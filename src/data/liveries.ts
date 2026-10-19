import type { PodStyle } from './cars/spec';
import type { EraId } from './eras';
import { CARBON } from './liveryHelpers';
import type { Livery } from './liveryTypes';
import { LIVERIES_GEN1980S } from './liveries/gen1980s';
import { LIVERIES_GEN2004 } from './liveries/gen2004';
import { LIVERIES_GEN2014 } from './liveries/gen2014';
import { LIVERIES_GEN2022 } from './liveries/gen2022';
import { LIVERIES_GEN2026 } from './liveries/gen2026';

export type { Livery, LiveryLayer, LiveryText } from './liveryTypes';

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
 * Every livery, grouped by generation (oldest first). A livery is data: colors, flat shapes and lettering painted on
 * one generation's car model. Team names, colors and sponsors follow the real cars (a personal project).
 */
export const LIVERIES: readonly Livery[] = [...LIVERIES_GEN1980S, ...LIVERIES_GEN2004, ...LIVERIES_GEN2014, ...LIVERIES_GEN2022, ...LIVERIES_GEN2026];

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
