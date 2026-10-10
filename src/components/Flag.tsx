import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { colors } from '../theme';
import type { CountryCode } from '../models/types';

/**
 * Small country flags drawn in code. (Flag emoji are not used because Windows shows them as plain letters.)
 * All are drawn on a 60 x 40 canvas and scaled to `width`.
 */
export function Flag({ code, width = 36 }: { code: CountryCode; width?: number }) {
  const height = (width * 2) / 3;
  return (
    <View style={[styles.frame, { width, height }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={width} height={height} viewBox="0 0 60 40" preserveAspectRatio="none">
        {code === 'GB' && (
          <>
            <Rect width={60} height={40} fill="#012169" />
            <Path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" strokeWidth={7} />
            <Path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth={2.6} />
            <Path d="M30,0 V40 M0,20 H60" stroke="#FFFFFF" strokeWidth={11} />
            <Path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth={6.5} />
          </>
        )}
        {code === 'MC' && (
          <>
            <Rect width={60} height={20} fill="#CE1126" />
            <Rect y={20} width={60} height={20} fill="#FFFFFF" />
          </>
        )}
        {code === 'BE' && (
          <>
            <Rect width={20} height={40} fill="#000000" />
            <Rect x={20} width={20} height={40} fill="#FAE042" />
            <Rect x={40} width={20} height={40} fill="#ED2939" />
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
});
