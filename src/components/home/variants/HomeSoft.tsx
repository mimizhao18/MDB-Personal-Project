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
  panel: { gap: t.spacing.md },
  strip: { flexDirection: 'row', borderTopWidth: t.border.hairline, borderTopColor: t.glass.divider, paddingTop: t.spacing.md },
  cell: { flex: 1, alignItems: 'center', gap: 2 },
  divided: { borderLeftWidth: t.border.hairline, borderLeftColor: t.glass.divider },
  label: { ...t.typography.metaLabel, color: t.colors.textMuted },
  value: { ...t.typography.metaValue, fontSize: 14, color: t.colors.text },
}));

/** Variant 3, Soft: the level and credits sit right on the glow; one softly rounded glass panel at the bottom holds XP and the stats together. */
export function HomeSoft({ data, onStart }: { data: HomeData; onStart: () => void }) {
  const styles = useStyles();
  const livery = getLivery(data.profile.car.liveryId);
  return (
    <View style={styles.screen}>
      <AmbientGlow color={glowHexFor(livery.primary, livery.secondary)} />
      <View style={styles.content}>
        <LevelLine data={data} />
        <View style={styles.car}>
          <HeroCar car={data.profile.car} autoSpin={false} background="transparent" zoom={0.88} />
        </View>
        <Glass corner="round" style={styles.panel}>
          <XpBlock data={data} gap={8} />
          <View style={styles.strip}>
            {figures(data).map((f, i) => (
              <View key={f.label} style={[styles.cell, i > 0 && styles.divided]}>
                <Text style={styles.label}>{f.label}</Text>
                <Text style={styles.value}>{withUnit(f)}</Text>
              </View>
            ))}
          </View>
        </Glass>
        <StartButton label="Start Race" onPress={onStart} frame />
      </View>
    </View>
  );
}
