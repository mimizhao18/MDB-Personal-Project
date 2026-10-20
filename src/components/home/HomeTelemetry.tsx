import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { makeStyles } from '../../design/styles';
import { Credits } from '../../ui/Credits';
import { Button } from '../../ui/kit';
import { HeroCar } from '../HeroCar';
import type { HomeData } from './useHomeData';

const SEGMENTS = 12;

const useStyles = makeStyles((t) => ({
  safe: { flex: 1, padding: t.spacing.md, gap: t.spacing.md },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm },
  badge: { borderWidth: t.border.hairline, borderColor: t.colors.borderStrong, paddingHorizontal: t.spacing.sm, paddingVertical: 4 },
  badgeText: { fontSize: 15, fontWeight: '800', color: t.colors.text, letterSpacing: 0.5 },
  label: { ...t.type.label, fontSize: 11, color: t.colors.textMuted },
  gauge: { gap: 6 },
  segments: { flexDirection: 'row', gap: 3 },
  segment: { flex: 1, height: 6, backgroundColor: t.colors.border },
  segmentOn: { backgroundColor: t.colors.accent },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  xp: { ...t.type.caption, color: t.colors.textMuted },
  carArea: { flex: 1, marginHorizontal: -t.spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: t.spacing.sm },
  panel: {
    width: '48.5%',
    backgroundColor: t.colors.surface,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
    borderRadius: t.radius.lg,
    paddingVertical: t.spacing.sm + 2,
    paddingHorizontal: t.spacing.md,
    gap: 2,
  },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  value: { fontSize: 24, fontWeight: '800', color: t.colors.text },
  unit: { ...t.type.caption, color: t.colors.textMuted },
}));

/** A race-engineer dashboard: a segmented XP gauge and a grid of stat panels. */
export function HomeTelemetry({ data, onStart }: { data: HomeData; onStart: () => void }) {
  const styles = useStyles();
  const { profile, stats, level, streak } = data;
  const filled = Math.round(level.fraction * SEGMENTS);
  const panels = [
    { label: 'Streak', value: String(streak), unit: streak === 1 ? 'day' : 'days' },
    { label: 'Races', value: String(stats.races), unit: '' },
    { label: 'Laps', value: String(stats.laps), unit: '' },
    { label: 'Distance', value: stats.distanceKm.toFixed(0), unit: 'km' },
  ];
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
        <View style={styles.segments}>
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <View key={i} style={[styles.segment, i < filled && styles.segmentOn]} />
          ))}
        </View>
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
      <View style={styles.grid}>
        {panels.map((p) => (
          <View key={p.label} style={styles.panel}>
            <Text style={styles.label}>{p.label}</Text>
            <View style={styles.valueRow}>
              <Text style={styles.value}>{p.value}</Text>
              {p.unit ? <Text style={styles.unit}>{p.unit}</Text> : null}
            </View>
          </View>
        ))}
      </View>
      <Button label="Start Race" onPress={onStart} />
    </SafeAreaView>
  );
}
