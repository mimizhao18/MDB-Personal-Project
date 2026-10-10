import type { Track } from '../../models/types';
import {
  MONACO_PATH,
  MONACO_POINTS,
  MONACO_ROAD_WIDTH,
  MONACO_START_FINISH,
  MONACO_VIEWBOX,
} from './monacoShape';

export const MONACO: Track = {
  id: 'monaco',
  name: 'Monaco',
  country: 'Monaco',
  countryCode: 'MC',
  raceLaps: 78,
  lapLengthKm: 3.337,
  raceDistanceKm: 260.286,
  lapTimeSeconds: 70, // lap record 1:12.909, rounded to the nearest 10 s
  viewBox: MONACO_VIEWBOX,
  roadWidth: MONACO_ROAD_WIDTH,
  startFinish: MONACO_START_FINISH,
  path: MONACO_PATH,
  points: MONACO_POINTS,
};
