import type { Track } from '../../models/types';
import {
  SILVERSTONE_PATH,
  SILVERSTONE_POINTS,
  SILVERSTONE_START_FINISH,
  SILVERSTONE_VIEWBOX,
} from './silverstoneShape';

export const SILVERSTONE: Track = {
  id: 'silverstone',
  name: 'Silverstone',
  country: 'Great Britain',
  raceLaps: 52,
  lapLengthKm: 5.891,
  lapTimeSeconds: 90, // lap record 1:27.097, rounded to the nearest 10 s
  viewBox: SILVERSTONE_VIEWBOX,
  startFinish: SILVERSTONE_START_FINISH,
  path: SILVERSTONE_PATH,
  points: SILVERSTONE_POINTS,
};
