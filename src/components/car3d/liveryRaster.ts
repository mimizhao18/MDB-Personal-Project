// Paints a livery's flat pictures (seen from above, from the right side, from the left side) as plain RGBA pixels.
// No browser canvas and no three.js here: it runs the same on the web and on a phone through expo-gl, and in the rule
// checks under Node. paint.ts turns the pixels into textures.
//
// Two pipelines live side by side. The original one (straight polygons and the stroke/pixel fonts) is kept exactly
// as it was, so every livery drawn with it renders pixel for pixel as before. The vector one draws SVG-style paths,
// outlines, gradients, logos (decals) and the Inter typeface, and is used by anything that asks for those.

import { specFor } from '../../data/cars';
import { PAINT_BOX, frontWingSection, rearWingSection } from '../../data/cars/spec';
import type { Outline } from '../../data/cars/spec';
import type { Livery, LiveryDecal, LiveryLayer, LiveryText } from '../../data/liveryTypes';
import { getLogo, isLogoText } from '../../data/logos';
import type { Logo, LogoColor, LogoText } from '../../data/logos';
import { GLYPH_HEIGHT, GLYPH_WIDTH, glyphRows } from './font';
import { layoutText } from './outlineFont';
import type { Affine, Pt, Ring, Seg } from './path';
import { apply, compose, flatten, parsePath, polygonSegs, rotate, scale, transformSegs } from './path';
import type { Picture } from './raster';
import { fillRings, hexToRgb, linearPaint, signedArea, solid, strokeRings } from './raster';
import { LETTER_GAP, glyphPolygons, strokeGlyph, strokeTextWidth } from './strokeFont';

const { xMin, xMax, zHalf, yMax } = PAINT_BOX;
export const TOP_W = 2048;
export const TOP_H = 768;
export const SIDE_W = 2048;
export const SIDE_H = 448;
const SUBSAMPLES = 4;
/** How far (in pixels) a flattened curve may stray from the true one. */
const TOLERANCE = 0.12;

type Rgb = readonly [number, number, number];

// ---------------------------------------------------------------------------------------------------------------
// The original pipeline (unchanged)

/** Fills a polygon (in pixel coordinates) with a color, with soft edges from a few samples per pixel row. */
function fillPolygon(data: Uint8Array, width: number, height: number, points: readonly (readonly [number, number])[], rgb: Rgb): void {
  if (points.length < 3) return;
  let minY = Infinity;
  let maxY = -Infinity;
  let minX = Infinity;
  let maxX = -Infinity;
  for (const [x, y] of points) {
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
  }
  const first = Math.max(0, Math.floor(minY));
  const last = Math.min(height - 1, Math.ceil(maxY));
  // only the columns the polygon can touch are scanned (lettering is thousands of small polygons)
  const colFirst = Math.max(0, Math.floor(minX));
  const colLast = Math.min(width - 1, Math.ceil(maxX));
  if (colLast < colFirst || last < first) return;
  const coverage = new Float32Array(colLast - colFirst + 1);

  for (let py = first; py <= last; py++) {
    coverage.fill(0);
    let touched = false;
    for (let k = 0; k < SUBSAMPLES; k++) {
      const sy = py + (k + 0.5) / SUBSAMPLES;
      const crossings: number[] = [];
      for (let i = 0; i < points.length; i++) {
        const [x0, y0] = points[i];
        const [x1, y1] = points[(i + 1) % points.length];
        if ((y0 <= sy && y1 > sy) || (y1 <= sy && y0 > sy)) crossings.push(x0 + ((sy - y0) / (y1 - y0)) * (x1 - x0));
      }
      crossings.sort((a, b) => a - b);
      for (let c = 0; c + 1 < crossings.length; c += 2) {
        const xa = Math.max(0, crossings[c]);
        const xb = Math.min(width, crossings[c + 1]);
        if (xb <= xa) continue;
        touched = true;
        for (let px = Math.max(colFirst, Math.floor(xa)); px < Math.min(colLast + 1, Math.ceil(xb)); px++) {
          coverage[px - colFirst] += (Math.min(px + 1, xb) - Math.max(px, xa)) / SUBSAMPLES;
        }
      }
    }
    if (!touched) continue;
    for (let px = colFirst; px <= colLast; px++) {
      const a = Math.min(1, coverage[px - colFirst]);
      if (a <= 0) continue;
      const o = (py * width + px) * 4;
      data[o] += (rgb[0] - data[o]) * a;
      data[o + 1] += (rgb[1] - data[o + 1]) * a;
      data[o + 2] += (rgb[2] - data[o + 2]) * a;
    }
  }
}

type ToPixel = (a: number, b: number) => [number, number];

/** The flat shapes of the wing elements seen from above, in their paint colors, so the wings are painted (and can carry lettering) too. */
function wingLayers(livery: Livery): LiveryLayer[] {
  const spec = specFor(livery.era);
  const layers: LiveryLayer[] = [];
  const fw = spec.frontWing;
  const front = livery.frontParts ?? livery.parts;
  for (const e of fw.elements) {
    const color = e.flap ? front.flap : front.wing;
    const z0 = Math.max(e.from, 0.12); // leave the middle to the nose, which runs into the wing
    const zs = Array.from({ length: 24 }, (_, i) => z0 + ((fw.span - 0.01 - z0) * i) / 23);
    for (const side of [1, -1]) {
      const le = zs.map((z) => [frontWingSection(spec, e, z).x, z * side] as const);
      const te = zs.map((z) => {
        const sec = frontWingSection(spec, e, z);
        return [sec.x - sec.chord, z * side] as const;
      });
      layers.push({ color, points: [...le, ...te.reverse()] });
    }
  }
  const rw = spec.rearWing;
  for (const e of rw.elements) {
    const color = e.flap ? livery.parts.flap : livery.parts.wing;
    const half = rw.span - 0.01;
    const zs = Array.from({ length: 30 }, (_, i) => -half + (2 * half * i) / 29);
    const le = zs.map((z) => [rearWingSection(spec, e, z).x, z] as const);
    const te = zs.map((z) => {
      const sec = rearWingSection(spec, e, z);
      return [sec.x - sec.chord, z] as const;
    });
    layers.push({ color, points: [...le, ...te.reverse()] });
  }
  return layers;
}

/**
 * Letters one piece of text onto a picture. `view` says which way is up for the letters: in the top picture the car's
 * right side is down; in the side picture up is up. `mirror` draws it back to front, for the picture seen from the
 * other side of the car, so the letters read the right way round from both sides.
 */
function drawText(data: Uint8Array, width: number, height: number, toPixel: ToPixel, t: LiveryText, mirror: boolean): void {
  if (t.font !== 'pixel') return drawStrokeText(data, width, height, toPixel, t, mirror);
  const text = t.text;
  const p = t.height / GLYPH_HEIGHT; // the size of one font pixel, in metres
  const advance = (GLYPH_WIDTH + 1) * p + (t.spacing ?? 0);
  const length = text.length * advance - p;
  const start = t.align === 'center' ? t.x - length / 2 : t.align === 'right' ? t.x - length : t.x;
  const rgb = hexToRgb(t.color);
  if (t.view === 'top' && t.orient && t.orient !== 'along') {
    // across the wing: the letters advance along z, with their tops toward the front (read from the rear) or the rear
    const fromRear = t.orient === 'across-rear';
    const zStart = fromRear ? t.y - length / 2 : t.y + length / 2;
    for (let i = 0; i < text.length; i++) {
      const rows = glyphRows(text[i]);
      for (let r = 0; r < GLYPH_HEIGHT; r++) {
        for (let c = 0; c < GLYPH_WIDTH; c++) {
          if (!((rows[r] >> (GLYPH_WIDTH - 1 - c)) & 1)) continue;
          const off = i * advance + c * p;
          const z0 = fromRear ? zStart + off : zStart - off - p;
          const x0 = fromRear ? t.x + t.height / 2 - (r + 1) * p : t.x - t.height / 2 + r * p;
          fillPolygon(data, width, height, [toPixel(x0, z0), toPixel(x0 + p, z0), toPixel(x0 + p, z0 + p), toPixel(x0, z0 + p)], rgb);
        }
      }
    }
    return;
  }
  for (let i = 0; i < text.length; i++) {
    const slot = mirror ? text.length - 1 - i : i;
    const rows = glyphRows(text[i]);
    for (let r = 0; r < GLYPH_HEIGHT; r++) {
      for (let c = 0; c < GLYPH_WIDTH; c++) {
        const col = mirror ? GLYPH_WIDTH - 1 - c : c;
        if (!((rows[r] >> (GLYPH_WIDTH - 1 - col)) & 1)) continue;
        const x0 = start + slot * advance + c * p;
        // top view: the glyph's top row is toward -z; side view: toward +y
        const lo = t.view === 'top' ? t.y - t.height / 2 + r * p : t.y + t.height / 2 - (r + 1) * p;
        fillPolygon(data, width, height, [toPixel(x0, lo), toPixel(x0 + p, lo), toPixel(x0 + p, lo + p), toPixel(x0, lo + p)], rgb);
      }
    }
  }
}

/**
 * Letters one piece of text in the bold stroke font. Each glyph is laid out in its own units (100 tall, x to the
 * right, y up) and mapped into the picture by `view` and `orient` like the pixel font: along the car (side view: y up;
 * top view: the glyph's top toward -z), or across a wing. `mirror` reverses the run and each glyph for the far side.
 */
function drawStrokeText(data: Uint8Array, width: number, height: number, toPixel: ToPixel, t: LiveryText, mirror: boolean): void {
  const text = t.text;
  const unit = t.height / 100; // metres per glyph unit
  const extraGap = (t.spacing ?? 0) / unit;
  const run = strokeTextWidth(text, extraGap) * unit; // the whole run, in metres
  const across = t.view === 'top' && t.orient && t.orient !== 'along';
  const fromRear = t.orient === 'across-rear';
  // where the run starts along its reading direction (metres)
  // Across a wing the glyph tops point to the rear (-x): both wings rise toward the back, so that edge is the upper
  // one whether the wing is seen from behind (reader's right +z) or from the front (reader's right -z).
  const start = across ? (fromRear ? t.y - run / 2 : t.y + run / 2) : t.align === 'center' ? t.x - run / 2 : t.align === 'right' ? t.x - run : t.x;
  const rgb = hexToRgb(t.color);
  let offset = 0; // along the run, in metres
  for (let i = 0; i < text.length; i++) {
    const glyph = strokeGlyph(text[mirror ? text.length - 1 - i : i]);
    const w = glyph.width * unit;
    const at = offset;
    const map = (u: number, v: number): readonly [number, number] => {
      const gu = (mirror ? glyph.width - u : u) * unit; // along the reading direction, from the glyph's start
      const gv = (v - 50) * unit; // up from the middle of the cap height
      if (across) return fromRear ? toPixel(t.x - gv, start + at + gu) : toPixel(t.x - gv, start - at - gu);
      return t.view === 'top' ? toPixel(start + at + gu, t.y - gv) : toPixel(start + at + gu, t.y + gv);
    };
    for (const polygon of glyphPolygons(glyph, map)) fillPolygon(data, width, height, polygon, rgb);
    offset += w + (LETTER_GAP + extraGap) * unit;
  }
}

/** A flat picture of one color. */
function blank(width: number, height: number, base: Rgb): Picture {
  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    data[i * 4] = base[0];
    data[i * 4 + 1] = base[1];
    data[i * 4 + 2] = base[2];
    data[i * 4 + 3] = 255;
  }
  return { data, width, height };
}

// ---------------------------------------------------------------------------------------------------------------
// The vector pipeline

/** True for a shape the original pipeline draws: a plain polygon in one color. */
const isPlainPolygon = (l: LiveryLayer) => !!l.points && !!l.color && !l.path && !l.gradient && !l.stroke && l.opacity === undefined && !l.rule && !l.symmetric;

/** How many pixels a unit becomes under a transform (the square root of its area scale). */
const pixelsPer = (m: Affine) => Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2]));

/** Orients rings the same way round (positive area), so that filling them together with non-zero gives their union. */
function sameWay(rings: Pt[][]): Pt[][] {
  for (const r of rings) if (signedArea(r) < 0) r.reverse();
  return rings;
}

/** Draws path segments (already in pixels) with a fill, a gradient and/or an outline. */
function drawSegs(pic: Picture, segs: readonly Seg[], fill: { color?: string; gradient?: { from: Pt; to: Pt; stops: readonly (readonly [number, string])[] } }, stroke: { color: string; width: number } | undefined, rule: 'nonzero' | 'evenodd' | undefined, alpha: number): void {
  const rings = flatten(segs, TOLERANCE);
  if (fill.gradient) fillRings(pic, rings, linearPaint(fill.gradient.from, fill.gradient.to, fill.gradient.stops, alpha), rule);
  else if (fill.color) fillRings(pic, rings, solid(fill.color, alpha), rule);
  if (stroke && stroke.width > 0) fillRings(pic, strokeRings(rings, stroke.width), solid(stroke.color, alpha));
}

/** Draws one livery shape; `m` takes the car's metres to the picture's pixels, `toPixel` is the same for the original pipeline. */
function drawLayer(pic: Picture, layer: LiveryLayer, m: Affine, toPixel: ToPixel): void {
  if (isPlainPolygon(layer)) {
    fillPolygon(pic.data, pic.width, pic.height, layer.points!.map(([a, b]) => toPixel(a, b)), hexToRgb(layer.color!));
    return;
  }
  const source = layer.path ? parsePath(layer.path) : polygonSegs(layer.points ?? []);
  for (const mm of layer.symmetric ? [m, compose(m, scale(1, -1))] : [m]) {
    const g = layer.gradient;
    drawSegs(
      pic,
      transformSegs(source, mm),
      { color: layer.color, gradient: g && { from: apply(mm, g.from), to: apply(mm, g.to), stops: g.stops } },
      layer.stroke && { color: layer.stroke.color, width: layer.stroke.width * pixelsPer(mm) },
      layer.rule,
      layer.opacity ?? 1,
    );
  }
}

/**
 * The reading frame of a view as an affine from (u along the reading direction, v up the letters) in metres to the
 * car's coordinates, with its origin at (x, y). Top view: along the car the tops point to -z; across a wing they point
 * to the rear (-x), reading toward +z from behind or toward -z from the front (see drawStrokeText).
 */
function frame(view: 'top' | 'side', orient: LiveryText['orient'], x: number, y: number): Affine {
  if (view === 'side') return [1, 0, 0, 1, x, y];
  if (!orient || orient === 'along') return [1, 0, 0, -1, x, y];
  return orient === 'across-rear' ? [0, 1, -1, 0, x, y] : [0, -1, -1, 0, x, y];
}

/** Bold-stroke-font lettering laid out as filled pieces in text units (cap height 1, y up, the run from x = 0). */
function strokeFontPieces(text: string, tracking: number, extra: number): { pieces: Pt[][]; width: number }[] {
  return text.split('\n').map((line) => {
    const pieces: Pt[][] = [];
    let pen = 0;
    for (let i = 0; i < line.length; i++) {
      const glyph = strokeGlyph(line[i]);
      const at = pen;
      for (const p of glyphPolygons(glyph, (u, v) => [(at + u) / 100, v / 100], extra * 100)) pieces.push(p as Pt[]);
      pen += glyph.width + (i < line.length - 1 ? LETTER_GAP + tracking * 100 : 0);
    }
    return { pieces, width: pen / 100 };
  });
}

/**
 * Lays out lettering in text units (cap height 1, y up, the block's widest line from u = 0 to `width`, the first
 * baseline at v = 0) as filled rings in pixels after `m`, plus the same thickened for an outline. `outline` is in text
 * units. Lines stack downward, each placed by `align`.
 */
function textRings(
  t: { text: string; font?: 'bold' | 'sans' | 'pixel'; weight?: 400 | 600 | 800 | 900; tracking: number; condense: number; slant: number; lineHeight: number; align: 'left' | 'center' | 'right' },
  placeBlock: (width: number, lines: number, lineHeight: number) => Affine,
  outline: number,
): { fill: Pt[][]; outline: Pt[][] | null } {
  if (t.font === 'sans') {
    const layout = layoutText(t.text, { weight: t.weight, tracking: t.tracking, condense: t.condense, slant: t.slant, lineHeight: t.lineHeight, align: t.align });
    const m = placeBlock(layout.width, layout.lines, layout.lineHeight);
    const fill = flatten(transformSegs(layout.segs, m), TOLERANCE);
    const ring = outline > 0 ? sameWay([...strokeRings(fill as Ring[], 2 * outline * pixelsPer(m)), ...fill.map((r) => [...r])]) : null;
    return { fill, outline: ring };
  }
  // the bold stroke font
  const lines = strokeFontPieces(t.text, t.tracking, 0);
  const width = Math.max(...lines.map((l) => l.width)) * t.condense;
  const m = placeBlock(width, lines.length, t.lineHeight);
  const slant = Math.tan((t.slant * Math.PI) / 180);
  const place = (pieces: { pieces: Pt[][]; width: number }[]) =>
    sameWay(
      pieces.flatMap((line, li) => {
        const shift = t.align === 'center' ? (width - line.width * t.condense) / 2 : t.align === 'right' ? width - line.width * t.condense : 0;
        const base = -li * t.lineHeight;
        return line.pieces.map((p) => p.map(([u, v]) => apply(m, [shift + u * t.condense + v * slant, base + v])));
      }),
    );
  return { fill: place(lines), outline: outline > 0 ? place(strokeFontPieces(t.text, t.tracking, outline)) : null };
}

/** True for lettering the original pipeline draws (none of the newer options). */
const isPlainText = (t: LiveryText) => t.font !== 'sans' && !t.slant && !t.condense && !t.outline && !t.text.includes('\n') && !t.lineHeight;

/** Letters a piece of text with the vector pipeline (Inter, slant, condensed, outlined, several lines). */
function drawRichText(pic: Picture, m: Affine, t: LiveryText, mirror: boolean): void {
  const h = t.height;
  const across = t.view === 'top' && !!t.orient && t.orient !== 'along';
  const f = frame(t.view, t.orient, t.x, t.y);
  const align = across ? 'center' : t.align ?? 'left';
  const placeBlock = (width: number, lines: number, lineHeight: number): Affine => {
    const middle = (1 - (lines - 1) * lineHeight) / 2; // the block's middle, in text units up from the first baseline
    const start = align === 'center' ? -width / 2 : align === 'right' ? -width : 0;
    // text units -> metres along the reading frame (u from the start, v from the middle) -> car -> pixels
    let local: Affine = [h, 0, 0, h, start * h, -middle * h];
    if (mirror) local = compose([-1, 0, 0, 1, (2 * start + width) * h, 0], local);
    return compose(m, compose(f, local));
  };
  const { fill, outline } = textRings(
    { text: t.text, font: t.font === 'sans' ? 'sans' : 'bold', weight: t.weight, tracking: (t.spacing ?? 0) / h, condense: t.condense ?? 1, slant: t.slant ?? 0, lineHeight: t.lineHeight ?? 1.3, align: t.text.includes('\n') ? (align === 'right' ? 'right' : align === 'left' ? 'left' : 'center') : 'left' },
    placeBlock,
    t.outline ? t.outline.width / h : 0,
  );
  if (outline && t.outline) fillRings(pic, outline, solid(t.outline.color));
  fillRings(pic, fill, solid(t.color));
}

/** Resolves a logo color: a hex color as it is, a slot name through the overrides and then the logo's defaults. */
function logoColor(logo: Logo, c: LogoColor, colors: Readonly<Record<string, string>> | undefined): string {
  if (c.startsWith('#')) return c;
  return colors?.[c] ?? logo.slots[c] ?? '#FF00FF';
}

/** Draws a logo into a picture; `m` takes logo units (y down) to pixels. */
export function drawLogo(pic: Picture, logo: Logo, m: Affine, colors?: Readonly<Record<string, string>>, alpha = 1): void {
  const px = pixelsPer(m);
  for (const s of logo.shapes) {
    if (isLogoText(s)) {
      drawLogoText(pic, logo, s, m, colors, alpha);
      continue;
    }
    const segs = transformSegs(parsePath(s.d), m);
    const a = alpha * (s.opacity ?? 1);
    const g = s.gradient;
    drawSegs(
      pic,
      segs,
      { color: s.fill && logoColor(logo, s.fill, colors), gradient: g && { from: apply(m, g.from), to: apply(m, g.to), stops: g.stops.map(([o, c]) => [o, logoColor(logo, c, colors)] as const) } },
      s.stroke && { color: logoColor(logo, s.stroke.color, colors), width: s.stroke.width * px },
      s.rule,
      a,
    );
  }
}

function drawLogoText(pic: Picture, logo: Logo, s: LogoText, m: Affine, colors: Readonly<Record<string, string>> | undefined, alpha: number): void {
  const size = s.size;
  let condense = s.condense ?? 1;
  const placeBlock = (width: number, lines: number, lineHeight: number): Affine => {
    void lines;
    void lineHeight;
    const w = width * size;
    const start = s.align === 'center' ? s.x - w / 2 : s.align === 'right' ? s.x - w : s.x;
    // text units (y up) -> logo units (y down), baseline at s.y
    return compose(m, [size, 0, 0, -size, start, s.y]);
  };
  if (s.fitWidth) {
    // measure first, then squeeze or stretch to the asked width
    const probe = s.font === 'bold' ? strokeTextWidth(s.text, (s.tracking ?? 0) / size * 100) / 100 : layoutText(s.text, { weight: s.weight, tracking: (s.tracking ?? 0) / size }).width;
    condense = s.fitWidth / size / Math.max(1e-6, probe);
  }
  const { fill, outline } = textRings(
    { text: s.text, font: s.font === 'bold' ? 'bold' : 'sans', weight: s.weight, tracking: (s.tracking ?? 0) / size, condense, slant: s.slant ?? 0, lineHeight: 1.3, align: 'left' },
    placeBlock,
    s.outline ? s.outline.width / size : 0,
  );
  if (outline && s.outline) fillRings(pic, outline, solid(logoColor(logo, s.outline.color, colors), alpha));
  fillRings(pic, fill, solid(logoColor(logo, s.fill, colors), alpha));
}

/** Places a decal: its logo's middle at (x, y) in the view, sized, turned and mirrored as asked; `m` is metres to pixels. */
function drawDecal(pic: Picture, d: LiveryDecal, m: Affine, farSide: boolean, logos: LogoLookup = getLogo): void {
  const logo = logos(d.logo);
  if (!logo) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn(`livery decal: no logo "${d.logo}"`);
    return;
  }
  const [w, h] = logo.size;
  const sx = d.width !== undefined ? d.width / w : (d.height ?? 0.1) / h;
  const sy = d.height !== undefined ? d.height / h : sx;
  // logo units (y down, origin top left) -> metres around the decal's middle (u right, v up)
  let local: Affine = [sx, 0, 0, -sy, (-w / 2) * sx, (h / 2) * sy];
  if (d.mirror) local = compose(scale(-1, 1), local);
  if (d.rotate) local = compose(rotate((d.rotate * Math.PI) / 180), local);
  if (farSide && d.farSide !== 'same') local = compose(scale(-1, 1), local);
  drawLogo(pic, logo, compose(m, compose(frame(d.view, d.orient, d.x, d.y), local)), d.colors, d.opacity ?? 1);
}

// ---------------------------------------------------------------------------------------------------------------
// Pictures of a livery

const topPixel: ToPixel = (x, z) => [((x - xMin) / (xMax - xMin)) * TOP_W, ((z + zHalf) / (2 * zHalf)) * TOP_H];
const sidePixel: ToPixel = (x, y) => [((x - xMin) / (xMax - xMin)) * SIDE_W, (y / yMax) * SIDE_H];
const TOP_AFFINE: Affine = [TOP_W / (xMax - xMin), 0, 0, TOP_H / (2 * zHalf), (-xMin * TOP_W) / (xMax - xMin), (zHalf * TOP_H) / (2 * zHalf)];
const SIDE_AFFINE: Affine = [SIDE_W / (xMax - xMin), 0, 0, SIDE_H / yMax, (-xMin * SIDE_W) / (xMax - xMin), 0];

export interface LiveryPixels {
  top: Picture;
  /** The right side of the car, and the left side (its lettering and logos turned round so they read correctly). */
  side: Picture;
  sideLeft: Picture;
}

function drawTexts(pic: Picture, texts: readonly LiveryText[], toPixel: ToPixel, m: Affine, mirror: boolean): void {
  for (const t of texts) {
    if (isPlainText(t)) drawText(pic.data, pic.width, pic.height, toPixel, t, mirror);
    else drawRichText(pic, m, t, mirror);
  }
}

/** Finds a logo by id: the library's, unless a test passes its own. */
export type LogoLookup = (id: string) => Logo | undefined;

/** Paints the livery's three pictures. */
export function paintLivery(livery: Livery, logos: LogoLookup = getLogo): LiveryPixels {
  const base = hexToRgb(livery.primary);
  const top = blank(TOP_W, TOP_H, base);
  for (const layer of [...livery.top, ...wingLayers(livery), ...(livery.wingTop ?? [])]) drawLayer(top, layer, TOP_AFFINE, topPixel);
  const side = blank(SIDE_W, SIDE_H, base);
  for (const layer of livery.side) drawLayer(side, layer, SIDE_AFFINE, sidePixel);
  const sideLeft: Picture = { data: side.data.slice(), width: SIDE_W, height: SIDE_H };
  for (const d of livery.decals ?? []) {
    if (d.view === 'top') drawDecal(top, d, TOP_AFFINE, false, logos);
    else {
      drawDecal(side, d, SIDE_AFFINE, false, logos);
      drawDecal(sideLeft, d, SIDE_AFFINE, true, logos);
    }
  }
  const texts = livery.texts ?? [];
  drawTexts(top, texts.filter((t) => t.view === 'top'), topPixel, TOP_AFFINE, false);
  const sideTexts = texts.filter((t) => t.view !== 'top');
  drawTexts(side, sideTexts, sidePixel, SIDE_AFFINE, false);
  drawTexts(sideLeft, sideTexts, sidePixel, SIDE_AFFINE, true);
  return { top, side, sideLeft };
}

/** Pixels per metre of the end plate pictures. */
export const PLATE_PPM = 420;

/** A picture for a wing end plate: its color with its logos and lettering, sized to the plate outline. */
export function paintPlate(outline: Outline, base: string, texts: readonly LiveryText[], decals: readonly LiveryDecal[], mirror: boolean, logos: LogoLookup = getLogo): Picture & { x0: number; y0: number; w: number; h: number } {
  const xs = outline.map(([x]) => x);
  const ys = outline.map(([, y]) => y);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  const w = Math.max(...xs) - x0;
  const h = Math.max(...ys) - y0;
  const width = Math.max(8, Math.ceil(w * PLATE_PPM));
  const height = Math.max(8, Math.ceil(h * PLATE_PPM));
  const toPixel: ToPixel = (x, y) => [(x - x0) * PLATE_PPM, (y - y0) * PLATE_PPM];
  const m: Affine = [PLATE_PPM, 0, 0, PLATE_PPM, -x0 * PLATE_PPM, -y0 * PLATE_PPM];
  const pic = blank(width, height, hexToRgb(base));
  for (const d of decals) drawDecal(pic, { ...d, view: 'side' }, m, mirror, logos);
  drawTexts(pic, texts.map((t) => ({ ...t, view: 'side' as const })), toPixel, m, mirror);
  return { ...pic, x0, y0, w, h };
}

/** A picture of one logo on a background, fitted with a margin (for the /dev/logos page). */
export function paintLogo(logo: Logo, width: number, height: number, background: string, colors?: Readonly<Record<string, string>>): Picture {
  const pic = blank(width, height, hexToRgb(background));
  const [w, h] = logo.size;
  const s = Math.min((width * 0.88) / w, (height * 0.8) / h);
  drawLogo(pic, logo, [s, 0, 0, s, (width - w * s) / 2, (height - h * s) / 2], colors);
  return pic;
}

