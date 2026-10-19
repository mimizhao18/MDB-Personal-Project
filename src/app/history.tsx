import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TRACKS } from '../data/tracks';
import { makeStyles } from '../design/styles';
import { recentDays } from '../logic/history';
import type { DayActivity } from '../logic/history';
import { formatDurationWords } from '../logic/sessionOptions';
import { dayKey, displayedStreak } from '../logic/streak';
import type { PlayerProfile, Session } from '../models/types';
import { DEFAULT_PROFILE, getProfile } from '../storage/profile';
import { getSessions } from '../storage/sessions';
import { Card, SectionLabel, StatStrip } from '../ui/kit';

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const STRIP_DAYS = 7;
const BAR_MAX_HEIGHT = 64;

export default function HistoryScreen() {
  const styles = useStyles();
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
      <StatStrip
        items={[
          { label: 'Current streak', value: `${streak} ${streak === 1 ? 'day' : 'days'}` },
          { label: 'Longest streak', value: `${Math.max(profile.longestStreak, streak)} days` },
        ]}
      />
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
        renderItem={({ item, index }) => <SessionRow session={item} first={index === 0} last={index === sessions.length - 1} />}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={Divider}
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

/** The hairline between two races in the list, drawn inside the list's panel. */
function Divider() {
  const styles = useStyles();
  return (
    <View style={styles.dividerWrap}>
      <View style={styles.divider} />
    </View>
  );
}

function SessionRow({ session, first, last }: { session: Session; first: boolean; last: boolean }) {
  const styles = useStyles();
  const when = new Date(session.endedAt);
  const dateText = when.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const timeText = when.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const track = TRACKS[session.trackId];
  return (
    <View style={[styles.row, first && styles.rowFirst, last && styles.rowLast]}>
      <View style={styles.rowMain}>
        <Text style={styles.rowTitle}>{track?.name ?? 'Race'}</Text>
        <Text style={styles.muted}>
          {dateText} · {timeText}
        </Text>
        <Text style={styles.muted}>
          {session.completedLaps}/{session.plannedLaps} laps · {formatDurationWords(session.focusedSeconds)} · {session.distanceKm.toFixed(1)} km
        </Text>
      </View>
      <View style={styles.rowSide}>
        <Text style={styles.rowXp}>+{session.xpEarned} XP</Text>
        {!session.finished && <Text style={styles.early}>Ended early</Text>}
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  safe: { flex: 1 },
  content: { padding: t.spacing.md },
  header: { gap: t.spacing.md, marginBottom: t.spacing.sm },
  muted: { ...t.type.caption, color: t.colors.textMuted },
  empty: { ...t.type.body, color: t.colors.textMuted, textAlign: 'center', marginTop: t.spacing.lg },
  cardGap: { gap: t.spacing.sm },
  cardLabel: { ...t.type.label, color: t.colors.textMuted },
  strip: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  stripDay: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: t.spacing.xs, height: BAR_MAX_HEIGHT + 44 },
  stripMinutes: { fontSize: 11, height: 14, color: t.colors.textMuted },
  stripBar: { width: 12, borderRadius: t.radius.sm, backgroundColor: t.colors.border },
  stripBarActive: { backgroundColor: t.colors.accent },
  stripLetter: { ...t.type.caption, color: t.colors.textMuted },
  stripToday: { color: t.colors.text, fontWeight: '800' },
  // the races form one panel: each row has side borders, the first a top border and the last a bottom border
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: t.spacing.md,
    padding: t.spacing.md,
    backgroundColor: t.colors.surface,
    borderLeftWidth: t.border.hairline,
    borderRightWidth: t.border.hairline,
    borderColor: t.colors.border,
  },
  rowFirst: { borderTopWidth: t.border.hairline, borderTopLeftRadius: t.radius.lg, borderTopRightRadius: t.radius.lg },
  rowLast: { borderBottomWidth: t.border.hairline, borderBottomLeftRadius: t.radius.lg, borderBottomRightRadius: t.radius.lg },
  rowMain: { flex: 1, gap: 2 },
  rowSide: { alignItems: 'flex-end', gap: 2 },
  rowTitle: { ...t.type.heading, fontSize: 16, color: t.colors.text },
  rowXp: { fontSize: 15, fontWeight: '700', color: t.colors.text },
  early: { ...t.type.caption, color: t.colors.textMuted },
  dividerWrap: { backgroundColor: t.colors.surface, borderLeftWidth: t.border.hairline, borderRightWidth: t.border.hairline, borderColor: t.colors.border, paddingLeft: t.spacing.md },
  divider: { height: t.border.hairline, backgroundColor: t.colors.border },
}));
