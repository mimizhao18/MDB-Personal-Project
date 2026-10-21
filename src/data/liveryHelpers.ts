import { specFor } from './cars/index';
import type { EraId } from './eras';
import type { LiveryLayer, LiveryText } from './liveryTypes';

export type Point = readonly [number, number];

export const BLACK = '#0E0E10';
export const CARBON = '#17171A';
export const WHITE = '#F4F4F4';

/** A shape on the right half of the car and its mirror image on the left (for the top view). */
export const both = (color: string, points: readonly Point[]): LiveryLayer[] => [
  { color, points },
  { color, points: points.map(([x, z]) => [x, -z] as const) },
];

/** A rectangle seen from above, along the car from x0 to x1 and across +/- hw from the middle. */
export const stripe = (x0: number, x1: number, hw: number): Point[] => [[x0, hw], [x0, -hw], [x1, -hw], [x1, hw]];

/** A band seen from the side, along the car from x0 to x1 and in height from y0 to y1. */
export const flank = (x0: number, x1: number, y0: number, y1: number): Point[] => [[x0, y0], [x0, y1], [x1, y1], [x1, y0]];

/** The same band on both sidepods, seen from above: across the car from z0 to z1. */
export const podBand = (color: string, x0: number, x1: number, z0: number, z1: number): LiveryLayer[] =>
  both(color, [[x0, z0], [x0, z1], [x1, z1], [x1, z0]]);

/** A tapered cap over the nose: `len` long, as wide as `hw` at its back. */
export const noseCapShape = (x0: number, x1: number, hw: number): Point[] => [[x0, hw], [x0, -hw], [x1, -hw * 0.5], [x1, hw * 0.5]];

/** A cooling grille on the side of the body: a black panel with `slats` lighter bars across it. */
export function grille(x0: number, x1: number, y0: number, y1: number, slats = 4): LiveryLayer[] {
  const layers: LiveryLayer[] = [{ color: BLACK, points: flank(x0, x1, y0, y1) }];
  const step = (y1 - y0) / (slats + 1);
  for (let i = 1; i <= slats; i++) layers.push({ color: '#3A3A40', points: flank(x0 + 0.01, x1 - 0.01, y0 + step * i - 0.004, y0 + step * i + 0.004) });
  return layers;
}

/** An ellipse (a roundel, a badge) as a polygon. */
export function ellipse(cx: number, cy: number, rx: number, ry: number, steps = 20): Point[] {
  return Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as const;
  });
}

/** Lettering on the side of the car. */
export const sideText = (text: string, x: number, y: number, height: number, color: string, align: LiveryText['align'] = 'center', spacing = 0): LiveryText => ({
  view: 'side',
  text,
  x,
  y,
  height,
  color,
  align,
  spacing,
});

/** Lettering on top of the car, reading along it. */
export const topText = (text: string, x: number, z: number, height: number, color: string, align: LiveryText['align'] = 'center', spacing = 0): LiveryText => ({
  view: 'top',
  text,
  x,
  y: z,
  height,
  color,
  align,
  spacing,
});

/** Lettering across a wing (top view), reading from the rear (`rear`) or from the front (`front`); z is its middle. */
export const wingText = (text: string, x: number, z: number, height: number, color: string, from: 'rear' | 'front' = 'rear', spacing = 0): LiveryText => ({
  view: 'top',
  text,
  x,
  y: z,
  height,
  color,
  align: 'center',
  spacing,
  orient: from === 'rear' ? 'across-rear' : 'across-front',
});

/** Lettering on an end plate (the plate's own x along the car and y up). */
export const plateText = (text: string, x: number, y: number, height: number, color: string, align: LiveryText['align'] = 'center'): LiveryText => sideText(text, x, y, height, color, align);

/** A checkerboard: squares of `size`, alternating, over a rectangle (for the checkered wings and flaps). */
export function checker(color: string, x0: number, x1: number, z0: number, z1: number, size: number): LiveryLayer[] {
  const layers: LiveryLayer[] = [];
  let i = 0;
  for (let x = x0; x < x1; x += size, i++) {
    let j = 0;
    for (let z = z0; z < z1; z += size, j++) {
      if ((i + j) % 2 === 0) layers.push({ color, points: [[x, z], [x + size, z], [x + size, z + size], [x, z + size]] });
    }
  }
  return layers;
}

/** Where the parts of a generation's car are, so paint can be placed in the same relative spots on every generation. */
export function layout(era: EraId) {
  const spec = specFor(era);
  const pod = Object.values(spec.pods)[0]!;
  const last = (a: readonly number[]) => a[a.length - 1];
  const podTop = Math.max(...pod.top);
  return {
    /** the tip of the nose, and the tail of the engine cover */
    nose: spec.spine.x[0],
    tail: last(spec.spine.x),
    /** the front and the back of the sidepods, and how far out they reach */
    podFront: pod.x[0],
    podRear: last(pod.x),
    podOut: Math.max(...pod.zOut),
    podIn: Math.min(...pod.zIn),
    podBottom: Math.min(...pod.bottom),
    podTop,
    /** a height halfway up the sidepod side, good for big lettering */
    podMid: (podTop + Math.min(...pod.bottom)) / 2,
    cockpitX: spec.details.cockpit.x,
    coverHalfWidth: Math.max(...spec.spine.hw.slice(-8)),
    airbox: spec.airbox.x[spec.airbox.x.length - 3],
    airboxTop: Math.max(...spec.airbox.top),
  };
}

/**
 * A halftone fade: dots on a staggered grid over a rectangle (along the car from x0 to x1, and y0 to y1), their size
 * going from `r0` at x0 to `r1` at x1 (0 for none), so one color fades into the paint around it, as on the 2022
 * Alpine's engine cover. `clip` keeps only the dots whose middle is inside it (a path test is not needed: a polygon).
 */
export function halftone(color: string, x0: number, x1: number, y0: number, y1: number, spacing: number, r0: number, r1: number, clip?: readonly Point[]): LiveryLayer {
  const inside = (x: number, y: number) => {
    if (!clip) return true;
    let c = false;
    for (let i = 0, j = clip.length - 1; i < clip.length; j = i++) {
      const [xi, yi] = clip[i];
      const [xj, yj] = clip[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  const f = (n: number) => (Math.round(n * 10000) / 10000).toString();
  let d = '';
  const cols = Math.round(Math.abs(x1 - x0) / spacing);
  const rows = Math.round(Math.abs(y1 - y0) / spacing);
  for (let i = 0; i <= cols; i++) {
    const t = i / cols;
    const r = r0 + (r1 - r0) * t;
    if (r <= 0.0005) continue;
    const x = x0 + (x1 - x0) * t;
    for (let j = 0; j <= rows; j++) {
      const y = y0 + (y1 - y0) * (j / rows) + (i % 2 ? spacing / 2 : 0);
      if (!inside(x, y)) continue;
      d += `M${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x - r)} ${f(y)}Z`;
    }
  }
  return { color, path: d || 'M0 0Z' };
}
