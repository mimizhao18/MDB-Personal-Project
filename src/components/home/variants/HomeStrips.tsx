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
  top: { gap: t.spacing.sm, paddingHorizontal: t.spacing.screen },
  car: { flex: 1 },
  dock: { gap: t.spacing.md, paddingHorizontal: t.spacing.screen },
  strip: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center', gap: 2 },
  divided: { borderLeftWidth: t.border.hairline, borderLeftColor: t.glass.divider },
  label: { ...t.typography.metaLabel, color: t.colors.textMuted },
  value: { ...t.typography.metaValue, fontSize: 14, color: t.colors.text },
}));

/** Variant 5, Strips: two full-width glass strips, one across the top and a dock at the bottom that holds the stats and the Start button, like the bars of a game menu. */
export function HomeStrips({ data, onStart }: { data: HomeData; onStart: () => void }) {
  const styles = useStyles();
  const livery = getLivery(data.profile.car.liveryId);
  return (
    <View style={styles.screen}>
      <AmbientGlow color={glowHexFor(livery.primary, livery.secondary)} />
      <Glass corner="square" style={styles.top}>
        <LevelLine data={data} />
        <XpBlock data={data} gap={8} />
      </Glass>
      <View style={styles.car}>
        <HeroCar car={data.profile.car} autoSpin={false} background="transparent" zoom={0.88} />
      </View>
      <Glass corner="square" style={styles.dock}>
        <View style={styles.strip}>
          {figures(data).map((f, i) => (
            <View key={f.label} style={[styles.cell, i > 0 && styles.divided]}>
              <Text style={styles.label}>{f.label}</Text>
              <Text style={styles.value}>{withUnit(f)}</Text>
            </View>
          ))}
        </View>
        <StartButton label="Start Race" onPress={onStart} frame />
      </Glass>
    </View>
  );
}
