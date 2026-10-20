import { useId, useState } from 'react';
import { View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { makeStyles, useTheme } from '../../design/styles';

const useStyles = makeStyles(() => ({
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
}));

/**
 * A soft pool of color behind a screen's content, in the car's color: a strong glow centered behind the car and a faint one
 * in the top corner. Put it first inside a screen so everything else, glass panels included, sits on top of it.
 */
export function AmbientGlow({ color }: { color: string }) {
  const styles = useStyles();
  const { glass } = useTheme();
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width, height } = size;

  return (
    <View style={styles.fill} pointerEvents="none" onLayout={(e) => setSize(e.nativeEvent.layout)}>
      {width > 0 && (
        <Svg width={width} height={height}>
          <Defs>
            <RadialGradient id={`${id}c`} gradientUnits="userSpaceOnUse" cx={width * 0.5} cy={height * 0.5} r={width * 0.95}>
              <Stop offset="0" stopColor={color} stopOpacity={glass.ambient} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id={`${id}t`} gradientUnits="userSpaceOnUse" cx={width} cy={0} r={width * 0.7}>
              <Stop offset="0" stopColor={color} stopOpacity={glass.ambient / 2} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={width} height={height} fill={`url(#${id}c)`} />
          <Rect x={0} y={0} width={width} height={height} fill={`url(#${id}t)`} />
        </Svg>
      )}
    </View>
  );
}
