// Sponsors with a mark of their own beside or in their name (drawn shapes plus lettering in Inter).

import { circle, ellipse, measure, poly, rrect, text, wordmark } from './draw';
import type { Logo, LogoShape } from './types';

/** "BYB" + the yellow bar standing for the I + "T". */
function bybit(): Logo {
  const o = { weight: 900 as const, condense: 1.05 };
  const byb = measure('BYB', o);
  const gap = 10;
  const barX = byb + gap;
  return {
    id: 'bybit',
    name: 'Bybit',
    size: [barX + 16 + gap + measure('T', o), 100],
    slots: { main: '#FFFFFF', bar: '#F7A600' },
    shapes: [text('BYB', 0, 100, 100, 'main', o), { d: rrect(barX, -8, 16, 108), fill: 'bar' }, text('T', barX + 16 + gap, 100, 100, 'main', o)],
  };
}

/** The TAG Heuer shield: green over red with white lettering and a white border, cut corners and a point below. */
const TAG_HEUER: Logo = {
  id: 'tag-heuer',
  name: 'TAG Heuer',
  size: [120, 80],
  slots: { green: '#00805A', red: '#E2001A', white: '#FFFFFF' },
  shapes: [
    { d: poly([[8, 2], [112, 2], [118, 10], [118, 52], [60, 78], [2, 52], [2, 10]]), fill: 'white' },
    { d: poly([[11, 7], [109, 7], [113, 12], [113, 33], [7, 33], [7, 12]]), fill: 'green' },
    { d: poly([[7, 37], [113, 37], [113, 49], [60, 72.5], [7, 49]]), fill: 'red' },
    text('TAG', 60, 29, 19, 'white', { weight: 900, align: 'center', condense: 1.25, tracking: 4 }),
    text('HEUER', 60, 55, 15, 'white', { weight: 900, align: 'center', condense: 1.05, tracking: 2 }),
  ],
};

/** Santander: the flame over its curved base, and the name. */
const SANTANDER_FLAME = 'M50 -18C72 4 80 30 66 52C68 36 60 26 50 18C55 34 45 46 37 54C27 36 32 10 50 -18Z';
const SANTANDER_BASE = 'M6 62C26 53 74 53 94 62C96 82 76 96 50 96C24 96 4 82 6 62Z';
function santander(): Logo {
  const w = measure('Santander', { weight: 600 });
  return {
    id: 'santander',
    name: 'Santander',
    size: [112 + w * 0.82, 100],
    slots: { main: '#FFFFFF', mark: '#FFFFFF' },
    shapes: [
      { d: SANTANDER_FLAME, fill: 'mark' },
      { d: SANTANDER_BASE, fill: 'mark' },
      text('Santander', 112, 94, 82, 'main', { weight: 600 }),
    ],
  };
}

/** aws in lower case with the smile arrow under it. */
const AWS: Logo = {
  id: 'aws',
  name: 'AWS',
  size: [170, 120],
  slots: { main: '#FFFFFF', smile: '#FFFFFF' },
  shapes: [
    text('aws', 85, 72, 72, 'main', { weight: 800, align: 'center' }),
    { d: 'M14 88C50 112 112 112 146 90', stroke: { color: 'smile', width: 9 } },
    { d: poly([[131, 80], [154, 85], [142, 105]]), fill: 'smile' },
  ],
};

/** Ceva: "Cev" and the triangle A. */
function ceva(): Logo {
  const w = measure('Cev', { weight: 600 });
  return {
    id: 'ceva',
    name: 'CEVA Logistics',
    size: [w + 100, 100],
    slots: { main: '#FFFFFF' },
    shapes: [
      text('C', 0, 100, 100, 'main', { weight: 600 }),
      text('ev', measure('C', { weight: 600 }) + 2, 100, 100, 'main', { weight: 600 }),
      // the A: a solid triangle with its right flank cut by a slit
      { d: poly([[w + 6, 100], [w + 52, 2], [w + 98, 100]]) + poly([[w + 60, 34], [w + 65, 26], [w + 94, 95], [w + 84, 95]]), fill: 'main', rule: 'evenodd' },
    ],
  };
}

/** Ray-Ban, the script: drawn as pen strokes. */
const RAYBAN: Logo = {
  id: 'ray-ban',
  name: 'Ray-Ban',
  size: [310, 140],
  slots: { main: '#FFFFFF' },
  shapes: [
    {
      d:
        'M30 108C34 80 38 52 46 22' +
        'M18 40C40 14 92 6 92 30C92 52 62 62 40 60' +
        'M50 60C62 78 70 98 84 106' +
        'M114 74C104 62 88 70 89 87C90 99 103 95 111 76C109 87 108 96 117 101' +
        'M126 74C121 92 130 99 142 86L148 72C142 100 136 122 120 132' +
        'M157 82L170 79' +
        'M186 106C190 78 195 48 204 16' +
        'M192 32C222 8 248 22 228 50C221 58 210 58 200 56C232 56 240 80 222 98C211 106 196 106 186 102' +
        'M262 74C252 62 238 70 239 87C240 99 253 95 260 76C258 87 257 96 266 101' +
        'M274 102C278 89 280 80 282 72C292 64 304 68 299 84L294 102',
      stroke: { color: 'main', width: 7 },
    },
  ],
};

/** Snapdragon: the red flame-in-a-disc and the name. */
function snapdragon(): Logo {
  const w = measure('Snapdragon', { weight: 600 });
  return {
    id: 'snapdragon',
    name: 'Snapdragon',
    size: [w + 120, 100],
    slots: { main: '#FFFFFF', disc: '#E2231A', flame: '#FFFFFF' },
    shapes: [
      { d: circle(48, 52, 44), fill: 'disc' },
      { d: 'M56 18C38 32 32 50 46 62C40 70 34 78 40 88C46 74 62 72 64 58C66 46 54 40 56 18Z', fill: 'flame' },
      text('Snapdragon', 110, 88, 76, 'main', { weight: 600 }),
    ],
  };
}

/** Petronas: the teal drop emblem and the wide name. */
const PETRONAS_DROP = 'M45 -22C60 3 85 30 85 58C85 83 67 100 45 100C23 100 5 83 5 58C5 30 30 3 45 -22Z';
const PETRONAS_DROP_IN = 'M45 13C54 28 67 43 67 60C67 75 57 84 45 84C33 84 23 75 23 60C23 43 36 28 45 13Z';
function petronas(withMark: boolean): Logo {
  const o = { weight: 800 as const, condense: 1.12 };
  const w = measure('PETRONAS', o);
  const x0 = withMark ? 104 : 0;
  return {
    id: withMark ? 'petronas' : 'petronas-word',
    name: withMark ? 'Petronas (emblem and name)' : 'Petronas (name)',
    size: [x0 + w, 100],
    slots: { main: '#00A19C', mark: '#00A19C', inner: '#FFFFFF' },
    shapes: [
      ...(withMark
        ? ([
            { d: PETRONAS_DROP, fill: 'mark' },
            { d: PETRONAS_DROP_IN, fill: 'inner' },
            { d: circle(45, 62, 11), fill: 'mark' },
          ] as LogoShape[])
        : []),
      text('PETRONAS', x0, 100, 100, 'main', o),
    ],
  };
}

/** INEOS: wide-spaced capitals. */
const INEOS = wordmark('ineos', 'INEOS', 'INEOS', '#FFFFFF', { weight: 600, tracking: 14, condense: 1.05 });

/** TeamViewer: the name and the blue box with the two-way arrow. */
function teamviewer(): Logo {
  const w = measure('TeamViewer', { weight: 600, size: 80 });
  return {
    id: 'teamviewer',
    name: 'TeamViewer',
    size: [w + 130, 110],
    slots: { main: '#111111', box: '#111111', arrow: '#FFFFFF' },
    shapes: [
      text('TeamViewer', 0, 95, 80, 'main', { weight: 600 }),
      { d: rrect(w + 22, 0, 108, 108, 14), fill: 'box' },
      { d: circle(w + 76, 54, 40), fill: 'arrow' },
      { d: poly([[w + 44, 54], [w + 62, 38], [w + 62, 48], [w + 90, 48], [w + 90, 38], [w + 108, 54], [w + 90, 70], [w + 90, 60], [w + 62, 60], [w + 62, 70]]), fill: 'box' },
    ],
  };
}

/** AMD and its arrow. */
function amd(): Logo {
  const o = { weight: 900 as const, condense: 1.15 };
  const w = measure('AMD', o);
  return {
    id: 'amd',
    name: 'AMD',
    size: [w + 108, 100],
    slots: { main: '#111111' },
    shapes: [
      text('AMD', 0, 100, 100, 'main', o),
      { d: poly([[w + 14, 0], [w + 108, 0], [w + 108, 94], [w + 84, 70], [w + 84, 24], [w + 38, 24]]) + poly([[w + 76, 32], [w + 76, 80], [w + 52, 104], [w + 52, 56], [w + 14, 56], [w + 38, 32]]), fill: 'main' },
    ],
  };
}

/** IWC Schaffhausen. */
const IWC: Logo = {
  id: 'iwc',
  name: 'IWC Schaffhausen',
  size: [200, 120],
  slots: { main: '#111111' },
  shapes: [text('IWC', 100, 76, 76, 'main', { weight: 600, align: 'center', tracking: 6, condense: 1.1 }), text('SCHAFFHAUSEN', 100, 112, 18, 'main', { weight: 600, align: 'center', tracking: 5 })],
};

/** CrowdStrike: the falcon and the name. */
function crowdstrike(): Logo {
  const w = measure('CROWDSTRIKE', { weight: 800 });
  return {
    id: 'crowdstrike',
    name: 'CrowdStrike',
    size: [w + 120, 100],
    slots: { main: '#111111', bird: '#E3001B' },
    shapes: [
      { d: 'M4 30C30 34 62 46 84 70C92 78 98 90 104 98C96 92 86 88 76 86C64 84 54 76 46 66C40 58 30 50 18 46C28 44 36 46 44 50C34 40 20 34 4 30Z', fill: 'bird' },
      text('CROWDSTRIKE', 118, 92, 70, 'main', { weight: 800 }),
    ],
  };
}

/** ORACLE: wide, open capitals. */
const ORACLE = wordmark('oracle', 'Oracle', 'ORACLE', '#FFFFFF', { weight: 600, condense: 1.32, tracking: 6 });

/** Mobil 1: the name with its red o, and the 1. */
function mobil1(withOne: boolean): Logo {
  const o = { weight: 800 as const };
  const m = measure('M', o);
  const ob = measure('o', o);
  const bil = measure('bil', o);
  const one = withOne ? measure(' 1', o) : 0;
  return {
    id: withOne ? 'mobil1' : 'mobil',
    name: withOne ? 'Mobil 1' : 'Mobil',
    size: [m + ob + bil + one, 100],
    slots: { main: '#FFFFFF', o: '#E5202E', one: '#E5202E' },
    shapes: [
      text('M', 0, 100, 100, 'main', o),
      text('o', m, 100, 100, 'o', o),
      text('bil', m + ob, 100, 100, 'main', o),
      ...(withOne ? [text(' 1', m + ob + bil, 100, 100, 'one', o)] : []),
    ],
  };
}

/** Esso: red letters in the blue-ringed oval. */
const ESSO: Logo = {
  id: 'esso',
  name: 'Esso',
  size: [160, 100],
  slots: { ring: '#003399', fill: '#FFFFFF', main: '#E2001A' },
  shapes: [{ d: ellipse(80, 50, 78, 48), fill: 'ring' }, { d: ellipse(80, 50, 70, 41), fill: 'fill' }, text('Esso', 80, 69, 40, 'main', { weight: 800, align: 'center', slant: 6 })],
};

/** Claro: the name with the sun rays over its o. */
function claro(): Logo {
  const w = measure('Claro', { weight: 600 });
  const ox = w - measure('o', { weight: 600 }) / 2;
  return {
    id: 'claro',
    name: 'Claro',
    size: [w + 30, 130],
    slots: { main: '#FFFFFF', rays: '#E2001A' },
    shapes: [
      text('Claro', 0, 125, 90, 'main', { weight: 600 }),
      { d: poly([[ox - 4, 2], [ox + 4, 2], [ox + 3, 22], [ox - 3, 22]]) + poly([[ox + 20, 10], [ox + 26, 15], [ox + 14, 30], [ox + 9, 26]]) + poly([[ox + 32, 32], [ox + 34, 40], [ox + 18, 42], [ox + 17, 36]]), fill: 'rays' },
    ],
  };
}

/** HRC: Honda Racing Corporation's red-and-white letters. */
const HRC = wordmark('hrc', 'Honda Racing (HRC)', 'HRC', '#FFFFFF', { weight: 900, slant: 10, condense: 1.1, outline: { color: 'edge', width: 6 }, slots: { edge: '#E2001A' } });

export const SPONSOR_LOGOS: readonly Logo[] = [
  santander(),
  AWS,
  ceva(),
  RAYBAN,
  snapdragon(),
  petronas(true),
  petronas(false),
  INEOS,
  teamviewer(),
  amd(),
  IWC,
  crowdstrike(),
  ORACLE,
  bybit(),
  TAG_HEUER,
  mobil1(true),
  mobil1(false),
  ESSO,
  claro(),
  HRC,
];
