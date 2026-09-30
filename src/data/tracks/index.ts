import type { Track, TrackId } from '../../models/types';
import { SILVERSTONE } from './silverstone';

export const TRACKS: Record<TrackId, Track> = {
  silverstone: SILVERSTONE,
};

export const TRACK_LIST: Track[] = Object.values(TRACKS);
