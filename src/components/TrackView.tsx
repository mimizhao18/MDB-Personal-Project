import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Line, Path, Polygon } from 'react-native-svg';

import { DEFAULT_LIVERY_ID } from '../data/liveries';
import { colors } from '../design/tokens';
import { positionOnTrack } from '../logic/trackPosition';
import type { CarSettings, Track } from '../models/types';
import { CarShape } from './CarIcon';

interface Props {
  track: Track;
  /** 0 to 1 through the current lap. */
  lapFraction: number;
  car?: CarSettings;
  /** Set to false for a plain track preview with no car. */
  showCar?: boolean;
  /** Draw the car spun round with a crash burst on it (the race ended in a DNF). */
  crashed?: boolean;
  /** Fill whatever space the parent gives (keeping the track's proportions) instead of sizing to the width. */
  fill?: boolean;
}

const DEFAULT_CAR: CarSettings = { liveryId: DEFAULT_LIVERY_ID, number: 1 };
// a soft grey road (not pure white) so the track does not glare on the dark screen; every car color still shows on it
const ROAD_COLOR = colors.textSecondary;
const KERB_EXTRA = 4; // dark edge, split across both sides of the road
const STANDARD_ROAD_WIDTH = 26; // the car is drawn for this road width and scaled for others
const KERB_COLOR = colors.raised;
// a twelve-point star centred on the car, for a crash
const BURST = Array.from({ length: 24 }, (_, i) => {
  const radius = i % 2 === 0 ? 34 : 17;
  const angle = (i * Math.PI) / 12;
  return `${(Math.cos(angle) * radius).toFixed(1)},${(Math.sin(angle) * radius).toFixed(1)}`;
}).join(' ');
const CRASH_SPIN = 50; // degrees the crashed car is turned from the direction of the track
const CAR_SCALE = 1.35; // the car is drawn a little larger than the road is wide, so it is easy to follow

/** The circuit with the car on it. Drawn in track coordinates and scaled to fit the width. */
export function TrackView({ track, lapFraction, car = DEFAULT_CAR, showCar = true, crashed = false, fill = false }: Props) {
  const { width, height } = track.viewBox;
  const pos = positionOnTrack(track, lapFraction);

  return (
    <View style={fill ? styles.fill : [styles.wrap, { aspectRatio: width / height }]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <TrackLayer track={track} />
        {showCar && crashed && (
          <G transform={`translate(${pos.x} ${pos.y}) scale(${track.roadWidth / STANDARD_ROAD_WIDTH})`}>
            <Polygon points={BURST} fill={colors.flag} fillOpacity={0.9} />
            <Polygon points={BURST} fill={colors.accent} transform="scale(0.55)" />
          </G>
        )}
        {showCar && (
          <G transform={`translate(${pos.x} ${pos.y}) rotate(${pos.angleDeg + (crashed ? CRASH_SPIN : 0)}) scale(${(track.roadWidth / STANDARD_ROAD_WIDTH) * CAR_SCALE})`}>
            <CarShape car={car} />
          </G>
        )}
      </Svg>
    </View>
  );
}

/** The road and start line. Memoised so it is not redrawn every frame while the car moves. */
const TrackLayer = memo(function TrackLayer({ track }: { track: Track }) {
  const { from, to } = track.startFinish;
  return (
    <>
      <Path d={track.path} stroke={KERB_COLOR} strokeWidth={track.roadWidth + KERB_EXTRA} strokeLinejoin="round" fill="none" />
      <Path d={track.path} stroke={ROAD_COLOR} strokeWidth={track.roadWidth} strokeLinejoin="round" fill="none" />
      <Line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={colors.text} strokeWidth={8} />
      <Line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={colors.background} strokeWidth={3} strokeDasharray="6 6" />
    </>
  );
});

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  fill: { flex: 1, width: '100%', minHeight: 100 },
});
