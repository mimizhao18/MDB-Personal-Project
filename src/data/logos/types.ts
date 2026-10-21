/**
 * A color in a logo: '#RRGGBB', or the name of one of the logo's color slots (so the same logo can be recolored, a
 * white version on a dark car for example).
 */
export type LogoColor = string;

/** A filled (and/or outlined) shape of a logo: an SVG path in the logo's own units, y down like SVG. */
export interface LogoPath {
  d: string;
  /** Fill color; leave out (with no gradient) for an outline only. */
  fill?: LogoColor;
  /** A linear gradient fill between two points in logo units. */
  gradient?: { from: readonly [number, number]; to: readonly [number, number]; stops: readonly (readonly [number, LogoColor])[] };
  /** An outline `width` logo units wide, centred on the edge. */
  stroke?: { color: LogoColor; width: number };
  /** Non-zero winding unless 'evenodd'. */
  rule?: 'nonzero' | 'evenodd';
  opacity?: number;
  /** Drawn only when the decal gives this slot a color (an optional keyline round a logo, for example). */
  when?: string;
}

/** Lettering inside a logo, in the Inter typeface (or the bold stroke font). */
export interface LogoText {
  text: string;
  /** The start, middle or end of the text (see `align`) and its baseline, in logo units (y down). */
  x: number;
  y: number;
  /** Height of the capital letters, in logo units. */
  size: number;
  fill: LogoColor;
  font?: 'sans' | 'bold';
  weight?: 400 | 600 | 800 | 900;
  align?: 'left' | 'center' | 'right';
  /** Extra space between letters, in logo units. */
  tracking?: number;
  /** Horizontal scale: below 1 condensed. */
  condense?: number;
  /** Lean in degrees, positive leans forward. */
  slant?: number;
  /** Fit the text to exactly this width (squeezing or stretching it), in logo units. */
  fitWidth?: number;
  /** An outline around each letter, `width` logo units outside it. */
  outline?: { color: LogoColor; width: number };
}

export type LogoShape = LogoPath | LogoText;

export interface Logo {
  id: string;
  /** The sponsor or team, as shown on the /dev/logos page. */
  name: string;
  /** The logo's box [width, height] in its own units; its middle is the decal's anchor point. */
  size: readonly [number, number];
  /** The default color of each slot. */
  slots: Readonly<Record<string, string>>;
  /** Drawn in order, later shapes on top. */
  shapes: readonly LogoShape[];
  /** A dark or light background behind it on the /dev/logos page when it is mostly white or black. */
  note?: string;
}

export const isLogoText = (s: LogoShape): s is LogoText => 'text' in s;
