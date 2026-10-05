import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarImage } from '../components/CarIcon';
import { getLivery } from '../data/liveries';
import { makeStyles, useDesign } from '../design/DesignProvider';
import { levelProgress } from '../logic/rewards';
import { formatDurationWords } from '../logic/sessionOptions';
import { lifetimeStats } from '../logic/stats';
import type { LifetimeStats } from '../logic/stats';
import { dayKey, displayedStreak } from '../logic/streak';
import type { PlayerProfile } from '../models/types';
import { DEFAULT_PROFILE, getProfile } from '../storage/profile';
import { getSessions } from '../storage/sessions';
import { Button, Card, ProgressBar, SectionLabel, StatTile } from '../ui/kit';

const EMPTY_STATS: LifetimeStats = { races: 0, laps: 0, distanceKm: 0, focusedSeconds: 0 };

const useStyles = makeStyles((t) => ({
  safe: { flex: 1, padding: t.spacing.md, gap: t.spacing.md },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: t.spacing.md },
  levelBlock: { flex: 1, gap: t.spacing.xs },
  level: { ...t.type.title, color: t.colors.text },
  caption: { ...t.type.caption, color: t.colors.textMuted },
  topRight: { alignItems: 'flex-end', gap: t.spacing.sm },
  credits: { ...t.type.heading, color: t.colors.text },
  links: { flexDirection: 'row', gap: t.spacing.md },
  link: { ...t.type.body, color: t.colors.textMuted },
  carArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: t.spacing.md },
  statRow: { flexDirection: 'row', gap: t.spacing.sm },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.sm },
  statCell: { flexBasis: '47%', flexGrow: 1, flexDirection: 'row' },
  focusTotal: { ...t.type.caption, color: t.colors.textMuted, textAlign: 'center' },
  carCard: { alignItems: 'center', justifyContent: 'center', paddingVertical: t.spacing.lg, gap: t.spacing.sm },
  carCardName: { ...t.type.label, color: t.colors.textMuted },
  navCards: { flexDirection: 'row', gap: t.spacing.sm },
  navCard: { flex: 1, gap: 2 },
  navCardTitle: { ...t.type.heading, color: t.colors.text },
  fill: { flex: 1 },
}));

export default function HomeScreen() {
  const styles = useStyles();
  const { settings } = useDesign();
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
  const tabs = settings.nav === 'tabs';
  const startRace = () => router.push('/create-session');
  const focusLine = stats.focusedSeconds > 0 ? `${formatDurationWords(stats.focusedSeconds)} focused in total` : 'No races yet. Start your first one!';

  const levelBlock = (
    <View style={styles.levelBlock}>
      <Text style={styles.level}>Level {level.level}</Text>
      <ProgressBar fraction={level.fraction} />
      <Text style={styles.caption}>
        {level.xpIntoLevel} / {level.xpForNextLevel} XP
      </Text>
    </View>
  );

  const statTiles = [
    <StatTile key="streak" label="Day streak" value={String(streak)} />,
    <StatTile key="races" label="Races" value={String(stats.races)} />,
    <StatTile key="laps" label="Laps" value={String(stats.laps)} />,
    <StatTile key="km" label="Km" value={stats.distanceKm.toFixed(0)} />,
  ];

  const links = !tabs && (
    <View style={styles.links}>
      <Pressable onPress={() => router.push('/history')} hitSlop={12}>
        <Text style={styles.link}>History</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/settings')} hitSlop={12}>
        <Text style={styles.link}>Settings</Text>
      </Pressable>
    </View>
  );

  const renderTopBar = (showLinks: boolean) => (
    <View style={styles.topBar}>
      {levelBlock}
      <View style={styles.topRight}>
        <Text style={styles.credits}>{profile.credits} credits</Text>
        {showLinks && links}
      </View>
    </View>
  );

  if (settings.homeLayout === 'cards') {
    return (
      <SafeAreaView style={styles.safe}>
        {renderTopBar(false)}
        <Card style={[styles.carCard, styles.fill]}>
          <Text style={styles.carCardName}>{getLivery(profile.car.liveryId).name}</Text>
          <CarImage car={profile.car} size={300} />
        </Card>
        <Button label="Start Race" onPress={startRace} />
        {tabs ? (
          <View style={styles.statRow}>{statTiles}</View>
        ) : (
          <View style={styles.navCards}>
            <Pressable style={styles.navCard} onPress={() => router.push('/garage')}>
              <Card>
                <Text style={styles.navCardTitle}>Garage</Text>
                <Text style={styles.caption}>{getLivery(profile.car.liveryId).name}</Text>
              </Card>
            </Pressable>
            <Pressable style={styles.navCard} onPress={() => router.push('/history')}>
              <Card>
                <Text style={styles.navCardTitle}>History</Text>
                <Text style={styles.caption}>{stats.races} {stats.races === 1 ? 'race' : 'races'}</Text>
              </Card>
            </Pressable>
            <Pressable style={styles.navCard} onPress={() => router.push('/settings')}>
              <Card>
                <Text style={styles.navCardTitle}>Settings</Text>
                <Text style={styles.caption}>Data</Text>
              </Card>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    );
  }

  if (settings.homeLayout === 'dashboard') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <SectionLabel>Your season</SectionLabel>
          <View style={styles.topRight}>
            <Text style={styles.credits}>{profile.credits} credits</Text>
          </View>
        </View>
        <Card>{levelBlock}</Card>
        <View style={styles.statGrid}>
          {statTiles.map((tile, i) => (
            <View key={i} style={styles.statCell}>
              {tile}
            </View>
          ))}
        </View>
        <View style={[styles.carArea, styles.fill]}>
          <CarImage car={profile.car} size={240} />
        </View>
        <Text style={styles.focusTotal}>{focusLine}</Text>
        <Button label="Start Race" onPress={startRace} />
        {!tabs && (
          <View style={[styles.links, { justifyContent: 'center' }]}>
            <Pressable onPress={() => router.push('/garage')} hitSlop={12}>
              <Text style={styles.link}>Garage</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/history')} hitSlop={12}>
              <Text style={styles.link}>History</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/settings')} hitSlop={12}>
              <Text style={styles.link}>Settings</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // 'hub': the car in the middle, stats underneath, one big button.
  return (
    <SafeAreaView style={styles.safe}>
      {renderTopBar(true)}
      <View style={styles.carArea}>
        <CarImage car={profile.car} size={300} />
        {!tabs && <Button label="Customize car" variant="secondary" onPress={() => router.push('/garage')} />}
      </View>
      <View style={styles.statRow}>{statTiles}</View>
      <Text style={styles.focusTotal}>{focusLine}</Text>
      <Button label="Start Race" onPress={startRace} />
    </SafeAreaView>
  );
}
