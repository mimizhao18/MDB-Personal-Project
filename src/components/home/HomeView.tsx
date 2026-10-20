import { Text, View } from 'react-native';

import { makeStyles } from '../../design/styles';
import { HeroCar } from '../HeroCar';
import { Button, CreditAmount, SegmentedProgress, StatBlock } from '../ui';
import type { HomeData } from './useHomeData';

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, padding: t.spacing.screen, gap: t.spacing.md },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  level: { flexDirection: 'row', alignItems: 'baseline', gap: t.spacing.sm },
  levelLabel: { ...t.typography.label, color: t.colors.textMuted },
  levelNumber: { ...t.typography.stat, color: t.colors.text },
  xp: { gap: t.spacing.xs },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  xpText: { ...t.typography.statSmall, color: t.colors.textMuted },
  xpLabel: { ...t.typography.label, color: t.colors.textMuted },
  car: { flex: 1, marginHorizontal: -t.spacing.screen },
  strip: { flexDirection: 'row', borderTopWidth: t.border.hairline, borderBottomWidth: t.border.hairline, borderColor: t.colors.border, paddingVertical: t.spacing.md },
  cell: { flex: 1, alignItems: 'center' },
  divided: { borderLeftWidth: t.border.hairline, borderLeftColor: t.colors.border },
}));

/** Home: the car as the hero, one continuous XP bar across the top, a three-up stat strip split by hairlines, one red button. */
export function HomeView({ data, onStart }: { data: HomeData; onStart: () => void }) {
  const styles = useStyles();
  const { profile, stats, level, streak } = data;
  return (
    <View style={styles.screen}>
      <View style={styles.top}>
        <View style={styles.level} accessible accessibilityLabel={`Level ${level.level}`}>
          <Text style={styles.levelLabel}>Level</Text>
          <Text style={styles.levelNumber}>{level.level}</Text>
        </View>
        <CreditAmount amount={profile.credits} />
      </View>
      <View style={styles.xp}>
        <SegmentedProgress fraction={level.fraction} accessibilityLabel="XP to the next level" />
        <View style={styles.xpRow}>
          <Text style={styles.xpLabel}>XP</Text>
          <Text style={styles.xpText}>
            {level.xpIntoLevel} / {level.xpForNextLevel}
          </Text>
        </View>
      </View>
      <View style={styles.car}>
        <HeroCar car={profile.car} autoSpin={false} />
      </View>
      <View style={styles.strip}>
        <View style={styles.cell}>
          <StatBlock label="Streak" value={streak} unit={streak === 1 ? 'day' : 'days'} align="center" />
        </View>
        <View style={[styles.cell, styles.divided]}>
          <StatBlock label="Races" value={stats.races} align="center" />
        </View>
        <View style={[styles.cell, styles.divided]}>
          <StatBlock label="Distance" value={stats.distanceKm.toFixed(0)} unit="km" align="center" />
        </View>
      </View>
      <Button label="Start Race" onPress={onStart} />
    </View>
  );
}
