import { Text, View } from 'react-native';

import { getLivery } from '../../data/liveries';
import { makeStyles } from '../../design/styles';
import { glowHexFor } from '../car3d/glow';
import { HeroCar } from '../HeroCar';
import { AmbientGlow, ChamferButton, CreditAmount, Glass, SegmentedProgress, StatBlock } from '../ui';
import type { HomeData } from './useHomeData';

const useStyles = makeStyles((t) => ({
  screen: { flex: 1 },
  content: { flex: 1, padding: t.spacing.screen, gap: t.spacing.md },
  // the top bar: every piece of text in it is the same 12 px; the level and credits are white, the rest muted
  top: { gap: t.spacing.sm, paddingVertical: t.spacing.sm + t.spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pair: { flexDirection: 'row', alignItems: 'baseline', gap: t.spacing.sm },
  metaLabel: { ...t.typography.metaLabel, color: t.colors.textMuted },
  metaValue: { ...t.typography.metaValue, color: t.colors.textMuted },
  metaStrong: { color: t.colors.text },
  car: { flex: 1, marginHorizontal: -t.spacing.screen },
  // the stats are the quietest thing on the screen: small figures in a thin panel
  strip: { flexDirection: 'row', paddingHorizontal: 0, paddingVertical: t.spacing.sm },
  cell: { flex: 1, alignItems: 'center' },
  divided: { borderLeftWidth: t.border.hairline, borderLeftColor: t.glass.divider },
  start: { boxShadow: t.glass.buttonGlow },
}));

/**
 * Home, in order of importance: the car and the Start button, then a thin level bar on top and a thin stat strip below,
 * both as glass panels with cut corners over a soft glow in the car's color.
 */
export function HomeView({ data, onStart }: { data: HomeData; onStart: () => void }) {
  const styles = useStyles();
  const { profile, stats, level, streak } = data;
  const livery = getLivery(profile.car.liveryId);

  return (
    <View style={styles.screen}>
      <AmbientGlow color={glowHexFor(livery.primary, livery.secondary)} />
      <View style={styles.content}>
        <Glass corner="chamfer" style={styles.top}>
          <View style={styles.row}>
            <View style={styles.pair} accessible accessibilityLabel={`Level ${level.level}`}>
              <Text style={styles.metaLabel}>Level</Text>
              <Text style={[styles.metaValue, styles.metaStrong]}>{level.level}</Text>
            </View>
            <CreditAmount amount={profile.credits} small />
          </View>
          <SegmentedProgress fraction={level.fraction} accessibilityLabel="XP to the next level" />
          <View style={styles.row} accessible accessibilityLabel={`${level.xpIntoLevel} of ${level.xpForNextLevel} XP`}>
            <Text style={styles.metaLabel}>XP</Text>
            <Text style={styles.metaValue}>
              {level.xpIntoLevel} / {level.xpForNextLevel}
            </Text>
          </View>
        </Glass>
        <View style={styles.car}>
          <HeroCar car={profile.car} autoSpin={false} background="transparent" zoom={0.88} />
        </View>
        <Glass corner="chamfer" style={styles.strip}>
          <View style={styles.cell}>
            <StatBlock label="Streak" value={streak} unit={streak === 1 ? 'day' : 'days'} size="small" align="center" />
          </View>
          <View style={[styles.cell, styles.divided]}>
            <StatBlock label="Races" value={stats.races} size="small" align="center" />
          </View>
          <View style={[styles.cell, styles.divided]}>
            <StatBlock label="Distance" value={stats.distanceKm.toFixed(0)} unit="km" size="small" align="center" />
          </View>
        </Glass>
        <View style={styles.start}>
          <ChamferButton label="Start Race" onPress={onStart} />
        </View>
      </View>
    </View>
  );
}
