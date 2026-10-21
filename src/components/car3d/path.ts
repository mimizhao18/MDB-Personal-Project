// Curved shapes for the livery painter: SVG-style path strings parsed into lines and Bezier curves, moved by an affine
// transform, and flattened into polygons (rings of points) for the rasterizer. Pure math, no DOM: it has to run on a
// phone through expo-gl, where there is no browser canvas.

export type Pt = readonly [number, number];

/** A flattened subpath; `closed` when it ended with Z (it matters for outlines, not for fills, which always close). */
export type Ring = Pt[] & { closed?: boolean };

/** One drawing command in absolute coordinates: arcs are turned into cubic curves and H/V/S/T into L/C/Q on parsing. */
export type Seg =
  | { k: 'M'; p: Pt }
  | { k: 'L'; p: Pt }
  | { k: 'Q'; c: Pt; p: Pt }
  | { k: 'C'; c1: Pt; c2: Pt; p: Pt }
  | { k: 'Z' };

/** An affine transform [a, b, c, d, e, f]: (x, y) -> (a x + c y + e, b x + d y + f), as in SVG and canvas. */
export type Affine = readonly [number, number, number, number, number, number];

export const IDENTITY: Affine = [1, 0, 0, 1, 0, 0];

export const apply = (m: Affine, [x, y]: Pt): Pt => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

/** `outer` after `inner`: a point goes through `inner` first. */
export function compose(outer: Affine, inner: Affine): Affine {
  const [a, b, c, d, e, f] = outer;
  const [A, B, C, D, E, F] = inner;
  return [a * A + c * B, b * A + d * B, a * C + c * D, b * C + d * D, a * E + c * F + e, b * E + d * F + f];
}

export function invert(m: Affine): Affine {
  const [a, b, c, d, e, f] = m;
  const det = a * d - b * c || 1e-12;
  return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det];
}

export const translate = (x: number, y: number): Affine => [1, 0, 0, 1, x, y];
export const scale = (sx: number, sy = sx): Affine => [sx, 0, 0, sy, 0, 0];
export const rotate = (radians: number): Affine => [Math.cos(radians), Math.sin(radians), -Math.sin(radians), Math.cos(radians), 0, 0];
/** Slants x by y (a positive angle leans the tops of letters to +x when y is up). */
export const skewX = (radians: number): Affine => [1, 0, Math.tan(radians), 1, 0, 0];

const NUMBER = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y;

/** Splits a path string into commands and their numbers. Arc flags may be written without separators ("a1 1 0 01 1 1"). */
function tokenize(d: string): { cmd: string; args: number[] }[] {
  const out: { cmd: string; args: number[] }[] = [];
  let i = 0;
  let current: { cmd: string; args: number[] } | null = null;
  while (i < d.length) {
    const ch = d[i];
    if (/[MmLlHhVvCcSsQqTtAaZz]/.test(ch)) {
      current = { cmd: ch, args: [] };
      out.push(current);
      i++;
      continue;
    }
    if (/[\s,]/.test(ch)) {
      i++;
      continue;
    }
    if (!current) throw new Error(`path must start with a command: "${d.slice(0, 20)}"`);
    // arc flags are single digits
    const upper = current.cmd.toUpperCase();
    const slot = current.args.length % 7;
    if (upper === 'A' && (slot === 3 || slot === 4) && (ch === '0' || ch === '1')) {
      current.args.push(ch === '1' ? 1 : 0);
      i++;
      continue;
    }
    NUMBER.lastIndex = i;
    const m = NUMBER.exec(d);
    if (!m) throw new Error(`bad number in path at ${i}: "${d.slice(i, i + 12)}"`);
    current.args.push(parseFloat(m[0]));
    i = NUMBER.lastIndex;
  }
  return out;
}

/** The cubic curves of an SVG elliptical arc (endpoint form, as in the SVG spec's implementation notes). */
function arcToCubics(x1: number, y1: number, rx: number, ry: number, phiDeg: number, large: number, sweep: number, x2: number, y2: number): Seg[] {
  if (rx === 0 || ry === 0 || (x1 === x2 && y1 === y2)) return [{ k: 'L', p: [x2, y2] }];
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  const phi = (phiDeg * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy;
  const y1p = -sin * dx + cos * dy;
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  let coef = Math.sqrt(Math.max(0, num / den));
  if (large === sweep) coef = -coef;
  const cxp = (coef * rx * y1p) / ry;
  const cyp = (-coef * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const angle = (ux: number, uy: number, vx: number, vy: number) => {
    const a = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
    return a;
  };
  const theta1 = angle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let delta = angle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!sweep && delta > 0) delta -= 2 * Math.PI;
  if (sweep && delta < 0) delta += 2 * Math.PI;
  const parts = Math.ceil(Math.abs(delta) / (Math.PI / 2) - 1e-9);
  const step = delta / parts;
  const k = (4 / 3) * Math.tan(step / 4);
  const point = (t: number): Pt => [cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin, cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos];
  const deriv = (t: number): Pt => [-rx * Math.sin(t) * cos - ry * Math.cos(t) * sin, -rx * Math.sin(t) * sin + ry * Math.cos(t) * cos];
  const segs: Seg[] = [];
  for (let i = 0; i < parts; i++) {
    const t0 = theta1 + i * step;
    const t1 = t0 + step;
    const p0 = point(t0);
    const p1 = i === parts - 1 ? ([x2, y2] as Pt) : point(t1);
    const d0 = deriv(t0);
    const d1 = deriv(t1);
    segs.push({ k: 'C', c1: [p0[0] + k * d0[0], p0[1] + k * d0[1]], c2: [p1[0] - k * d1[0], p1[1] - k * d1[1]], p: p1 });
  }
  return segs;
}

const parsed = new Map<string, readonly Seg[]>();

/**
 * Parses an SVG path string (M L H V C S Q T A Z, absolute and relative) into absolute segments. Results are cached by
 * string, since logos are drawn many times.
 */
export function parsePath(d: string): readonly Seg[] {
  const hit = parsed.get(d);
  if (hit) return hit;
  const segs: Seg[] = [];
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;
  let lastC: Pt | null = null; // the last cubic control point, for S
  let lastQ: Pt | null = null; // the last quadratic control point, for T
  for (const { cmd, args } of tokenize(d)) {
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    const ox = () => (rel ? x : 0);
    const oy = () => (rel ? y : 0);
    const need = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 }[C as 'M'] ?? 0;
    if (C === 'Z') {
      segs.push({ k: 'Z' });
      x = sx;
      y = sy;
      lastC = lastQ = null;
      continue;
    }
    if (need === 0 || args.length % need !== 0 || args.length === 0) throw new Error(`path command ${cmd} has ${args.length} numbers`);
    for (let i = 0; i < args.length; i += need) {
      const a = args.slice(i, i + need);
      let nextC: Pt | null = null;
      let nextQ: Pt | null = null;
      if (C === 'M') {
        x = a[0] + ox();
        y = a[1] + oy();
        if (i === 0) {
          segs.push({ k: 'M', p: [x, y] });
          sx = x;
          sy = y;
        } else segs.push({ k: 'L', p: [x, y] }); // extra pairs after M are lines
      } else if (C === 'L') {
        x = a[0] + ox();
        y = a[1] + oy();
        segs.push({ k: 'L', p: [x, y] });
      } else if (C === 'H') {
        x = a[0] + ox();
        segs.push({ k: 'L', p: [x, y] });
      } else if (C === 'V') {
        y = a[0] + oy();
        segs.push({ k: 'L', p: [x, y] });
      } else if (C === 'C') {
        const c1: Pt = [a[0] + ox(), a[1] + oy()];
        const c2: Pt = [a[2] + ox(), a[3] + oy()];
        const p: Pt = [a[4] + ox(), a[5] + oy()];
        segs.push({ k: 'C', c1, c2, p });
        nextC = c2;
        [x, y] = p;
      } else if (C === 'S') {
        const c1: Pt = lastC ? [2 * x - lastC[0], 2 * y - lastC[1]] : [x, y];
        const c2: Pt = [a[0] + ox(), a[1] + oy()];
        const p: Pt = [a[2] + ox(), a[3] + oy()];
        segs.push({ k: 'C', c1, c2, p });
        nextC = c2;
        [x, y] = p;
      } else if (C === 'Q') {
        const c: Pt = [a[0] + ox(), a[1] + oy()];
        const p: Pt = [a[2] + ox(), a[3] + oy()];
        segs.push({ k: 'Q', c, p });
        nextQ = c;
        [x, y] = p;
      } else if (C === 'T') {
        const c: Pt = lastQ ? [2 * x - lastQ[0], 2 * y - lastQ[1]] : [x, y];
        const p: Pt = [a[0] + ox(), a[1] + oy()];
        segs.push({ k: 'Q', c, p });
        nextQ = c;
        [x, y] = p;
      } else if (C === 'A') {
        const ex = a[5] + ox();
        const ey = a[6] + oy();
        segs.push(...arcToCubics(x, y, a[0], a[1], a[2], a[3], a[4], ex, ey));
        x = ex;
        y = ey;
      }
      lastC = nextC;
      lastQ = nextQ;
    }
  }
  parsed.set(d, segs);
  return segs;
}

/** The segments moved by an affine transform (Bezier curves stay Bezier curves under it). */
export function transformSegs(segs: readonly Seg[], m: Affine): Seg[] {
  return segs.map((s) => {
    switch (s.k) {
      case 'M':
      case 'L':
        return { k: s.k, p: apply(m, s.p) };
      case 'Q':
        return { k: 'Q', c: apply(m, s.c), p: apply(m, s.p) };
      case 'C':
        return { k: 'C', c1: apply(m, s.c1), c2: apply(m, s.c2), p: apply(m, s.p) };
      default:
        return s;
    }
  });
}

/**
 * Turns segments into closed rings of points, no point further than `tolerance` from the true curve (in the units of
 * the segments: pixels, once transformed to the picture). Every subpath becomes a ring, closed or not.
 */
export function flatten(segs: readonly Seg[], tolerance = 0.15): Ring[] {
  const rings: Ring[] = [];
  let ring: Ring = [];
  let x = 0;
  let y = 0;
  const end = (closed = false) => {
    if (ring.length >= 2) {
      ring.closed = closed;
      rings.push(ring);
    }
    ring = [];
  };
  for (const s of segs) {
    if (s.k === 'M') {
      end();
      [x, y] = s.p;
      ring.push(s.p);
    } else if (s.k === 'L') {
      ring.push(s.p);
      [x, y] = s.p;
    } else if (s.k === 'Q') {
      const ddx = x - 2 * s.c[0] + s.p[0];
      const ddy = y - 2 * s.c[1] + s.p[1];
      const n = Math.max(1, Math.min(200, Math.ceil(Math.sqrt((0.25 * Math.hypot(ddx, ddy)) / tolerance))));
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        const u = 1 - t;
        ring.push([u * u * x + 2 * u * t * s.c[0] + t * t * s.p[0], u * u * y + 2 * u * t * s.c[1] + t * t * s.p[1]]);
      }
      [x, y] = s.p;
    } else if (s.k === 'C') {
      const d1 = Math.hypot(x - 2 * s.c1[0] + s.c2[0], y - 2 * s.c1[1] + s.c2[1]);
      const d2 = Math.hypot(s.c1[0] - 2 * s.c2[0] + s.p[0], s.c1[1] - 2 * s.c2[1] + s.p[1]);
      const n = Math.max(1, Math.min(300, Math.ceil(Math.sqrt((0.75 * Math.max(d1, d2)) / tolerance))));
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        const u = 1 - t;
        const a = u * u * u;
        const b = 3 * u * u * t;
        const c = 3 * u * t * t;
        const e = t * t * t;
        ring.push([a * x + b * s.c1[0] + c * s.c2[0] + e * s.p[0], a * y + b * s.c1[1] + c * s.c2[1] + e * s.p[1]]);
      }
      [x, y] = s.p;
    } else if (s.k === 'Z') {
      if (ring.length > 0) {
        const first = ring[0];
        end(true);
        [x, y] = first;
        ring = [first]; // a drawing command after Z (without M) starts again from the subpath's start
      }
    }
  }
  end();
  // a lone start point left over after Z is not a ring
  return rings.filter((r) => r.length >= 3 || (r.length === 2 && (r[0][0] !== r[1][0] || r[0][1] !== r[1][1])));
}

/** The bounding box of segments' end and control points [minX, minY, maxX, maxY] (contains the curves). */
export function segBounds(segs: readonly Seg[]): [number, number, number, number] {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  const add = ([x, y]: Pt) => {
    x0 = Math.min(x0, x);
    y0 = Math.min(y0, y);
    x1 = Math.max(x1, x);
    y1 = Math.max(y1, y);
  };
  for (const s of segs) {
    if (s.k === 'Z') continue;
    add(s.p);
    if (s.k === 'Q') add(s.c);
    if (s.k === 'C') {
      add(s.c1);
      add(s.c2);
    }
  }
  return [x0, y0, x1, y1];
}

/** A polygon as path segments (a closed ring), so plain point lists and curves go through the same pipeline. */
export function polygonSegs(points: readonly Pt[]): Seg[] {
  if (points.length === 0) return [];
  return [{ k: 'M', p: points[0] }, ...points.slice(1).map((p): Seg => ({ k: 'L', p })), { k: 'Z' }];
}
