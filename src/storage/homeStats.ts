import { readJson, writeJson } from './storage';

/** How the stats on the Home screen are shown (Settings > Home stats). */
export type HomeStatsId = 'strip' | 'line' | 'pills' | 'table' | 'highlight';

export const HOME_STATS: readonly { id: HomeStatsId; name: string; description: string }[] = [
  { id: 'strip', name: 'Strip', description: 'One thin row of four figures with small labels, divided by hairlines.' },
  { id: 'line', name: 'Line', description: 'A single quiet line of text: "5 day streak · 7 races · 679 km".' },
  { id: 'pills', name: 'Pills', description: 'Small rounded tags in a row, one for each stat.' },
  { id: 'table', name: 'Table', description: 'Two columns of label and value, no boxes. Compact but shows everything.' },
  { id: 'highlight', name: 'Highlight', description: 'Your streak as a big number on the left, the other stats small beside it.' },
];

const KEY = 'settings.homeStats.v1';

export const isHomeStatsId = (v: unknown): v is HomeStatsId => typeof v === 'string' && HOME_STATS.some((d) => d.id === v);

export const DEFAULT_HOME_STATS: HomeStatsId = 'line';

export function getHomeStats(): Promise<HomeStatsId> {
  return readJson<HomeStatsId>(KEY, DEFAULT_HOME_STATS, isHomeStatsId);
}

export function saveHomeStats(id: HomeStatsId): Promise<void> {
  return writeJson(KEY, id);
}
