import { StyleSheet, View } from 'react-native';
import Svg, { ClipPath, Defs, Ellipse, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { specFor } from '../data/cars';
import { frontWingSection, rearWingSection } from '../data/cars/spec';
import type { CarSpec, PodStyle } from '../data/cars/spec';
import { spline } from '../data/cars/spline';
import { getLivery } from '../data/liveries';
import type { CarSettings } from '../models/types';

const TYRE = '#1B1B1B';
const TYRE_OUTLINE = '#7C7C7C'; // keeps the tires visible on dark backgrounds
const DARK = '#141414';
const BODY_CLIP_ID = 'f1-car-body-clip';

// The icon is the car seen from above, drawn from the same measurements as the 3D model: 10 icon units to the metre,
// facing right, with the middle of the car's length at the origin.
const SCALE = 10;
const fmt = (n: number) => n.toFixed(2);
const iy = (z: number) => z * SCALE;

/** `steps` points along a smoothed station table, as [x, z]. */
function along(xs: readonly number[], zs: readonly number[], steps = 28): [number, number][] {
  return Array.from({ length: steps + 1 }, (_, i) => [spline(xs, i / steps), spline(zs, i / steps)] as [number, number]);
}

const xRange = (outline: readonly (readonly [number, number])[]) => [Math.min(...outline.map(([x]) => x)), Math.max(...outline.map(([x]) => x))] as const;

/** The paths for one car design (a generation and a sidepod style), worked out once. */
interface IconShapes {
  ix: (x: number) => number;
  spine: string;
  floor: string;
  pods: readonly [string, string];
  frontWing: string[];
  rearWing: string[];
  frontPlate: readonly [number, number];
  rearPlate: readonly [number, number];
}

const cache = new Map<string, IconShapes>();

function shapesFor(spec: CarSpec, style: PodStyle): IconShapes {
  const key = `${spec.id}:${style}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const ix = (x: number) => (x - spec.centreX) * SCALE;
  const toPath = (points: readonly (readonly [number, number])[]) => `M ${points.map(([x, z]) => `${fmt(ix(x))} ${fmt(iy(z))}`).join(' L ')} Z`;
  /** A shape that is the same on both sides of the car: the right edge out and the left edge back. */
  const symmetric = (xs: readonly number[], hw: readonly number[]) => {
    const right = along(xs, hw);
    return toPath([...right, ...right.map(([x, z]) => [x, -z] as [number, number]).reverse()]);
  };
  /** One sidepod, on the right (side 1) or left (-1): between its inner and outer edge. */
  const sidepod = (side: 1 | -1) => {
    const pod = spec.pods[style] ?? Object.values(spec.pods)[0]!;
    const outer = along(pod.x, pod.zOut).map(([x, z]) => [x, z * side] as [number, number]);
    const inner = along(pod.x, pod.zIn).map(([x, z]) => [x, z * side] as [number, number]);
    return toPath([...outer, ...inner.reverse()]);
  };
  /** A wing element seen from above: its leading edge and trailing edge, from one tip to the other. */
  const wingPath = (section: (z: number) => { x: number; chord: number }, span: number, steps = 24) => {
    const zs = Array.from({ length: steps + 1 }, (_, i) => -span + (2 * span * i) / steps);
    const leading = zs.map((z) => [section(z).x, z] as [number, number]);
    const trailing = zs.map((z) => [section(z).x - section(z).chord, z] as [number, number]).reverse();
    return toPath([...leading, ...trailing]);
  };

  const shapes: IconShapes = {
    ix,
    spine: symmetric(spec.spine.x, spec.spine.hw),
    floor: symmetric(spec.floor.x, spec.floor.hw),
    pods: [sidepod(1), sidepod(-1)],
    frontWing: spec.frontWing.elements.map((e) => wingPath((z) => frontWingSection(spec, e, z), spec.frontWing.span)),
    rearWing: spec.rearWing.elements.map((e) => wingPath((z) => rearWingSection(spec, e, z), spec.rearWing.span)),
    frontPlate: xRange(spec.frontWing.endplate),
    rearPlate: xRange(spec.rearWing.endplate),
  };
  cache.set(key, shapes);
  return shapes;
}

/** Darkens a #RRGGBB color (factor 0 to 1) for edges. */
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
 * The car from above (the generation its livery belongs to), about 55 units long and 20 wide, centred on (0, 0) and
 * facing right. Its colors and shapes come from the livery, laid over the bodywork the same way they are on the 3D car.
 */
export function CarShape({ car, detail = 'simple', showNumber = false }: ShapeProps) {
  const livery = getLivery(car.liveryId);
  const spec = specFor(livery.era);
  const { ix, spine, floor, pods, frontWing, rearWing, frontPlate, rearPlate } = shapesFor(spec, livery.sidepod);
  const podShape = spec.pods[livery.sidepod] ?? Object.values(spec.pods)[0]!;
  const full = detail === 'full';
  const { front, rear } = spec.wheels;
  const edge = shade(livery.primary, 0.55);
  const lastRear = spec.rearWing.elements[spec.rearWing.elements.length - 1];
  const tailX = ix(lastRear.x - lastRear.chord / 2); // the race number goes on the rear wing

  const tire = (axle: { x: number; radius: number; width: number; z: number }, side: 1 | -1) => {
    const inner = (axle.z - axle.width / 2) * SCALE;
    return (
      <Rect
        key={`${axle.x}${side}`}
        x={ix(axle.x - axle.radius)}
        y={side > 0 ? inner : -(inner + axle.width * SCALE)}
        width={axle.radius * 2 * SCALE}
        height={axle.width * SCALE}
        rx={1.6}
        fill={TYRE}
        stroke={TYRE_OUTLINE}
        strokeWidth={0.7}
      />
    );
  };
  const plate = (key: string, x: readonly [number, number], z: number, color: string) => (
    <Rect key={key} x={ix(x[0])} y={iy(z) - 0.45} width={(x[1] - x[0]) * SCALE} height={0.9} rx={0.3} fill={color} stroke={edge} strokeWidth={0.3} />
  );

  return (
    <G>
      <Defs>
        <ClipPath id={BODY_CLIP_ID}>
          <Path d={spine} />
          <Path d={pods[0]} />
          <Path d={pods[1]} />
        </ClipPath>
      </Defs>

      {/* suspension arms */}
      {[front, rear].map((axle) =>
        [1, -1].map((side) => (
          <Line key={`${axle.x}${side}`} x1={ix(axle.x)} y1={iy(0.12) * side} x2={ix(axle.x)} y2={iy(axle.z - axle.width / 2) * side} stroke={DARK} strokeWidth={0.9} />
        )),
      )}

      {/* tires */}
      {[1, -1].flatMap((side) => [tire(front, side as 1 | -1), tire(rear, side as 1 | -1)])}

      {/* floor, a little wider than the bodywork */}
      <Path d={floor} fill="#0B0B0B" fillOpacity={0.9} />

      {/* rear wing: main plane and flap, with end plates */}
      {rearWing.map((d, i) => (
        <Path key={`r${i}`} d={d} fill={spec.rearWing.elements[i].flap ? livery.parts.flap : livery.parts.wing} stroke={edge} strokeWidth={0.3} />
      ))}
      {[1, -1].map((side) => plate(`rp${side}`, rearPlate, spec.rearWing.span * side, livery.parts.endplate))}

      {/* front wing: main plane and flaps, with end plates */}
      {frontWing.map((d, i) => (
        <Path key={`f${i}`} d={d} fill={spec.frontWing.elements[i].flap ? livery.parts.flap : livery.parts.wing} stroke={edge} strokeWidth={0.3} />
      ))}
      {[1, -1].map((side) => plate(`fp${side}`, frontPlate, spec.frontWing.span * side, livery.parts.endplate))}

      {/* bodywork in the base color, then the livery shapes laid over it */}
      <Path d={spine} fill={livery.primary} />
      <Path d={pods[0]} fill={livery.primary} />
      <Path d={pods[1]} fill={livery.primary} />
      <G clipPath={`url(#${BODY_CLIP_ID})`}>
        {livery.top.map((layer, i) => (
          <Polygon key={i} points={layer.points.map(([x, z]) => `${fmt(ix(x))},${fmt(iy(z))}`).join(' ')} fill={layer.color} />
        ))}
      </G>
      <Path d={spine} fill="none" stroke={edge} strokeWidth={0.4} />
      <Path d={pods[0]} fill="none" stroke={edge} strokeWidth={0.4} />
      <Path d={pods[1]} fill="none" stroke={edge} strokeWidth={0.4} />

      {/* sidepod inlets, cockpit, airbox intake, halo */}
      {[1, -1].map((side) => (
        <Rect key={`inlet${side}`} x={ix(podShape.x[0] - 0.03)} y={side > 0 ? iy(podShape.zIn[0]) : -iy(podShape.zOut[0])} width={0.9} height={iy(podShape.zOut[0] - podShape.zIn[0])} fill={DARK} />
      ))}
      <Ellipse cx={ix(0.5)} cy={0} rx={4.2} ry={1.8} fill={DARK} />
      <Ellipse cx={ix(0.0)} cy={0} rx={0.5} ry={0.9} fill={DARK} />
      <Path
        d={`M ${fmt(ix(0.98))} 0 L ${fmt(ix(0.84))} 0 C ${fmt(ix(0.5))} -1.5, ${fmt(ix(0.15))} -2.3, ${fmt(ix(-0.2))} -1.9 M ${fmt(ix(0.84))} 0 C ${fmt(ix(0.5))} 1.5, ${fmt(ix(0.15))} 2.3, ${fmt(ix(-0.2))} 1.9`}
        fill="none"
        stroke="#9A9DA3"
        strokeWidth={0.7}
        strokeLinecap="round"
      />

      {full && <Line x1={ix(spec.spine.x[spec.spine.x.length - 1])} y1={0} x2={ix(spec.spine.x[0] - 0.6)} y2={0} stroke="#FFFFFF" strokeOpacity={0.12} strokeWidth={0.4} />}

      {/* race number on the rear wing */}
      {showNumber && (
        <SvgText x={tailX} y={1.5} fontSize={4.2} fontWeight="bold" fontFamily="Arial" fill={livery.secondary} textAnchor="middle" transform={`rotate(90 ${fmt(tailX)} 0)`}>
          {car.number}
        </SvgText>
      )}
    </G>
  );
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
