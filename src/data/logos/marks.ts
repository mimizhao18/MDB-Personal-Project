// Team marks: the Ferrari shield and prancing horse, the Mercedes star, the Red Bull bulls...

import type { P } from './draw';
import { circle, poly, text } from './draw';
import type { Logo } from './types';

// ---- Ferrari: the prancing horse (cavallino), and the Scuderia shield ----

/** The rearing horse facing left, in a 60 x 80 box: head up, front legs raised, tail up behind. */
export const CAVALLINO =
  'M2 22C4 17 8 12 12 9L14 3L15.5 7L17 2L18.5 8C24 9 30 15 33 24C36 29 39 34 42 38' +
  'C46 34 47 28 49 22C51 16 54 12 58 9C57 14 54 19 53 24C52 30 51 35 50 40' +
  'C51 45 51 52 48 56C47 60 47 64 47 67L46 72L47 78L40 78L41 72C41 68 40 64 38 60' +
  'C35 60 32 61 30 63L27 70L23 69L26 62C27 58 28 56 30 55' +
  'C28 51 26 48 24 46L19 47L13 52L11 58L7 58L8 54L10 51L15 46' +
  'L17 42L11 40L7 42L5 47L2 46L3 42L6 38L12 36L18 36' +
  'C19 32 17 27 14 24C11 24 8 24 6 24C4 24 2 23 2 22Z';

const SHIELD = 'M3 3H97V62C97 92 76 112 50 127C24 112 3 92 3 62Z';

export const FERRARI_SHIELD: Logo = {
  id: 'ferrari-shield',
  name: 'Ferrari (Scuderia shield)',
  size: [100, 130],
  slots: { yellow: '#FFD200', black: '#111111', green: '#009246', white: '#F4F4F4', red: '#CE2B37' },
  shapes: [
    { d: SHIELD, fill: 'yellow', stroke: { color: 'black', width: 3.5 } },
    // the Italian tricolor across the top
    { d: poly([[4.8, 4.8], [34, 4.8], [34, 16], [4.8, 16]]), fill: 'green' },
    { d: poly([[34, 4.8], [66, 4.8], [66, 16], [34, 16]]), fill: 'white' },
    { d: poly([[66, 4.8], [95.2, 4.8], [95.2, 16], [66, 16]]), fill: 'red' },
    { d: poly([[4.8, 16], [95.2, 16], [95.2, 18], [4.8, 18]]), fill: 'black' },
    // the horse, and S F below it
    { d: shift(CAVALLINO, 24, 22, 0.86), fill: 'black' },
    text('S', 30, 114, 16, 'black', { weight: 900, align: 'center' }),
    text('F', 70, 114, 16, 'black', { weight: 900, align: 'center' }),
  ],
};

/** The horse alone (the 1980s and 2004 cars carry it on its own on the nose and the cover). */
export const FERRARI_HORSE: Logo = {
  id: 'ferrari-horse',
  name: 'Ferrari (prancing horse)',
  size: [60, 80],
  slots: { main: '#111111' },
  shapes: [{ d: CAVALLINO, fill: 'main' }],
};

/** Moves and scales a path made only of absolute M L C Z commands (the hand-drawn marks here). */
function shift(d: string, dx: number, dy: number, s: number): string {
  return d.replace(/[MLC]([^MLCZ]*)/g, (all, nums: string) => {
    const v = nums.trim().split(/[\s,]+/).map(Number);
    const out = v.map((n, i) => Math.round((i % 2 === 0 ? n * s + dx : n * s + dy) * 100) / 100);
    return all[0] + out.join(' ');
  });
}

// ---- Mercedes: the three-pointed star in its ring ----

function starArms(cx: number, cy: number, r: number, inner: number): { light: string; dark: string } {
  let light = '';
  let dark = '';
  for (let k = 0; k < 3; k++) {
    const a = ((90 + k * 120) * Math.PI) / 180;
    const tip: P = [cx + r * Math.cos(a), cy - r * Math.sin(a)];
    const left: P = [cx + inner * Math.cos(a + Math.PI / 3), cy - inner * Math.sin(a + Math.PI / 3)];
    const right: P = [cx + inner * Math.cos(a - Math.PI / 3), cy - inner * Math.sin(a - Math.PI / 3)];
    // each arm is two facets meeting along its ridge: one catches the light
    light += poly([[cx, cy], left, tip]);
    dark += poly([[cx, cy], tip, right]);
  }
  return { light, dark };
}

const STAR = starArms(50, 50, 41, 7.5);

export const MERCEDES_STAR: Logo = {
  id: 'mercedes-star',
  name: 'Mercedes-Benz star',
  size: [100, 100],
  slots: { main: '#C9CDD2', shade: '#8E949B' },
  shapes: [
    { d: circle(50, 50, 48) + circle(50, 50, 42.5, true), fill: 'main' },
    { d: STAR.light, fill: 'main' },
    { d: STAR.dark, fill: 'shade' },
  ],
};

// ---- Red Bull: the charging bull, and the full logo (two bulls, the sun, the name) ----

/** One bull charging to the left, head down and horns forward, in a 100 x 60 box. */
const BULL_RAW =
  'M4 34C3 30 5 26 9 24C6 20 3 15 1 9C6 12 10 17 13 21C12 15 9 10 6 5C12 8 16 13 19 20' +
  'C23 13 30 7 40 6C52 5 64 9 76 10C82 10 86 9 89 7C92 4 94 1 98 0C100 1 99 4 96 4C94 6 92 9 91 13' +
  'C93 19 96 25 99 31L100 35L96 36C92 31 88 26 84 22C83 27 82 32 80 37L79 41L75 41C76 35 76 30 74 26' +
  'C66 28 56 28 48 27C42 32 34 38 24 44L18 47L17 44C23 39 28 34 32 30C27 31 22 33 17 35' +
  'C15 38 14 41 15 45L11 46C10 41 12 35 16 31C12 32 8 34 4 34Z';
/** One bull charging to the left, head down and horns forward, tail up, in a 100 x 60 box. */
export const BULL = shift(BULL_RAW, 0, 6, 1);

export const REDBULL_BULL: Logo = {
  id: 'redbull-bull',
  name: 'Red Bull (charging bull)',
  size: [100, 60],
  slots: { main: '#DB0A40' },
  shapes: [{ d: BULL, fill: 'main' }],
};

/** The two bulls facing each other in front of the yellow sun, with "Red Bull" under them. */
export const REDBULL: Logo = {
  id: 'redbull',
  name: 'Red Bull (bulls, sun and name)',
  size: [200, 116],
  slots: { bull: '#DB0A40', sun: '#FFC906', word: '#DB0A40' },
  shapes: [
    { d: circle(100, 38, 30), fill: 'sun' },
    // the bull on the right faces left; its mirror image on the left faces right: they meet in front of the sun
    { d: shift(BULL, 96, 12, 0.92), fill: 'bull' },
    { d: mirrorX(shift(BULL, 96, 12, 0.92), 200), fill: 'bull' },
    text('Red Bull', 100, 112, 34, 'word', { weight: 900, align: 'center', condense: 0.92 }),
  ],
};

/** A path of absolute M L C Z commands mirrored left to right within a box `width` wide. */
function mirrorX(d: string, width: number): string {
  return d.replace(/[MLC]([^MLCZ]*)/g, (all, nums: string) => {
    const v = nums.trim().split(/[\s,]+/).map(Number);
    return all[0] + v.map((n, i) => (i % 2 === 0 ? Math.round((width - n) * 100) / 100 : n)).join(' ');
  });
}

export { mirrorX, shift };

export const TEAM_MARKS: readonly Logo[] = [FERRARI_SHIELD, FERRARI_HORSE, MERCEDES_STAR, REDBULL, REDBULL_BULL];
