import type { PlayerProfile, Session, Track, TrackId } from '../models/types';
import { buildSession } from './rewards';
import { dayKey } from './streak';

interface DemoRace {
  daysAgo: number;
  track: TrackId;
  plannedLaps: number;
  focusedSeconds: number;
}

// A believable week: a 5-day streak ending yesterday, one race ended early, all three tracks.
// The total comes to 191 XP, 9 short of level 3, so one 15-minute race during a demo shows a level-up.
const DEMO_RACES: DemoRace[] = [
  { daysAgo: 5, track: 'silverstone', plannedLaps: 20, focusedSeconds: 1800 },
  { daysAgo: 4, track: 'monaco', plannedLaps: 32, focusedSeconds: 2240 },
  { daysAgo: 3, track: 'spa', plannedLaps: 12, focusedSeconds: 1200 },
  { daysAgo: 3, track: 'silverstone', plannedLaps: 20, focusedSeconds: 900 }, // ended early
  { daysAgo: 2, track: 'monaco', plannedLaps: 40, focusedSeconds: 2800 },
  { daysAgo: 1, track: 'spa', plannedLaps: 17, focusedSeconds: 1700 },
  { daysAgo: 1, track: 'silverstone', plannedLaps: 10, focusedSeconds: 900 },
];

const COBALT_PRICE = 50; // the demo owner has already bought the Cobalt livery

export interface DemoData {
  sessions: Session[];
  profile: PlayerProfile;
}

/** Example sessions and a matching profile, relative to `now`, for demonstrating the app. */
export function buildDemoData(now: Date, tracks: Record<TrackId, Track>): DemoData {
  const sessions = DEMO_RACES.map((race, i) => {
    const ended = new Date(now.getFullYear(), now.getMonth(), now.getDate() - race.daysAgo, 17, 30 + i * 7);
    return buildSession({
      id: `demo-${i + 1}`,
      track: tracks[race.track],
      plannedLaps: race.plannedLaps,
      focusedSeconds: race.focusedSeconds,
      startedAt: new Date(ended.getTime() - race.focusedSeconds * 1000),
      endedAt: ended,
    });
  });

  const totalXp = sessions.reduce((sum, s) => sum + s.xpEarned, 0);
  const earnedCredits = sessions.reduce((sum, s) => sum + s.creditsEarned, 0);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

  return {
    sessions,
    profile: {
      totalXp,
      credits: earnedCredits - COBALT_PRICE, // enough left to buy the 100-credit Papaya livery live
      currentStreak: 5,
      longestStreak: 7,
      lastSessionDay: dayKey(yesterday),
      unlockedLiveries: ['scarlet', 'cobalt'],
      car: { liveryId: 'cobalt', number: 1 },
    },
  };
}
