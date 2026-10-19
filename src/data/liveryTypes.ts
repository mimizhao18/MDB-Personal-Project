import type { PodStyle } from './cars/spec';
import type { EraId } from './eras';

/** A flat colored shape drawn on the car's paint: a list of [along the car, across/up] points in metres. */
export interface LiveryLayer {
  color: string;
  points: readonly (readonly [number, number])[];
}

/** A piece of lettering painted on the car, such as a sponsor's name. */
export interface LiveryText {
  /** Seen from above (y is across the car, the right side positive) or from the side (y is height). */
  view: 'top' | 'side';
  text: string;
  /** Where it goes along the car, and across or up. */
  x: number;
  y: number;
  /** The height of the letters, in metres. */
  height: number;
  color: string;
  /** What x means: the start, middle or end of the text. Defaults to the start. */
  align?: 'left' | 'center' | 'right';
  /** Extra space between the letters, in metres. */
  spacing?: number;
  /** Top view only: along the car (the default), or across it for the wings, reading from the rear or from the front. */
  orient?: 'along' | 'across-rear' | 'across-front';
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
  /** Solid colors for the wings and floor. */
  parts: { wing: string; flap: string; endplate: string; floor: string };
  /** The front wing's colors, when it differs from the rear wing's (the 1980s McLarens ran a white front wing and a red rear one). */
  frontParts?: { wing: string; flap: string; endplate: string };
  /** Shapes laid over the base paint seen from above: [x, z] in the car's own measurements (see src/data/cars). */
  top: readonly LiveryLayer[];
  /** The same seen from the side: [x, y]. Used on both sides of the car. */
  side: readonly LiveryLayer[];
  /** Sponsor names and other lettering, painted over the shapes. On the wings, use the top view with the wing's own x and z. */
  texts?: readonly LiveryText[];
  /** Shapes drawn on the wings from above (stripes, checks), on top of the wing colors. */
  wingTop?: readonly LiveryLayer[];
  /** Lettering on the front and rear wing end plates (side view, in the car's x and y). */
  plateTexts?: { front?: readonly LiveryText[]; rear?: readonly LiveryText[] };
}
