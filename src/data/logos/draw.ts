// Small helpers for writing logos as path strings: numbers rounded, shapes built from points, circles, and mirrored
// halves for symmetric marks. Logo units are arbitrary (most logos use a box about 100 high), y down like SVG.

import { layoutText } from '../../components/car3d/outlineFont';
import { strokeTextWidth } from '../../components/car3d/strokeFont';
import type { Logo, LogoShape, LogoText } from './types';

export type P = readonly [number, number];

const f = (n: number) => (Math.round(n * 100) / 100).toString();

/** A closed polygon. */
export const poly = (pts: readonly P[]) => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`;

/** A circle (two arcs), clockwise unless `ccw` (a ring is a circle and a smaller ccw one in the same path). */
export const circle = (cx: number, cy: number, r: number, ccw = false) => {
  const s = ccw ? 0 : 1;
  return `M${f(cx - r)} ${f(cy)}A${f(r)} ${f(r)} 0 1 ${s} ${f(cx + r)} ${f(cy)}A${f(r)} ${f(r)} 0 1 ${s} ${f(cx - r)} ${f(cy)}Z`;
};

/** An ellipse. */
export const ellipse = (cx: number, cy: number, rx: number, ry: number, ccw = false) => {
  const s = ccw ? 0 : 1;
  return `M${f(cx - rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 1 ${s} ${f(cx + rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 1 ${s} ${f(cx - rx)} ${f(cy)}Z`;
};

/** A rectangle with rounded corners (radius r). */
export const rrect = (x: number, y: number, w: number, h: number, r = 0) => {
  if (r <= 0) return poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
  r = Math.min(r, w / 2, h / 2);
  return `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + r)} ${f(y)}Z`;
};

/** Points of a polygon given for its right half (x >= axis), completed by its mirror image on the left. */
export const mirrored = (half: readonly P[], axis: number): P[] => [...half, ...[...half].reverse().map(([x, y]) => [2 * axis - x, y] as const)];

/** Points on a circle arc from angle a0 to a1 (degrees, 0 to the right, counter-clockwise as seen with y down). */
export const arcPoints = (cx: number, cy: number, r: number, a0: number, a1: number, n: number): P[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)] as const;
  });

/** A thick line between two points as a polygon (square ends). */
export const bar = ([x0, y0]: P, [x1, y1]: P, w: number) => {
  const len = Math.hypot(x1 - x0, y1 - y0) || 1;
  const nx = (-(y1 - y0) / len) * (w / 2);
  const ny = ((x1 - x0) / len) * (w / 2);
  return poly([[x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]]);
};

/** Lettering for a logo, in the Inter typeface by default. */
export const text = (t: string, x: number, y: number, size: number, fill: string, more: Partial<LogoText> = {}): LogoText => ({ text: t, x, y, size, fill, ...more });

/**
 * A logo that is only lettering (most of the small sponsors): one line in the Inter weight closest to the real
 * typeface. The box is the run's natural width by 100 (the cap height), so a decal sized by `height` gets the right
 * proportions; `extra` shapes (a mark beside the name) are drawn after it in the same units.
 */
export function wordmark(id: string, name: string, t: string, color: string, more: Partial<LogoText> & { extra?: readonly LogoShape[]; pad?: [number, number]; slots?: Record<string, string> } = {}): Logo {
  const { extra, pad = [0, 0], slots, ...rest } = more;
  const width = measure(t, rest) + pad[0] + pad[1];
  return {
    id,
    name,
    size: [width, 100],
    slots: { main: color, ...slots },
    shapes: [{ text: t, x: pad[0], y: 100, size: 100, fill: 'main', weight: 800, ...rest } as LogoText, ...(extra ?? [])],
  };
}

/** The width of a line of logo lettering at cap height 100, as drawn (Inter, or the bold stroke font). */
export function measure(t: string, o: Partial<LogoText> = {}): number {
  const size = o.size ?? 100;
  if (o.font === 'bold') return (strokeTextWidth(t, ((o.tracking ?? 0) / size) * 100) / 100) * size * (o.condense ?? 1);
  return layoutText(t, { weight: o.weight ?? 800, tracking: (o.tracking ?? 0) / size, condense: o.condense ?? 1 }).width * size;
}
