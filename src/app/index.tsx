import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarImage } from '../components/CarIcon';
import { levelProgress } from '../logic/rewards';
import { formatDurationWords } from '../logic/sessionOptions';
import { lifetimeStats } from '../logic/stats';
import type { LifetimeStats } from '../logic/stats';
import { dayKey, displayedStreak } from '../logic/streak';
import type { PlayerProfile } from '../models/types';
import { DEFAULT_PROFILE, getProfile } from '../storage/profile';
import { getSessions } from '../storage/sessions';
import { colors, spacing } from '../theme';

const EMPTY_STATS: LifetimeStats = { races: 0, laps: 0, distanceKm: 0, focusedSeconds: 0 };

export default function HomeScreen() {
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [stats, setStats] = useState<LifetimeStats>(EMPTY_STATS);

  // Reload every time Home comes back into view, e.g. after a race.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      Promise.all([getProfile(), getSessions()]).then(([p, sessions]) => {
        if (cancelled) return;
        setProfile(p);
        setStats(lifetimeStats(sessions));
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const level = levelProgress(profile.totalXp);
  const streak = displayedStreak(profile, dayKey(new Date()));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <View style={styles.levelBlock}>
          <Text style={styles.level}>Level {level.level}</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${level.fraction * 100}%` }]} />
          </View>
          <Text style={styles.muted}>
            {level.xpIntoLevel} / {level.xpForNextLevel} XP
          </Text>
        </View>
        <View style={styles.topRight}>
          <Text style={styles.credits}>{profile.credits} credits</Text>
          <Pressable onPress={() => router.push('/settings')} hitSlop={12}>
            <Text style={styles.settings}>Settings</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.carArea}>
        <CarImage car={profile.car} size={300} />
        <Pressable style={styles.garageButton} onPress={() => router.push('/garage')}>
          <Text style={styles.garageText}>Customize car</Text>
        </Pressable>
      </View>

      <View style={styles.statRow}>
        <Stat label="Day streak" value={String(streak)} />
        <Stat label="Races" value={String(stats.races)} />
        <Stat label="Laps" value={String(stats.laps)} />
        <Stat label="Km" value={stats.distanceKm.toFixed(0)} />
      </View>
      <Text style={styles.focusTotal}>
        {stats.focusedSeconds > 0 ? `${formatDurationWords(stats.focusedSeconds)} focused in total` : 'No races yet. Start your first one!'}
      </Text>

      <Pressable style={styles.startButton} onPress={() => router.push('/create-session')}>
        <Text style={styles.startText}>Start Race</Text>
      </Pressable>
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

const styles = StyleSheet.create({
  safe: { flex: 1, padding: spacing.md, gap: spacing.md },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md },
  levelBlock: { flex: 1, gap: spacing.xs },
  level: { color: colors.text, fontSize: 22, fontWeight: '800' },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: colors.surface, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.accent },
  topRight: { alignItems: 'flex-end', gap: spacing.sm },
  credits: { color: colors.text, fontSize: 18, fontWeight: '700' },
  settings: { color: colors.textMuted, fontSize: 16 },
  carArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  garageButton: { backgroundColor: colors.surface, borderRadius: 10, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  garageText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  statRow: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, backgroundColor: colors.surface, borderRadius: 12, paddingVertical: spacing.md, alignItems: 'center', gap: spacing.xs },
  statValue: { color: colors.text, fontSize: 22, fontWeight: '700' },
  muted: { color: colors.textMuted, fontSize: 13 },
  focusTotal: { color: colors.textMuted, fontSize: 14, textAlign: 'center' },
  startButton: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: spacing.md + 2, alignItems: 'center' },
  startText: { color: colors.accentText, fontSize: 20, fontWeight: '800' },
});
