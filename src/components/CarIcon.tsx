import { StyleSheet, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { getLivery } from '../data/liveries';
import type { Livery } from '../data/liveries';
import type { CarSettings } from '../models/types';

const TYRE = '#1B1B1B';
const TYRE_OUTLINE = '#7C7C7C'; // keeps the tires visible on dark backgrounds
const DARK = '#141414';
const BODY_CLIP_ID = 'f1-car-body-clip';

/** Engine cover, sidepods and nose in one outline, pointing right. */
const BODY_PATH =
  'M -22 -4.5 C -20 -8, -14 -10.8, -8 -10.2 C -2 -9.6, 2 -6, 7 -4.2 L 22 -1.7 Q 24.2 0 22 1.7 L 7 4.2 C 2 6, -2 9.6, -8 10.2 C -14 10.8, -20 8, -22 4.5 Z';

/** Darkens a #RRGGBB color (factor 0 to 1) for wing end plates and shadows. */
function shade(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => Math.round(((n >> shift) & 255) * factor);
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

/** `simple` is the small car on the track; `full` adds the detail you can see at Home and in the garage size. */
export type CarDetail = 'simple' | 'full';

interface ShapeProps {
  car: CarSettings;
  detail?: CarDetail;
  showNumber?: boolean;
}

/**
 * A top-down single-seater, about 55 units long and 40 wide, centred on (0, 0) and facing right.
 * The look comes from the car's livery: body color, accent color and a pattern laid over the body.
 */
export function CarShape({ car, detail = 'simple', showNumber = false }: ShapeProps) {
  const livery = getLivery(car.liveryId);
  const body = livery.primary;
  const accent = livery.secondary;
  const full = detail === 'full';
  const edge = shade(body, 0.6);
  const end = shade(body, 0.45);

  return (
    <G>
      <Defs>
        <ClipPath id={BODY_CLIP_ID}>
          <Path d={BODY_PATH} />
        </ClipPath>
      </Defs>

      {/* soft shadow under the floor */}
      <Path d="M -20 -13 L 12 -13 L 16 -6 L 16 6 L 12 13 L -20 13 Z" fill="#000000" fillOpacity={0.22} />

      {/* rear wing */}
      <Rect x={-27} y={-15} width={6} height={30} rx={1} fill={body} stroke={edge} strokeWidth={0.6} />
      <Rect x={-28} y={-16.5} width={8} height={2.2} rx={0.8} fill={end} />
      <Rect x={-28} y={14.3} width={8} height={2.2} rx={0.8} fill={end} />
      {full && (
        <>
          <Rect x={-24.6} y={-15} width={0.8} height={30} fill={end} />
          <Rect x={-22.2} y={-12} width={1.2} height={24} rx={0.5} fill={accent} fillOpacity={0.9} />
          <Circle cx={-22.4} cy={0} r={1} fill={DARK} />
        </>
      )}

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
      {full && (
        <>
          {/* tread grooves and a colored sidewall band */}
          {[-17, -14.5, -12, -9.5].map((x) => (
            <G key={x}>
              <Line x1={x} y1={-19} x2={x} y2={-11.5} stroke="#3A3A3A" strokeWidth={0.5} />
              <Line x1={x} y1={11.5} x2={x} y2={19} stroke="#3A3A3A" strokeWidth={0.5} />
            </G>
          ))}
          {[11.5, 13.5, 15.5, 17.5].map((x) => (
            <G key={x}>
              <Line x1={x} y1={-16} x2={x} y2={-10.5} stroke="#3A3A3A" strokeWidth={0.5} />
              <Line x1={x} y1={10.5} x2={x} y2={16} stroke="#3A3A3A" strokeWidth={0.5} />
            </G>
          ))}
          <Rect x={-18} y={-12.2} width={10} height={1} fill={accent} fillOpacity={0.85} />
          <Rect x={-18} y={11.2} width={10} height={1} fill={accent} fillOpacity={0.85} />
        </>
      )}

      {/* front wing */}
      <Rect x={21} y={-15} width={5.5} height={30} rx={1.2} fill={body} stroke={edge} strokeWidth={0.6} />
      <Rect x={24.3} y={-15} width={1.3} height={30} fill={accent} />
      {full && <Rect x={22.5} y={-15} width={0.7} height={30} fill={end} />}
      <Rect x={20.5} y={-16.2} width={7} height={2.2} rx={0.8} fill={end} />
      <Rect x={20.5} y={14} width={7} height={2.2} rx={0.8} fill={end} />

      {/* body */}
      <Path d={BODY_PATH} fill={body} />
      <G clipPath={`url(#${BODY_CLIP_ID})`}>
        <LiveryPattern livery={livery} />
        {full && (
          <>
            {/* sidepod undercut shading and a soft highlight along the top edge */}
            <Path d="M -10 -10.4 C -5 -10, 0 -8.2, 4.5 -5.4 L 4.5 -4.2 C 0 -6.8, -5 -8.6, -10 -9 Z" fill="#000000" fillOpacity={0.22} />
            <Path d="M -10 10.4 C -5 10, 0 8.2, 4.5 5.4 L 4.5 4.2 C 0 6.8, -5 8.6, -10 9 Z" fill="#000000" fillOpacity={0.22} />
            <Path d="M -18 -6.8 C -10 -9.6, 0 -7.6, 18 -2.4" fill="none" stroke="#FFFFFF" strokeOpacity={0.2} strokeWidth={1} />
          </>
        )}
      </G>
      <Path d={BODY_PATH} fill="none" stroke={accent} strokeOpacity={0.55} strokeWidth={0.7} />

      {/* sidepod inlets */}
      <Path d="M -3 -7.6 L 3 -5.6 L 3 -4.2 L -3 -5.2 Z" fill={end} />
      <Path d="M -3 7.6 L 3 5.6 L 3 4.2 L -3 5.2 Z" fill={end} />

      {/* engine cover fin (full only), airbox, mirrors, helmet and halo */}
      {full && <Line x1={-20} y1={0} x2={-10.5} y2={0} stroke={DARK} strokeOpacity={0.55} strokeWidth={0.7} />}
      <Ellipse cx={-7.5} cy={0} rx={3.2} ry={2.4} fill={DARK} />
      {full && (
        <>
          <Ellipse cx={2.4} cy={-5.6} rx={1.5} ry={0.9} fill={DARK} stroke={accent} strokeOpacity={0.6} strokeWidth={0.4} />
          <Ellipse cx={2.4} cy={5.6} rx={1.5} ry={0.9} fill={DARK} stroke={accent} strokeOpacity={0.6} strokeWidth={0.4} />
        </>
      )}
      <Circle cx={-1.5} cy={0} r={3.1} fill={accent} stroke={DARK} strokeWidth={0.8} />
      <Path d="M 1.2 -3.9 Q 4.2 0 1.2 3.9" fill="none" stroke={DARK} strokeWidth={1.1} strokeLinecap="round" />

      {/* race number, run along the rear wing like on a real car */}
      {showNumber && (
        <SvgText
          x={-24}
          y={1.9}
          fontSize={5.6}
          fontWeight="bold"
          fontFamily="Arial"
          fill={accent}
          textAnchor="middle"
          transform="rotate(90 -24 0)"
        >
          {car.number}
        </SvgText>
      )}
    </G>
  );
}

/** The accent color laid over the body in the livery's pattern. Drawn inside the body outline. */
function LiveryPattern({ livery }: { livery: Livery }) {
  const accent = livery.secondary;
  switch (livery.pattern) {
    case 'stripe':
      return <Rect x={-23} y={-1.9} width={47} height={3.8} fill={accent} fillOpacity={0.95} />;
    case 'split':
      // the whole nose section in the accent color, cut on a diagonal
      return <Polygon points="5,-12 25,-12 25,12 -1,12" fill={accent} />;
    case 'chevron':
      return (
        <>
          <Path d="M -21 -9.5 L -14.5 0 L -21 9.5" fill="none" stroke={accent} strokeWidth={2.2} strokeLinejoin="miter" />
          <Path d="M -16 -9.5 L -9.5 0 L -16 9.5" fill="none" stroke={accent} strokeWidth={2.2} strokeLinejoin="miter" />
        </>
      );
  }
}

/** The car on its own, for screens like Home and the garage. Faces right. */
export function CarImage({ car, size = 240, detail = 'full', showNumber = true }: { car: CarSettings; size?: number; detail?: CarDetail; showNumber?: boolean }) {
  return (
    <View style={[styles.wrap, { width: size, height: size * 0.5 }]}>
      <Svg width="100%" height="100%" viewBox="-34 -22 68 44">
        <CarShape car={car} detail={detail} showNumber={showNumber} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center' },
});
