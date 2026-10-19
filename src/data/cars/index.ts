import type { EraId } from '../eras';
import { GEN2022 } from './gen2022';
import { GEN2026 } from './gen2026';
import type { CarSpec } from './spec';

/** The measurements of the car for a generation. Generations that are not built yet use the 2022 car. */
export function specFor(era: EraId): CarSpec {
  return era === 'gen2026' ? GEN2026 : GEN2022;
}

export { GEN2022, GEN2026 };
