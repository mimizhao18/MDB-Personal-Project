import type { EraId } from '../eras';
import { GEN1980S } from './gen1980s';
import { GEN2004 } from './gen2004';
import { GEN2014 } from './gen2014';
import { GEN2022 } from './gen2022';
import { GEN2026 } from './gen2026';
import type { CarSpec } from './spec';

const SPECS: Record<EraId, CarSpec> = { gen1980s: GEN1980S, gen2004: GEN2004, gen2014: GEN2014, gen2022: GEN2022, gen2026: GEN2026 };

/** The measurements of the car for a generation. */
export function specFor(era: EraId): CarSpec {
  return SPECS[era];
}

export { GEN1980S, GEN2004, GEN2014, GEN2022, GEN2026 };
