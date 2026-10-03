import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import type { CarSettings } from '../models/types';

const TYRE = '#1B1B1B';
const TYRE_OUTLINE = '#7C7C7C'; // keeps the tires visible on dark backgrounds
const DARK = '#141414';

/** Darkens a #RRGGBB color (factor 0 to 1) for the wing end plates and edges. */
function shade(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => Math.round(((n >> shift) & 255) * factor);
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

/**
 * A top-down single-seater, about 55 units long and 40 wide, centred on (0, 0) and facing right.
 * The body takes the primary color; the helmet, nose stripe and wing flap take the accent color.
 */
export function CarShape({ car, showNumber = false }: { car: CarSettings; showNumber?: boolean }) {
  const body = car.primaryColor;
  const accent = car.secondaryColor;
  const edge = shade(body, 0.6);

  return (
    <G>
      {/* soft shadow under the floor */}
      <Path d="M -20 -13 L 12 -13 L 16 -6 L 16 6 L 12 13 L -20 13 Z" fill="#000000" fillOpacity={0.22} />

      {/* rear wing */}
      <Rect x={-27} y={-15} width={6} height={30} rx={1} fill={body} stroke={edge} strokeWidth={0.6} />
      <Rect x={-28} y={-16.5} width={8} height={2.2} rx={0.8} fill={shade(body, 0.45)} />
      <Rect x={-28} y={14.3} width={8} height={2.2} rx={0.8} fill={shade(body, 0.45)} />

      {/* suspension arms */}
      <Line x1={-13} y1={-8} x2={-13} y2={-12} stroke={DARK} strokeWidth={1.1} />
      <Line x1={-13} y1={8} x2={-13} y2={12} stroke={DARK} strokeWidth={1.1} />
      <Line x1={14} y1={-3} x2={14} y2={-10} stroke={DARK} strokeWidth={1.1} />
      <Line x1={14} y1={3} x2={14} y2={10} stroke={DARK} strokeWidth={1.1} />

      {/* tires: rear (larger) and front */}
      <Rect x={-19} y={-19.5} width={12} height={8.5} rx={2.2} fill={TYRE} stroke={TYRE_OUTLINE} strokeWidth={0.8} />
      <Rect x={-19} y={11} width={12} height={8.5} rx={2.2} fill={TYRE} stroke={TYRE_OUTLINE} strokeWidth={0.8} />
      <Rect x={9.5} y={-16.5} width={9.5} height={6.5} rx={2} fill={TYRE} stroke={TYRE_OUTLINE} strokeWidth={0.8} />
      <Rect x={9.5} y={10} width={9.5} height={6.5} rx={2} fill={TYRE} stroke={TYRE_OUTLINE} strokeWidth={0.8} />

      {/* front wing */}
      <Rect x={21} y={-15} width={5.5} height={30} rx={1.2} fill={body} stroke={edge} strokeWidth={0.6} />
      <Rect x={24.3} y={-15} width={1.3} height={30} fill={accent} />
      <Rect x={20.5} y={-16.2} width={7} height={2.2} rx={0.8} fill={shade(body, 0.45)} />
      <Rect x={20.5} y={14} width={7} height={2.2} rx={0.8} fill={shade(body, 0.45)} />

      {/* body: engine cover, sidepods, tapering to the nose */}
      <Path
        d="M -22 -4.5 C -20 -8, -14 -10.8, -8 -10.2 C -2 -9.6, 2 -6, 7 -4.2 L 22 -1.7 Q 24.2 0 22 1.7 L 7 4.2 C 2 6, -2 9.6, -8 10.2 C -14 10.8, -20 8, -22 4.5 Z"
        fill={body}
        stroke={accent}
        strokeOpacity={0.55}
        strokeWidth={0.7}
      />
      {/* centre stripe along the engine cover and nose */}
      <Line x1={-21} y1={0} x2={22} y2={0} stroke={accent} strokeWidth={1.2} strokeOpacity={0.9} />
      {/* sidepod inlets */}
      <Path d="M -3 -7.6 L 3 -5.6 L 3 -4.2 L -3 -5.2 Z" fill={shade(body, 0.45)} />
      <Path d="M -3 7.6 L 3 5.6 L 3 4.2 L -3 5.2 Z" fill={shade(body, 0.45)} />

      {/* airbox, helmet and halo */}
      <Ellipse cx={-7.5} cy={0} rx={3.2} ry={2.4} fill={DARK} />
      <Circle cx={-1.5} cy={0} r={3.1} fill={accent} stroke={DARK} strokeWidth={0.8} />
      <Path d="M 1.2 -3.9 Q 4.2 0 1.2 3.9" fill="none" stroke={DARK} strokeWidth={1.1} strokeLinecap="round" />

      {showNumber && (
        <SvgText x={-15.5} y={2.4} fontSize={6.5} fontWeight="bold" fontFamily="Arial" fill={accent} textAnchor="middle">
          {car.number}
        </SvgText>
      )}
    </G>
  );
}

/** The car on its own, for screens like Home and the garage. Faces right. */
export function CarImage({ car, size = 240 }: { car: CarSettings; size?: number }) {
  return (
    <View style={[styles.wrap, { width: size, height: size * 0.5 }]}>
      <Svg width="100%" height="100%" viewBox="-34 -22 68 44">
        <CarShape car={car} showNumber />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center' },
});
