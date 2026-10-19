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

// ---------- helpers for the older generations' paint ----------

/** A rectangle seen from above, along the car from x0 to x1 and across +/- hw from the middle. */
const stripe = (x0: number, x1: number, hw: number): Point[] => [[x0, hw], [x0, -hw], [x1, -hw], [x1, hw]];
/** A band seen from the side, along the car from x0 to x1 and in height from y0 to y1. */
const flank = (x0: number, x1: number, y0: number, y1: number): Point[] => [[x0, y0], [x0, y1], [x1, y1], [x1, y0]];
/** The same band on both sidepods, seen from above: across the car from z0 to z1. */
const podBand = (color: string, x0: number, x1: number, z0: number, z1: number): LiveryLayer[] =>
  both(color, [[x0, z0], [x0, z1], [x1, z1], [x1, z0]]);

// ---------- 2014 (hybrid era, drawn as the 2018-20 cars) ----------

const FERRARI_2014: Livery = {
  id: 'ferrari-2014',
  name: 'Ferrari',
  era: 'gen2014',
  team: 'Scuderia Ferrari',
  price: 50,
  primary: '#DC0000',
  secondary: '#FFFFFF',
  sidepod: 'hybrid',
  finish: 'gloss',
  parts: { wing: CARBON, flap: CARBON, endplate: CARBON, floor: CARBON },
  top: [
    { color: BLACK, points: stripe(-1.4, -2.4, 0.17) },
    { color: '#F4F4F4', points: stripe(2.45, 2.85, 0.1) },
    ...podBand('#F4F4F4', 0.9, -0.3, 0.64, 0.7),
  ],
  side: [{ color: BLACK, points: flank(1.0, -2.1, 0.06, 0.2) }],
};

const MERCEDES_2014: Livery = {
  id: 'mercedes-2014',
  name: 'Mercedes',
  era: 'gen2014',
  team: 'Mercedes-AMG Petronas',
  price: 80,
  primary: '#B8BCC2',
  secondary: '#00D2BE',
  sidepod: 'hybrid',
  finish: 'gloss',
  parts: { wing: '#0E0E10', flap: '#0E0E10', endplate: '#0E0E10', floor: CARBON },
  top: [
    { color: BLACK, points: stripe(-0.8, -2.4, 0.2) },
    { color: '#00D2BE', points: stripe(2.3, 2.85, 0.08) },
    ...podBand('#00D2BE', 0.8, -1.2, 0.6, 0.66),
  ],
  side: [{ color: BLACK, points: flank(1.0, -2.1, 0.06, 0.22) }, { color: '#00D2BE', points: flank(1.0, -1.9, 0.3, 0.33) }],
};

const MCLAREN_2014: Livery = {
  id: 'mclaren-2014',
  name: 'McLaren',
  era: 'gen2014',
  team: 'McLaren F1 Team',
  price: 110,
  primary: '#FF8000',
  secondary: '#47C7FC',
  sidepod: 'hybrid',
  finish: 'gloss',
  parts: { wing: '#FF8000', flap: '#FF8000', endplate: '#FF8000', floor: CARBON },
  top: [
    { color: '#47C7FC', points: stripe(-0.9, -2.4, 0.1) },
    { color: '#47C7FC', points: stripe(2.4, 2.85, 0.1) },
    ...podBand('#47C7FC', -0.4, -1.5, 0.12, 0.4),
  ],
  side: [{ color: '#47C7FC', points: flank(1.0, -2.1, 0.06, 0.26) }],
};

const REDBULL_2014: Livery = {
  id: 'redbull-2014',
  name: 'Red Bull',
  era: 'gen2014',
  team: 'Aston Martin Red Bull Racing',
  price: 140,
  primary: '#1C2B5E',
  secondary: '#E4002B',
  glow: '#E4002B',
  sidepod: 'hybrid',
  finish: 'matte',
  parts: { wing: '#1C2B5E', flap: '#E4002B', endplate: '#1C2B5E', floor: CARBON },
  top: [
    { color: '#E4002B', points: stripe(2.2, 2.85, 0.1) },
    ...podBand('#E4002B', 0.9, -0.9, 0.3, 0.7),
    { color: '#E4002B', points: stripe(-1.0, -2.3, 0.05) },
  ],
  side: [{ color: '#E4002B', points: flank(1.0, -2.1, 0.08, 0.15) }],
};

// ---------- 2004 (V10 era) ----------

const FERRARI_2004: Livery = {
  id: 'ferrari-2004',
  name: 'Ferrari',
  era: 'gen2004',
  team: 'Scuderia Ferrari',
  price: 60,
  primary: '#D80000',
  secondary: '#FFFFFF',
  sidepod: 'v10',
  finish: 'gloss',
  parts: { wing: '#D80000', flap: '#F4F4F4', endplate: '#D80000', floor: CARBON },
  top: [
    { color: '#F4F4F4', points: stripe(1.9, 2.6, 0.07) },
    { color: BLACK, points: stripe(-1.3, -2.05, 0.14) },
    ...podBand('#F4F4F4', 0.8, -0.2, 0.3, 0.36),
  ],
  side: [{ color: '#F4F4F4', points: flank(0.85, -1.5, 0.2, 0.26) }],
};

const MCLAREN_2004: Livery = {
  id: 'mclaren-2004',
  name: 'McLaren',
  era: 'gen2004',
  team: 'West McLaren Mercedes',
  price: 90,
  primary: '#B9BDC4',
  secondary: '#0E0E10',
  sidepod: 'v10',
  finish: 'gloss',
  parts: { wing: '#B9BDC4', flap: BLACK, endplate: BLACK, floor: CARBON },
  top: [
    { color: BLACK, points: stripe(2.2, 2.6, 0.09) },
    { color: BLACK, points: stripe(-0.4, -2.05, 0.06) },
    ...podBand('#E10600', 0.7, 0.1, 0.5, 0.54),
  ],
  side: [{ color: BLACK, points: flank(0.85, -1.9, 0.06, 0.18) }],
};

const WILLIAMS_2004: Livery = {
  id: 'williams-2004',
  name: 'Williams',
  era: 'gen2004',
  team: 'BMW Williams F1 Team',
  price: 120,
  primary: '#1E3C8A',
  secondary: '#F2F2F2',
  sidepod: 'v10',
  finish: 'gloss',
  parts: { wing: '#1E3C8A', flap: '#F2F2F2', endplate: '#1E3C8A', floor: CARBON },
  top: [
    { color: '#F2F2F2', points: stripe(1.6, 2.6, 0.08) },
    ...podBand('#F2F2F2', 0.8, -0.4, 0.3, 0.42),
    { color: '#F2F2F2', points: stripe(-0.5, -2.0, 0.05) },
  ],
  side: [{ color: '#F2F2F2', points: flank(0.85, -1.6, 0.14, 0.22) }],
};

const RENAULT_2004: Livery = {
  id: 'renault-2004',
  name: 'Renault',
  era: 'gen2004',
  team: 'Mild Seven Renault F1',
  price: 150,
  primary: '#0F3A9A',
  secondary: '#FFD800',
  sidepod: 'v10',
  finish: 'gloss',
  parts: { wing: '#FFD800', flap: '#0F3A9A', endplate: '#FFD800', floor: CARBON },
  top: [
    { color: '#FFD800', points: stripe(1.7, 2.6, 0.1) },
    { color: '#FFD800', points: stripe(-0.5, -2.05, 0.1) },
    ...podBand('#FFD800', 0.7, -0.2, 0.34, 0.5),
  ],
  side: [{ color: '#FFD800', points: flank(0.85, -1.8, 0.06, 0.16) }],
};

// ---------- 1980s (turbo era) ----------

const FERRARI_1980S: Livery = {
  id: 'ferrari-1980s',
  name: 'Ferrari',
  era: 'gen1980s',
  team: 'Scuderia Ferrari',
  price: 30,
  primary: '#D40000',
  secondary: '#FFFFFF',
  sidepod: 'turbo',
  finish: 'gloss',
  parts: { wing: '#D40000', flap: '#D40000', endplate: '#D40000', floor: CARBON },
  top: [
    { color: '#F4F4F4', points: stripe(1.4, 2.45, 0.03) },
    { color: '#F4F4F4', points: stripe(-0.2, -2.3, 0.025) },
  ],
  side: [{ color: '#F4F4F4', points: flank(0.7, -1.9, 0.24, 0.27) }],
};

const MCLAREN_1980S: Livery = {
  id: 'mclaren-1980s',
  name: 'McLaren',
  era: 'gen1980s',
  team: 'McLaren International',
  price: 60,
  primary: '#F2F2F2',
  secondary: '#E10600',
  sidepod: 'turbo',
  finish: 'gloss',
  parts: { wing: '#E10600', flap: '#F2F2F2', endplate: '#E10600', floor: CARBON },
  top: [
    { color: '#E10600', points: stripe(0.5, 1.3, 0.23) },
    { color: '#E10600', points: stripe(-1.5, -2.3, 0.2) },
    ...podBand('#E10600', -1.2, -2.0, 0.2, 0.5),
  ],
  side: [{ color: '#E10600', points: flank(0.7, -1.9, 0.06, 0.17) }],
};

const LOTUS_1980S: Livery = {
  id: 'lotus-1980s',
  name: 'Lotus',
  era: 'gen1980s',
  team: 'John Player Special Team Lotus',
  price: 90,
  primary: '#0E0E10',
  secondary: '#D4AF37',
  sidepod: 'turbo',
  finish: 'gloss',
  parts: { wing: BLACK, flap: BLACK, endplate: '#D4AF37', floor: CARBON },
  top: [
    { color: '#D4AF37', points: stripe(2.0, 2.5, 0.07) },
    { color: '#D4AF37', points: stripe(2.4, -2.3, 0.012) },
    ...podBand('#D4AF37', 0.6, -1.2, 0.34, 0.37),
  ],
  side: [{ color: '#D4AF37', points: flank(0.7, -1.9, 0.24, 0.26) }],
};

const WILLIAMS_1980S: Livery = {
  id: 'williams-1980s',
  name: 'Williams',
  era: 'gen1980s',
  team: 'Canon Williams Honda',
  price: 120,
  primary: '#1E3C8A',
  secondary: '#F2F2F2',
  sidepod: 'turbo',
  finish: 'gloss',
  parts: { wing: '#1E3C8A', flap: '#F2F2F2', endplate: '#F2F2F2', floor: CARBON },
  top: [
    { color: '#F2F2F2', points: stripe(1.3, 2.45, 0.04) },
    ...podBand('#F2F2F2', 0.6, -0.8, 0.2, 0.34),
  ],
  side: [{ color: '#F2F2F2', points: flank(0.7, -1.9, 0.12, 0.2) }],
};


const NEUTRAL_PODS: Record<EraId, PodStyle> = { gen1980s: 'turbo', gen2004: 'v10', gen2014: 'hybrid', gen2022: 'downwash', gen2026: 'compact' };

/**
 * Team-neutral paint for the side-by-side comparison of the generations (not for sale): the same light grey on every
 * car, so only the shape differs.
 */
function neutral(era: EraId): Livery {
  return {
    id: `neutral-${era}`,
    name: 'Neutral',
    era,
    team: 'Comparison',
    price: 0,
    primary: '#B9BDC4',
    secondary: '#5B5F66',
    sidepod: NEUTRAL_PODS[era],
    finish: 'gloss',
    parts: { wing: '#3A3D42', flap: '#3A3D42', endplate: '#3A3D42', floor: CARBON },
    top: [{ color: '#8E939B', points: [[-0.6, 0.03], [-0.6, -0.03], [-2.0, -0.03], [-2.0, 0.03]] }],
    side: [{ color: '#8E939B', points: [[0.8, 0.08], [0.8, 0.16], [-1.8, 0.16], [-1.8, 0.08]] }],
  };
}

export const COMPARISON_LIVERIES: Record<EraId, Livery> = {
  gen1980s: neutral('gen1980s'),
  gen2004: neutral('gen2004'),
  gen2014: neutral('gen2014'),
  gen2022: neutral('gen2022'),
  gen2026: neutral('gen2026'),
};

/**
 * Every livery, grouped by generation (oldest first). A livery is data: colors and flat shapes painted on one
 * generation's car model. Team names are the real ones; the paint is drawn from the best-known looks.
 */
export const LIVERIES: readonly Livery[] = [
  FERRARI_1980S, MCLAREN_1980S, LOTUS_1980S, WILLIAMS_1980S,
  FERRARI_2004, MCLAREN_2004, WILLIAMS_2004, RENAULT_2004,
  FERRARI_2014, MERCEDES_2014, MCLAREN_2014, REDBULL_2014,
  FERRARI_2022, MERCEDES_2022, MCLAREN_2022, REDBULL_2022,
  FERRARI_2026, MERCEDES_2026, MCLAREN_2026, REDBULL_2026,
];

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
  return LIVERIES.find((l) => l.id === id) ?? LIVERIES.find((l) => l.id === DEFAULT_LIVERY_ID) ?? LIVERIES[0];
}
