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

// ---- 2022 McLaren ----

/** VELO with its three stacked chevrons. */
function velo(): Logo {
  const w = measure('VELO', { weight: 800 });
  // three thin arrowheads pointing forward, stacked
  const chev = (y: number) => poly([[0, y], [62, y + 13], [0, y + 26], [0, y + 18], [34, y + 13], [0, y + 8]]);
  return {
    id: 'velo',
    name: 'Velo',
    size: [w + 104, 100],
    slots: { main: '#1E1E1E', mark: '#1E1E1E' },
    shapes: [{ d: chev(12) + chev(38) + chev(64), fill: 'mark' }, text('VELO', 104, 100, 100, 'main', { weight: 800, tracking: 4 })],
  };
}

/** android in lower case and the green robot head. */
function android(): Logo {
  const o = { weight: 600 as const };
  const w = measure('android', o);
  const x = w + 40;
  return {
    id: 'android',
    name: 'Android',
    size: [x + 150, 110],
    slots: { main: '#FFFFFF', bot: '#3DDC84', eye: '#2B2D31' },
    shapes: [
      text('android', 0, 100, 100, 'main', o),
      { d: `M${x} 108A75 75 0 0 1 ${x + 150} 108Z`, fill: 'bot' },
      { d: `M${x + 30} 40L${x + 18} 18L${x + 24} 15L${x + 37} 37Z M${x + 120} 40L${x + 132} 18L${x + 126} 15L${x + 113} 37Z`, fill: 'bot' },
      { d: circle(x + 45, 78, 8) + circle(x + 105, 78, 8), fill: 'eye' },
    ],
  };
}

/** The Gulf roundel: an orange disc with GULF in blue, in a blue ring. */
const GULF: Logo = {
  id: 'gulf',
  name: 'Gulf',
  size: [100, 100],
  slots: { ring: '#003A70', disc: '#F07A1A', main: '#003A70', edge: '#FFFFFF' },
  shapes: [
    { d: circle(50, 50, 49), fill: 'edge' },
    { d: circle(50, 50, 45), fill: 'ring' },
    { d: circle(50, 50, 37), fill: 'disc' },
    { d: poly([[6, 39], [94, 39], [94, 61], [6, 61]]), fill: 'edge' },
    text('Gulf', 50, 58, 17, 'main', { weight: 900, align: 'center', slant: 8 }),
  ],
};

/** ARROW: the electronics firm's wordmark, its letters built of slanted strokes. */
const ARROW = wordmark('arrow-electronics', 'Arrow Electronics', 'ARROW', '#FFFFFF', { weight: 400, condense: 1.35, tracking: 6, outline: { color: 'main', width: 3 } });

/** webex by cisco. */
function webex(): Logo {
  const w = measure('webex', { weight: 800 });
  return {
    id: 'webex',
    name: 'Webex by Cisco',
    size: [w, 140],
    slots: { main: '#FFFFFF' },
    shapes: [text('webex', 0, 100, 100, 'main', { weight: 800 }), text('by CISCO', w / 2, 136, 28, 'main', { weight: 600, align: 'center' })],
  };
}

/** smartsheet with its small square mark. */
function smartsheet(): Logo {
  const w = measure('smartsheet', { weight: 600 });
  return {
    id: 'smartsheet',
    name: 'Smartsheet',
    size: [w + 105, 100],
    slots: { main: '#FFFFFF' },
    shapes: [{ d: rrect(0, 22, 78, 78, 6) + poly([[16, 48], [30, 48], [40, 70], [64, 30], [70, 36], [40, 86]]), fill: 'main', rule: 'evenodd' }, text('smartsheet', 105, 100, 100, 'main', { weight: 600 })],
  };
}

/** cādence (with the bar over its a). */
function cadence(): Logo {
  const w = measure('cadence', { weight: 400, tracking: 10 });
  const a = measure('c', { weight: 400 }) + 10;
  return {
    id: 'cadence',
    name: 'Cadence',
    size: [w, 100],
    slots: { main: '#FFFFFF' },
    shapes: [text('cadence', 0, 100, 100, 'main', { weight: 400, tracking: 10 }), { d: rrect(a + 6, 6, 50, 9), fill: 'main' }],
  };
}

/** OKX: letters built from squares. */
function okx(): Logo {
  const s = 20;
  const cells: [number, number][] = [
    // O: a ring of squares
    [0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2],
    // K
    [4, 0], [4, 1], [4, 2], [5, 1], [6, 0], [6, 2],
    // X
    [8, 0], [10, 0], [9, 1], [8, 2], [10, 2],
  ];
  return {
    id: 'okx',
    name: 'OKX',
    size: [11 * s, 3 * s],
    slots: { main: '#FFFFFF' },
    shapes: [{ d: cells.map(([cx, cy]) => rrect(cx * s, cy * s, s, s)).join(''), fill: 'main' }],
  };
}

/** Tezos: its tz mark and the name. */
function tezos(): Logo {
  const w = measure('Tezos', { weight: 600 });
  return {
    id: 'tezos',
    name: 'Tezos',
    size: [w + 110, 110],
    slots: { main: '#FFFFFF' },
    shapes: [
      { d: 'M12 6H78V18L46 46C70 46 84 60 84 78C84 98 68 110 48 110C30 110 18 100 16 86L30 84C32 94 38 98 48 98C60 98 70 90 70 78C70 64 60 56 44 56H32V46L62 18H12Z M30 0H44V30H30Z', fill: 'main' },
      text('Tezos', 110, 100, 90, 'main', { weight: 600 }),
    ],
  };
}

/** DeWalt: black letters on its yellow box. */
function dewalt(): Logo {
  const w = measure('DEWALT', { weight: 900, condense: 0.95 });
  return {
    id: 'dewalt',
    name: 'DeWalt',
    size: [w + 40, 130],
    slots: { box: '#FEBD17', main: '#111111' },
    shapes: [{ d: rrect(0, 0, w + 40, 130), fill: 'box' }, text('DEWALT', 20, 110, 90, 'main', { weight: 900, condense: 0.95 })],
  };
}

/** The McLaren speedmark: the swoosh over ARTURA, and on its own. */
const MCLAREN_SPEEDMARK: Logo = {
  id: 'mclaren-speedmark',
  name: 'McLaren speedmark',
  size: [100, 50],
  slots: { main: '#FF8000' },
  shapes: [{ d: 'M0 50C30 30 62 12 100 0C84 16 70 34 62 50L48 50C52 40 58 30 66 22C44 30 24 40 10 50Z', fill: 'main' }],
};

// ---- 2022 Alpine ----

/** BWT: heavy rounded capitals (dark blue, with a white edge on the Alpine). */
const BWT = wordmark('bwt', 'BWT', 'BWT', '#0A3C9E', { weight: 900, condense: 1.12, tracking: 4, outline: { color: 'edge', width: 6 }, slots: { edge: '#FFFFFF' } });

/** MAPFRE: white capitals on a red box. */
function boxed(id: string, name: string, word: string, box: string, ink: string, o: { weight?: 400 | 600 | 800 | 900; condense?: number; tracking?: number; pad?: number; r?: number } = {}): Logo {
  const pad = o.pad ?? 30;
  const w = measure(word, { weight: o.weight ?? 800, condense: o.condense, tracking: o.tracking });
  return {
    id,
    name,
    size: [w + 2 * pad, 100 + 2 * pad * 0.8],
    slots: { box, main: ink },
    shapes: [{ d: rrect(0, 0, w + 2 * pad, 100 + 2 * pad * 0.8, o.r ?? 0), fill: 'box' }, text(word, pad, 100 + pad * 0.8, 100, 'main', { weight: o.weight ?? 800, condense: o.condense, tracking: o.tracking })],
  };
}

/** Castrol: red lettering on a white rounded box, with the green and red ribbon in front. */
function castrol(): Logo {
  const w = measure('Castrol', { weight: 900, slant: 0 });
  return {
    id: 'castrol',
    name: 'Castrol',
    size: [w + 170, 150],
    slots: { box: '#FFFFFF', main: '#E2001A', green: '#009A44', red: '#E2001A' },
    shapes: [
      { d: rrect(0, 0, w + 170, 150, 22), fill: 'box' },
      { d: circle(70, 75, 52), fill: 'green' },
      { d: 'M18 64C50 52 92 50 132 58L132 88C92 80 50 82 18 94Z', fill: 'red' },
      { d: 'M18 74C50 64 92 62 132 68L132 78C92 72 50 74 18 84Z', fill: 'box' },
      text('Castrol', 140, 118, 92, 'main', { weight: 900, slant: 8 }),
    ],
  };
}

/** Alpine's A: an A whose right leg ends in an arrow. */
const ALPINE_A: Logo = {
  id: 'alpine-a',
  name: 'Alpine (A)',
  size: [120, 100],
  slots: { main: '#FFFFFF' },
  shapes: [{ d: 'M0 100L44 0H62L106 100H86L53 22L20 100Z M34 72H80L72 56H40Z M70 100L120 84L96 74Z', fill: 'main' }],
};

/** Microsoft: the four colored squares and the name. */
function microsoft(): Logo {
  const w = measure('Microsoft', { weight: 600 });
  return {
    id: 'microsoft',
    name: 'Microsoft',
    size: [w + 125, 100],
    slots: { main: '#FFFFFF', a: '#F25022', b: '#7FBA00', c: '#00A4EF', d: '#FFB900' },
    shapes: [
      { d: rrect(0, 0, 47, 47), fill: 'a' },
      { d: rrect(53, 0, 47, 47), fill: 'b' },
      { d: rrect(0, 53, 47, 47), fill: 'c' },
      { d: rrect(53, 53, 47, 47), fill: 'd' },
      text('Microsoft', 125, 92, 84, 'main', { weight: 600 }),
    ],
  };
}

/** DuPont in its oval. */
function dupont(): Logo {
  const w = measure('DUPONT', { weight: 800, slant: 0 });
  return {
    id: 'dupont',
    name: 'DuPont',
    size: [w + 70, 130],
    slots: { main: '#FFFFFF', ring: '#FFFFFF' },
    shapes: [{ d: ellipse((w + 70) / 2, 65, (w + 70) / 2 - 2, 62) + ellipse((w + 70) / 2, 65, (w + 70) / 2 - 12, 52, true), fill: 'ring' }, text('DUPONT', 35, 108, 86, 'main', { weight: 800 })],
  };
}

/** Binance: the diamond of diamonds and the name. */
function binance(): Logo {
  const w = measure('BINANCE', { weight: 800 });
  const dia = (cx: number, cy: number, r: number) => poly([[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]]);
  return {
    id: 'binance',
    name: 'Binance',
    size: [w + 120, 100],
    slots: { main: '#FFFFFF', mark: '#F3BA2F' },
    shapes: [
      { d: dia(50, 50, 14) + dia(50, 14, 14) + dia(50, 86, 14) + dia(14, 50, 12) + dia(86, 50, 12), fill: 'mark' },
      text('BINANCE', 120, 100, 100, 'main', { weight: 800 }),
    ],
  };
}

/** RENAULT E-TECH on two lines. */
const RENAULT_ETECH: Logo = {
  id: 'renault-etech',
  name: 'Renault E-Tech',
  size: [300, 210],
  slots: { main: '#FFFFFF' },
  shapes: [text('RENAULT', 150, 90, 90, 'main', { weight: 800, align: 'center', tracking: 6 }), text('E-TECH', 150, 205, 90, 'main', { weight: 800, align: 'center', tracking: 6 })],
};

// ---- 2022 Aston Martin ----

/** The Aston Martin wings: two swept wings with feather lines and the name on a bar between them. */
function astonWings(): Logo {
  const wing = 'M100 34L60 34C46 34 26 30 4 18C18 34 36 44 60 48L100 48Z';
  const mirror = (d: string) => d.replace(/(\d+(?:\.\d+)?) (\d+(?:\.\d+)?)/g, (_m, x, y) => `${200 - Number(x)} ${y}`);
  const feathers = 'M30 32L60 40L60 42L28 34Z M18 26L60 37L60 38.5L16 27.5Z';
  return {
    id: 'aston-wings',
    name: 'Aston Martin (wings)',
    size: [200, 60],
    slots: { main: '#CEDC00', ink: '#0A6E5C' },
    shapes: [
      { d: wing + mirror(wing), fill: 'main' },
      { d: feathers + mirror(feathers), fill: 'ink' },
      { d: rrect(62, 30, 76, 22, 3), fill: 'main' },
      text('ASTON MARTIN', 100, 46, 9, 'ink', { weight: 800, align: 'center', tracking: 1.5 }),
    ],
  };
}

/** crypto.com: the shield with its lion-head facets, and the name. */
function cryptoCom(): Logo {
  const w = measure('crypto.com', { weight: 600 });
  return {
    id: 'crypto-com',
    name: 'Crypto.com',
    size: [w + 110, 110],
    slots: { main: '#FFFFFF' },
    shapes: [
      { d: 'M44 0L88 25V75L44 100L0 75V25Z M44 14L12 32V68L44 86L76 68V32Z', fill: 'main', rule: 'evenodd' },
      { d: 'M44 26L64 38V52L52 70H36L24 52V38Z', fill: 'main' },
      text('crypto.com', 110, 92, 82, 'main', { weight: 600 }),
    ],
  };
}

/** Peroni Nastro Azzurro 0.0%: three lines. */
const PERONI: Logo = {
  id: 'peroni',
  name: 'Peroni Nastro Azzurro 0.0%',
  size: [300, 200],
  slots: { main: '#FFFFFF' },
  shapes: [
    text('PERONI', 150, 80, 80, 'main', { weight: 900, align: 'center', condense: 0.9, tracking: 4 }),
    text('NASTRO AZZURRO', 150, 128, 30, 'main', { weight: 600, align: 'center', tracking: 3 }),
    text('0.0%', 150, 192, 50, 'main', { weight: 800, align: 'center' }),
  ],
};

/** JCB: black letters on its yellow box. */
const JCB: Logo = boxedLogo('jcb', 'JCB', 'JCB', '#FCB813', '#111111', 900);

function boxedLogo(id: string, name: string, word: string, box: string, ink: string, weight: 400 | 600 | 800 | 900): Logo {
  const w = measure(word, { weight, condense: 1.1 });
  return { id, name, size: [w + 50, 140], slots: { box, main: ink }, shapes: [{ d: rrect(0, 0, w + 50, 140, 6), fill: 'box' }, text(word, 25, 120, 100, 'main', { weight, condense: 1.1 })] };
}

// ---- 2022 AlphaTauri ----

/** ALPHATAURI: ALPHA in a light weight and TAURI in a heavy one, run together. */
function alphatauri(): Logo {
  const a = measure('ALPHA', { weight: 400, condense: 1.1, tracking: 6 });
  const t = measure('TAURI', { weight: 900, condense: 1.05 });
  return {
    id: 'alphatauri',
    name: 'AlphaTauri',
    size: [a + 6 + t, 100],
    slots: { main: '#FFFFFF' },
    shapes: [text('ALPHA', 0, 100, 100, 'main', { weight: 400, condense: 1.1, tracking: 6 }), text('TAURI', a + 6, 100, 100, 'main', { weight: 900, condense: 1.05 })],
  };
}

/** ZIBA FOODS on two lines. */
const ZIBA: Logo = {
  id: 'ziba',
  name: 'Ziba Foods',
  size: [200, 150],
  slots: { main: '#FFFFFF' },
  shapes: [text('ZIBA', 100, 100, 100, 'main', { weight: 900, align: 'center', condense: 0.95 }), text('FOODS', 100, 146, 30, 'main', { weight: 600, align: 'center', tracking: 10 })],
};

/** Buzz with its round mark. */
function buzz(): Logo {
  const w = measure('BUZZ', { weight: 900 });
  return {
    id: 'buzz',
    name: 'Buzz',
    size: [w + 120, 100],
    slots: { main: '#FFFFFF' },
    shapes: [{ d: circle(50, 50, 48) + circle(50, 50, 30, true) + rrect(42, 0, 16, 100), fill: 'main' }, text('BUZZ', 120, 100, 100, 'main', { weight: 900 })],
  };
}

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
  velo(),
  android(),
  GULF,
  ARROW,
  webex(),
  smartsheet(),
  cadence(),
  okx(),
  tezos(),
  dewalt(),
  MCLAREN_SPEEDMARK,
  BWT,
  boxed('mapfre', 'Mapfre', 'MAPFRE', '#D81E2B', '#FFFFFF', { weight: 800, tracking: 4 }),
  castrol(),
  ALPINE_A,
  microsoft(),
  dupont(),
  binance(),
  RENAULT_ETECH,
  astonWings(),
  cryptoCom(),
  PERONI,
  JCB,
  alphatauri(),
  ZIBA,
  buzz(),
];
