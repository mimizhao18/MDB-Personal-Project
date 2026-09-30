// Run with: node --experimental-strip-types scripts/check-rules.ts
// @ts-nocheck (plain Node script; the app's tsconfig does not know about Node or .ts import suffixes)
import assert from 'node:assert/strict';
import {
  buildSession,
  completedLaps,
  distanceKm,
  lapsToSeconds,
  levelForXp,
  xpForLevel,
  xpForSeconds,
} from '../src/logic/rewards.ts';
import { applySessionToStreak, daysBetween, displayedStreak } from '../src/logic/streak.ts';

const track = { id: 'silverstone', lapLengthKm: 5.891, lapTimeSeconds: 90 };

// laps <-> time
assert.equal(lapsToSeconds(track, 10), 900);
assert.equal(lapsToSeconds(track, 52), 4680);
assert.equal(completedLaps(track, 0, 10), 0);
assert.equal(completedLaps(track, 89, 10), 0);
assert.equal(completedLaps(track, 90, 10), 1);
assert.equal(completedLaps(track, 500, 10), 5);
assert.equal(completedLaps(track, 99999, 10), 10); // capped at planned
assert.equal(distanceKm(track, 10), 58.91);

// rewards: 1 XP / credit per full minute
assert.equal(xpForSeconds(59), 0);
assert.equal(xpForSeconds(60), 1);
assert.equal(xpForSeconds(900), 15);

// levels
assert.equal(levelForXp(0), 1);
assert.equal(levelForXp(49), 1);
assert.equal(levelForXp(50), 2);
assert.equal(levelForXp(199), 2);
assert.equal(levelForXp(200), 3);
assert.equal(xpForLevel(3), 200);

// finished session
const start = new Date('2026-09-30T10:00:00');
const done = buildSession({ id: 'a', track, plannedLaps: 10, focusedSeconds: 900, startedAt: start, endedAt: new Date('2026-09-30T10:15:00') });
assert.equal(done.finished, true);
assert.equal(done.completedLaps, 10);
assert.equal(done.xpEarned, 15);
assert.equal(done.creditsEarned, 15);
assert.equal(done.distanceKm, 58.91);

// ended early, mid-lap: pays for time focused, counts whole laps only
const early = buildSession({ id: 'b', track, plannedLaps: 10, focusedSeconds: 400, startedAt: start, endedAt: start });
assert.equal(early.finished, false);
assert.equal(early.completedLaps, 4);
assert.equal(early.xpEarned, 6);

// time beyond the plan is not credited
const over = buildSession({ id: 'c', track, plannedLaps: 2, focusedSeconds: 5000, startedAt: start, endedAt: start });
assert.equal(over.focusedSeconds, 180);
assert.equal(over.finished, true);

// streaks
assert.equal(daysBetween('2026-02-28', '2026-03-01'), 1);
assert.equal(daysBetween('2026-12-31', '2027-01-01'), 1);
let s = { currentStreak: 0, longestStreak: 0, lastSessionDay: null };
s = applySessionToStreak(s, '2026-09-28');
assert.deepEqual(s, { currentStreak: 1, longestStreak: 1, lastSessionDay: '2026-09-28' });
s = applySessionToStreak(s, '2026-09-28'); // same day
assert.equal(s.currentStreak, 1);
s = applySessionToStreak(s, '2026-09-29'); // next day
assert.equal(s.currentStreak, 2);
s = applySessionToStreak(s, '2026-09-30');
assert.equal(s.currentStreak, 3);
assert.equal(displayedStreak(s, '2026-10-01'), 3); // can still extend tomorrow
assert.equal(displayedStreak(s, '2026-10-02'), 0); // missed a day
s = applySessionToStreak(s, '2026-10-05'); // gap restarts, longest kept
assert.equal(s.currentStreak, 1);
assert.equal(s.longestStreak, 3);

console.log('all rule checks passed');
