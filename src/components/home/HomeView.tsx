import { Text, View } from 'react-native';

import { glowHexFor } from '../car3d/glow';
import { getLivery } from '../../data/liveries';
import { makeStyles } from '../../design/styles';
import { HeroCar } from '../HeroCar';
import { AmbientGlow, Button, CreditAmount, Glass, SegmentedProgress, StatBlock } from '../ui';
import type { HomeData } from './useHomeData';

const useStyles = makeStyles((t) => ({
  screen: { flex: 1 },
  content: { flex: 1, padding: t.spacing.screen, gap: t.spacing.md },
  top: { gap: t.spacing.sm },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  level: { flexDirection: 'row', alignItems: 'baseline', gap: t.spacing.sm },
  levelLabel: { ...t.typography.label, color: t.colors.textMuted },
  levelNumber: { ...t.typography.stat, color: t.colors.text },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  xpText: { ...t.typography.statSmall, color: t.colors.textMuted },
  xpLabel: { ...t.typography.label, color: t.colors.textMuted },
  car: { flex: 1, marginHorizontal: -t.spacing.screen },
  strip: { flexDirection: 'row', paddingHorizontal: 0 },
  cell: { flex: 1, alignItems: 'center' },
  divided: { borderLeftWidth: t.border.hairline, borderLeftColor: t.glass.divider },
  start: { boxShadow: t.glass.buttonGlow },
}));

/**
 * Home: a soft glow in the car's color behind everything, the car as the hero, and two glass panels (level and XP on top,
 * a three-up stat strip below) around it, then one red button.
 */
export function HomeView({ data, onStart }: { data: HomeData; onStart: () => void }) {
  const styles = useStyles();
  const { profile, stats, level, streak } = data;
  const livery = getLivery(profile.car.liveryId);

  return (
    <View style={styles.screen}>
      <AmbientGlow color={glowHexFor(livery.primary, livery.secondary)} />
      <View style={styles.content}>
        <Glass style={styles.top}>
          <View style={styles.topRow}>
            <View style={styles.level} accessible accessibilityLabel={`Level ${level.level}`}>
              <Text style={styles.levelLabel}>Level</Text>
              <Text style={styles.levelNumber}>{level.level}</Text>
            </View>
            <CreditAmount amount={profile.credits} />
          </View>
          <SegmentedProgress fraction={level.fraction} accessibilityLabel="XP to the next level" />
          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>XP</Text>
            <Text style={styles.xpText}>
              {level.xpIntoLevel} / {level.xpForNextLevel}
            </Text>
          </View>
        </Glass>
        <View style={styles.car}>
          <HeroCar car={profile.car} autoSpin={false} background="transparent" />
        </View>
        <Glass style={styles.strip}>
          <View style={styles.cell}>
            <StatBlock label="Streak" value={streak} unit={streak === 1 ? 'day' : 'days'} align="center" />
          </View>
          <View style={[styles.cell, styles.divided]}>
            <StatBlock label="Races" value={stats.races} align="center" />
          </View>
          <View style={[styles.cell, styles.divided]}>
            <StatBlock label="Distance" value={stats.distanceKm.toFixed(0)} unit="km" align="center" />
          </View>
        </Glass>
        <View style={styles.start}>
          <Button label="Start Race" onPress={onStart} />
        </View>
      </View>
    </View>
  );
}
