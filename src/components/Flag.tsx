import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Polygon, Rect } from 'react-native-svg';

import type { CountryCode } from '../models/types';
import { colors } from '../theme';

/** Points of a star with `tips` tips, centred on (cx, cy): outer radius `outer`, inner radius `inner`. */
function star(cx: number, cy: number, outer: number, inner: number, tips = 5, rotation = -90): string {
  return Array.from({ length: tips * 2 }, (_, i) => {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = ((rotation + (i * 180) / tips) * Math.PI) / 180;
    return `${(cx + Math.cos(angle) * radius).toFixed(2)},${(cy + Math.sin(angle) * radius).toFixed(2)}`;
  }).join(' ');
}

/** A zigzag edge for the flags of Bahrain and Qatar, running down x = `x` with `teeth` points pointing right. */
function serrated(x: number, teeth: number, depth: number): string {
  const step = 40 / teeth;
  let points = `0,0 ${x},0`;
  for (let i = 0; i < teeth; i++) points += ` ${x + depth},${step * i + step / 2} ${x},${step * (i + 1)}`;
  return `${points} 0,40`;
}

const UNION_JACK = (
  <>
    <Rect width={60} height={40} fill="#012169" />
    <Path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" strokeWidth={7} />
    <Path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth={2.6} />
    <Path d="M30,0 V40 M0,20 H60" stroke="#FFFFFF" strokeWidth={11} />
    <Path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth={6.5} />
  </>
);

/**
 * Small country flags drawn in code, simplified so they stay clear at a small size. (Flag emoji are not used because
 * Windows shows them as plain letters.) All are drawn on a 60 x 40 canvas and scaled to `width`.
 */
export function Flag({ code, width = 36 }: { code: CountryCode; width?: number }) {
  const height = (width * 2) / 3;
  return (
    <View style={[styles.frame, { width, height }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={width} height={height} viewBox="0 0 60 40" preserveAspectRatio="none">
        {code === 'GB' && UNION_JACK}
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
        {code === 'AU' && (
          <>
            <Rect width={60} height={40} fill="#00008B" />
            <G transform="scale(0.5)">{UNION_JACK}</G>
            <Polygon points={star(15, 31, 4.5, 1.9, 7)} fill="#FFFFFF" />
            <Polygon points={star(42, 8, 2.6, 1.1, 7)} fill="#FFFFFF" />
            <Polygon points={star(50, 18, 2.6, 1.1, 7)} fill="#FFFFFF" />
            <Polygon points={star(42, 31, 2.6, 1.1, 7)} fill="#FFFFFF" />
            <Polygon points={star(34, 19, 2.6, 1.1, 7)} fill="#FFFFFF" />
          </>
        )}
        {code === 'CN' && (
          <>
            <Rect width={60} height={40} fill="#DE2910" />
            <Polygon points={star(10, 10, 6, 2.4)} fill="#FFDE00" />
            <Polygon points={star(21, 4, 2, 0.8)} fill="#FFDE00" />
            <Polygon points={star(25, 9, 2, 0.8)} fill="#FFDE00" />
            <Polygon points={star(25, 16, 2, 0.8)} fill="#FFDE00" />
            <Polygon points={star(21, 21, 2, 0.8)} fill="#FFDE00" />
          </>
        )}
        {code === 'JP' && (
          <>
            <Rect width={60} height={40} fill="#FFFFFF" />
            <Circle cx={30} cy={20} r={12} fill="#BC002D" />
          </>
        )}
        {code === 'BH' && (
          <>
            <Rect width={60} height={40} fill="#CE1126" />
            <Polygon points={serrated(16, 5, 8)} fill="#FFFFFF" />
          </>
        )}
        {code === 'SA' && (
          <>
            <Rect width={60} height={40} fill="#006C35" />
            <Path d="M14,15 H46 M18,20 H42 M22,25 H38" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" />
            <Path d="M14,31 H46" stroke="#FFFFFF" strokeWidth={2} />
            <Path d="M14,31 L10,29 M14,31 L10,33" stroke="#FFFFFF" strokeWidth={1.4} />
          </>
        )}
        {code === 'US' && (
          <>
            <Rect width={60} height={40} fill="#FFFFFF" />
            {Array.from({ length: 7 }, (_, i) => (
              <Rect key={`s${i}`} y={(i * 2 * 40) / 13} width={60} height={40 / 13} fill="#B22234" />
            ))}
            <Rect width={26} height={(7 * 40) / 13} fill="#3C3B6E" />
            {Array.from({ length: 4 }, (_, r) =>
              Array.from({ length: 5 }, (_, c) => <Circle key={`${r}${c}`} cx={3.2 + c * 4.9} cy={3 + r * 4.2} r={0.9} fill="#FFFFFF" />),
            )}
          </>
        )}
        {code === 'CA' && (
          <>
            <Rect width={60} height={40} fill="#FFFFFF" />
            <Rect width={15} height={40} fill="#D52B1E" />
            <Rect x={45} width={15} height={40} fill="#D52B1E" />
            <Polygon points="30,8 33,15 38,13 36,21 40,19 37,26 30,24 23,26 20,19 24,21 22,13 27,15" fill="#D52B1E" />
            <Rect x={29} y={24} width={2} height={7} fill="#D52B1E" />
          </>
        )}
        {code === 'ES' && (
          <>
            <Rect width={60} height={40} fill="#AA151B" />
            <Rect y={10} width={60} height={20} fill="#F1BF00" />
          </>
        )}
        {code === 'AT' && (
          <>
            <Rect width={60} height={40} fill="#ED2939" />
            <Rect y={13.3} width={60} height={13.4} fill="#FFFFFF" />
          </>
        )}
        {code === 'HU' && (
          <>
            <Rect width={60} height={13.4} fill="#CD2A3E" />
            <Rect y={13.3} width={60} height={13.4} fill="#FFFFFF" />
            <Rect y={26.6} width={60} height={13.4} fill="#436F4D" />
          </>
        )}
        {code === 'NL' && (
          <>
            <Rect width={60} height={13.4} fill="#AE1C28" />
            <Rect y={13.3} width={60} height={13.4} fill="#FFFFFF" />
            <Rect y={26.6} width={60} height={13.4} fill="#21468B" />
          </>
        )}
        {code === 'IT' && (
          <>
            <Rect width={20} height={40} fill="#009246" />
            <Rect x={20} width={20} height={40} fill="#FFFFFF" />
            <Rect x={40} width={20} height={40} fill="#CE2B37" />
          </>
        )}
        {code === 'AZ' && (
          <>
            <Rect width={60} height={13.4} fill="#00B5E2" />
            <Rect y={13.3} width={60} height={13.4} fill="#EF3340" />
            <Rect y={26.6} width={60} height={13.4} fill="#509E2F" />
            <Circle cx={28} cy={20} r={5.2} fill="#FFFFFF" />
            <Circle cx={29.6} cy={20} r={4.2} fill="#EF3340" />
            <Polygon points={star(35, 20, 2.4, 1, 8)} fill="#FFFFFF" />
          </>
        )}
        {code === 'SG' && (
          <>
            <Rect width={60} height={20} fill="#EF3340" />
            <Rect y={20} width={60} height={20} fill="#FFFFFF" />
            <Circle cx={13} cy={10} r={6.2} fill="#FFFFFF" />
            <Circle cx={15.4} cy={10} r={5.4} fill="#EF3340" />
            <Polygon points={star(22, 5.5, 1.8, 0.7)} fill="#FFFFFF" />
            <Polygon points={star(26, 9, 1.8, 0.7)} fill="#FFFFFF" />
            <Polygon points={star(24.8, 14, 1.8, 0.7)} fill="#FFFFFF" />
            <Polygon points={star(19.2, 14, 1.8, 0.7)} fill="#FFFFFF" />
            <Polygon points={star(18, 9, 1.8, 0.7)} fill="#FFFFFF" />
          </>
        )}
        {code === 'MX' && (
          <>
            <Rect width={20} height={40} fill="#006847" />
            <Rect x={20} width={20} height={40} fill="#FFFFFF" />
            <Rect x={40} width={20} height={40} fill="#CE1126" />
            <Circle cx={30} cy={20} r={5.5} fill="#8C6D3C" />
            <Path d="M24,24 Q30,30 36,24" stroke="#006847" strokeWidth={1.8} fill="none" />
          </>
        )}
        {code === 'BR' && (
          <>
            <Rect width={60} height={40} fill="#009C3B" />
            <Polygon points="30,5 55,20 30,35 5,20" fill="#FFDF00" />
            <Circle cx={30} cy={20} r={9} fill="#002776" />
            <Path d="M21.5,18 Q30,14.5 38.5,22" stroke="#FFFFFF" strokeWidth={1.8} fill="none" />
          </>
        )}
        {code === 'QA' && (
          <>
            <Rect width={60} height={40} fill="#8A1538" />
            <Polygon points={serrated(20, 9, 8)} fill="#FFFFFF" />
          </>
        )}
        {code === 'AE' && (
          <>
            <Rect width={60} height={13.4} fill="#00732F" />
            <Rect y={13.3} width={60} height={13.4} fill="#FFFFFF" />
            <Rect y={26.6} width={60} height={13.4} fill="#000000" />
            <Rect width={15} height={40} fill="#FF0000" />
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
});
