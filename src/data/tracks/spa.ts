import type { Track } from '../../models/types';
import { SPA_PATH, SPA_POINTS, SPA_ROAD_WIDTH, SPA_START_FINISH, SPA_VIEWBOX } from './spaShape';

export const SPA: Track = {
  id: 'spa',
  name: 'Spa-Francorchamps',
  country: 'Belgium',
  raceLaps: 44,
  lapLengthKm: 7.004,
  lapTimeSeconds: 100, // lap record 1:44.701, rounded to the nearest 10 s
  viewBox: SPA_VIEWBOX,
  roadWidth: SPA_ROAD_WIDTH,
  startFinish: SPA_START_FINISH,
  path: SPA_PATH,
  points: SPA_POINTS,
};
