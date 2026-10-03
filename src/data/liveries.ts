/** How a livery's accent color is laid over the car body. */
export type LiveryPattern = 'stripe' | 'split' | 'chevron';

export interface Livery {
  /** Stable id: saved in players' profiles, so never rename or reuse one. */
  id: string;
  name: string;
  /** Credits. 0 means owned from the start. Placeholder prices, see BACKLOG.md. */
  price: number;
  /** Main body color. */
  primary: string;
  /** Accent: pattern, helmet, wing flap, race number. */
  secondary: string;
  pattern: LiveryPattern;
}

/**
 * The cars you can buy. They are original designs (not any real team's colors or logos).
 * A livery is only data: colors plus a pattern type. The car drawing builds the look from it, so redrawing the car
 * updates every livery at once.
 */
export const LIVERIES: readonly Livery[] = [
  { id: 'scarlet', name: 'Scarlet', price: 0, primary: '#E10600', secondary: '#FFFFFF', pattern: 'stripe' },
  { id: 'cobalt', name: 'Cobalt', price: 50, primary: '#1E41FF', secondary: '#FFD800', pattern: 'chevron' },
  { id: 'papaya', name: 'Papaya', price: 100, primary: '#FF8000', secondary: '#0B1F5C', pattern: 'split' },
  { id: 'emerald', name: 'Emerald', price: 150, primary: '#0B8A3E', secondary: '#F2C94C', pattern: 'stripe' },
  { id: 'obsidian', name: 'Obsidian', price: 250, primary: '#1A1A1A', secondary: '#D4AF37', pattern: 'chevron' },
];

export const DEFAULT_LIVERY_ID = 'scarlet';

export const FREE_LIVERY_IDS: string[] = LIVERIES.filter((l) => l.price === 0).map((l) => l.id);

export const MIN_CAR_NUMBER = 1;
export const MAX_CAR_NUMBER = 99;

/** The livery with this id, or the default one if the id is unknown (for example after a livery is retired). */
export function getLivery(id: string): Livery {
  return LIVERIES.find((l) => l.id === id) ?? LIVERIES[0];
}
