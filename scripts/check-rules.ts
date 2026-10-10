// Run with: npm run check
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
import { formatDurationWords } from '../src/logic/sessionOptions.ts';
import { clampLaps, lapsFromMinutes, maxMinutes, minutesForLaps } from '../src/logic/raceLength.ts';
import { lifetimeStats } from '../src/logic/stats.ts';
import { buyLivery, equipLivery, ownsLivery, setCarNumber } from '../src/logic/garage.ts';
import { normalizeProfile } from '../src/logic/profileMigration.ts';
import { DEFAULT_LIVERY_ID, FREE_LIVERY_IDS, LIVERIES, MAX_CAR_NUMBER, MIN_CAR_NUMBER, getLivery } from '../src/data/liveries.ts';
import { recentDays } from '../src/logic/history.ts';
import { buildDemoData } from '../src/logic/demo.ts';
import { colors, theme } from '../src/design/tokens.ts';
import { glowHexFor, hexToRgb255 } from '../src/components/car3d/glow.ts';
import { TRACK_LIST } from '../src/data/tracks/index.ts';
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
pos = positionOnTrack(square, 0.25); // passes exactly through the traced points
assert.deepEqual([pos.x, pos.y], [10, 0]);
pos = positionOnTrack(square, 1); // a full lap is back at the line
assert.deepEqual([pos.x, pos.y], [0, 0]);
const wrapped = positionOnTrack(square, 1.25);
assert.ok(Math.abs(wrapped.x - 10) < 1e-9 && Math.abs(wrapped.y) < 1e-9);
const angleDiff = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
const circle = { points: Array.from({ length: 36 }, (_, k) => [100 * Math.cos((k * 10 * Math.PI) / 180), 100 * Math.sin((k * 10 * Math.PI) / 180)]) };
pos = positionOnTrack(circle, 0); // at (100, 0) heading toward +y, i.e. 90 degrees
assert.ok(angleDiff(pos.angleDeg, 90) < 1, `angle ${pos.angleDeg}`);
pos = positionOnTrack(circle, 0.25); // at (0, 100) heading toward -x, i.e. 180 degrees
assert.ok(angleDiff(pos.angleDeg, 180) < 1, `angle ${pos.angleDeg}`);
// between points the car stays on the circle (straight-line steps would cut inside it by ~0.4%)
pos = positionOnTrack(circle, 0.5 / 36);
assert.ok(Math.abs(Math.hypot(pos.x, pos.y) - 100) < 0.05, `radius ${Math.hypot(pos.x, pos.y)}`);
// the heading turns smoothly: no sudden jumps anywhere around the lap, even on a coarse 36-point circle
let maxJump = 0;
let prev = positionOnTrack(circle, 0).angleDeg;
for (let k = 1; k <= 4000; k++) {
  const a = positionOnTrack(circle, k / 4000).angleDeg;
  maxJump = Math.max(maxJump, angleDiff(a, prev));
  prev = a;
}
assert.ok(maxJump < 0.3, `max heading jump ${maxJump}`);

// duration wording and lap options
assert.equal(formatDurationWords(900), '15 min');
assert.equal(formatDurationWords(450), '7 min 30 s');
assert.equal(formatDurationWords(4680), '1 h 18 min');
assert.equal(formatDurationWords(3600), '1 h');
assert.equal(formatDurationWords(45), '45 s');

// race length slider: minutes snap to whole laps, and the slider never jumps back
const raceTracks = [
  { lapTimeSeconds: 90, raceLaps: 52 }, // Silverstone
  { lapTimeSeconds: 70, raceLaps: 78 }, // Monaco
  { lapTimeSeconds: 100, raceLaps: 44 }, // Spa
];
for (const t of raceTracks) {
  assert.equal(lapsFromMinutes(t, 0), 1); // never fewer than 1 lap
  assert.equal(lapsFromMinutes(t, 100000), t.raceLaps); // never more than a full race
  assert.equal(clampLaps(t, 0), 1);
  assert.equal(clampLaps(t, t.raceLaps + 10), t.raceLaps);
  assert.equal(maxMinutes(t), Math.round((t.raceLaps * t.lapTimeSeconds) / 60));
  for (let m = 1; m <= maxMinutes(t); m++) {
    const laps = lapsFromMinutes(t, m);
    assert.ok(Number.isInteger(laps) && laps >= 1 && laps <= t.raceLaps, `${m} min -> ${laps} laps`);
    // the race is within half a lap of the minutes asked for, unless clamped at the ends
    if (laps > 1 && laps < t.raceLaps) assert.ok(Math.abs(laps * t.lapTimeSeconds - m * 60) <= t.lapTimeSeconds / 2 + 1e-9, `${m} min`);
  }
  for (let laps = 1; laps <= t.raceLaps; laps++) {
    // placing the minutes slider for a lap count and reading it back gives the same laps (no jumping)
    assert.equal(lapsFromMinutes(t, minutesForLaps(t, laps)), laps, `laps ${laps} at ${t.lapTimeSeconds}s`);
  }
}
assert.equal(lapsFromMinutes(raceTracks[0], 15), 10); // 15 min at 90 s per lap = 10 laps
assert.equal(minutesForLaps(raceTracks[0], 10), 15);

// level progress
assert.deepEqual(levelProgress(0), { level: 1, xpIntoLevel: 0, xpForNextLevel: 50, fraction: 0 });
assert.deepEqual(levelProgress(25), { level: 1, xpIntoLevel: 25, xpForNextLevel: 50, fraction: 0.5 });
assert.deepEqual(levelProgress(50), { level: 2, xpIntoLevel: 0, xpForNextLevel: 150, fraction: 0 });
assert.deepEqual(levelProgress(125), { level: 2, xpIntoLevel: 75, xpForNextLevel: 150, fraction: 0.5 });

// lifetime stats
assert.deepEqual(lifetimeStats([]), { races: 0, laps: 0, distanceKm: 0, focusedSeconds: 0 });
assert.deepEqual(lifetimeStats([done, early]), { races: 2, laps: 14, distanceKm: 82.5, focusedSeconds: 1300 });

// garage (liveries)
const scarlet = { id: 'scarlet', name: 'Scarlet', price: 0 };
const cobalt = { id: 'cobalt', name: 'Cobalt', price: 50 };
const gp = { totalXp: 0, credits: 80, currentStreak: 0, longestStreak: 0, lastSessionDay: null, unlockedLiveries: ['scarlet'], car: { liveryId: 'scarlet', number: 1 } };
assert.equal(ownsLivery(gp, scarlet), true);
assert.equal(ownsLivery(gp, cobalt), false);
let g = buyLivery(gp, cobalt);
assert.equal(g.ok, true);
assert.equal(g.profile.credits, 30);
assert.deepEqual(g.profile.unlockedLiveries, ['scarlet', 'cobalt']);
assert.equal(gp.credits, 80); // original profile untouched
assert.deepEqual(buyLivery(g.profile, cobalt), { ok: false, reason: 'already-owned' });
assert.deepEqual(buyLivery({ ...gp, credits: 49 }, cobalt), { ok: false, reason: 'not-enough-credits' });
assert.deepEqual(equipLivery(gp, cobalt), { ok: false, reason: 'not-owned' });
g = equipLivery(buyLivery(gp, cobalt).profile, cobalt);
assert.equal(g.profile.car.liveryId, 'cobalt');
assert.equal(g.profile.car.number, 1); // number is kept when the livery changes
assert.equal(setCarNumber(gp, 44, 1, 99).profile.car.number, 44);
assert.equal(setCarNumber(gp, 44, 1, 99).profile.car.liveryId, 'scarlet');
assert.equal(setCarNumber(gp, 0, 1, 99).ok, false);
assert.equal(setCarNumber(gp, 100, 1, 99).ok, false);
assert.equal(setCarNumber(gp, 4.5, 1, 99).ok, false);

// the livery catalog
assert.equal(LIVERIES.length, 5);
assert.equal(new Set(LIVERIES.map((l) => l.id)).size, LIVERIES.length); // ids are unique
assert.ok(LIVERIES.every((l) => /^#[0-9A-Fa-f]{6}$/.test(l.primary) && /^#[0-9A-Fa-f]{6}$/.test(l.secondary))); // the car shades #RRGGBB colors
assert.ok(LIVERIES.every((l) => ['stripe', 'split', 'chevron'].includes(l.pattern)));
assert.ok(LIVERIES.every((l) => l.price >= 0 && Number.isInteger(l.price)));
assert.ok(LIVERIES.every((l) => l.primary.toLowerCase() !== l.secondary.toLowerCase())); // the accent must show
assert.deepEqual(FREE_LIVERY_IDS, [DEFAULT_LIVERY_ID]); // everyone starts with exactly the default
assert.equal(getLivery('scarlet').id, 'scarlet');
assert.equal(getLivery('no-such-livery').id, LIVERIES[0].id); // unknown ids still draw something

// profile migration: old saves keep progress and get a livery
const catalog = { knownIds: LIVERIES.map((l) => l.id), freeIds: FREE_LIVERY_IDS, defaultId: DEFAULT_LIVERY_ID };
const oldSave = { totalXp: 120, credits: 40, currentStreak: 3, longestStreak: 5, lastSessionDay: '2026-10-01', unlockedColors: ['red', 'white', 'blue'], car: { primaryColor: '#1E41FF', secondaryColor: '#FFFFFF', number: 44 } };
let m = normalizeProfile(oldSave, catalog, MIN_CAR_NUMBER, MAX_CAR_NUMBER);
assert.equal(m.totalXp, 120);
assert.equal(m.credits, 40);
assert.equal(m.currentStreak, 3);
assert.equal(m.longestStreak, 5);
assert.equal(m.lastSessionDay, '2026-10-01');
assert.deepEqual(m.unlockedLiveries, FREE_LIVERY_IDS);
assert.deepEqual(m.car, { liveryId: DEFAULT_LIVERY_ID, number: 44 }); // number kept, colors replaced by the default livery
assert.equal('unlockedColors' in m, false);
m = normalizeProfile({ ...oldSave, unlockedLiveries: ['cobalt', 'retired-livery'], car: { liveryId: 'cobalt', number: 7 } }, catalog, 1, 99);
assert.deepEqual(m.unlockedLiveries, ['scarlet', 'cobalt']); // unknown ids dropped, free ones always present
assert.deepEqual(m.car, { liveryId: 'cobalt', number: 7 });
m = normalizeProfile({ ...oldSave, unlockedLiveries: [], car: { liveryId: 'papaya', number: 7 } }, catalog, 1, 99);
assert.equal(m.car.liveryId, 'scarlet'); // never wear a livery that is not owned
m = normalizeProfile({ ...oldSave, car: { liveryId: 'retired-livery', number: 500 } }, catalog, 1, 99);
assert.deepEqual(m.car, { liveryId: 'scarlet', number: 1 }); // unknown livery and an out-of-range number fall back
assert.equal(normalizeProfile(null, catalog, 1, 99), null);
assert.equal(normalizeProfile('garbage', catalog, 1, 99), null);
assert.equal(normalizeProfile({ totalXp: 'lots' }, catalog, 1, 99), null);
assert.equal(normalizeProfile({ ...oldSave, car: undefined }, catalog, 1, 99).car.number, 1);

// recent days (history strip)
const mk = (endedAt, focusedSeconds) => ({ ...done, endedAt: new Date(endedAt).toISOString(), focusedSeconds });
const week = recentDays([mk('2026-09-30T10:15:00', 900), mk('2026-09-30T18:00:00', 600), mk('2026-09-28T09:00:00', 300), mk('2026-09-01T09:00:00', 999)], new Date('2026-09-30T12:00:00'), 7);
assert.equal(week.length, 7);
assert.equal(week[0].day, '2026-09-24');
assert.equal(week[6].day, '2026-09-30');
assert.equal(week[6].weekday, 3); // Wednesday
assert.deepEqual([week[6].races, week[6].focusedSeconds], [2, 1500]);
assert.deepEqual([week[4].races, week[4].focusedSeconds], [1, 300]); // Sep 28
assert.equal(week[5].races, 0);
assert.equal(week.reduce((n, d) => n + d.races, 0), 3); // the Sep 1 race is outside the window

// demo data
const demoTracks = {
  silverstone: { id: 'silverstone', lapLengthKm: 5.891, lapTimeSeconds: 90 },
  monaco: { id: 'monaco', lapLengthKm: 3.337, lapTimeSeconds: 70 },
  spa: { id: 'spa', lapLengthKm: 7.004, lapTimeSeconds: 100 },
};
const demoNow = new Date('2026-10-05T12:00:00');
const demo = buildDemoData(demoNow, demoTracks);
assert.equal(demo.sessions.length, 7);
assert.equal(demo.profile.totalXp, 191); // 9 short of level 3 (200 XP), so one 15 min race levels up
assert.equal(levelProgress(demo.profile.totalXp).level, 2);
assert.equal(levelProgress(demo.profile.totalXp + 15).level, 3);
assert.equal(demo.profile.credits, 141); // 191 earned minus the 50 spent on the Cobalt livery
assert.deepEqual(demo.profile.unlockedLiveries, ['scarlet', 'cobalt']);
assert.equal(demo.profile.car.liveryId, 'cobalt'); // wears one it owns
assert.ok(demo.profile.credits >= 100); // can afford the 100-credit Papaya live in the garage
assert.equal(demo.profile.lastSessionDay, '2026-10-04'); // yesterday, so the 5-day streak is still alive and a race today extends it
assert.equal(displayedStreak(demo.profile, '2026-10-05'), 5);
assert.deepEqual(demo.sessions.map((s) => s.finished), [true, true, true, false, true, true, true]);
assert.equal(new Set(demo.sessions.map((s) => s.id)).size, 7);
assert.ok(demo.sessions.every((s) => s.endedAt < demoNow.toISOString())); // all in the past
assert.ok(demo.sessions.every((s) => s.focusedSeconds <= s.plannedLaps * demoTracks[s.trackId].lapTimeSeconds));
assert.equal(applySessionToStreak(demo.profile, '2026-10-05').currentStreak, 6);
assert.equal(lifetimeStats(demo.sessions).races, 7);

// design values
assert.ok(theme.radius.lg <= 4, 'sharp corners: cards are nearly square');
assert.ok(theme.radius.sm <= theme.radius.md && theme.radius.md <= theme.radius.lg && theme.radius.lg < theme.radius.pill, 'radius scale is ordered');
const sp = theme.spacing;
assert.ok(sp.xs < sp.sm && sp.sm < sp.md && sp.md < sp.lg && sp.lg < sp.xl, 'spacing scale is ordered');
assert.ok(Object.values(sp).every((v) => Number.isInteger(v) && v > 0), 'spacing is whole numbers');
assert.ok(Object.values(colors).every((c) => /^#[0-9A-Fa-f]{6}$/.test(c)), 'colors are #RRGGBB (the car and the credits coin shade them)');
assert.equal(colors.accent, '#E10600'); // fixed F1 red
assert.notEqual(colors.gold.toLowerCase(), colors.accent.toLowerCase());
assert.ok(theme.type.label.textTransform === 'uppercase');

// 3D car glow follows the livery
for (const livery of LIVERIES) {
  const glow = glowHexFor(livery.primary, livery.secondary);
  assert.ok(glow === livery.primary || glow === livery.secondary);
  const [r, g, b] = hexToRgb255(glow);
  assert.ok(0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255) >= 0.1, `${livery.id} glow is visible`); // never a near-black glow
}
assert.equal(glowHexFor('#E10600', '#FFFFFF'), '#E10600'); // a red car glows red
assert.equal(glowHexFor('#1E41FF', '#FFD800'), '#1E41FF'); // a blue car glows blue
assert.equal(glowHexFor('#1A1A1A', '#D4AF37'), '#D4AF37'); // a near-black car glows in its accent (gold)
assert.deepEqual(hexToRgb255('#FF8000'), [255, 128, 0]);

// track data shown on the New Race cards
assert.equal(TRACK_LIST.length, 3);
for (const t of TRACK_LIST) {
  assert.ok(['GB', 'MC', 'BE'].includes(t.countryCode), `${t.id} has a flag`);
  assert.ok(t.name.length > 0 && t.country.length > 0);
  // the official race distance is laps x lap length (to within rounding of the published figures)
  assert.ok(Math.abs(t.raceLaps * t.lapLengthKm - t.raceDistanceKm) < 0.5, `${t.id}: ${t.raceLaps} x ${t.lapLengthKm} vs ${t.raceDistanceKm}`);
  assert.equal(t.lapTimeSeconds % 10, 0, `${t.id} lap time is a multiple of 10 s`);
  assert.equal(t.points.length, 360);
}
assert.deepEqual(TRACK_LIST.map((t) => t.countryCode), ['GB', 'MC', 'BE']);
assert.deepEqual(TRACK_LIST.map((t) => t.lapTimeSeconds), [90, 70, 100]);

console.log('all rule checks passed');
