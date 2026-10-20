import { Text, View } from 'react-native';

import { getLivery } from '../../../data/liveries';
import { makeStyles } from '../../../design/styles';
import { glowHexFor } from '../../car3d/glow';
import { HeroCar } from '../../HeroCar';
import { AmbientGlow, Glass, StartButton } from '../../ui';
import type { HomeData } from '../useHomeData';
import { LevelLine, XpBlock, figures, withUnit } from './parts';

const useStyles = makeStyles((t) => ({
  screen: { flex: 1 },
  content: { flex: 1, padding: t.spacing.screen, gap: t.spacing.md },
  car: { flex: 1, marginHorizontal: -t.spacing.screen },
  panel: { gap: t.spacing.sm, paddingLeft: t.spacing.md + t.spacing.xs },
  rail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: t.colors.accent },
  rows: { paddingVertical: t.spacing.xs, paddingLeft: t.spacing.md + t.spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingVertical: t.spacing.xs + 1 },
  rowDivided: { borderTopWidth: t.border.hairline, borderTopColor: t.glass.divider },
  label: { ...t.typography.metaLabel, color: t.colors.textMuted },
  value: { ...t.typography.metaValue, color: t.colors.text },
}));

/** Variant 2, Rail: flat panels with a thin red rail down the left edge, and the stats as label / value rows like a lobby info list. */
export function HomeRail({ data, onStart }: { data: HomeData; onStart: () => void }) {
  const styles = useStyles();
  const livery = getLivery(data.profile.car.liveryId);
  return (
    <View style={styles.screen}>
      <AmbientGlow color={glowHexFor(livery.primary, livery.secondary)} />
      <View style={styles.content}>
        <Glass corner="square" style={styles.panel}>
          <View style={styles.rail} />
          <LevelLine data={data} />
          <XpBlock data={data} gap={8} />
        </Glass>
        <View style={styles.car}>
          <HeroCar car={data.profile.car} autoSpin={false} background="transparent" zoom={0.88} />
        </View>
        <Glass corner="square" style={styles.rows}>
          <View style={styles.rail} />
          {figures(data).map((f, i) => (
            <View key={f.label} style={[styles.row, i > 0 && styles.rowDivided]} accessible accessibilityLabel={`${f.label}: ${withUnit(f)}`}>
              <Text style={styles.label}>{f.label}</Text>
              <Text style={styles.value}>{withUnit(f)}</Text>
            </View>
          ))}
        </Glass>
        <StartButton label="Start Race" onPress={onStart} />
      </View>
    </View>
  );
}
