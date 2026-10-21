// Sponsors first drawn for the 2022 Alfa Romeo, Haas and Williams (the earlier 2022 teams are in sponsors.ts and
// wordmarks.ts). Simplified vector versions drawn from photos of the cars.

import { circle, measure, poly, rrect, text, wordmark } from './draw';
import type { Logo } from './types';

const W = '#FFFFFF';

// ---- Alfa Romeo ----

/** ORLEN: the red eagle-head arch and the name. */
function orlen(): Logo {
  const w = measure('ORLEN', { weight: 800 });
  return {
    id: 'orlen',
    name: 'Orlen',
    size: [w + 125, 100],
    slots: { main: '#E31E24', mark: '#E31E24' },
    shapes: [
      { d: 'M0 100C0 42 32 6 74 6L104 6L94 30L74 30C48 30 30 60 28 100Z M58 48L86 48L80 100L54 100Z', fill: 'mark' },
      text('ORLEN', 125, 100, 100, 'main', { weight: 800 }),
    ],
  };
}

/** Alfa Romeo, the script on the engine cover: pen strokes. */
const ALFA_SCRIPT: Logo = {
  id: 'alfa-romeo-script',
  name: 'Alfa Romeo (script)',
  size: [400, 112],
  slots: { main: W },
  shapes: [
    {
      d:
        'M10 100C25 60 40 30 50 10C55 40 60 70 70 100M28 70C40 66 55 66 64 68' +
        'M80 100C84 70 88 40 92 12' +
        'M110 100C112 60 116 30 126 12C130 8 136 12 132 20M100 58L128 56' +
        'M150 72C140 60 128 68 130 86C131 98 142 94 148 76C147 88 147 96 154 100' +
        'M190 100C194 70 198 40 204 12M196 24C226 4 248 20 232 44C224 54 212 56 202 54M210 56C222 72 230 92 244 100' +
        'M268 74C254 72 252 98 266 100C280 102 282 76 268 74Z' +
        'M292 100L298 72C304 66 312 68 310 80L306 100M310 80C316 66 326 68 324 82L320 100' +
        'M338 88C350 86 356 76 348 72C336 70 330 92 340 100C346 102 352 98 356 94' +
        'M378 74C364 72 362 98 376 100C390 102 392 76 378 74Z',
      stroke: { color: 'main', width: 8 },
    },
  ],
};

/** The quadrifoglio: a green four-leaf clover in a white triangle. */
const QUADRIFOGLIO: Logo = {
  id: 'quadrifoglio',
  name: 'Alfa Romeo (quadrifoglio)',
  size: [100, 90],
  slots: { tri: W, leaf: '#00843D' },
  shapes: [
    { d: 'M50 0L100 88L0 88Z', fill: 'tri' },
    { d: circle(50, 40, 11) + circle(38, 54, 11) + circle(62, 54, 11) + circle(50, 66, 11), fill: 'leaf' },
  ],
};

/** CAMOZZI with its double-chevron mark over it. */
function camozzi(): Logo {
  const w = measure('CAMOZZI', { weight: 800 });
  return {
    id: 'camozzi',
    name: 'Camozzi',
    size: [w, 150],
    slots: { main: '#1E1E1E', mark: '#E31E24' },
    shapes: [
      { d: poly([[w / 2 - 40, 0], [w / 2, 30], [w / 2 + 40, 0], [w / 2 + 40, 14], [w / 2, 44], [w / 2 - 40, 14]]), fill: 'mark' },
      text('CAMOZZI', 0, 150, 100, 'main', { weight: 800 }),
    ],
  };
}

// ---- Haas ----

/** HAAS: heavy red capitals with the slanted cut through them, as on the VF-22. */
function haas(): Logo {
  const o = { weight: 900 as const, condense: 1.1, tracking: 4 };
  const w = measure('HAAS', o);
  return {
    id: 'haas',
    name: 'Haas',
    size: [w, 100],
    slots: { main: '#E10600', cut: '#FFFFFF' },
    shapes: [
      text('HAAS', 0, 100, 100, 'main', { ...o, slant: 16 }),
      // the speed cut through the letters, in the body color when a livery gives one
      { d: poly([[-10, 52], [w + 30, 40], [w + 30, 48], [-10, 60]]), fill: 'cut', when: 'cut' },
    ],
  };
}

/** 1&1 in its blue box. */
const ONE_AND_ONE: Logo = {
  id: '1and1',
  name: '1&1',
  size: [200, 120],
  slots: { box: '#003D8F', main: W },
  shapes: [{ d: rrect(0, 0, 200, 120, 10), fill: 'box' }, text('1&1', 100, 95, 72, 'main', { weight: 900, align: 'center' })],
};

/** Haas Automation's tooling line, red capitals. */
const HAAS_TOOLING = wordmark('haas-tooling', 'Haas Tooling', 'HAAS TOOLING', '#E10600', { weight: 900, tracking: 5 });

// ---- Williams ----

/** The Williams W: two interlocked chevrons. */
const WILLIAMS_W: Logo = {
  id: 'williams-w',
  name: 'Williams (W)',
  size: [120, 80],
  slots: { main: W, inner: '#00A3E0' },
  shapes: [
    { d: 'M0 0H22L40 54L60 0H80L58 80H42L20 18H18Z M60 0H82L100 54L102 48L120 0H120L98 80H82Z', fill: 'main' },
    { d: 'M44 64L60 18L76 64L72 76L60 40L48 76Z', fill: 'inner' },
  ],
};

/** DURACELL: black letters with the copper top, here simplified to the name over a copper bar. */
function duracell(): Logo {
  const w = measure('DURACELL', { weight: 900 });
  return {
    id: 'duracell',
    name: 'Duracell',
    size: [w, 128],
    slots: { main: W, copper: '#C8742A' },
    shapes: [text('DURACELL', 0, 100, 100, 'main', { weight: 900 }), { d: rrect(0, 112, w * 0.35, 16), fill: 'copper' }],
  };
}

export const LOGOS_2022: readonly Logo[] = [
  orlen(),
  ALFA_SCRIPT,
  QUADRIFOGLIO,
  camozzi(),
  wordmark('path', 'Path', 'PATH', W, { weight: 600, tracking: 14 }),
  wordmark('accelleron', 'Accelleron', 'Accelleron', W, { weight: 800 }),
  wordmark('adler', 'Adler Pelzer Group', 'ADLER', W, { weight: 900, tracking: 4 }),
  wordmark('singha', 'Singha', 'SINGHA', W, { weight: 800, tracking: 4 }),
  wordmark('tonale', 'Alfa Romeo Tonale', 'Tonale', W, { weight: 600, slant: 14 }),
  wordmark('web-eyewear', 'Web Eyewear', 'WEB', W, { weight: 900, tracking: 4 }),
  wordmark('cielo', 'Cielo', 'cielo', W, { weight: 800 }),
  haas(),
  ONE_AND_ONE,
  HAAS_TOOLING,
  wordmark('ionos', 'IONOS', 'IONOS', '#003D8F', { weight: 900 }),
  wordmark('transfermate', 'TransferMate', 'TransferMate', '#111111', { weight: 800 }),
  WILLIAMS_W,
  duracell(),
  wordmark('dorilton', 'Dorilton Capital', 'DORILTON', W, { weight: 600, tracking: 10 }),
  wordmark('lavazza', 'Lavazza', 'LAVAZZA', W, { weight: 900, tracking: 3 }),
  wordmark('bang-olufsen', 'Bang & Olufsen', 'BANG & OLUFSEN', W, { weight: 400, tracking: 6 }),
  wordmark('acronis', 'Acronis', 'Acronis', W, { weight: 800 }),
  wordmark('fuzion', 'FuZion', 'FUZION', W, { weight: 800 }),
  wordmark('zeiss', 'Zeiss', 'ZEISS', W, { weight: 900 }),
  wordmark('ducati', 'Ducati', 'DUCATI', W, { weight: 900, slant: 10 }),
  wordmark('williams', 'Williams (name)', 'WILLIAMS', W, { weight: 600, tracking: 10 }),
  wordmark('williams-racing', 'Williams Racing', 'WILLIAMS RACING', W, { weight: 800, tracking: 8 }),
];
