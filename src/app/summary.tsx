import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TRACKS } from '../data/tracks';
import { levelForXp, levelProgress } from '../logic/rewards';
import { formatDurationWords } from '../logic/sessionOptions';
import { dayKey, displayedStreak } from '../logic/streak';
import type { PlayerProfile, Session } from '../models/types';
import { getProfile } from '../storage/profile';
import { getSessions } from '../storage/sessions';
import { colors, spacing } from '../theme';

export default function SummaryScreen() {
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
          <Stat label="Laps" value={`${session.completedLaps} / ${session.plannedLaps}`} />
          <Stat label="Focused" value={formatDurationWords(session.focusedSeconds)} />
          <Stat label="Distance" value={`${session.distanceKm.toFixed(1)} km`} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>Rewards</Text>
          <View style={styles.rewardRow}>
            <Text style={styles.reward}>+{session.xpEarned} XP</Text>
            <Text style={styles.reward}>+{session.creditsEarned} credits</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>
            Level {progress.level}
            {leveledUp ? '  ·  Level up!' : ''}
          </Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${progress.fraction * 100}%` }]} />
          </View>
          <Text style={styles.muted}>
            {progress.xpIntoLevel} / {progress.xpForNextLevel} XP to level {progress.level + 1}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Stat label="Total credits" value={String(profile.credits)} />
          <Stat label="Day streak" value={String(streak)} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Race again" onPress={() => router.replace('/create-session')} />
        <Button label="Home" onPress={() => router.replace('/')} secondary />
      </View>
    </SafeAreaView>
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

function Button({ label, onPress, secondary }: { label: string; onPress: () => void; secondary?: boolean }) {
  return (
    <Pressable style={[styles.button, secondary && styles.buttonSecondary]} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.md },
  content: { padding: spacing.md, gap: spacing.md },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  muted: { color: colors.textMuted, fontSize: 14, textAlign: 'center' },
  statRow: { flexDirection: 'row', gap: spacing.sm },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: { color: colors.text, fontSize: 20, fontWeight: '700' },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, gap: spacing.sm },
  cardHeading: { color: colors.text, fontSize: 18, fontWeight: '700' },
  rewardRow: { flexDirection: 'row', justifyContent: 'space-around' },
  reward: { color: colors.accent, fontSize: 24, fontWeight: '800' },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: colors.surfaceBorder, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.accent },
  footer: {
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    backgroundColor: colors.background,
  },
  button: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, alignItems: 'center' },
  buttonSecondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.surfaceBorder },
  buttonText: { color: colors.accentText, fontSize: 18, fontWeight: '700' },
});
