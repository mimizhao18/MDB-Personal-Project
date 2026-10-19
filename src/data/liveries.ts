import type { PodStyle } from './cars/spec';
import type { EraId } from './eras';

/** A flat colored shape drawn on the car's paint: a list of [along the car, across/up] points in metres. */
export interface LiveryLayer {
  color: string;
  points: readonly (readonly [number, number])[];
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
  /** Matte paint (a few teams run it) or glossy. */
  finish: 'gloss' | 'matte';
  /** Solid colors for the wings and floor. */
  parts: { wing: string; flap: string; endplate: string; floor: string };
  /** Shapes laid over the base paint seen from above: [x, z] in the car's own measurements (see src/data/cars). */
  top: readonly LiveryLayer[];
  /** The same seen from the side: [x, y]. Used on both sides of the car. */
  side: readonly LiveryLayer[];
}

type Point = readonly [number, number];

/** A shape on the right half of the car and its mirror image on the left (for the top view). */
const both = (color: string, points: readonly Point[]): LiveryLayer[] => [
  { color, points },
  { color, points: points.map(([x, z]) => [x, -z] as const) },
];

const BLACK = '#0E0E10';
const CARBON = '#17171A';

// ---------- 2022 (ground effect): four teams ----------

const FERRARI_2022: Livery = {
  id: 'ferrari-2022',
  name: 'Ferrari',
  era: 'gen2022',
  team: 'Scuderia Ferrari',
  price: 0,
  primary: '#DC0000',
  secondary: '#FFEB00',
  sidepod: 'scoop',
  finish: 'gloss',
  parts: { wing: CARBON, flap: CARBON, endplate: CARBON, floor: CARBON },
  top: [
    // black tail of the engine cover
    { color: BLACK, points: [[-1.45, 0.2], [-1.45, -0.2], [-2.4, -0.2], [-2.4, 0.2]] },
    // the yellow badge on the engine cover
    { color: '#FFEB00', points: [[-0.82, 0.07], [-0.9, 0.0], [-0.82, -0.07], [-0.98, -0.07], [-1.06, 0.0], [-0.98, 0.07]] },
  ],
  side: [
    // black lower half of the sidepod
    { color: BLACK, points: [[0.95, 0.06], [0.95, 0.24], [0.3, 0.27], [-0.5, 0.22], [-1.3, 0.2], [-2.05, 0.2], [-2.05, 0.06]] },
  ],
};

const MERCEDES_2022: Livery = {
  id: 'mercedes-2022',
  name: 'Mercedes',
  era: 'gen2022',
  team: 'Mercedes-AMG Petronas',
  price: 50,
  primary: '#0E0E10',
  secondary: '#00D2BE',
  sidepod: 'slim',
  finish: 'matte',
  parts: { wing: '#0E0E10', flap: '#0E0E10', endplate: '#0E0E10', floor: CARBON },
  top: [
    // teal nose tip
    { color: '#00D2BE', points: [[2.24, 0.1], [2.24, -0.1], [2.6, -0.04], [2.6, 0.04]] },
    // thin teal line down the engine cover
    { color: '#00D2BE', points: [[-0.75, 0.025], [-0.75, -0.025], [-2.35, -0.025], [-2.35, 0.025]] },
    // teal edge along the outside of the (slim) sidepods
    ...both('#00D2BE', [[0.95, 0.38], [0.7, 0.46], [0.3, 0.5], [-0.2, 0.46], [-0.7, 0.38], [-1.2, 0.28], [-1.7, 0.18], [-1.7, 0.13], [-1.2, 0.23], [-0.7, 0.33], [-0.2, 0.41], [0.3, 0.45], [0.7, 0.41], [0.95, 0.33]]),
  ],
  side: [
    // thin teal line along the side
    { color: '#00D2BE', points: [[0.95, 0.3], [0.95, 0.33], [-2.0, 0.28], [-2.0, 0.25]] },
  ],
};

const MCLAREN_2022: Livery = {
  id: 'mclaren-2022',
  name: 'McLaren',
  era: 'gen2022',
  team: 'McLaren F1 Team',
  price: 100,
  primary: '#FF8000',
  secondary: '#47C7FC',
  sidepod: 'downwash',
  finish: 'gloss',
  parts: { wing: '#FF8000', flap: '#FF8000', endplate: '#FF8000', floor: CARBON },
  top: [
    // blue engine cover tail
    { color: '#47C7FC', points: [[-0.9, 0.1], [-0.9, -0.1], [-2.4, -0.1], [-2.4, 0.1]] },
    // blue sweep on the back half of the sidepods
    ...both('#47C7FC', [[-0.5, 0.64], [-1.2, 0.45], [-1.9, 0.2], [-1.9, 0.12], [-1.0, 0.24], [-0.4, 0.34]]),
  ],
  side: [
    // blue lower sidepod
    { color: '#47C7FC', points: [[0.9, 0.06], [0.9, 0.3], [0.2, 0.34], [-0.6, 0.27], [-1.3, 0.23], [-2.05, 0.22], [-2.05, 0.06]] },
  ],
};

const REDBULL_2022: Livery = {
  id: 'redbull-2022',
  name: 'Red Bull',
  era: 'gen2022',
  team: 'Oracle Red Bull Racing',
  price: 150,
  primary: '#1C2B5E',
  secondary: '#E4002B',
  glow: '#E4002B',
  sidepod: 'downwash',
  finish: 'matte',
  parts: { wing: '#1C2B5E', flap: '#E4002B', endplate: '#1C2B5E', floor: CARBON },
  top: [
    // yellow nose tip
    { color: '#FFD100', points: [[2.34, 0.08], [2.34, -0.08], [2.6, -0.03], [2.6, 0.03]] },
    // red sweep across the top of the sidepods
    ...both('#E4002B', [[0.9, 0.3], [0.7, 0.58], [0.3, 0.7], [-0.3, 0.7], [-0.9, 0.54], [-0.3, 0.5], [0.3, 0.54], [0.7, 0.4]]),
    // red stripe on the engine cover
    { color: '#E4002B', points: [[-1.0, 0.04], [-1.0, -0.04], [-2.35, -0.04], [-2.35, 0.04]] },
  ],
  side: [
    // red line low on the sidepod
    { color: '#E4002B', points: [[0.95, 0.07], [0.95, 0.15], [-2.05, 0.15], [-2.05, 0.07]] },
  ],
};

// ---------- 2026: four teams ----------
// Same teams, new cars: slimmer, with compact sidepods, so the paint shapes follow the 2026 bodywork.

const FERRARI_2026: Livery = {
  id: 'ferrari-2026',
  name: 'Ferrari',
  era: 'gen2026',
  team: 'Scuderia Ferrari HP',
  price: 100,
  primary: '#DC0000',
  secondary: '#FFFFFF',
  sidepod: 'compact',
  finish: 'gloss',
  parts: { wing: CARBON, flap: CARBON, endplate: CARBON, floor: CARBON },
  top: [
    // black tail of the engine cover
    { color: BLACK, points: [[-1.3, 0.17], [-1.3, -0.17], [-2.2, -0.17], [-2.2, 0.17]] },
    // white line down the engine cover, and a white nose cap
    { color: '#F4F4F4', points: [[-0.5, 0.025], [-0.5, -0.025], [-1.3, -0.025], [-1.3, 0.025]] },
    { color: '#F4F4F4', points: [[2.5, 0.07], [2.5, -0.07], [2.85, -0.04], [2.85, 0.04]] },
  ],
  side: [
    // black lower half of the sidepod
    { color: BLACK, points: [[0.85, 0.06], [0.85, 0.2], [0.25, 0.22], [-0.5, 0.2], [-1.3, 0.18], [-1.95, 0.18], [-1.95, 0.06]] },
  ],
};

const MERCEDES_2026: Livery = {
  id: 'mercedes-2026',
  name: 'Mercedes',
  era: 'gen2026',
  team: 'Mercedes-AMG Petronas',
  price: 150,
  primary: '#0E0E10',
  secondary: '#00D2BE',
  sidepod: 'compact',
  finish: 'matte',
  parts: { wing: '#0E0E10', flap: '#0E0E10', endplate: '#0E0E10', floor: CARBON },
  top: [
    // teal nose tip and a thin teal line down the engine cover
    { color: '#00D2BE', points: [[2.4, 0.1], [2.4, -0.1], [2.85, -0.04], [2.85, 0.04]] },
    { color: '#00D2BE', points: [[-0.75, 0.025], [-0.75, -0.025], [-2.1, -0.025], [-2.1, 0.025]] },
    // teal edge along the outside of the sidepods
    ...both('#00D2BE', [[0.85, 0.37], [0.62, 0.48], [0.25, 0.55], [-0.2, 0.55], [-0.65, 0.48], [-1.1, 0.36], [-1.55, 0.23], [-1.55, 0.18], [-1.1, 0.31], [-0.65, 0.43], [-0.2, 0.5], [0.25, 0.5], [0.62, 0.43], [0.85, 0.32]]),
  ],
  side: [{ color: '#00D2BE', points: [[0.85, 0.27], [0.85, 0.3], [-1.9, 0.25], [-1.9, 0.22]] }],
};

const MCLAREN_2026: Livery = {
  id: 'mclaren-2026',
  name: 'McLaren',
  era: 'gen2026',
  team: 'McLaren F1 Team',
  price: 200,
  primary: '#FF8000',
  secondary: '#47C7FC',
  sidepod: 'compact',
  finish: 'gloss',
  parts: { wing: '#FF8000', flap: '#47C7FC', endplate: '#FF8000', floor: CARBON },
  top: [
    // blue engine cover tail and a sweep on the back half of the sidepods
    { color: '#47C7FC', points: [[-0.8, 0.09], [-0.8, -0.09], [-2.2, -0.09], [-2.2, 0.09]] },
    ...both('#47C7FC', [[-0.4, 0.5], [-1.0, 0.38], [-1.6, 0.2], [-1.6, 0.12], [-0.9, 0.22], [-0.35, 0.3]]),
  ],
  side: [{ color: '#47C7FC', points: [[0.85, 0.06], [0.85, 0.26], [0.2, 0.3], [-0.6, 0.24], [-1.3, 0.2], [-1.95, 0.2], [-1.95, 0.06]] }],
};

const REDBULL_2026: Livery = {
  id: 'redbull-2026',
  name: 'Red Bull',
  era: 'gen2026',
  team: 'Oracle Red Bull Racing',
  price: 250,
  primary: '#1C2B5E',
  secondary: '#E4002B',
  glow: '#E4002B',
  sidepod: 'compact',
  finish: 'matte',
  parts: { wing: '#1C2B5E', flap: '#E4002B', endplate: '#1C2B5E', floor: CARBON },
  top: [
    // yellow nose cap, red sweep over the sidepods and a red stripe on the engine cover
    { color: '#FFD100', points: [[2.5, 0.07], [2.5, -0.07], [2.85, -0.03], [2.85, 0.03]] },
    ...both('#E4002B', [[0.8, 0.28], [0.62, 0.46], [0.25, 0.55], [-0.3, 0.55], [-0.8, 0.44], [-0.3, 0.4], [0.25, 0.42], [0.62, 0.34]]),
    { color: '#E4002B', points: [[-0.9, 0.04], [-0.9, -0.04], [-2.1, -0.04], [-2.1, 0.04]] },
  ],
  side: [{ color: '#E4002B', points: [[0.85, 0.15], [0.85, 0.2], [-1.95, 0.2], [-1.95, 0.15]] }],
};

/**
 * Team-neutral paint for the side-by-side comparison of the generations (not for sale): the same light grey on every
 * car, so only the shape differs.
 */
function neutral(era: 'gen2022' | 'gen2026'): Livery {
  return {
    id: `neutral-${era}`,
    name: 'Neutral',
    era,
    team: 'Comparison',
    price: 0,
    primary: '#B9BDC4',
    secondary: '#5B5F66',
    sidepod: era === 'gen2026' ? 'compact' : 'downwash',
    finish: 'gloss',
    parts: { wing: '#3A3D42', flap: '#3A3D42', endplate: '#3A3D42', floor: CARBON },
    top: [{ color: '#8E939B', points: [[-0.6, 0.03], [-0.6, -0.03], [-2.0, -0.03], [-2.0, 0.03]] }],
    side: [{ color: '#8E939B', points: [[0.8, 0.08], [0.8, 0.16], [-1.8, 0.16], [-1.8, 0.08]] }],
  };
}

export const COMPARISON_LIVERIES = { gen2022: neutral('gen2022'), gen2026: neutral('gen2026') } as const;

/**
 * Every livery, grouped by generation (oldest first). A livery is data: colors and flat shapes painted on one
 * generation's car model. Team names are the real ones; the paint is drawn from the best-known looks.
 */
export const LIVERIES: readonly Livery[] = [FERRARI_2022, MERCEDES_2022, MCLAREN_2022, REDBULL_2022, FERRARI_2026, MERCEDES_2026, MCLAREN_2026, REDBULL_2026];

export const DEFAULT_LIVERY_ID = 'ferrari-2022';

export const FREE_LIVERY_IDS: string[] = LIVERIES.filter((l) => l.price === 0).map((l) => l.id);

/** Liveries that were renamed or retired map to the closest current one, so saved profiles keep what they owned. */
export const RENAMED_LIVERY_IDS: Readonly<Record<string, string>> = {
  scarlet: 'ferrari-2022',
  cobalt: 'redbull-2022',
  papaya: 'mclaren-2022',
  emerald: 'ferrari-2022',
  obsidian: 'mercedes-2022',
};

export const MIN_CAR_NUMBER = 1;
export const MAX_CAR_NUMBER = 99;

/** The livery with this id, or the default one if the id is unknown (for example after a livery is retired). */
export function getLivery(id: string): Livery {
  return LIVERIES.find((l) => l.id === id) ?? LIVERIES[0];
}
