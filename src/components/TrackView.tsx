import { StyleSheet, View } from 'react-native';
import Svg, { G, Line, Path, Polygon, Rect } from 'react-native-svg';

import { positionOnTrack } from '../logic/trackPosition';
import type { Track } from '../models/types';

interface Props {
  track: Track;
  /** 0 to 1 through the current lap. */
  lapFraction: number;
  carColor?: string;
}

const ROAD_COLOR = '#E6E6E6';
const ROAD_WIDTH = 26;
const KERB_COLOR = '#2B2B2B';
const KERB_WIDTH = 30;

/** The circuit with the car on it. Drawn in track coordinates and scaled to fit the width. */
export function TrackView({ track, lapFraction, carColor = '#E10600' }: Props) {
  const { width, height } = track.viewBox;
  const car = positionOnTrack(track, lapFraction);
  const { from, to } = track.startFinish;

  return (
    <View style={[styles.wrap, { aspectRatio: width / height }]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <Path d={track.path} stroke={KERB_COLOR} strokeWidth={KERB_WIDTH} strokeLinejoin="round" fill="none" />
        <Path d={track.path} stroke={ROAD_COLOR} strokeWidth={ROAD_WIDTH} strokeLinejoin="round" fill="none" />
        <Line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#FFFFFF" strokeWidth={8} />
        <Line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#111111" strokeWidth={3} strokeDasharray="6 6" />
        <G transform={`translate(${car.x} ${car.y}) rotate(${car.angleDeg})`}>
          <Car color={carColor} />
        </G>
      </Svg>
    </View>
  );
}

/** A small top-down single-seater, about 52 units long, facing right. */
function Car({ color }: { color: string }) {
  return (
    <G>
      <Rect x={-26} y={-16} width={6} height={32} fill="#111111" />
      <Rect x={20} y={-14} width={5} height={28} fill="#111111" />
      <Rect x={-14} y={-18} width={12} height={8} rx={2} fill="#111111" />
      <Rect x={-14} y={10} width={12} height={8} rx={2} fill="#111111" />
      <Rect x={10} y={-16} width={10} height={7} rx={2} fill="#111111" />
      <Rect x={10} y={9} width={10} height={7} rx={2} fill="#111111" />
      <Polygon points="-24,-6 6,-7 22,-2 22,2 6,7 -24,6" fill={color} stroke="#FFFFFF" strokeWidth={1.5} />
      <Rect x={-6} y={-3.5} width={8} height={7} rx={3} fill="#FFFFFF" />
    </G>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
});
