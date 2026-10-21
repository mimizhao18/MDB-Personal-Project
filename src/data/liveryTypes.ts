import type { PodStyle } from './cars/spec';
import type { EraId } from './eras';

/** A gradient across a shape: colors at offsets 0..1 between two points, in the same coordinates as the shape. */
export interface LiveryGradient {
  from: readonly [number, number];
  to: readonly [number, number];
  stops: readonly (readonly [number, string])[];
}

/** An outline: a line `width` metres wide centred on the shape's edge (half of it falls outside the shape). */
export interface LiveryStroke {
  color: string;
  width: number;
}

/**
 * A shape drawn on the car's paint, in metres ([along the car, across/up]). Either a polygon (`points`) or an
 * SVG-style path (`path`: M L H V C S Q T A Z, absolute or relative, curves flattened to a fraction of a pixel).
 * Filled with `color` or `gradient`, optionally outlined with `stroke`.
 * Fill rule: non-zero winding (draw a hole the other way round from its outer edge), or `rule: 'evenodd'`.
 */
export interface LiveryLayer {
  color?: string;
  points?: readonly (readonly [number, number])[];
  path?: string;
  gradient?: LiveryGradient;
  stroke?: LiveryStroke;
  /** 0..1, for tints and see-through fades. */
  opacity?: number;
  rule?: 'nonzero' | 'evenodd';
  /** Top view only: also drawn mirrored across the car's centre line (z to -z). */
  symmetric?: boolean;
}

/** A piece of lettering painted on the car, such as a sponsor's name. */
export interface LiveryText {
  /** Seen from above (y is across the car, the right side positive) or from the side (y is height). */
  view: 'top' | 'side';
  /** The words; "\n" starts a new line (lines stack downward, centred on y as a block). */
  text: string;
  /** Where it goes along the car, and across or up (the middle of the capital letters). */
  x: number;
  y: number;
  /** The height of the capital letters, in metres. */
  height: number;
  color: string;
  /** What x means: the start, middle or end of the text. Defaults to the start. */
  align?: 'left' | 'center' | 'right';
  /** Extra space between the letters, in metres. */
  spacing?: number;
  /** Top view only: along the car (the default), or across it for the wings, reading from the rear or from the front. */
  orient?: 'along' | 'across-rear' | 'across-front';
  /**
   * The smooth bold stroke lettering (the default), a real typeface (`sans`: Inter, with `weight`), or the old
   * 5 x 7 pixel font (which takes none of the options below).
   */
  font?: 'bold' | 'pixel' | 'sans';
  /** `sans` only: 400 regular, 600 semibold, 800 extra bold (the default), 900 black. */
  weight?: 400 | 600 | 800 | 900;
  /** Lean of the letters in degrees; positive leans them forward like italics. */
  slant?: number;
  /** Width of the letters: below 1 condensed, above 1 wide. */
  condense?: number;
  /** A colored outline around every letter, `width` metres outside it. */
  outline?: LiveryStroke;
  /** Line spacing for several lines, in letter heights (default 1.3). */
  lineHeight?: number;
}

/**
 * A logo from the logo library (src/data/logos) placed on the car. Seen from the side it reads correctly from both
 * sides of the car: the left side gets a mirror-image copy, as with lettering (unless `farSide: 'same'`).
 */
export interface LiveryDecal {
  view: 'top' | 'side';
  /** The logo's id in the library. */
  logo: string;
  /** Where its middle goes: along the car, and across (top) or up (side), in metres. */
  x: number;
  y: number;
  /** Its size: the width in metres (or `height`; with both, the logo is stretched to fit). */
  width?: number;
  height?: number;
  /** Turned this many degrees counter-clockwise, as seen. */
  rotate?: number;
  /** Top view: along the car (the logo's top toward the left side of the car), or across a wing like lettering. */
  orient?: 'along' | 'across-rear' | 'across-front';
  /** Drawn back to front. */
  mirror?: boolean;
  /** Side view: what the left side shows: a mirror-image copy that reads correctly (the default), or the same pixels. */
  farSide?: 'readable' | 'same';
  /** New colors for the logo's named color slots (a white version on a dark car, for example). */
  colors?: Readonly<Record<string, string>>;
  opacity?: number;
}

export interface Livery {
  /** Stable id: saved in players' profiles, so never rename or reuse one. */
  id: string;
  name: string;
  /** Which generation of car this livery is for. It is only ever put on that generation's model. */
  era: EraId;
  team: string;
  /** Credits. 0 means owned from the start. Placeholder prices, see BACKLOG.md. */
  price: number;
  /** Main body color: the base paint, and the color of the floor glow. */
  primary: string;
  /** Accent color: the most noticeable second color. */
  secondary: string;
  /** Color of the floor glow under the 3D car, when the body color would make a dull one. Defaults to the body or accent color. */
  glow?: string;
  /** Which sidepod design the team ran (the shape of the car's side bodywork). */
  sidepod: PodStyle;
  /** The color of the driver's helmet, as seen in the cockpit. Defaults to white. */
  helmet?: string;
  /** Matte paint (a few teams run it) or glossy. */
  finish: 'gloss' | 'matte';
  /** Solid colors for the wings and floor, and the halo when the team paints it (otherwise it is bare carbon). */
  parts: { wing: string; flap: string; endplate: string; floor: string; halo?: string };
  /** The front wing's colors, when it differs from the rear wing's (the 1980s McLarens ran a white front wing and a red rear one). */
  frontParts?: { wing: string; flap: string; endplate: string };
  /** Shapes laid over the base paint seen from above: [x, z] in the car's own measurements (see src/data/cars). */
  top: readonly LiveryLayer[];
  /** The same seen from the side: [x, y]. Used on both sides of the car. */
  side: readonly LiveryLayer[];
  /** Sponsor names and other lettering, painted over the shapes and logos. On the wings, use the top view with the wing's own x and z. */
  texts?: readonly LiveryText[];
  /** Logos from the logo library, painted over the shapes (and under the lettering). */
  decals?: readonly LiveryDecal[];
  /** Shapes drawn on the wings from above (stripes, checks), on top of the wing colors. */
  wingTop?: readonly LiveryLayer[];
  /** Lettering on the front and rear wing end plates (side view, in the car's x and y). */
  plateTexts?: { front?: readonly LiveryText[]; rear?: readonly LiveryText[] };
  /** Logos on the end plates (side view, in the car's x and y), under the plate lettering. */
  plateDecals?: { front?: readonly LiveryDecal[]; rear?: readonly LiveryDecal[] };
}
