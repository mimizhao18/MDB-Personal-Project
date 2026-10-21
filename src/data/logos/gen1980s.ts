// Sponsors and marks first drawn for the 1980s cars. Simplified vector versions drawn from photos of the cars.

import { circle, measure, poly, rrect, text, wordmark } from './draw';
import type { Logo } from './types';

const W = '#FFFFFF';

/** Marlboro: the red chevron "roof" over the name (here the McLaren's white chevron on red, or red on white). */
const MARLBORO: Logo = {
  id: 'marlboro',
  name: 'Marlboro',
  size: [300, 140],
  slots: { main: '#E10600', roof: '#E10600' },
  shapes: [
    { d: 'M0 50L150 0L300 50V62L150 14L0 62Z', fill: 'roof' },
    text('Marlboro', 150, 130, 62, 'main', { weight: 800, align: 'center', tracking: 2 }),
  ],
};

/** Goodyear: GOOD and YEAR either side of the winged foot. */
function goodyear(): Logo {
  const good = measure('GOOD', { weight: 900, condense: 1.1, slant: 6 });
  const foot = 70;
  return {
    id: 'goodyear',
    name: 'Goodyear',
    size: [good * 2 + foot, 100],
    slots: { main: W },
    shapes: [
      text('GOOD', 0, 100, 100, 'main', { weight: 900, condense: 1.1, slant: 6 }),
      // the winged foot: a foot with a wing at the heel
      { d: `M${good + 6} 70L${good + 40} 62L${good + 52} 70L${good + 64} 72L${good + 64} 80L${good + 6} 80Z M${good + 10} 60L${good + 30} 40L${good + 36} 46L${good + 22} 62Z`, fill: 'main' },
      text('YEAR', good + foot, 100, 100, 'main', { weight: 900, condense: 1.1, slant: 6 }),
    ],
  };
}

/** Agip: the black six-legged dog breathing fire on a yellow square, with AGIP under it. */
const AGIP: Logo = {
  id: 'agip',
  name: 'Agip',
  size: [100, 130],
  slots: { box: '#FFD800', dog: '#111111', fire: '#E2001A', main: '#111111' },
  shapes: [
    { d: rrect(0, 0, 100, 100), fill: 'box' },
    { d: 'M14 64L30 48L64 48L74 34L84 38L80 52L78 72L72 72L70 58L62 58L62 84L56 84L56 60L48 60L46 84L40 84L40 60L32 60L26 84L20 84Z', fill: 'dog' },
    { d: 'M84 38L96 28L94 42L98 48L86 48Z', fill: 'fire' },
    text('AGIP', 50, 128, 24, 'main', { weight: 900, align: 'center', tracking: 4 }),
  ],
};

/** EniChem, the chemicals arm on the F1/87 nose. */
const ENICHEM = wordmark('enichem', 'EniChem', 'EniChem', W, { weight: 800 });

/** JPS: the gold monogram, the J, P and S interlaced in a serif style, simplified to overlapped letters. */
const JPS: Logo = {
  id: 'jps',
  name: 'John Player Special (JPS)',
  size: [150, 110],
  slots: { main: '#D4AF37' },
  shapes: [
    text('J', 18, 92, 90, 'main', { weight: 900 }),
    text('P', 46, 82, 70, 'main', { weight: 900 }),
    text('S', 78, 104, 76, 'main', { weight: 900 }),
    { d: rrect(0, 104, 150, 6), fill: 'main' },
  ],
};

/** John Player Special in a serif-like heavy face (Inter at 900 with wide tracking), gold. */
const JOHN_PLAYER = wordmark('john-player-special', 'John Player Special', 'John Player Special', '#D4AF37', { weight: 800, slant: 0 });

/** De'Longhi in its rounded outlined box. */
function delonghi(): Logo {
  const w = measure("DeLonghi", { weight: 900, size: 80 });
  return {
    id: 'delonghi',
    name: "De'Longhi",
    size: [w + 60, 120],
    slots: { main: '#0033A0', ring: '#0033A0' },
    shapes: [{ d: rrect(0, 0, w + 60, 120, 40) + rrect(8, 8, w + 44, 104, 32), fill: 'ring', rule: 'evenodd' }, text('DeLonghi', 30, 92, 80, 'main', { weight: 900 })],
  };
}

/** Camel: the camel silhouette and CAMEL in its heavy capitals. */
const CAMEL_SILHOUETTE = 'M2 96L8 60C10 50 14 44 22 40C26 34 28 26 34 24C40 22 44 28 46 34C50 30 54 24 60 26C66 28 68 38 72 44C76 50 82 50 86 42L90 30C92 24 98 20 100 26C102 30 98 36 96 42L92 60L90 96L84 96L84 66L74 66L72 96L66 96L64 64L36 64L32 96L26 96L24 66L14 66L8 96Z';
const CAMEL: Logo = {
  id: 'camel',
  name: 'Camel (name)',
  size: [330, 100],
  slots: { main: '#0033A0' },
  shapes: [text('CAMEL', 0, 100, 100, 'main', { weight: 900, condense: 1.15, tracking: 4 })],
};
const CAMEL_ANIMAL: Logo = {
  id: 'camel-animal',
  name: 'Camel (camel)',
  size: [102, 100],
  slots: { main: '#0033A0' },
  shapes: [{ d: CAMEL_SILHOUETTE, fill: 'main' }],
};

/** Canon in its red capitals. */
const CANON = wordmark('canon', 'Canon', 'Canon', '#E10600', { weight: 900, condense: 1.1 });

/** ICI: the roundel with the wave lines. */
const ICI: Logo = {
  id: 'ici',
  name: 'ICI',
  size: [100, 100],
  slots: { disc: '#0B3D91', main: W, wave: W },
  shapes: [
    { d: circle(50, 50, 49), fill: 'disc' },
    text('ICI', 50, 52, 30, 'main', { weight: 900, align: 'center', tracking: 2 }),
    { d: 'M18 66C30 60 40 72 50 66C60 60 70 72 82 66L82 70C70 76 60 64 50 70C40 76 30 64 18 70Z M22 76C32 72 42 82 50 77C60 72 68 82 78 76L78 80C68 86 60 76 50 81C42 86 32 76 22 80Z', fill: 'wave' },
  ],
};

/** Tactel, in its script-like lower case. */
const TACTEL = wordmark('tactel', 'Tactel', 'Tactel', '#0B3D91', { weight: 800, slant: 10 });

/** Honda's H in its rounded trapezoid. */
const HONDA_H: Logo = {
  id: 'honda-h',
  name: 'Honda (H)',
  size: [100, 90],
  slots: { main: W, ink: '#111111' },
  shapes: [
    { d: 'M6 4C34 0 66 0 94 4L88 80C66 88 34 88 12 80Z', fill: 'main' },
    { d: 'M20 14L32 12L36 40L64 40L68 12L80 14L74 76L62 78L64 52L36 52L38 78L26 76Z', fill: 'ink' },
  ],
};

/** benetton: the green lower case name. */
const BENETTON = wordmark('benetton', 'Benetton', 'benetton', W, { weight: 600 });

/** Sisley in its spaced capitals. */
const SISLEY = wordmark('sisley', 'Sisley', 'SISLEY', W, { weight: 900, tracking: 8, condense: 1.1 });

/** RIELLO: white letters on its red box. */
function riello(): Logo {
  const w = measure('RIELLO', { weight: 900 });
  return { id: 'riello', name: 'Riello', size: [w + 40, 130], slots: { box: '#E10600', main: W }, shapes: [{ d: rrect(0, 0, w + 40, 130, 4), fill: 'box' }, text('RIELLO', 20, 115, 100, 'main', { weight: 900 })] };
}

/** The Benetton paint strokes: a run of colored brush marks. */
const BRUSH = 'M0 30C20 0 60 -4 90 10C70 12 50 18 40 30C30 40 20 50 0 60Z';
const STROKES: Logo = {
  id: 'benetton-strokes',
  name: 'Benetton (paint strokes)',
  size: [400, 70],
  slots: { a: '#E10600', b: '#FFD800', c: '#1F7AE0', d: '#1B9E4B', e: '#8E44AD', f: '#FF7A00' },
  shapes: (['a', 'b', 'c', 'd', 'e', 'f', 'a', 'c'] as const).map((slot, i) => ({ d: BRUSH.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_m, x, y) => `${Number(x) + i * 46} ${Number(y) + (i % 2) * 6}`), fill: slot })),
};

/** Parmalat in its slanted lower case. */
const PARMALAT = wordmark('parmalat', 'Parmalat', 'parmalat', W, { weight: 800, slant: 4 });

/** Fila: the red and navy F block. */
const FILA: Logo = {
  id: 'fila',
  name: 'Fila',
  size: [100, 100],
  slots: { red: '#E10600', navy: '#1A2A6E', main: W },
  shapes: [{ d: poly([[0, 0], [100, 0], [100, 30], [40, 30], [40, 100], [0, 100]]), fill: 'navy' }, { d: poly([[40, 30], [100, 30], [100, 60], [40, 60]]), fill: 'red' }, text('FILA', 70, 90, 24, 'main', { weight: 900, align: 'center' })],
};

/** Santal in its rounded letters. */
const SANTAL = wordmark('santal', 'Santal', 'Santal', W, { weight: 900, slant: 6 });

/** The BMW M stripes: light blue, dark blue and red bars. */
const BMW_M_STRIPES: Logo = {
  id: 'bmw-m-stripes',
  name: 'BMW M (stripes)',
  size: [120, 60],
  slots: { a: '#0066B1', b: '#1C2A6E', c: '#E2001A' },
  shapes: [
    { d: poly([[10, 0], [42, 0], [32, 60], [0, 60]]), fill: 'a' },
    { d: poly([[48, 0], [80, 0], [70, 60], [38, 60]]), fill: 'b' },
    { d: poly([[86, 0], [118, 0], [108, 60], [76, 60]]), fill: 'c' },
  ],
};

export const LOGOS_1980S: readonly Logo[] = [
  MARLBORO,
  goodyear(),
  AGIP,
  ENICHEM,
  JPS,
  JOHN_PLAYER,
  delonghi(),
  CAMEL,
  CAMEL_ANIMAL,
  CANON,
  ICI,
  TACTEL,
  HONDA_H,
  BENETTON,
  SISLEY,
  riello(),
  STROKES,
  PARMALAT,
  FILA,
  SANTAL,
  BMW_M_STRIPES,
  wordmark('longines', 'Longines', 'LONGINES', W, { weight: 600, tracking: 8 }),
  wordmark('magneti-marelli', 'Magneti Marelli', 'MAGNETI MARELLI', W, { weight: 800 }),
  wordmark('digital', 'Digital', 'digital', W, { weight: 800, tracking: 4 }),
  wordmark('showa', 'Showa', 'SHOWA', W, { weight: 900, slant: 8 }),
  wordmark('tag-80s', 'TAG', 'TAG', '#111111', { weight: 900, tracking: 6 }),
  wordmark('denim', 'Denim', 'DENIM', '#111111', { weight: 900, tracking: 4 }),
  wordmark('calma', 'Calma', 'Calma', '#0B3D91', { weight: 800 }),
  wordmark('micromax', 'Micromax', 'MICROMAX', '#0033A0', { weight: 800 }),
  wordmark('lotus', 'Lotus (name)', 'LOTUS', '#0033A0', { weight: 900, tracking: 6 }),
  wordmark('flying-tigers', 'Flying Tigers', 'FLYING TIGERS', W, { weight: 900 }),
  wordmark('pirelli', 'Pirelli', 'PIRELLI', W, { weight: 900, slant: 6 }),
  wordmark('bmw-m-power', 'BMW M Power', 'BMW M POWER', '#111111', { weight: 800 }),
];
