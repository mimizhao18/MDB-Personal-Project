// Lettering in a real typeface: the Inter font's glyph outlines (see outlineFontData.ts), laid out with its kerning into
// path segments the livery painter fills like any other shape. Units: the cap height is 1, x to the right, y up, the
// first line's baseline at y = 0 and the run starting at x = 0.

import { CAP_HEIGHT, INTER, UNITS_PER_EM } from './outlineFontData';
import type { Seg } from './path';
import { compose, parsePath, scale, skewX, transformSegs, translate } from './path';

export type FontWeight = 400 | 600 | 800 | 900;

export interface TextLayoutOptions {
  weight?: FontWeight;
  /** Extra space between letters, in cap heights. */
  tracking?: number;
  /** Horizontal scale of the letters: below 1 is condensed, above 1 is wide. */
  condense?: number;
  /** Lean of the letters in degrees (positive leans the tops forward, like italics). */
  slant?: number;
  /** Distance between baselines, in cap heights, for text with several lines ("\n"). */
  lineHeight?: number;
  /** How lines of different lengths line up with each other. */
  align?: 'left' | 'center' | 'right';
}

export interface TextLayout {
  segs: Seg[];
  /** The widest line, in cap heights (slant not included). */
  width: number;
  lines: number;
  lineHeight: number;
}

const UNIT = 1 / CAP_HEIGHT;

/** The width of one line in cap heights. */
function lineWidth(line: string, weight: FontWeight, tracking: number, condense: number): number {
  const font = INTER[weight];
  let w = 0;
  for (let i = 0; i < line.length; i++) {
    const g = font.glyphs[line[i]];
    w += (g ? g[0] : font.glyphs[' ']?.[0] ?? UNITS_PER_EM * 0.28) * UNIT * condense;
    if (i < line.length - 1) w += (font.kerning[line[i] + line[i + 1]] ?? 0) * UNIT * condense + tracking;
  }
  return w;
}

/** Lays out text (with "\n" for line breaks) in Inter. Characters the font set lacks are drawn as a space. */
export function layoutText(text: string, options: TextLayoutOptions = {}): TextLayout {
  const weight = options.weight ?? 800;
  const tracking = options.tracking ?? 0;
  const condense = options.condense ?? 1;
  const lineHeight = options.lineHeight ?? 1.3;
  const font = INTER[weight];
  const lines = text.split('\n');
  const widths = lines.map((l) => lineWidth(l, weight, tracking, condense));
  const width = Math.max(0, ...widths);
  const slant = skewX(((options.slant ?? 0) * Math.PI) / 180);
  const segs: Seg[] = [];
  lines.forEach((line, li) => {
    const shift = options.align === 'center' ? (width - widths[li]) / 2 : options.align === 'right' ? width - widths[li] : 0;
    let pen = shift;
    const baseline = -li * lineHeight;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const g = font.glyphs[ch];
      const advance = (g ? g[0] : font.glyphs[' ']?.[0] ?? UNITS_PER_EM * 0.28) * UNIT * condense;
      if (g && g[1]) {
        const m = compose(translate(pen, baseline), compose(slant, scale(UNIT * condense, UNIT)));
        segs.push(...transformSegs(parsePath(g[1]), m));
      }
      pen += advance;
      if (i < line.length - 1) pen += (font.kerning[ch + line[i + 1]] ?? 0) * UNIT * condense + tracking;
    }
  });
  return { segs, width, lines: lines.length, lineHeight };
}
