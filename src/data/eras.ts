/** The generations of F1 car. Each has its own car model, and every livery belongs to exactly one of them. */
export type EraId = 'gen1980s' | 'gen2004' | 'gen2014' | 'gen2022' | 'gen2026';

export interface Era {
  id: EraId;
  /** Short label, for headings. */
  name: string;
  years: string;
  /** False until this era's car model is built; liveries are only listed for eras that are available. */
  available: boolean;
}

/** Oldest first. */
export const ERAS: readonly Era[] = [
  { id: 'gen1980s', name: '1980s', years: '1980-1989', available: false },
  { id: 'gen2004', name: '2004', years: '2004', available: false },
  { id: 'gen2014', name: '2014', years: '2014-2021', available: false },
  { id: 'gen2022', name: '2022', years: 'Ground effect, 2022-2025', available: true },
  { id: 'gen2026', name: '2026', years: 'Current generation', available: false },
];

export function getEra(id: EraId): Era {
  return ERAS.find((e) => e.id === id) ?? ERAS[0];
}
