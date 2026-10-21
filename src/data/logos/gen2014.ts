// Sponsors and marks first drawn for the 2014 cars. Simplified vector versions drawn from photos of the cars.

import { circle, ellipse, measure, poly, rrect, text, wordmark } from './draw';
import type { Logo } from './types';

const W = '#FFFFFF';

/** UPS: the brown shield with the gold letters. */
const UPS: Logo = {
  id: 'ups',
  name: 'UPS',
  size: [90, 100],
  slots: { shield: '#5A3A1E', main: '#FFB500' },
  shapes: [
    { d: 'M2 10C28 2 62 2 88 10V54C88 76 66 90 45 98C24 90 2 76 2 54Z', fill: 'shield', stroke: { color: 'main', width: 2 } },
    text('ups', 45, 66, 34, 'main', { weight: 800, align: 'center' }),
  ],
};

/** Fiat: the 2007 badge, a red rounded square with FIAT in chrome letters. */
const FIAT: Logo = {
  id: 'fiat',
  name: 'Fiat',
  size: [160, 100],
  slots: { box: '#A6192E', main: W },
  shapes: [{ d: rrect(0, 0, 160, 100, 22), fill: 'box' }, text('FIAT', 80, 70, 40, 'main', { weight: 900, align: 'center', tracking: 6 })],
};

/** BlackBerry: the seven-dot keys mark and the name. */
function blackberry(): Logo {
  const w = measure('BlackBerry', { weight: 800 });
  const dot = (x: number, y: number) => rrect(x, y, 22, 16, 8);
  return {
    id: 'blackberry',
    name: 'BlackBerry',
    size: [w + 100, 100],
    slots: { main: '#111111' },
    shapes: [{ d: dot(10, 14) + dot(42, 14) + dot(4, 40) + dot(36, 40) + dot(68, 30) + dot(0, 66) + dot(32, 66) + dot(62, 58), fill: 'main' }, text('BlackBerry', 98, 92, 82, 'main', { weight: 800 })],
  };
}

/** Johnnie Walker: the striding man and the name on two lines. */
const JOHNNIE_WALKER: Logo = {
  id: 'johnnie-walker',
  name: 'Johnnie Walker',
  size: [330, 150],
  slots: { main: W },
  shapes: [
    // the striding man in his top hat, walking right
    { d: 'M22 6H40V12H44V16H18V12H22Z M26 18H38L40 30L52 42L48 46L38 38L42 60L54 96H44L34 66L26 96H16L24 62L22 40L12 52L8 48L20 32Z M30 0H34V6H30Z', fill: 'main' },
    text('JOHNNIE', 70, 68, 58, 'main', { weight: 900, tracking: 4 }),
    text('WALKER', 70, 140, 58, 'main', { weight: 900, tracking: 10 }),
  ],
};

/** SAP in its slanted box. */
const SAP: Logo = {
  id: 'sap',
  name: 'SAP',
  size: [200, 100],
  slots: { box: W, main: '#111111' },
  shapes: [{ d: 'M0 0H200L110 100H0Z', fill: 'box' }, text('SAP', 16, 74, 52, 'main', { weight: 900 })],
};

/** Infiniti: the oval road mark and the spaced name. */
function infiniti(): Logo {
  const w = measure('INFINITI', { weight: 400, tracking: 30, condense: 1.2 });
  return {
    id: 'infiniti',
    name: 'Infiniti',
    size: [w, 280],
    slots: { main: W },
    shapes: [
      { d: ellipse(w / 2, 80, 110, 70) + ellipse(w / 2, 80, 98, 60, true), fill: 'main' },
      { d: `M${w / 2 - 70} 132L${w / 2} 30L${w / 2 + 70} 132L${w / 2 + 40} 136L${w / 2} 64L${w / 2 - 40} 136Z`, fill: 'main' },
      text('INFINITI', 0, 280, 90, 'main', { weight: 400, tracking: 30, condense: 1.2 }),
    ],
  };
}

/** Total, 2014: the red name beside the swirl of colored bands. */
function total(): Logo {
  const w = measure('TOTAL', { weight: 900 });
  return {
    id: 'total',
    name: 'Total',
    size: [w + 130, 120],
    slots: { main: '#E2001A', a: '#0072CE', b: '#E2001A', c: '#FF9E1B', box: W },
    shapes: [
      { d: rrect(0, 0, w + 130, 120, 10), fill: 'box' },
      { d: circle(58, 60, 42), fill: 'c' },
      { d: 'M20 62C30 30 66 18 96 44C70 34 44 44 30 70Z', fill: 'b' },
      { d: 'M24 84C44 98 76 96 96 70C80 80 54 84 34 72Z', fill: 'a' },
      text('TOTAL', 118, 92, 64, 'main', { weight: 900 }),
    ],
  };
}

/** Renault: the diamond (lozenge) and the name. */
function renault(withName: boolean): Logo {
  const w = withName ? measure('RENAULT', { weight: 800, tracking: 4 }) : 0;
  return {
    id: withName ? 'renault' : 'renault-diamond',
    name: withName ? 'Renault' : 'Renault (diamond)',
    size: [70 + (withName ? w + 20 : 0), 100],
    slots: { main: W },
    shapes: [
      { d: 'M35 0L70 50L35 100L0 50Z M35 18L57 50L35 82L13 50Z M35 30L49 50L35 70L21 50Z', fill: 'main', rule: 'evenodd' },
      ...(withName ? [text('RENAULT', 90, 75, 50, 'main', { weight: 800, tracking: 4 })] : []),
    ],
  };
}

/** Sahara, with Force India's tricolor sweep under it. */
function sahara(): Logo {
  const w = measure('SAHARA', { weight: 900, condense: 1.05 });
  return {
    id: 'sahara',
    name: 'Sahara',
    size: [w, 150],
    slots: { main: W, saffron: '#F08A1D', green: '#1A8A4A', script: '#E2001A' },
    shapes: [
      text('SAHARA', 0, 100, 100, 'main', { weight: 900, condense: 1.05 }),
      text('forceindia', w * 0.25, 142, 30, 'script', { weight: 800, slant: 14 }),
    ],
  };
}

/** Royal Challenge on two lines. */
const ROYAL_CHALLENGE: Logo = {
  id: 'royal-challenge',
  name: 'Royal Challenge',
  size: [300, 200],
  slots: { main: W },
  shapes: [text('ROYAL', 150, 88, 80, 'main', { weight: 800, align: 'center', tracking: 4 }), text('CHALLENGE', 150, 192, 80, 'main', { weight: 800, align: 'center', condense: 0.82 })],
};

/** PDVSA: the white sunburst disc and the name on a red box. */
function pdvsa(): Logo {
  const w = measure('PDVSA', { weight: 900 });
  return {
    id: 'pdvsa',
    name: 'PDVSA',
    size: [w + 150, 130],
    slots: { box: '#E2001A', main: W },
    shapes: [
      { d: rrect(0, 0, w + 150, 130, 8), fill: 'box' },
      { d: circle(62, 65, 42) + circle(62, 65, 16, true), fill: 'main' },
      { d: poly([[62, 23], [70, 50], [54, 50]]) + poly([[104, 65], [77, 73], [77, 57]]) + poly([[62, 107], [54, 80], [70, 80]]) + poly([[20, 65], [47, 57], [47, 73]]), fill: 'box' },
      text('PDVSA', 124, 106, 80, 'main', { weight: 900 }),
    ],
  };
}

/** Sure, with the gold swoosh. */
function sure(): Logo {
  const w = measure('Sure', { weight: 600 });
  return {
    id: 'sure',
    name: 'Sure',
    size: [w + 90, 110],
    slots: { main: W, swoosh: '#C9A227' },
    shapes: [{ d: 'M0 50C20 70 34 92 40 110C52 70 70 30 90 0C66 30 48 62 40 82C30 66 18 56 0 50Z', fill: 'swoosh' }, text('Sure', 90, 100, 90, 'main', { weight: 600 })],
  };
}

/** The Lotus roundel: LOTUS over the green and yellow badge with the ACBC monogram, simplified. */
const LOTUS_ROUNDEL: Logo = {
  id: 'lotus-roundel',
  name: 'Lotus (roundel)',
  size: [100, 100],
  slots: { ring: '#FFD200', fill: '#004225', main: '#FFD200' },
  shapes: [{ d: circle(50, 50, 49), fill: 'ring' }, { d: circle(50, 50, 42), fill: 'fill' }, text('LOTUS', 50, 60, 20, 'main', { weight: 900, align: 'center' })],
};

/** Saxo Bank in its outlined box. */
const SAXO_BANK: Logo = {
  id: 'saxo-bank',
  name: 'Saxo Bank',
  size: [200, 170],
  slots: { main: W },
  shapes: [{ d: rrect(0, 0, 200, 170, 4) + rrect(8, 8, 184, 154, 2), fill: 'main', rule: 'evenodd' }, text('SAXO', 100, 76, 52, 'main', { weight: 900, align: 'center', tracking: 6 }), text('BANK', 100, 142, 52, 'main', { weight: 900, align: 'center', tracking: 6 })],
};

/** The Martini roundel and bar: the red ball, the dark blue bar with MARTINI across it. */
const MARTINI: Logo = {
  id: 'martini',
  name: 'Martini',
  size: [300, 140],
  slots: { ball: '#E10600', bar: '#0B3D91', main: W, ring: '#111111' },
  shapes: [
    { d: circle(150, 70, 68), fill: 'ring' },
    { d: circle(150, 70, 60), fill: 'ball' },
    { d: rrect(0, 46, 300, 48, 6), fill: 'bar' },
    text('MARTINI', 150, 84, 30, 'main', { weight: 900, align: 'center', tracking: 6, condense: 1.2 }),
  ],
};

/** Oris Swiss Watches. */
const ORIS: Logo = {
  id: 'oris',
  name: 'Oris',
  size: [240, 150],
  slots: { main: '#0B3D91' },
  shapes: [text('ORIS', 120, 96, 96, 'main', { weight: 600, align: 'center', tracking: 8 }), text('Swiss Watches', 120, 142, 30, 'main', { weight: 600, align: 'center' })],
};

/** Experian: its cluster of dots and the name. */
function experian(): Logo {
  const w = measure('Experian', { weight: 600 });
  return {
    id: 'experian',
    name: 'Experian',
    size: [w + 110, 100],
    slots: { main: '#0B3D91', a: '#1D4F91', b: '#E63888', c: '#AF1685' },
    shapes: [
      { d: circle(20, 30, 16) + circle(54, 24, 12), fill: 'a' },
      { d: circle(30, 70, 20), fill: 'b' },
      { d: circle(70, 64, 14), fill: 'c' },
      text('Experian', 100, 92, 82, 'main', { weight: 600 }),
    ],
  };
}

export const LOGOS_2014: readonly Logo[] = [
  UPS,
  FIAT,
  blackberry(),
  JOHNNIE_WALKER,
  SAP,
  infiniti(),
  total(),
  renault(true),
  renault(false),
  sahara(),
  ROYAL_CHALLENGE,
  pdvsa(),
  sure(),
  LOTUS_ROUNDEL,
  SAXO_BANK,
  MARTINI,
  ORIS,
  experian(),
  wordmark('kaspersky', 'Kaspersky', 'KASPERSKY', W, { weight: 800, tracking: 4 }),
  wordmark('weichai', 'Weichai', 'WEICHAI', W, { weight: 900 }),
  wordmark('hublot', 'Hublot', 'HUBLOT', W, { weight: 800, tracking: 8 }),
  wordmark('infor', 'Infor', 'infor', W, { weight: 800 }),
  wordmark('scuderia-ferrari', 'Scuderia Ferrari (name)', 'Scuderia Ferrari', '#D40000', { weight: 800, slant: 12 }),
  wordmark('swissquote', 'Swissquote', 'SWISSQUOTE', '#111111', { weight: 800 }),
  wordmark('petronas-primax', 'Petronas Primax', 'PETRONAS PRIMAX', '#111111', { weight: 800 }),
  wordmark('asos', 'ASOS', 'asos.com', W, { weight: 800 }),
  wordmark('gsk', 'GSK', 'GSK', W, { weight: 900, tracking: 4 }),
  wordmark('hugo-boss', 'Hugo Boss', 'HUGO BOSS', '#111111', { weight: 800, tracking: 10 }),
  wordmark('casio', 'Casio', 'CASIO', W, { weight: 900, tracking: 4 }),
  wordmark('pepe-jeans', 'Pepe Jeans', 'Pepe Jeans', W, { weight: 600, slant: 12 }),
  wordmark('rauch', 'Rauch', 'Rauch', '#FF7A00', { weight: 900, slant: 8 }),
  wordmark('kingfisher', 'Kingfisher', 'KINGFISHER', W, { weight: 900, tracking: 2 }),
  wordmark('smirnoff', 'Smirnoff', 'SMIRNOFF', W, { weight: 600, tracking: 8 }),
  wordmark('roshfrans', 'Roshfrans', 'ROSHFRANS', W, { weight: 900, slant: 10 }),
  wordmark('astana', 'Astana', 'ASTANA', '#00A3E0', { weight: 900, tracking: 4 }),
  wordmark('whyte-mackay', 'Whyte & Mackay', 'WHYTE & MACKAY', '#111111', { weight: 800 }),
  wordmark('emc', 'EMC', 'EMC', W, { weight: 900, tracking: 4 }),
  wordmark('emaar', 'Emaar', 'EMAAR', W, { weight: 800, tracking: 8 }),
  wordmark('burn', 'Burn', 'BURN', W, { weight: 900, slant: 12 }),
  wordmark('randstad', 'Randstad', 'randstad', '#0B3D91', { weight: 600 }),
  wordmark('petrobras', 'Petrobras', 'PETROBRAS', '#0B3D91', { weight: 900 }),
  wordmark('genworth', 'Genworth', 'Genworth', '#0B3D91', { weight: 600 }),
  wordmark('wihuri', 'Wihuri', 'WIHURI', '#0B3D91', { weight: 900 }),
];
