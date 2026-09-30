import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Line, Path } from 'react-native-svg';

import { positionOnTrack } from '../logic/trackPosition';
import type { CarSettings, Track } from '../models/types';
import { CarShape } from './CarIcon';

interface Props {
  track: Track;
  /** 0 to 1 through the current lap. */
  lapFraction: number;
  car?: CarSettings;
}

const DEFAULT_CAR: CarSettings = { primaryColor: '#E10600', secondaryColor: '#FFFFFF', number: 1 };
const ROAD_COLOR = '#E6E6E6';
const ROAD_WIDTH = 26;
const KERB_COLOR = '#2B2B2B';
const KERB_WIDTH = 30;

/** The circuit with the car on it. Drawn in track coordinates and scaled to fit the width. */
export function TrackView({ track, lapFraction, car = DEFAULT_CAR }: Props) {
  const { width, height } = track.viewBox;
  const pos = positionOnTrack(track, lapFraction);

  return (
    <View style={[styles.wrap, { aspectRatio: width / height }]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <TrackLayer track={track} />
        <G transform={`translate(${pos.x} ${pos.y}) rotate(${pos.angleDeg})`}>
          <CarShape car={car} />
        </G>
      </Svg>
    </View>
  );
}

/** The road and start line. Memoised so it is not redrawn every frame while the car moves. */
const TrackLayer = memo(function TrackLayer({ track }: { track: Track }) {
  const { from, to } = track.startFinish;
  return (
    <>
      <Path d={track.path} stroke={KERB_COLOR} strokeWidth={KERB_WIDTH} strokeLinejoin="round" fill="none" />
      <Path d={track.path} stroke={ROAD_COLOR} strokeWidth={ROAD_WIDTH} strokeLinejoin="round" fill="none" />
      <Line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#FFFFFF" strokeWidth={8} />
      <Line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#111111" strokeWidth={3} strokeDasharray="6 6" />
    </>
  );
});

const styles = StyleSheet.create({
  wrap: { width: '100%' },
});
