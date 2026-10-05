import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarImage } from '../components/CarIcon';
import { makeStyles } from '../design/styles';
import { levelProgress } from '../logic/rewards';
import { formatDurationWords } from '../logic/sessionOptions';
import { lifetimeStats } from '../logic/stats';
import type { LifetimeStats } from '../logic/stats';
import { dayKey, displayedStreak } from '../logic/streak';
import type { PlayerProfile } from '../models/types';
import { DEFAULT_PROFILE, getProfile } from '../storage/profile';
import { getSessions } from '../storage/sessions';
import { Credits } from '../ui/Credits';
import { Button, ProgressBar, StatTile } from '../ui/kit';

const EMPTY_STATS: LifetimeStats = { races: 0, laps: 0, distanceKm: 0, focusedSeconds: 0 };

const useStyles = makeStyles((t) => ({
  safe: { flex: 1, padding: t.spacing.md, gap: t.spacing.md },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: t.spacing.md },
  levelBlock: { flex: 1, gap: t.spacing.xs },
  level: { ...t.type.title, color: t.colors.text },
  caption: { ...t.type.caption, color: t.colors.textMuted },
  carArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statRow: { flexDirection: 'row', gap: t.spacing.sm },
  focusTotal: { ...t.type.caption, color: t.colors.textMuted, textAlign: 'center' },
}));

export default function HomeScreen() {
  const styles = useStyles();
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
  const focusLine = stats.focusedSeconds > 0 ? `${formatDurationWords(stats.focusedSeconds)} focused in total` : 'No races yet. Start your first one!';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <View style={styles.levelBlock}>
          <Text style={styles.level}>Level {level.level}</Text>
          <ProgressBar fraction={level.fraction} />
          <Text style={styles.caption}>
            {level.xpIntoLevel} / {level.xpForNextLevel} XP
          </Text>
        </View>
        <Credits amount={profile.credits} size={20} />
      </View>

      <View style={styles.carArea}>
        <CarImage car={profile.car} size={300} />
      </View>

      <View style={styles.statRow}>
        <StatTile label="Day streak" value={String(streak)} />
        <StatTile label="Races" value={String(stats.races)} />
        <StatTile label="Laps" value={String(stats.laps)} />
        <StatTile label="Km" value={stats.distanceKm.toFixed(0)} />
      </View>
      <Text style={styles.focusTotal}>{focusLine}</Text>
      <Button label="Start Race" onPress={() => router.push('/create-session')} />
    </SafeAreaView>
  );
}
