import { useState } from 'react';
import { Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { makeStyles, useTheme } from '../../../design/styles';
import { CreditAmount, SegmentedProgress } from '../../ui';
import type { HomeData } from '../useHomeData';

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pair: { flexDirection: 'row', alignItems: 'baseline', gap: t.spacing.sm },
  label: { ...t.typography.metaLabel, color: t.colors.textMuted },
  value: { ...t.typography.metaValue, color: t.colors.textMuted },
  strong: { color: t.colors.text },
  slash: { ...t.typography.metaValue, color: t.colors.textMuted, opacity: t.opacity.dimmed },
  layer: { position: 'absolute', top: 0, left: 0 },
  padded: { padding: t.spacing.md },
}));

/** The level and credits line: every piece 12 px, the level number and the credits white, the rest muted. */
export function LevelLine({ data }: { data: HomeData }) {
  const styles = useStyles();
  const { level, profile } = data;
  return (
    <View style={styles.row}>
      <View style={styles.pair} accessible accessibilityLabel={`Level ${level.level}`}>
        <Text style={styles.label}>Level</Text>
        <Text style={[styles.value, styles.strong]}>{level.level}</Text>
      </View>
      <CreditAmount amount={profile.credits} small />
    </View>
  );
}

/** The XP line: a thin continuous bar and, under it, "XP" and how far along you are. */
export function XpBlock({ data, gap }: { data: HomeData; gap: number }) {
  const styles = useStyles();
  const { level } = data;
  return (
    <View style={{ gap }}>
      <SegmentedProgress fraction={level.fraction} accessibilityLabel="XP to the next level" />
      <View style={styles.row} accessible accessibilityLabel={`${level.xpIntoLevel} of ${level.xpForNextLevel} XP`}>
        <Text style={styles.label}>XP</Text>
        <Text style={styles.value}>
          {level.xpIntoLevel} / {level.xpForNextLevel}
        </Text>
      </View>
    </View>
  );
}

/** The three figures, as [label, value, unit] triples. */
export function figures(data: HomeData) {
  const { streak, stats } = data;
  return [
    { label: 'Streak', value: String(streak), unit: streak === 1 ? 'day' : 'days' },
    { label: 'Races', value: String(stats.races), unit: '' },
    { label: 'Distance', value: stats.distanceKm.toFixed(0), unit: 'km' },
  ];
}

/** Text for a figure's value with its unit: "5 days", "7", "679 km". */
export const withUnit = (f: { value: string; unit: string }) => (f.unit ? `${f.value} ${f.unit}` : f.value);

/** `a // b // c`, the separator used in a game's header ("BACK // PLAY"). */
export function SlashLine({ items }: { items: readonly string[] }) {
  const styles = useStyles();
  return (
    <Text style={[styles.value, { textAlign: 'center' }]}>
      {items.map((item, i) => (
        <Text key={item}>
          {i > 0 && <Text style={styles.slash}>{'  //  '}</Text>}
          <Text style={styles.strong}>{item}</Text>
        </Text>
      ))}
    </Text>
  );
}

/**
 * A panel with no border: just a very faint fill and a short L-shaped tick in each corner, like the corner marks of a
 * game HUD. The ticks are what give it its shape.
 */
export function BracketFrame({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const styles = useStyles();
  const { glass, size: sizes, border } = useTheme();
  const [box, setBox] = useState({ width: 0, height: 0 });
  const { width: w, height: h } = box;
  const n = sizes.tick;
  const o = border.hairline / 2;
  const d = [
    `M ${o} ${n} L ${o} ${o} L ${n} ${o}`,
    `M ${w - n} ${o} L ${w - o} ${o} L ${w - o} ${n}`,
    `M ${w - o} ${h - n} L ${w - o} ${h - o} L ${w - n} ${h - o}`,
    `M ${n} ${h - o} L ${o} ${h - o} L ${o} ${h - n}`,
  ].join(' ');
  return (
    <View style={[styles.padded, style]} onLayout={(e) => setBox(e.nativeEvent.layout)}>
      {w > 0 && (
        <Svg width={w} height={h} style={styles.layer} pointerEvents="none">
          <Rect x={0} y={0} width={w} height={h} fill={glass.tint} fillOpacity={glass.fillBottom} />
          <Path d={d} stroke={glass.tint} strokeOpacity={glass.mark} strokeWidth={border.hairline} fill="none" />
        </Svg>
      )}
      {children}
    </View>
  );
}
