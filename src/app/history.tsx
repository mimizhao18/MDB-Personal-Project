import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TRACKS } from '../data/tracks';
import { recentDays } from '../logic/history';
import type { DayActivity } from '../logic/history';
import { formatDurationWords } from '../logic/sessionOptions';
import { dayKey, displayedStreak } from '../logic/streak';
import type { PlayerProfile, Session } from '../models/types';
import { DEFAULT_PROFILE, getProfile } from '../storage/profile';
import { getSessions } from '../storage/sessions';
import { colors, spacing } from '../theme';

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const STRIP_DAYS = 7;
const BAR_MAX_HEIGHT = 64;

export default function HistoryScreen() {
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      Promise.all([getProfile(), getSessions()]).then(([p, s]) => {
        if (cancelled) return;
        setProfile(p);
        setSessions(s);
        setLoaded(true);
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const today = new Date();
  const streak = displayedStreak(profile, dayKey(today));
  const days = recentDays(sessions, today, STRIP_DAYS);

  const header = (
    <View style={styles.header}>
      <View style={styles.statRow}>
        <Stat label="Current streak" value={`${streak} ${streak === 1 ? 'day' : 'days'}`} />
        <Stat label="Longest streak" value={`${Math.max(profile.longestStreak, streak)} days`} />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardHeading}>Last 7 days</Text>
        <WeekStrip days={days} />
      </View>
      <Text style={styles.heading}>Races</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={sessions}
        keyExtractor={(s) => s.id}
        ListHeaderComponent={header}
        ListEmptyComponent={loaded ? <Text style={styles.empty}>No races yet. Your finished races will show up here.</Text> : null}
        renderItem={({ item }) => <SessionRow session={item} />}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />
    </SafeAreaView>
  );
}

function WeekStrip({ days }: { days: DayActivity[] }) {
  const maxSeconds = Math.max(...days.map((d) => d.focusedSeconds), 1);
  return (
    <View style={styles.strip}>
      {days.map((d, i) => {
        const height = d.focusedSeconds > 0 ? Math.max(6, (d.focusedSeconds / maxSeconds) * BAR_MAX_HEIGHT) : 4;
        const isToday = i === days.length - 1;
        return (
          <View key={d.day} style={styles.stripDay}>
            <Text style={styles.stripMinutes}>{d.focusedSeconds > 0 ? `${Math.round(d.focusedSeconds / 60)}m` : ''}</Text>
            <View style={[styles.stripBar, { height }, d.focusedSeconds > 0 && styles.stripBarActive]} />
            <Text style={[styles.stripLetter, isToday && styles.stripToday]}>{WEEKDAY_LETTERS[d.weekday]}</Text>
          </View>
        );
      })}
    </View>
  );
}

function SessionRow({ session }: { session: Session }) {
  const when = new Date(session.endedAt);
  const dateText = when.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const timeText = when.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const track = TRACKS[session.trackId];
  return (
    <View style={styles.row}>
      <View style={styles.rowTop}>
        <Text style={styles.rowTitle}>{track?.name ?? 'Race'}</Text>
        <Text style={styles.rowXp}>+{session.xpEarned} XP</Text>
      </View>
      <Text style={styles.muted}>
        {dateText} · {timeText}
      </Text>
      <Text style={styles.rowDetail}>
        {session.completedLaps} / {session.plannedLaps} laps · {formatDurationWords(session.focusedSeconds)} · {session.distanceKm.toFixed(1)} km
      </Text>
      <Text style={session.finished ? styles.finished : styles.early}>{session.finished ? 'Finished' : 'Ended early'}</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.md },
  header: { gap: spacing.md, marginBottom: spacing.sm },
  heading: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: spacing.sm },
  muted: { color: colors.textMuted, fontSize: 13 },
  empty: { color: colors.textMuted, fontSize: 15, textAlign: 'center', marginTop: spacing.lg },
  statRow: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, backgroundColor: colors.surface, borderRadius: 12, paddingVertical: spacing.md, alignItems: 'center', gap: spacing.xs },
  statValue: { color: colors.text, fontSize: 22, fontWeight: '700' },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, gap: spacing.sm },
  cardHeading: { color: colors.text, fontSize: 16, fontWeight: '700' },
  strip: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  stripDay: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: spacing.xs, height: BAR_MAX_HEIGHT + 44 },
  stripMinutes: { color: colors.textMuted, fontSize: 11, height: 14 },
  stripBar: { width: 18, borderRadius: 4, backgroundColor: colors.surfaceBorder },
  stripBarActive: { backgroundColor: colors.accent },
  stripLetter: { color: colors.textMuted, fontSize: 13 },
  stripToday: { color: colors.text, fontWeight: '800' },
  row: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, gap: spacing.xs },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  rowTitle: { color: colors.text, fontSize: 17, fontWeight: '700' },
  rowXp: { color: colors.accent, fontSize: 16, fontWeight: '700' },
  rowDetail: { color: colors.text, fontSize: 14 },
  finished: { color: '#4CD964', fontSize: 12, fontWeight: '600' },
  early: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
});
