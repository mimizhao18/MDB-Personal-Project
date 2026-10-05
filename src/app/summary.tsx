import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TRACKS } from '../data/tracks';
import { makeStyles } from '../design/styles';
import { levelForXp, levelProgress } from '../logic/rewards';
import { formatDurationWords } from '../logic/sessionOptions';
import { dayKey, displayedStreak } from '../logic/streak';
import type { PlayerProfile, Session } from '../models/types';
import { getProfile } from '../storage/profile';
import { getSessions } from '../storage/sessions';
import { Credits } from '../ui/Credits';
import { Button, Card, ProgressBar, StatTile } from '../ui/kit';

export default function SummaryScreen() {
  const styles = useStyles();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getSessions(), getProfile()]).then(([sessions, p]) => {
      if (cancelled) return;
      setSession(sessions.find((s) => s.id === id) ?? null);
      setProfile(p);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!loaded) {
    return <View style={styles.center} />;
  }
  if (!session || !profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Race not found.</Text>
        <Button label="Back to Home" onPress={() => router.replace('/')} />
      </View>
    );
  }

  const track = TRACKS[session.trackId];
  const levelBefore = levelForXp(profile.totalXp - session.xpEarned);
  const progress = levelProgress(profile.totalXp);
  const leveledUp = progress.level > levelBefore;
  const streak = displayedStreak(profile, dayKey(new Date()));

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{session.finished ? 'Chequered flag!' : 'Race ended early'}</Text>
        <Text style={styles.muted}>{track?.name ?? 'Race'}</Text>

        <View style={styles.statRow}>
          <StatTile label="Laps" value={`${session.completedLaps} / ${session.plannedLaps}`} />
          <StatTile label="Focused" value={formatDurationWords(session.focusedSeconds)} />
          <StatTile label="Distance" value={`${session.distanceKm.toFixed(1)} km`} />
        </View>

        <Card style={styles.cardGap}>
          <Text style={styles.cardLabel}>Rewards</Text>
          <View style={styles.rewardRow}>
            <Text style={styles.reward}>+{session.xpEarned} XP</Text>
            <Credits amount={session.creditsEarned} prefix="+" size={22} textStyle={styles.reward} />
          </View>
        </Card>

        <Card style={styles.cardGap}>
          <Text style={styles.cardLabel}>
            Level {progress.level}
            {leveledUp ? '  ·  Level up!' : ''}
          </Text>
          <ProgressBar fraction={progress.fraction} />
          <Text style={styles.muted}>
            {progress.xpIntoLevel} / {progress.xpForNextLevel} XP to level {progress.level + 1}
          </Text>
        </Card>

        <View style={styles.statRow}>
          <StatTile label="Total credits" value={String(profile.credits)} />
          <StatTile label="Day streak" value={String(streak)} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Race again" onPress={() => router.replace('/create-session')} />
        <Button label="Home" onPress={() => router.replace('/')} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const useStyles = makeStyles((t) => ({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: t.spacing.md, padding: t.spacing.md },
  content: { padding: t.spacing.md, gap: t.spacing.md },
  title: { ...t.type.title, fontSize: 28, color: t.colors.text, textAlign: 'center' },
  muted: { ...t.type.caption, color: t.colors.textMuted, textAlign: 'center' },
  statRow: { flexDirection: 'row', gap: t.spacing.sm },
  cardGap: { gap: t.spacing.sm },
  cardLabel: { ...t.type.label, color: t.colors.textMuted },
  rewardRow: { flexDirection: 'row', justifyContent: 'space-around' },
  reward: { fontSize: 24, fontWeight: '800', color: t.colors.accent },
  footer: {
    padding: t.spacing.md,
    gap: t.spacing.sm,
    borderTopWidth: t.border.hairline,
    borderTopColor: t.colors.border,
    backgroundColor: t.colors.background,
  },
}));
