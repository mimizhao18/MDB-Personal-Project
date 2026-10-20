import { Text, View } from 'react-native';

import { makeStyles } from '../../../design/styles';
import { HeroCar } from '../../HeroCar';
import { Button, SegmentedProgress, StatBlock } from '../../ui';
import type { HomeData } from '../useHomeData';
import { HomeTopBar } from './parts';

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, padding: t.spacing.screen, gap: t.spacing.md },
  xp: { gap: t.spacing.xs },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  xpText: { ...t.typography.statSmall, color: t.colors.textMuted },
  xpLabel: { ...t.typography.label, color: t.colors.textMuted },
  car: { flex: 1, marginHorizontal: -t.spacing.screen },
  strip: { flexDirection: 'row', borderTopWidth: t.border.hairline, borderBottomWidth: t.border.hairline, borderColor: t.colors.border, paddingVertical: t.spacing.md },
  cell: { flex: 1, alignItems: 'center' },
  divided: { borderLeftWidth: t.border.hairline, borderLeftColor: t.colors.border },
}));

/** Variant 1, Strip: the car as the hero, XP across the top, a three-up stat strip split by hairlines, one red button. */
export function HomeStrip({ data, onStart, segments }: { data: HomeData; onStart: () => void; segments: number }) {
  const styles = useStyles();
  const { profile, stats, level, streak } = data;
  return (
    <View style={styles.screen}>
      <HomeTopBar level={level.level} credits={profile.credits} />
      <View style={styles.xp}>
        <SegmentedProgress fraction={level.fraction} segments={segments} accessibilityLabel="XP to the next level" />
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
