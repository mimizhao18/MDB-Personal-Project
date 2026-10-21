import type { CountryCode, Track, TrackId } from '../../models/types';
import { AUSTRALIA_POINTS, AUSTRALIA_ROAD_WIDTH, AUSTRALIA_START_FINISH, AUSTRALIA_VIEWBOX } from './australiaShape';
import { CHINA_POINTS, CHINA_ROAD_WIDTH, CHINA_START_FINISH, CHINA_VIEWBOX } from './chinaShape';
import { JAPAN_POINTS, JAPAN_ROAD_WIDTH, JAPAN_START_FINISH, JAPAN_VIEWBOX } from './japanShape';
import { BAHRAIN_POINTS, BAHRAIN_ROAD_WIDTH, BAHRAIN_START_FINISH, BAHRAIN_VIEWBOX } from './bahrainShape';
import { MIAMI_POINTS, MIAMI_ROAD_WIDTH, MIAMI_START_FINISH, MIAMI_VIEWBOX } from './miamiShape';
import { CANADA_POINTS, CANADA_ROAD_WIDTH, CANADA_START_FINISH, CANADA_VIEWBOX } from './canadaShape';
import { BARCELONA_POINTS, BARCELONA_ROAD_WIDTH, BARCELONA_START_FINISH, BARCELONA_VIEWBOX } from './barcelonaShape';
import { AUSTRIA_POINTS, AUSTRIA_ROAD_WIDTH, AUSTRIA_START_FINISH, AUSTRIA_VIEWBOX } from './austriaShape';
import { HUNGARY_POINTS, HUNGARY_ROAD_WIDTH, HUNGARY_START_FINISH, HUNGARY_VIEWBOX } from './hungaryShape';
import { NETHERLANDS_POINTS, NETHERLANDS_ROAD_WIDTH, NETHERLANDS_START_FINISH, NETHERLANDS_VIEWBOX } from './netherlandsShape';
import { ITALY_POINTS, ITALY_ROAD_WIDTH, ITALY_START_FINISH, ITALY_VIEWBOX } from './italyShape';
import { MADRID_POINTS, MADRID_ROAD_WIDTH, MADRID_START_FINISH, MADRID_VIEWBOX } from './madridShape';
import { AZERBAIJAN_POINTS, AZERBAIJAN_ROAD_WIDTH, AZERBAIJAN_START_FINISH, AZERBAIJAN_VIEWBOX } from './azerbaijanShape';
import { SINGAPORE_POINTS, SINGAPORE_ROAD_WIDTH, SINGAPORE_START_FINISH, SINGAPORE_VIEWBOX } from './singaporeShape';
import { UNITED_STATES_POINTS, UNITED_STATES_ROAD_WIDTH, UNITED_STATES_START_FINISH, UNITED_STATES_VIEWBOX } from './unitedStatesShape';
import { MEXICO_POINTS, MEXICO_ROAD_WIDTH, MEXICO_START_FINISH, MEXICO_VIEWBOX } from './mexicoShape';
import { BRAZIL_POINTS, BRAZIL_ROAD_WIDTH, BRAZIL_START_FINISH, BRAZIL_VIEWBOX } from './brazilShape';
import { LAS_VEGAS_POINTS, LAS_VEGAS_ROAD_WIDTH, LAS_VEGAS_START_FINISH, LAS_VEGAS_VIEWBOX } from './lasVegasShape';
import { QATAR_POINTS, QATAR_ROAD_WIDTH, QATAR_START_FINISH, QATAR_VIEWBOX } from './qatarShape';
import { ABU_DHABI_POINTS, ABU_DHABI_ROAD_WIDTH, ABU_DHABI_START_FINISH, ABU_DHABI_VIEWBOX } from './abuDhabiShape';

/** What a traced outline gives: its box, road width, start/finish line and the 360 points of the lap. */
interface Shape {
  viewBox: Track['viewBox'];
  roadWidth: number;
  startFinish: Track['startFinish'];
  points: Track['points'];
}

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

// The 2026 calendar, in race order, without the three circuits that are free (Silverstone, Spa, Monaco)
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

// Each outline is traced from the official F1 circuit graphic with tools/trace_track.py, like Silverstone, Spa and Monaco.
const CALENDAR_SHAPES: Record<string, Shape> = {
  australia: { viewBox: AUSTRALIA_VIEWBOX, roadWidth: AUSTRALIA_ROAD_WIDTH, startFinish: AUSTRALIA_START_FINISH, points: AUSTRALIA_POINTS },
  china: { viewBox: CHINA_VIEWBOX, roadWidth: CHINA_ROAD_WIDTH, startFinish: CHINA_START_FINISH, points: CHINA_POINTS },
  japan: { viewBox: JAPAN_VIEWBOX, roadWidth: JAPAN_ROAD_WIDTH, startFinish: JAPAN_START_FINISH, points: JAPAN_POINTS },
  bahrain: { viewBox: BAHRAIN_VIEWBOX, roadWidth: BAHRAIN_ROAD_WIDTH, startFinish: BAHRAIN_START_FINISH, points: BAHRAIN_POINTS },
  miami: { viewBox: MIAMI_VIEWBOX, roadWidth: MIAMI_ROAD_WIDTH, startFinish: MIAMI_START_FINISH, points: MIAMI_POINTS },
  canada: { viewBox: CANADA_VIEWBOX, roadWidth: CANADA_ROAD_WIDTH, startFinish: CANADA_START_FINISH, points: CANADA_POINTS },
  barcelona: { viewBox: BARCELONA_VIEWBOX, roadWidth: BARCELONA_ROAD_WIDTH, startFinish: BARCELONA_START_FINISH, points: BARCELONA_POINTS },
  austria: { viewBox: AUSTRIA_VIEWBOX, roadWidth: AUSTRIA_ROAD_WIDTH, startFinish: AUSTRIA_START_FINISH, points: AUSTRIA_POINTS },
  hungary: { viewBox: HUNGARY_VIEWBOX, roadWidth: HUNGARY_ROAD_WIDTH, startFinish: HUNGARY_START_FINISH, points: HUNGARY_POINTS },
  netherlands: { viewBox: NETHERLANDS_VIEWBOX, roadWidth: NETHERLANDS_ROAD_WIDTH, startFinish: NETHERLANDS_START_FINISH, points: NETHERLANDS_POINTS },
  italy: { viewBox: ITALY_VIEWBOX, roadWidth: ITALY_ROAD_WIDTH, startFinish: ITALY_START_FINISH, points: ITALY_POINTS },
  madrid: { viewBox: MADRID_VIEWBOX, roadWidth: MADRID_ROAD_WIDTH, startFinish: MADRID_START_FINISH, points: MADRID_POINTS },
  azerbaijan: { viewBox: AZERBAIJAN_VIEWBOX, roadWidth: AZERBAIJAN_ROAD_WIDTH, startFinish: AZERBAIJAN_START_FINISH, points: AZERBAIJAN_POINTS },
  singapore: { viewBox: SINGAPORE_VIEWBOX, roadWidth: SINGAPORE_ROAD_WIDTH, startFinish: SINGAPORE_START_FINISH, points: SINGAPORE_POINTS },
  'united-states': { viewBox: UNITED_STATES_VIEWBOX, roadWidth: UNITED_STATES_ROAD_WIDTH, startFinish: UNITED_STATES_START_FINISH, points: UNITED_STATES_POINTS },
  mexico: { viewBox: MEXICO_VIEWBOX, roadWidth: MEXICO_ROAD_WIDTH, startFinish: MEXICO_START_FINISH, points: MEXICO_POINTS },
  brazil: { viewBox: BRAZIL_VIEWBOX, roadWidth: BRAZIL_ROAD_WIDTH, startFinish: BRAZIL_START_FINISH, points: BRAZIL_POINTS },
  'las-vegas': { viewBox: LAS_VEGAS_VIEWBOX, roadWidth: LAS_VEGAS_ROAD_WIDTH, startFinish: LAS_VEGAS_START_FINISH, points: LAS_VEGAS_POINTS },
  qatar: { viewBox: QATAR_VIEWBOX, roadWidth: QATAR_ROAD_WIDTH, startFinish: QATAR_START_FINISH, points: QATAR_POINTS },
  'abu-dhabi': { viewBox: ABU_DHABI_VIEWBOX, roadWidth: ABU_DHABI_ROAD_WIDTH, startFinish: ABU_DHABI_START_FINISH, points: ABU_DHABI_POINTS },
};

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
