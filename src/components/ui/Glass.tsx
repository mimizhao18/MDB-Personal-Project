import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Rect, Stop } from 'react-native-svg';

import { makeStyles, useTheme } from '../../design/styles';
import { chamferPoints } from '../../design/shapes';

const useStyles = makeStyles((t) => ({
  glass: { padding: t.spacing.md },
  layer: { position: 'absolute', top: 0, left: 0 },
}));

/**
 * A frosted-glass panel: a faint white fill that is brighter at the top, and a 1 px edge that catches light along the top.
 * It is see-through, so it picks up whatever glow is behind it. Use it sparingly: a couple of panels per screen, not every box.
 * `corner`: "chamfer" cuts two opposite corners (the angular look next to the tab bar), "round" uses the 6 px panel radius,
 * "square" has no rounding (the tab bar itself).
 */
export function Glass({ children, style, corner = 'round' }: { children: ReactNode; style?: StyleProp<ViewStyle>; corner?: 'chamfer' | 'round' | 'square' }) {
  const styles = useStyles();
  const { glass, radius, border, size: sizes } = useTheme();
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width, height } = size;
  const inset = border.hairline / 2;
  const fill = `url(#${id}f)`;
  const edge = `url(#${id}e)`;

  return (
    <View style={[styles.glass, style]} onLayout={(e) => setSize(e.nativeEvent.layout)}>
      {width > 0 && (
        <Svg width={width} height={height} style={styles.layer} pointerEvents="none">
          <Defs>
            <LinearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={glass.tint} stopOpacity={glass.fillTop} />
              <Stop offset="1" stopColor={glass.tint} stopOpacity={glass.fillBottom} />
            </LinearGradient>
            <LinearGradient id={`${id}e`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={glass.tint} stopOpacity={glass.edgeTop} />
              <Stop offset="1" stopColor={glass.tint} stopOpacity={glass.edgeBottom} />
            </LinearGradient>
          </Defs>
          {corner === 'chamfer' ? (
            <Polygon points={chamferPoints(inset, inset, width - border.hairline, height - border.hairline, sizes.chamfer)} fill={fill} stroke={edge} strokeWidth={border.hairline} />
          ) : (
            <Rect
              x={inset}
              y={inset}
              width={width - border.hairline}
              height={height - border.hairline}
              rx={corner === 'round' ? radius.panel : 0}
              fill={fill}
              stroke={edge}
              strokeWidth={border.hairline}
            />
          )}
        </Svg>
      )}
      {children}
    </View>
  );
}
