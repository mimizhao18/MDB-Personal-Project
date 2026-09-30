// Run with: node --experimental-strip-types scripts/check-rules.ts
// @ts-nocheck (plain Node script; the app's tsconfig does not know about Node or .ts import suffixes)
import assert from 'node:assert/strict';
import {
  buildSession,
  completedLaps,
  distanceKm,
  lapsToSeconds,
  levelForXp,
  levelProgress,
  xpForLevel,
  xpForSeconds,
} from '../src/logic/rewards.ts';
import { formatClock, lapProgress } from '../src/logic/lapProgress.ts';
import { positionOnTrack } from '../src/logic/trackPosition.ts';
import { formatDurationWords, LAP_OPTIONS } from '../src/logic/sessionOptions.ts';
import { lifetimeStats } from '../src/logic/stats.ts';
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

// lap progress
let p = lapProgress(track, 10, 0);
assert.deepEqual([p.completedLaps, p.currentLap, p.lapFraction, p.totalFraction, p.finished], [0, 1, 0, 0, false]);
p = lapProgress(track, 10, 45);
assert.deepEqual([p.completedLaps, p.currentLap, p.lapFraction, p.remainingSeconds], [0, 1, 0.5, 855]);
p = lapProgress(track, 10, 90);
assert.deepEqual([p.completedLaps, p.currentLap, p.lapFraction], [1, 2, 0]);
p = lapProgress(track, 10, 135);
assert.deepEqual([p.completedLaps, p.currentLap, p.lapFraction], [1, 2, 0.5]);
p = lapProgress(track, 10, 899);
assert.deepEqual([p.completedLaps, p.currentLap, p.finished], [9, 10, false]);
p = lapProgress(track, 10, 900);
assert.deepEqual([p.completedLaps, p.currentLap, p.lapFraction, p.totalFraction, p.finished], [10, 10, 1, 1, true]);
p = lapProgress(track, 10, 5000); // past the end and negative are clamped
assert.equal(p.elapsedSeconds, 900);
assert.equal(lapProgress(track, 10, -5).elapsedSeconds, 0);
assert.equal(formatClock(90), '1:30');
assert.equal(formatClock(59.2), '1:00'); // rounds up so the clock never shows 0:00 early
assert.equal(formatClock(0), '0:00');
assert.equal(formatClock(4680), '78:00');

// car position on the track
const square = { points: [[0, 0], [10, 0], [10, 10], [0, 10]] };
let pos = positionOnTrack(square, 0);
assert.deepEqual([pos.x, pos.y], [0, 0]);
pos = positionOnTrack(square, 0.125);
assert.deepEqual([pos.x, pos.y], [5, 0]);
pos = positionOnTrack(square, 0.25);
assert.deepEqual([pos.x, pos.y], [10, 0]);
pos = positionOnTrack(square, 1); // a full lap is back at the line
assert.deepEqual([pos.x, pos.y], [0, 0]);
pos = positionOnTrack(square, 1.125); // wraps
assert.deepEqual([pos.x, pos.y], [5, 0]);
const circle = { points: Array.from({ length: 360 }, (_, k) => [100 * Math.cos((k * Math.PI) / 180), 100 * Math.sin((k * Math.PI) / 180)]) };
pos = positionOnTrack(circle, 0); // at (100, 0) heading toward +y, i.e. 90 degrees
assert.ok(Math.abs(pos.angleDeg - 90) < 1.5, `angle ${pos.angleDeg}`);
pos = positionOnTrack(circle, 0.25); // at (0, 100) heading toward -x, i.e. 180 degrees
assert.ok(Math.abs(Math.abs(pos.angleDeg) - 180) < 1.5, `angle ${pos.angleDeg}`);

// duration wording and lap options
assert.equal(formatDurationWords(900), '15 min');
assert.equal(formatDurationWords(450), '7 min 30 s');
assert.equal(formatDurationWords(4680), '1 h 18 min');
assert.equal(formatDurationWords(3600), '1 h');
assert.equal(formatDurationWords(45), '45 s');
assert.ok(LAP_OPTIONS.every((n) => Number.isInteger(n) && n > 0));

// level progress
assert.deepEqual(levelProgress(0), { level: 1, xpIntoLevel: 0, xpForNextLevel: 50, fraction: 0 });
assert.deepEqual(levelProgress(25), { level: 1, xpIntoLevel: 25, xpForNextLevel: 50, fraction: 0.5 });
assert.deepEqual(levelProgress(50), { level: 2, xpIntoLevel: 0, xpForNextLevel: 150, fraction: 0 });
assert.deepEqual(levelProgress(125), { level: 2, xpIntoLevel: 75, xpForNextLevel: 150, fraction: 0.5 });

// lifetime stats
assert.deepEqual(lifetimeStats([]), { races: 0, laps: 0, distanceKm: 0, focusedSeconds: 0 });
assert.deepEqual(lifetimeStats([done, early]), { races: 2, laps: 14, distanceKm: 82.5, focusedSeconds: 1300 });

console.log('all rule checks passed');
