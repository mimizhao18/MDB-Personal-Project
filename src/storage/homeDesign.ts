import { readJson, writeJson } from './storage';

/** The Home screen layouts to choose from (Settings > Home design). */
export type HomeDesignId = 'classic' | 'ring' | 'cards' | 'poster' | 'telemetry';

export const HOME_DESIGNS: readonly { id: HomeDesignId; name: string; description: string }[] = [
  { id: 'classic', name: 'Classic', description: 'Level and credits on top, your car in the middle, a row of stats and the Start button.' },
  { id: 'ring', name: 'Ring', description: 'Your level in a progress ring at the top, the car below it, and one quiet line of stats.' },
  { id: 'cards', name: 'Cards', description: 'Everything in its own card: your car, your level, your streak and your last race.' },
  { id: 'poster', name: 'Poster', description: 'A huge level number and the car, nothing else: the most minimal layout.' },
  { id: 'telemetry', name: 'Telemetry', description: 'A race-engineer dashboard: segmented XP and a grid of stat panels.' },
];

const KEY = 'settings.homeDesign.v1';

export const isHomeDesignId = (v: unknown): v is HomeDesignId => typeof v === 'string' && HOME_DESIGNS.some((d) => d.id === v);

export const DEFAULT_HOME_DESIGN: HomeDesignId = 'classic';

export function getHomeDesign(): Promise<HomeDesignId> {
  return readJson<HomeDesignId>(KEY, DEFAULT_HOME_DESIGN, isHomeDesignId);
}

export function saveHomeDesign(id: HomeDesignId): Promise<void> {
  return writeJson(KEY, id);
}
