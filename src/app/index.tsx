import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroCar } from '../components/HeroCar';
import { HomeStatsView } from '../components/home/HomeStatsView';
import { useHomeData } from '../components/home/useHomeData';
import { makeStyles } from '../design/styles';
import { DEFAULT_HOME_STATS, getHomeStats, isHomeStatsId } from '../storage/homeStats';
import type { HomeStatsId } from '../storage/homeStats';
import { Credits } from '../ui/Credits';
import { Button, ProgressBar } from '../ui/kit';

const useStyles = makeStyles((t) => ({
  safe: { flex: 1, padding: t.spacing.md, gap: t.spacing.md },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm },
  badge: { borderWidth: t.border.hairline, borderColor: t.colors.borderStrong, paddingHorizontal: t.spacing.sm, paddingVertical: 4 },
  badgeText: { fontSize: 15, fontWeight: '800', color: t.colors.text, letterSpacing: 0.5 },
  label: { ...t.type.label, fontSize: 11, color: t.colors.textMuted },
  gauge: { gap: 6 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  xp: { ...t.type.caption, color: t.colors.textMuted },
  carArea: { flex: 1, marginHorizontal: -t.spacing.md },
}));

/** Home: level and XP on top, the car, a compact row of stats and the Start button. */
export default function HomeScreen() {
  const styles = useStyles();
  const data = useHomeData();
  const params = useLocalSearchParams<{ stats?: string }>();
  const [saved, setSaved] = useState<HomeStatsId>(DEFAULT_HOME_STATS);
  useFocusEffect(
    useCallback(() => {
      getHomeStats().then(setSaved);
    }, []),
  );
  // add ?stats=pills (and so on) to try a style without saving it
  const statsStyle: HomeStatsId = isHomeStatsId(params.stats) ? params.stats : saved;
  const { profile, level } = data;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>LV {level.level}</Text>
          </View>
          <Text style={styles.label}>Driver</Text>
        </View>
        <Credits amount={profile.credits} size={18} />
      </View>
      <View style={styles.gauge}>
        <ProgressBar fraction={level.fraction} />
        <View style={styles.xpRow}>
          <Text style={styles.xp}>XP</Text>
          <Text style={styles.xp}>
            {level.xpIntoLevel} / {level.xpForNextLevel}
          </Text>
        </View>
      </View>
      <View style={styles.carArea}>
        <HeroCar car={profile.car} autoSpin={false} />
      </View>
      <HomeStatsView data={data} style={statsStyle} />
      <Button label="Start Race" onPress={() => router.push('/create-session')} />
    </SafeAreaView>
  );
}
