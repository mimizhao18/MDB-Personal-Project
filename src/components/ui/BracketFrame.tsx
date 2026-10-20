import { useState } from 'react';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { makeStyles, useTheme } from '../../design/styles';

const useStyles = makeStyles((t) => ({
  frame: { padding: t.spacing.md },
  layer: { position: 'absolute', top: 0, left: 0 },
}));

/**
 * A panel with no border: just a very faint fill and a short L-shaped tick in each corner, like the corner marks of a
 * game HUD. The ticks are what give it its shape.
 */
export function BracketFrame({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
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
    <View style={[styles.frame, style]} onLayout={(e) => setBox(e.nativeEvent.layout)}>
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
