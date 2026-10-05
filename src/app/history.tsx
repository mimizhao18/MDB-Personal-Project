import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TRACKS } from '../data/tracks';
import { makeStyles, useTheme } from '../design/styles';
import { recentDays } from '../logic/history';
import type { DayActivity } from '../logic/history';
import { formatDurationWords } from '../logic/sessionOptions';
import { dayKey, displayedStreak } from '../logic/streak';
import type { PlayerProfile, Session } from '../models/types';
import { DEFAULT_PROFILE, getProfile } from '../storage/profile';
import { getSessions } from '../storage/sessions';
import { Card, SectionLabel, StatTile } from '../ui/kit';

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const STRIP_DAYS = 7;
const BAR_MAX_HEIGHT = 64;

export default function HistoryScreen() {
  const styles = useStyles();
  const theme = useTheme();
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
        <StatTile label="Current streak" value={`${streak} ${streak === 1 ? 'day' : 'days'}`} />
        <StatTile label="Longest streak" value={`${Math.max(profile.longestStreak, streak)} days`} />
      </View>
      <Card style={styles.cardGap}>
        <Text style={styles.cardLabel}>Last 7 days</Text>
        <WeekStrip days={days} />
      </Card>
      <SectionLabel>Races</SectionLabel>
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
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
      />
    </SafeAreaView>
  );
}

function WeekStrip({ days }: { days: DayActivity[] }) {
  const styles = useStyles();
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
  const styles = useStyles();
  const when = new Date(session.endedAt);
  const dateText = when.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const timeText = when.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const track = TRACKS[session.trackId];
  return (
    <Card style={styles.row}>
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
    </Card>
  );
}

const useStyles = makeStyles((t) => ({
  safe: { flex: 1 },
  content: { padding: t.spacing.md },
  header: { gap: t.spacing.md, marginBottom: t.spacing.sm },
  muted: { ...t.type.caption, color: t.colors.textMuted },
  empty: { ...t.type.body, color: t.colors.textMuted, textAlign: 'center', marginTop: t.spacing.lg },
  statRow: { flexDirection: 'row', gap: t.spacing.sm },
  cardGap: { gap: t.spacing.sm },
  cardLabel: { ...t.type.label, color: t.colors.textMuted },
  strip: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  stripDay: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: t.spacing.xs, height: BAR_MAX_HEIGHT + 44 },
  stripMinutes: { fontSize: 11, height: 14, color: t.colors.textMuted },
  stripBar: { width: 16, borderRadius: t.radius.sm, backgroundColor: t.colors.border },
  stripBarActive: { backgroundColor: t.colors.accent },
  stripLetter: { ...t.type.caption, color: t.colors.textMuted },
  stripToday: { color: t.colors.text, fontWeight: '800' },
  row: { gap: t.spacing.xs },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  rowTitle: { ...t.type.heading, color: t.colors.text },
  rowXp: { ...t.type.body, fontWeight: '700', color: t.colors.accent },
  rowDetail: { ...t.type.caption, color: t.colors.text },
  finished: { fontSize: 12, fontWeight: '600', color: t.colors.positive },
  early: { fontSize: 12, fontWeight: '600', color: t.colors.textMuted },
}));
