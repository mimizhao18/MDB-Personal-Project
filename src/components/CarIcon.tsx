import { StyleSheet, View } from 'react-native';
import Svg, { G, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import type { CarSettings } from '../models/types';

const TYRE = '#1F1F1F';
const TYRE_OUTLINE = '#8A8A8A'; // keeps the tires visible on dark backgrounds

/** A top-down single-seater, about 52 units long, centred on (0, 0) and facing right. */
export function CarShape({ car, showNumber = false }: { car: CarSettings; showNumber?: boolean }) {
  return (
    <G>
      <Rect x={-26} y={-16} width={6} height={32} fill={TYRE} stroke={TYRE_OUTLINE} strokeWidth={1} />
      <Rect x={20} y={-14} width={5} height={28} fill={TYRE} stroke={TYRE_OUTLINE} strokeWidth={1} />
      <Rect x={-14} y={-18} width={12} height={8} rx={2} fill={TYRE} stroke={TYRE_OUTLINE} strokeWidth={1} />
      <Rect x={-14} y={10} width={12} height={8} rx={2} fill={TYRE} stroke={TYRE_OUTLINE} strokeWidth={1} />
      <Rect x={10} y={-16} width={10} height={7} rx={2} fill={TYRE} stroke={TYRE_OUTLINE} strokeWidth={1} />
      <Rect x={10} y={9} width={10} height={7} rx={2} fill={TYRE} stroke={TYRE_OUTLINE} strokeWidth={1} />
      <Polygon
        points="-24,-6 6,-7 22,-2 22,2 6,7 -24,6"
        fill={car.primaryColor}
        stroke={car.secondaryColor}
        strokeWidth={1.5}
      />
      <Rect x={-6} y={-3.5} width={8} height={7} rx={3} fill={car.secondaryColor} />
      {showNumber && (
        <SvgText x={-14} y={3} fontSize={7} fontWeight="bold" fill={car.secondaryColor} textAnchor="middle">
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
