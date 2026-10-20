import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { makeStyles } from '../../design/styles';
import { Credits } from '../../ui/Credits';
import { Button, ProgressBar, StatStrip } from '../../ui/kit';
import { HeroCar } from '../HeroCar';
import type { HomeData } from './useHomeData';

const useStyles = makeStyles((t) => ({
  safe: { flex: 1, padding: t.spacing.md, gap: t.spacing.md },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: t.spacing.md },
  levelBlock: { flex: 1, gap: t.spacing.xs },
  level: { ...t.type.title, color: t.colors.text },
  caption: { ...t.type.caption, color: t.colors.textMuted },
  // the 3D car runs edge to edge (past the screen padding) so its floor glow has room to fade out before the edge
  carArea: { flex: 1, marginHorizontal: -t.spacing.md },
  focusTotal: { ...t.type.caption, color: t.colors.textMuted, textAlign: 'center' },
}));

/** Level and credits on top, the car in the middle, a strip of stats and the Start button. */
export function HomeClassic({ data, onStart }: { data: HomeData; onStart: () => void }) {
  const styles = useStyles();
  const { profile, stats, level, streak, focusLine } = data;
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
        <HeroCar car={profile.car} autoSpin={false} />
      </View>
      <StatStrip
        items={[
          { label: 'Day streak', value: String(streak) },
          { label: 'Races', value: String(stats.races) },
          { label: 'Laps', value: String(stats.laps) },
          { label: 'Km', value: stats.distanceKm.toFixed(0) },
        ]}
      />
      <Text style={styles.focusTotal}>{focusLine}</Text>
      <Button label="Start Race" onPress={onStart} />
    </SafeAreaView>
  );
}
