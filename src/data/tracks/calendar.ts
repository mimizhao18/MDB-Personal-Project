import type { CountryCode, Track, TrackId } from '../../models/types';
import { CALENDAR_SHAPES } from './calendarShapes';

/** The facts about a circuit that the outline does not carry. */
interface Facts {
  id: TrackId;
  name: string;
  country: string;
  countryCode: CountryCode;
  /** Laps in the 2026 Grand Prix. */
  raceLaps: number;
  lapLengthKm: number;
  /** Seconds one lap takes in the app: the lap record rounded to the nearest 10 s. */
  lapTimeSeconds: number;
}

// The 2026 calendar, in race order, without the three circuits that are free and hand-traced (Silverstone, Spa, Monaco)
// and without Jeddah, which is left out for now.
// Lap lengths and race laps are the published 2026 figures; lap records are the official ones (Madring is new, so its time is an estimate).
const FACTS: readonly Facts[] = [
  { id: 'australia', name: 'Albert Park', country: 'Australia', countryCode: 'AU', raceLaps: 58, lapLengthKm: 5.278, lapTimeSeconds: 80 }, // 1:19.813
  { id: 'china', name: 'Shanghai', country: 'China', countryCode: 'CN', raceLaps: 56, lapLengthKm: 5.451, lapTimeSeconds: 90 }, // 1:32.238
  { id: 'japan', name: 'Suzuka', country: 'Japan', countryCode: 'JP', raceLaps: 53, lapLengthKm: 5.807, lapTimeSeconds: 90 }, // 1:30.983
  { id: 'bahrain', name: 'Bahrain', country: 'Bahrain', countryCode: 'BH', raceLaps: 57, lapLengthKm: 5.412, lapTimeSeconds: 90 }, // 1:31.447
  { id: 'miami', name: 'Miami', country: 'United States', countryCode: 'US', raceLaps: 57, lapLengthKm: 5.412, lapTimeSeconds: 90 }, // 1:29.708
  { id: 'canada', name: 'Montreal', country: 'Canada', countryCode: 'CA', raceLaps: 70, lapLengthKm: 4.361, lapTimeSeconds: 70 }, // 1:13.078
  { id: 'barcelona', name: 'Barcelona-Catalunya', country: 'Spain', countryCode: 'ES', raceLaps: 66, lapLengthKm: 4.657, lapTimeSeconds: 80 }, // 1:16.330
  { id: 'austria', name: 'Red Bull Ring', country: 'Austria', countryCode: 'AT', raceLaps: 71, lapLengthKm: 4.318, lapTimeSeconds: 70 }, // 1:05.619
  { id: 'hungary', name: 'Hungaroring', country: 'Hungary', countryCode: 'HU', raceLaps: 70, lapLengthKm: 4.381, lapTimeSeconds: 80 }, // 1:16.627
  { id: 'netherlands', name: 'Zandvoort', country: 'Netherlands', countryCode: 'NL', raceLaps: 72, lapLengthKm: 4.259, lapTimeSeconds: 70 }, // 1:11.097
  { id: 'italy', name: 'Monza', country: 'Italy', countryCode: 'IT', raceLaps: 53, lapLengthKm: 5.793, lapTimeSeconds: 80 }, // 1:21.046
  { id: 'madrid', name: 'Madring', country: 'Spain', countryCode: 'ES', raceLaps: 56, lapLengthKm: 5.474, lapTimeSeconds: 90 }, // new in 2026: estimate
  { id: 'azerbaijan', name: 'Baku', country: 'Azerbaijan', countryCode: 'AZ', raceLaps: 51, lapLengthKm: 6.003, lapTimeSeconds: 100 }, // 1:43.009
  { id: 'singapore', name: 'Marina Bay', country: 'Singapore', countryCode: 'SG', raceLaps: 62, lapLengthKm: 4.94, lapTimeSeconds: 100 }, // 1:35.867
  { id: 'united-states', name: 'Austin', country: 'United States', countryCode: 'US', raceLaps: 56, lapLengthKm: 5.513, lapTimeSeconds: 100 }, // 1:36.169
  { id: 'mexico', name: 'Mexico City', country: 'Mexico', countryCode: 'MX', raceLaps: 71, lapLengthKm: 4.304, lapTimeSeconds: 80 }, // 1:17.774
  { id: 'brazil', name: 'Interlagos', country: 'Brazil', countryCode: 'BR', raceLaps: 71, lapLengthKm: 4.309, lapTimeSeconds: 70 }, // 1:10.540
  { id: 'las-vegas', name: 'Las Vegas', country: 'United States', countryCode: 'US', raceLaps: 50, lapLengthKm: 6.201, lapTimeSeconds: 100 }, // 1:35.490
  { id: 'qatar', name: 'Lusail', country: 'Qatar', countryCode: 'QA', raceLaps: 57, lapLengthKm: 5.419, lapTimeSeconds: 80 }, // 1:24.319
  { id: 'abu-dhabi', name: 'Yas Marina', country: 'United Arab Emirates', countryCode: 'AE', raceLaps: 58, lapLengthKm: 5.281, lapTimeSeconds: 90 }, // 1:26.103
];

/**
 * The player level you need before each of these tracks opens, in the order above: the season, race by race, two tracks
 * to a level. (Level 2 is 50 XP, level 5 is 800 XP, level 10 is 4050 XP, level 12 is 6050 XP.)
 */
const UNLOCK_LEVEL: readonly number[] = [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 12];

const pathFromPoints = (points: readonly (readonly [number, number])[]) => `M${points.map(([x, y]) => `${x} ${y}`).join(' L')}`;

function toTrack(facts: Facts, unlockLevel: number): Track {
  const shape = CALENDAR_SHAPES[facts.id];
  return {
    id: facts.id,
    name: facts.name,
    country: facts.country,
    countryCode: facts.countryCode,
    raceLaps: facts.raceLaps,
    lapLengthKm: facts.lapLengthKm,
    raceDistanceKm: Math.round(facts.raceLaps * facts.lapLengthKm * 1000) / 1000,
    lapTimeSeconds: facts.lapTimeSeconds,
    unlockLevel,
    viewBox: shape.viewBox,
    roadWidth: shape.roadWidth,
    startFinish: shape.startFinish,
    path: pathFromPoints(shape.points),
    points: shape.points,
  };
}

/** The tracks that have to be unlocked by reaching a level, in the order they open. */
export const CALENDAR_TRACKS: readonly Track[] = FACTS.map((facts, i) => toTrack(facts, UNLOCK_LEVEL[i]));
