// A bold stroke font for the lettering painted on the cars (sponsor names, numbers): every glyph is a few polylines
// in a 100-unit-tall box, drawn with thick round-ended strokes, so the letters stay smooth at any size (unlike the
// 5 x 7 pixel font in font.ts, which is kept for liveries that ask for it). Lower case is drawn as capitals.

/** A polyline in glyph units: x to the right, y up, 100 is the cap height. */
export type Stroke = readonly (readonly [number, number])[];

export interface StrokeGlyph {
  /** The glyph's advance width in glyph units (before letter spacing). */
  width: number;
  strokes: readonly Stroke[];
  /** Filled dots (for punctuation), as [x, y, radius]. */
  dots?: readonly (readonly [number, number, number])[];
}

/** How thick the strokes are, in glyph units. */
export const STROKE_WIDTH = 19;
/** Space between letters, in glyph units. */
export const LETTER_GAP = 22;

const O_RING: Stroke = [[50, 100], [18, 88], [4, 52], [18, 12], [50, 0], [82, 12], [96, 52], [82, 88], [50, 100]];
const P_BOWL: Stroke = [[0, 0], [0, 100], [60, 100], [86, 86], [86, 64], [60, 50], [0, 50]];

const G: Record<string, StrokeGlyph> = {
  A: { width: 100, strokes: [[[0, 0], [50, 100], [100, 0]], [[18, 34], [82, 34]]] },
  B: { width: 92, strokes: [[[0, 0], [0, 100], [58, 100], [80, 88], [80, 62], [58, 50], [0, 50]], [[58, 50], [86, 38], [86, 12], [62, 0], [0, 0]]] },
  C: { width: 94, strokes: [[[96, 82], [78, 97], [42, 100], [12, 84], [2, 50], [12, 16], [42, 0], [78, 3], [96, 18]]] },
  D: { width: 94, strokes: [[[0, 0], [0, 100], [50, 100], [82, 86], [94, 50], [82, 14], [50, 0], [0, 0]]] },
  E: { width: 84, strokes: [[[84, 100], [0, 100], [0, 0], [84, 0]], [[0, 50], [66, 50]]] },
  F: { width: 80, strokes: [[[82, 100], [0, 100], [0, 0]], [[0, 52], [62, 52]]] },
  G: { width: 96, strokes: [[[96, 82], [78, 97], [42, 100], [12, 84], [2, 50], [12, 16], [42, 0], [78, 3], [96, 18], [96, 44], [58, 44]]] },
  H: { width: 92, strokes: [[[0, 0], [0, 100]], [[92, 0], [92, 100]], [[0, 50], [92, 50]]] },
  I: { width: 22, strokes: [[[11, 0], [11, 100]]] },
  J: { width: 78, strokes: [[[78, 100], [78, 26], [66, 6], [40, 0], [14, 6], [2, 26]]] },
  K: { width: 90, strokes: [[[0, 0], [0, 100]], [[90, 100], [0, 40]], [[34, 56], [92, 0]]] },
  L: { width: 78, strokes: [[[0, 100], [0, 0], [78, 0]]] },
  M: { width: 112, strokes: [[[0, 0], [0, 100], [56, 34], [112, 100], [112, 0]]] },
  N: { width: 94, strokes: [[[0, 0], [0, 100], [94, 0], [94, 100]]] },
  O: { width: 100, strokes: [O_RING] },
  P: { width: 88, strokes: [P_BOWL] },
  Q: { width: 100, strokes: [O_RING, [[64, 28], [100, -6]]] },
  R: { width: 92, strokes: [P_BOWL, [[52, 50], [94, 0]]] },
  S: { width: 88, strokes: [[[86, 82], [70, 97], [40, 100], [12, 86], [8, 64], [30, 50], [62, 46], [84, 34], [84, 10], [58, 0], [24, 2], [2, 18]]] },
  T: { width: 86, strokes: [[[0, 100], [86, 100]], [[43, 100], [43, 0]]] },
  U: { width: 92, strokes: [[[0, 100], [0, 26], [12, 6], [46, 0], [80, 6], [92, 26], [92, 100]]] },
  V: { width: 100, strokes: [[[0, 100], [50, 0], [100, 100]]] },
  W: { width: 128, strokes: [[[0, 100], [30, 0], [64, 66], [98, 0], [128, 100]]] },
  X: { width: 92, strokes: [[[0, 0], [92, 100]], [[0, 100], [92, 0]]] },
  Y: { width: 92, strokes: [[[0, 100], [46, 48], [92, 100]], [[46, 48], [46, 0]]] },
  Z: { width: 86, strokes: [[[0, 100], [86, 100], [0, 0], [86, 0]]] },
  '0': { width: 90, strokes: [[[45, 100], [14, 88], [2, 50], [14, 12], [45, 0], [76, 12], [88, 50], [76, 88], [45, 100]]] },
  '1': { width: 58, strokes: [[[8, 76], [40, 100], [40, 0]]] },
  '2': { width: 86, strokes: [[[6, 80], [24, 97], [58, 100], [82, 86], [82, 62], [60, 40], [0, 0], [86, 0]]] },
  '3': { width: 86, strokes: [[[6, 90], [36, 100], [70, 98], [84, 80], [72, 58], [40, 52]], [[40, 52], [78, 46], [88, 22], [74, 3], [38, 0], [4, 10]]] },
  '4': { width: 92, strokes: [[[66, 0], [66, 100], [0, 30], [92, 30]]] },
  '5': { width: 86, strokes: [[[82, 100], [14, 100], [8, 50], [42, 58], [76, 52], [88, 30], [76, 5], [40, 0], [4, 10]]] },
  '6': { width: 88, strokes: [[[80, 92], [50, 100], [18, 84], [4, 50], [8, 15], [42, 0], [78, 8], [88, 34], [72, 54], [40, 58], [8, 44]]] },
  '7': { width: 84, strokes: [[[0, 100], [84, 100], [34, 0]]] },
  '8': { width: 88, strokes: [[[44, 52], [16, 64], [16, 90], [44, 100], [72, 90], [72, 64], [44, 52], [8, 38], [8, 12], [44, 0], [80, 12], [80, 38], [44, 52]]] },
  '9': { width: 88, strokes: [[[8, 8], [40, 0], [72, 16], [84, 50], [80, 85], [48, 100], [14, 92], [2, 66], [16, 46], [48, 42], [82, 56]]] },
  '-': { width: 60, strokes: [[[6, 50], [54, 50]]] },
  '+': { width: 74, strokes: [[[6, 50], [68, 50]], [[37, 18], [37, 82]]] },
  '/': { width: 70, strokes: [[[4, 0], [66, 100]]] },
  '&': { width: 100, strokes: [[[98, 0], [26, 74], [34, 96], [60, 96], [58, 72], [10, 32], [18, 6], [54, 0], [98, 44]]] },
  "'": { width: 30, strokes: [[[16, 100], [12, 72]]] },
  '.': { width: 30, strokes: [], dots: [[15, 10, 12]] },
  ':': { width: 30, strokes: [], dots: [[15, 22, 11], [15, 74, 11]] },
  '!': { width: 30, strokes: [[[15, 100], [15, 36]]], dots: [[15, 10, 12]] },
  ' ': { width: 44, strokes: [] },
};

/** The glyph for a character (a blank for characters the font does not have). */
export function strokeGlyph(ch: string): StrokeGlyph {
  return G[ch.toUpperCase()] ?? G[' '];
}

/** The width of a run of text in glyph units (letters plus the gaps between them, plus `extraGap` per gap). */
export function strokeTextWidth(text: string, extraGap = 0): number {
  let w = 0;
  for (let i = 0; i < text.length; i++) w += strokeGlyph(text[i]).width + (i < text.length - 1 ? LETTER_GAP + extraGap : 0);
  return w;
}

/**
 * The filled shapes of a glyph: one polygon per stroke segment (a thick line with round ends) and per dot, in glyph
 * units. `map` turns a glyph-unit point into the picture's own coordinates.
 */
export function glyphPolygons(glyph: StrokeGlyph, map: (u: number, v: number) => readonly [number, number]): (readonly [number, number])[][] {
  const polygons: (readonly [number, number])[][] = [];
  const r = STROKE_WIDTH / 2;
  const disc = (cx: number, cy: number, radius: number) => Array.from({ length: 10 }, (_, k) => map(cx + radius * Math.cos((k / 10) * Math.PI * 2), cy + radius * Math.sin((k / 10) * Math.PI * 2)));
  for (const stroke of glyph.strokes) {
    for (let i = 0; i + 1 < stroke.length; i++) {
      const [x0, y0] = stroke[i];
      const [x1, y1] = stroke[i + 1];
      const dx = x1 - x0;
      const dy = y1 - y0;
      const len = Math.hypot(dx, dy) || 1;
      const nx = (-dy / len) * r;
      const ny = (dx / len) * r;
      polygons.push([map(x0 + nx, y0 + ny), map(x1 + nx, y1 + ny), map(x1 - nx, y1 - ny), map(x0 - nx, y0 - ny)]);
      polygons.push(disc(x1, y1, r));
    }
    if (stroke.length > 0) polygons.push(disc(stroke[0][0], stroke[0][1], r));
  }
  for (const [cx, cy, radius] of glyph.dots ?? []) polygons.push(disc(cx, cy, radius));
  return polygons;
}
