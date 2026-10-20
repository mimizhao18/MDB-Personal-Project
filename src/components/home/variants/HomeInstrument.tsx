import { useState } from 'react';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { makeStyles, useTheme } from '../../../design/styles';
import { HeroCar } from '../../HeroCar';
import { Button, StatBlock } from '../../ui';
import type { HomeData } from '../useHomeData';
import { HomeTopBar } from './parts';

// the gauge is a 270 degree arc that opens at the bottom: it starts at 135 degrees and sweeps clockwise to 405
const START = 135;
const SWEEP = 270;

function polar(cx: number, cy: number, r: number, degrees: number) {
  const a = (degrees * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arc(cx: number, cy: number, r: number, from: number, to: number): string {
  const a = polar(cx, cy, r, from);
  const b = polar(cx, cy, r, to);
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${b.x} ${b.y}`;
}

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, padding: t.spacing.screen, gap: t.spacing.md },
  gauge: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  readout: { position: 'absolute', bottom: 0, alignItems: 'center' },
  readoutLevel: { ...t.typography.statLarge, color: t.colors.text },
  readoutXp: { ...t.typography.statSmall, color: t.colors.textMuted },
  readoutLabel: { ...t.typography.label, color: t.colors.textMuted },
  row: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center' },
  divided: { borderLeftWidth: t.border.hairline, borderLeftColor: t.colors.border },
}));

/** Variant 2, Instrument: a large arc gauge for the level behind the car, a compact stat row underneath. */
export function HomeInstrument({ data, onStart }: { data: HomeData; onStart: () => void }) {
  const styles = useStyles();
  const t = useTheme();
  const [box, setBox] = useState({ width: 0, height: 0 });
  const { profile, stats, level, streak } = data;

  const stroke = t.size.progress;
  const size = Math.min(box.width, box.height);
  const c = size / 2;
  const r = c - stroke;
  const end = START + SWEEP * Math.max(0.001, Math.min(1, level.fraction));

  return (
    <View style={styles.screen}>
      <HomeTopBar credits={profile.credits} />
      <View style={styles.gauge} onLayout={(e) => setBox(e.nativeEvent.layout)}>
        {size > 0 && (
          <Svg width={size} height={size} style={{ position: 'absolute' }}>
            <Path d={arc(c, c, r, START, START + SWEEP)} stroke={t.colors.border} strokeWidth={stroke} fill="none" strokeLinecap="butt" />
            <Path d={arc(c, c, r, START, end)} stroke={t.colors.accent} strokeWidth={stroke} fill="none" strokeLinecap="butt" />
          </Svg>
        )}
        <View style={{ width: size, height: size * 0.8 }}>
          <HeroCar car={profile.car} autoSpin={false} background="transparent" />
        </View>
        <View style={[styles.readout, { bottom: size * 0.04 }]} accessible accessibilityLabel={`Level ${level.level}, ${level.xpIntoLevel} of ${level.xpForNextLevel} XP`}>
          <Text style={styles.readoutLabel}>Level</Text>
          <Text style={styles.readoutLevel}>{level.level}</Text>
          <Text style={styles.readoutXp}>
            {level.xpIntoLevel} / {level.xpForNextLevel} XP
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.cell}>
          <StatBlock label="Streak" value={streak} unit="d" size="small" align="center" />
        </View>
        <View style={[styles.cell, styles.divided]}>
          <StatBlock label="Races" value={stats.races} size="small" align="center" />
        </View>
        <View style={[styles.cell, styles.divided]}>
          <StatBlock label="Laps" value={stats.laps} size="small" align="center" />
        </View>
        <View style={[styles.cell, styles.divided]}>
          <StatBlock label="Distance" value={stats.distanceKm.toFixed(0)} unit="km" size="small" align="center" />
        </View>
      </View>
      <Button label="Start Race" onPress={onStart} />
    </View>
  );
}
