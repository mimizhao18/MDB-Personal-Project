import { Text, View } from 'react-native';

import { getLivery } from '../../../data/liveries';
import { makeStyles } from '../../../design/styles';
import { glowHexFor } from '../../car3d/glow';
import { HeroCar } from '../../HeroCar';
import { AmbientGlow, StartButton } from '../../ui';
import type { HomeData } from '../useHomeData';
import { BracketFrame, LevelLine, XpBlock, figures, withUnit } from './parts';

const useStyles = makeStyles((t) => ({
  screen: { flex: 1 },
  content: { flex: 1, padding: t.spacing.screen, gap: t.spacing.md },
  car: { flex: 1, marginHorizontal: -t.spacing.screen },
  strip: { flexDirection: 'row', paddingVertical: t.spacing.sm },
  cell: { flex: 1, alignItems: 'center', gap: 2 },
  divided: { borderLeftWidth: t.border.hairline, borderLeftColor: t.glass.divider },
  label: { ...t.typography.metaLabel, color: t.colors.textMuted },
  value: { ...t.typography.metaValue, fontSize: 14, color: t.colors.text },
}));

/** Variant 1, Brackets: no borders at all, only a faint fill and a short tick in each corner of the two panels. */
export function HomeBrackets({ data, onStart }: { data: HomeData; onStart: () => void }) {
  const styles = useStyles();
  const livery = getLivery(data.profile.car.liveryId);
  return (
    <View style={styles.screen}>
      <AmbientGlow color={glowHexFor(livery.primary, livery.secondary)} />
      <View style={styles.content}>
        <BracketFrame style={{ gap: 8 }}>
          <LevelLine data={data} />
          <XpBlock data={data} gap={8} />
        </BracketFrame>
        <View style={styles.car}>
          <HeroCar car={data.profile.car} autoSpin={false} background="transparent" zoom={0.88} />
        </View>
        <BracketFrame style={styles.strip}>
          {figures(data).map((f, i) => (
            <View key={f.label} style={[styles.cell, i > 0 && styles.divided]}>
              <Text style={styles.label}>{f.label}</Text>
              <Text style={styles.value}>{withUnit(f)}</Text>
            </View>
          ))}
        </BracketFrame>
        <StartButton label="Start Race" onPress={onStart} frame />
      </View>
    </View>
  );
}
