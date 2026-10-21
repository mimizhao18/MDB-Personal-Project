// The 42 liveries exactly as they were before the vector paint engine (tag pre-livery-detail), frozen here so the
// rule checks can prove the engine still paints them pixel for pixel as before (see legacy-hashes.json), whatever
// later happens to the real liveries. Not part of the app.
import type { Livery } from '../../../src/data/liveryTypes';
import { LIVERIES_GEN1980S } from './gen1980s';
import { LIVERIES_GEN2004 } from './gen2004';
import { LIVERIES_GEN2014 } from './gen2014';
import { LIVERIES_GEN2022 } from './gen2022';
import { LIVERIES_GEN2026 } from './gen2026';

const ferrari = LIVERIES_GEN2022[0];
/** One more, for the old 5 x 7 pixel font, which no livery used any more: the Ferrari with every text in it. */
const PIXEL: Livery = { ...ferrari, id: 'legacy-pixel', texts: ferrari.texts?.map((t) => ({ ...t, font: 'pixel' as const })), plateTexts: { front: ferrari.plateTexts?.front?.map((t) => ({ ...t, font: 'pixel' as const })) } };

export const LEGACY_LIVERIES: readonly Livery[] = [...LIVERIES_GEN1980S, ...LIVERIES_GEN2004, ...LIVERIES_GEN2014, ...LIVERIES_GEN2022, ...LIVERIES_GEN2026, PIXEL];
