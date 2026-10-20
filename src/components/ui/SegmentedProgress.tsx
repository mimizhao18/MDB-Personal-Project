import { View } from 'react-native';

import { makeStyles } from '../../design/styles';

const useStyles = makeStyles((t) => ({
  track: { flexDirection: 'row', gap: t.spacing.xs / 2 },
  segment: { flex: 1, height: t.size.progress, backgroundColor: t.colors.border, overflow: 'hidden' },
  on: { height: '100%', backgroundColor: t.colors.accent },
}));

/**
 * Progress from 0 to 1 as a thin bar (XP, collection, race progress). One continuous bar by default;
 * pass `segments` (say 10) to split it into ticks like a timing tower.
 */
export function SegmentedProgress({ fraction, segments = 1, accessibilityLabel }: { fraction: number; segments?: number; accessibilityLabel?: string }) {
  const styles = useStyles();
  const clamped = Math.max(0, Math.min(1, fraction));
  const count = Math.max(1, Math.round(segments));

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      {Array.from({ length: count }, (_, i) => {
        // how much of this segment is filled, 0 to 1
        const filled = Math.max(0, Math.min(1, clamped * count - i));
        return (
          <View key={i} style={styles.segment}>
            <View style={[styles.on, { width: `${filled * 100}%` }]} />
          </View>
        );
      })}
    </View>
  );
}
