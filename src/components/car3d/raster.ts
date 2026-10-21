// The rasterizer for curved shapes, outlines and gradients: fills compound polygons (rings in pixel coordinates) into an
// RGBA picture with soft edges. It runs on the CPU in plain JavaScript (no browser canvas), so the paint works on a
// phone through expo-gl too.
//
// Fill rule: NON-ZERO winding, as in SVG's default. A hole is a ring drawn the other way round (as fonts do); a ring
// drawn the same way round as its outer ring adds to it. `evenodd` can be asked for per shape instead.

import type { Pt, Ring } from './path';

export type Rgb = readonly [number, number, number];

export interface Picture {
  data: Uint8Array;
  width: number;
  height: number;
}

/** What a shape is filled with: one color, or a color that varies across the picture (a gradient). */
export type Paint = { kind: 'solid'; rgb: Rgb; alpha: number } | { kind: 'linear'; lut: Uint8Array; alpha: number; tx: number; ty: number; t0: number };

export function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.slice(1, 7), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const solid = (hex: string, alpha = 1): Paint => ({ kind: 'solid', rgb: hexToRgb(hex), alpha });

/**
 * A linear gradient between two points in pixel coordinates with color stops (offset 0..1, hex). Colors are mixed in
 * sRGB like SVG and CSS do, and held in a 256-step table.
 */
export function linearPaint(from: Pt, to: Pt, stops: readonly (readonly [number, string])[], alpha = 1): Paint {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len2 = dx * dx + dy * dy || 1e-9;
  const lut = new Uint8Array(256 * 3);
  const sorted = [...stops].sort((a, b) => a[0] - b[0]).map(([o, c]) => [o, hexToRgb(c)] as const);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let k = 0;
    while (k < sorted.length - 1 && sorted[k + 1][0] < t) k++;
    const [o0, c0] = sorted[k];
    const [o1, c1] = sorted[Math.min(k + 1, sorted.length - 1)];
    const f = o1 > o0 ? Math.min(1, Math.max(0, (t - o0) / (o1 - o0))) : t >= o1 ? 1 : 0;
    for (let ch = 0; ch < 3; ch++) lut[i * 3 + ch] = Math.round(c0[ch] + (c1[ch] - c0[ch]) * f);
  }
  // t at a pixel = (p - from) . d / |d|^2 = tx * px + ty * py + t0
  return { kind: 'linear', lut, alpha, tx: dx / len2, ty: dy / len2, t0: -(from[0] * dx + from[1] * dy) / len2 };
}

const SUBSAMPLES = 4;

/** Edges of the rings, stored flat: x0, y0, x1, y1 (y0 < y1), direction. Horizontal edges are dropped. */
function buildEdges(rings: readonly (readonly Pt[])[]): Float64Array {
  let count = 0;
  for (const r of rings) count += r.length;
  const e = new Float64Array(count * 5);
  let n = 0;
  for (const r of rings) {
    for (let i = 0; i < r.length; i++) {
      const [ax, ay] = r[i];
      const [bx, by] = r[(i + 1) % r.length];
      if (ay === by || !Number.isFinite(ax + ay + bx + by)) continue;
      if (ay < by) {
        e[n] = ax;
        e[n + 1] = ay;
        e[n + 2] = bx;
        e[n + 3] = by;
        e[n + 4] = 1;
      } else {
        e[n] = bx;
        e[n + 1] = by;
        e[n + 2] = ax;
        e[n + 3] = ay;
        e[n + 4] = -1;
      }
      n += 5;
    }
  }
  return e.subarray(0, n);
}

/**
 * Fills a compound shape (all rings together, so holes and overlaps follow the fill rule) with soft edges: four
 * sample lines per pixel row, with the exact covered width along each.
 */
export function fillRings(pic: Picture, rings: readonly (readonly Pt[])[], paint: Paint, rule: 'nonzero' | 'evenodd' = 'nonzero'): void {
  const { data, width, height } = pic;
  const edges = buildEdges(rings);
  const ne = edges.length / 5;
  if (ne === 0) return;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < ne; i++) {
    const o = i * 5;
    minX = Math.min(minX, edges[o], edges[o + 2]);
    maxX = Math.max(maxX, edges[o], edges[o + 2]);
    minY = Math.min(minY, edges[o + 1]);
    maxY = Math.max(maxY, edges[o + 3]);
  }
  const rowFirst = Math.max(0, Math.floor(minY));
  const rowLast = Math.min(height - 1, Math.ceil(maxY));
  const colFirst = Math.max(0, Math.floor(minX));
  const colLast = Math.min(width - 1, Math.ceil(maxX));
  if (rowLast < rowFirst || colLast < colFirst) return;

  // edges sorted by their top, so each row only looks at the edges that reach it
  const order = Array.from({ length: ne }, (_, i) => i).sort((a, b) => edges[a * 5 + 1] - edges[b * 5 + 1]);
  let next = 0;
  let active: number[] = [];
  const coverage = new Float32Array(colLast - colFirst + 2);
  const xs: number[] = [];
  const ds: number[] = [];
  const idx: number[] = [];
  const evenOdd = rule === 'evenodd';

  for (let py = rowFirst; py <= rowLast; py++) {
    while (next < ne && edges[order[next] * 5 + 1] < py + 1) active.push(order[next++]);
    active = active.filter((i) => edges[i * 5 + 3] > py);
    if (active.length === 0) continue;
    coverage.fill(0);
    let touched = false;
    for (let k = 0; k < SUBSAMPLES; k++) {
      const sy = py + (k + 0.5) / SUBSAMPLES;
      xs.length = 0;
      ds.length = 0;
      for (const i of active) {
        const o = i * 5;
        const y0 = edges[o + 1];
        const y1 = edges[o + 3];
        if (sy < y0 || sy >= y1) continue;
        xs.push(edges[o] + ((sy - y0) / (y1 - y0)) * (edges[o + 2] - edges[o]));
        ds.push(edges[o + 4]);
      }
      if (xs.length < 2) continue;
      idx.length = 0;
      for (let j = 0; j < xs.length; j++) idx.push(j);
      idx.sort((a, b) => xs[a] - xs[b]);
      let wind = 0;
      for (let j = 0; j < idx.length - 1; j++) {
        wind += evenOdd ? 1 : ds[idx[j]];
        const inside = evenOdd ? wind % 2 !== 0 : wind !== 0;
        if (!inside) continue;
        const xa = Math.max(colFirst, xs[idx[j]]);
        const xb = Math.min(colLast + 1, xs[idx[j + 1]]);
        if (xb <= xa) continue;
        touched = true;
        const pa = Math.floor(xa);
        const pb = Math.ceil(xb);
        for (let px = pa; px < pb; px++) coverage[px - colFirst] += (Math.min(px + 1, xb) - Math.max(px, xa)) / SUBSAMPLES;
      }
    }
    if (!touched) continue;
    blendRow(data, width, py, colFirst, colLast, coverage, paint);
  }
}

function blendRow(data: Uint8Array, width: number, py: number, colFirst: number, colLast: number, coverage: Float32Array, paint: Paint): void {
  if (paint.kind === 'solid') {
    const [r, g, b] = paint.rgb;
    for (let px = colFirst; px <= colLast; px++) {
      const a = Math.min(1, coverage[px - colFirst]) * paint.alpha;
      if (a <= 0) continue;
      const o = (py * width + px) * 4;
      data[o] += (r - data[o]) * a;
      data[o + 1] += (g - data[o + 1]) * a;
      data[o + 2] += (b - data[o + 2]) * a;
    }
    return;
  }
  const { lut, tx, ty, t0 } = paint;
  const cy = py + 0.5;
  for (let px = colFirst; px <= colLast; px++) {
    const a = Math.min(1, coverage[px - colFirst]) * paint.alpha;
    if (a <= 0) continue;
    const t = tx * (px + 0.5) + ty * cy + t0;
    const li = Math.round(Math.min(1, Math.max(0, t)) * 255) * 3;
    const o = (py * width + px) * 4;
    data[o] += (lut[li] - data[o]) * a;
    data[o + 1] += (lut[li + 1] - data[o + 1]) * a;
    data[o + 2] += (lut[li + 2] - data[o + 2]) * a;
  }
}

/** Twice the signed area of a ring (positive for counter-clockwise with y up, clockwise with y down). */
export function signedArea(r: readonly Pt[]): number {
  let a = 0;
  for (let i = 0; i < r.length; i++) {
    const [x0, y0] = r[i];
    const [x1, y1] = r[(i + 1) % r.length];
    a += x0 * y1 - x1 * y0;
  }
  return a;
}

const oriented = (r: Pt[]): Pt[] => (signedArea(r) < 0 ? r.reverse() : r);

function disc(cx: number, cy: number, radius: number): Pt[] {
  const n = Math.max(8, Math.min(48, Math.ceil(radius * 2.2)));
  return Array.from({ length: n }, (_, k): Pt => [cx + radius * Math.cos((k / n) * Math.PI * 2), cy + radius * Math.sin((k / n) * Math.PI * 2)]);
}

/**
 * The outline of rings as filled pieces: a band `width` wide along every edge, with round joins and ends. The pieces
 * all turn the same way, so filling them together (non-zero) gives their union with no double-blended overlaps.
 */
export function strokeRings(rings: readonly Ring[], width: number): Pt[][] {
  const r = width / 2;
  const pieces: Pt[][] = [];
  for (const ring of rings) {
    const closed = ring.closed !== false;
    const n = ring.length;
    const segCount = closed ? n : n - 1;
    for (let i = 0; i < segCount; i++) {
      const [x0, y0] = ring[i];
      const [x1, y1] = ring[(i + 1) % n];
      const dx = x1 - x0;
      const dy = y1 - y0;
      const len = Math.hypot(dx, dy);
      if (len < 1e-9) continue;
      const nx = (-dy / len) * r;
      const ny = (dx / len) * r;
      pieces.push(oriented([[x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]]));
    }
    // round joins: only where the outline turns enough for a gap to show
    for (let i = 0; i < n; i++) {
      if (!closed && (i === 0 || i === n - 1)) {
        pieces.push(oriented(disc(ring[i][0], ring[i][1], r)));
        continue;
      }
      const p = ring[(i - 1 + n) % n];
      const c = ring[i];
      const q = ring[(i + 1) % n];
      const ax = c[0] - p[0];
      const ay = c[1] - p[1];
      const bx = q[0] - c[0];
      const by = q[1] - c[1];
      const la = Math.hypot(ax, ay);
      const lb = Math.hypot(bx, by);
      if (la < 1e-9 || lb < 1e-9) continue;
      const cos = (ax * bx + ay * by) / (la * lb);
      if (cos > 0.995 && r < 6) continue;
      pieces.push(oriented(disc(c[0], c[1], r)));
    }
  }
  return pieces;
}
