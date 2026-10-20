import { View } from 'react-native';

import { getLivery } from '../../../data/liveries';
import { makeStyles } from '../../../design/styles';
import { glowHexFor } from '../../car3d/glow';
import { HeroCar } from '../../HeroCar';
import { AmbientGlow, SegmentedProgress, StartButton } from '../../ui';
import type { HomeData } from '../useHomeData';
import { LevelLine, SlashLine, figures, withUnit } from './parts';

const useStyles = makeStyles((t) => ({
  screen: { flex: 1 },
  topLine: { paddingTop: t.spacing.xs },
  content: { flex: 1, padding: t.spacing.screen, gap: t.spacing.md },
  car: { flex: 1, marginHorizontal: -t.spacing.screen },
  stats: { paddingTop: t.spacing.md, borderTopWidth: t.border.hairline, borderTopColor: t.glass.divider },
}));

/** Variant 4, Open: no boxes. XP is a hairline across the very top, and the stats are one line with // between them. */
export function HomeOpen({ data, onStart }: { data: HomeData; onStart: () => void }) {
  const styles = useStyles();
  const livery = getLivery(data.profile.car.liveryId);
  return (
    <View style={styles.screen}>
      <AmbientGlow color={glowHexFor(livery.primary, livery.secondary)} />
      <View style={styles.topLine}>
        <SegmentedProgress fraction={data.level.fraction} accessibilityLabel="XP to the next level" />
      </View>
      <View style={styles.content}>
        <LevelLine data={data} />
        <View style={styles.car}>
          <HeroCar car={data.profile.car} autoSpin={false} background="transparent" zoom={0.88} />
        </View>
        <View style={styles.stats}>
          <SlashLine items={figures(data).map((f) => `${f.label.toUpperCase()} ${withUnit(f)}`)} />
        </View>
        <StartButton label="Start Race" onPress={onStart} />
      </View>
    </View>
  );
}
