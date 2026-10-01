import type { Track, TrackId } from '../../models/types';
import { MONACO } from './monaco';
import { SILVERSTONE } from './silverstone';
import { SPA } from './spa';

export const TRACKS: Record<TrackId, Track> = {
  silverstone: SILVERSTONE,
  monaco: MONACO,
  spa: SPA,
};

export const TRACK_LIST: Track[] = [SILVERSTONE, MONACO, SPA];

export function isTrackId(value: unknown): value is TrackId {
  return typeof value === 'string' && value in TRACKS;
}
