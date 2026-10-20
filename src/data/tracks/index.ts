import type { Track, TrackId } from '../../models/types';
import { CALENDAR_TRACKS } from './calendar';
import { MONACO } from './monaco';
import { SILVERSTONE } from './silverstone';
import { SPA } from './spa';

/** The three free tracks, then the rest of the 2026 calendar in race order (each opens at a player level). */
export const TRACK_LIST: Track[] = [SILVERSTONE, SPA, MONACO, ...CALENDAR_TRACKS];

export const TRACKS = Object.fromEntries(TRACK_LIST.map((track) => [track.id, track])) as Record<TrackId, Track>;

export function isTrackId(value: unknown): value is TrackId {
  return typeof value === 'string' && value in TRACKS;
}

/** Whether a player at `level` can race on this track. */
export function isTrackUnlocked(track: Track, level: number): boolean {
  return level >= track.unlockLevel;
}
