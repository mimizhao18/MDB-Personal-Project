// Sponsors and marks first drawn for the 2004 cars. Simplified vector versions drawn from photos of the cars.

import { circle, ellipse, measure, poly, rrect, text, wordmark } from './draw';
import type { Logo } from './types';

const W = '#FFFFFF';

/** Vodafone: the red disc with the white speech mark, and the name. */
function vodafone(withName: boolean): Logo {
  const w = withName ? measure('vodafone', { weight: 600 }) : 0;
  return {
    id: withName ? 'vodafone' : 'vodafone-mark',
    name: withName ? 'Vodafone' : 'Vodafone (mark)',
    size: [100 + (withName ? w + 20 : 0), 100],
    slots: { disc: '#E60000', mark: W, main: W, ring: W },
    shapes: [
      { d: circle(50, 50, 49), fill: 'ring' },
      { d: circle(50, 50, 44), fill: 'disc' },
      { d: 'M52 22C66 18 76 26 74 34C70 30 64 30 60 34C70 40 74 54 66 66C58 78 38 78 30 66C22 54 30 34 52 22Z M50 44C42 44 38 52 40 58C42 66 52 68 58 62C64 56 62 46 50 44Z', fill: 'mark', rule: 'evenodd' },
      ...(withName ? [text('vodafone', 118, 80, 64, 'main', { weight: 600 })] : []),
    ],
  };
}

/** Bridgestone: the red B and the name. */
function bridgestone(): Logo {
  const w = measure('BRIDGESTONE', { weight: 900, slant: 10, condense: 0.95 });
  return {
    id: 'bridgestone',
    name: 'Bridgestone',
    size: [w + 10, 100],
    slots: { main: '#111111', b: '#E2001A' },
    shapes: [text('B', 0, 100, 100, 'b', { weight: 900, slant: 10, condense: 0.95 }), text('RIDGESTONE', measure('B', { weight: 900, condense: 0.95 }) + 4, 100, 100, 'main', { weight: 900, slant: 10, condense: 0.95 })],
  };
}

/** West: the name with the zigzag W (the tobacco brand on the 2004 McLaren). */
function west(): Logo {
  const w = measure('est', { weight: 900 });
  return {
    id: 'west',
    name: 'West',
    size: [130 + w, 100],
    slots: { main: W },
    shapes: [{ d: poly([[0, 0], [24, 0], [40, 64], [58, 0], [74, 0], [92, 64], [108, 0], [130, 0], [102, 100], [84, 100], [66, 38], [48, 100], [30, 100]]), fill: 'main' }, text('est', 134, 100, 76, 'main', { weight: 900 })],
  };
}

/** HP: the blue rounded square with the slanted hp. */
const HP_BOX: Logo = {
  id: 'hp-box',
  name: 'HP (2004)',
  size: [120, 100],
  slots: { box: '#0B3D91', main: W },
  shapes: [{ d: rrect(0, 0, 120, 100, 16), fill: 'box' }, { d: ellipse(60, 50, 50, 40) + ellipse(60, 50, 44, 34, true), fill: 'main' }, text('hp', 60, 68, 46, 'main', { weight: 800, align: 'center', slant: 14 })],
};

/** FedEx: the name with the arrow hidden between its E and x (white Fed, orange Ex; all white on a dark wing). */
function fedex(): Logo {
  const fed = measure('Fed', { weight: 900 });
  const ex = measure('Ex', { weight: 900 });
  return {
    id: 'fedex',
    name: 'FedEx',
    size: [fed + ex, 100],
    slots: { fed: '#4D148C', ex: '#FF6600' },
    shapes: [text('Fed', 0, 100, 100, 'fed', { weight: 900 }), text('Ex', fed, 100, 100, 'ex', { weight: 900 })],
  };
}

/** The BMW roundel: the black ring, the blue and white quarters. */
const BMW: Logo = {
  id: 'bmw',
  name: 'BMW (roundel)',
  size: [100, 100],
  slots: { ring: '#111111', blue: '#0066B1', white: W, main: W },
  shapes: [
    { d: circle(50, 50, 49), fill: 'ring' },
    { d: circle(50, 50, 30), fill: 'white' },
    { d: 'M50 50L50 20A30 30 0 0 1 80 50Z M50 50L50 80A30 30 0 0 1 20 50Z', fill: 'blue' },
    text('BMW', 50, 18, 12, 'main', { weight: 800, align: 'center', tracking: 3 }),
  ],
};

/** Mild Seven: the blue swoosh in a white disc, and the name. */
function mildSeven(): Logo {
  const w = measure('MILD SEVEN', { weight: 800 });
  return {
    id: 'mild-seven',
    name: 'Mild Seven',
    size: [w + 120, 100],
    slots: { disc: W, mark: '#1F7DC1', main: W },
    shapes: [{ d: ellipse(50, 50, 48, 40), fill: 'disc' }, { d: 'M12 58C28 30 64 22 86 36C64 32 42 40 30 60C40 50 60 48 76 56C58 58 38 64 22 76Z', fill: 'mark' }, text('MILD SEVEN', 115, 80, 64, 'main', { weight: 800 })],
  };
}

/** elf: the oil company's red and blue triangle under the name. */
const ELF: Logo = {
  id: 'elf',
  name: 'Elf',
  size: [160, 100],
  slots: { red: '#E2001A', blue: '#0033A0', main: W },
  shapes: [{ d: 'M0 100L80 0L160 100Z', fill: 'blue' }, { d: 'M20 100L80 24L140 100Z', fill: 'red' }, text('elf', 80, 90, 44, 'main', { weight: 900, align: 'center' })],
};

/** Telefónica: the yellow script on the Renault rear wing (drawn in a slanted rounded typeface). */
const TELEFONICA = wordmark('telefonica', 'Telefonica', 'Telefonica', '#FFD800', { weight: 800, slant: 14 });

/** Lucky Strike: the red target roundel with its white and black rings. */
const LUCKY_STRIKE: Logo = {
  id: 'lucky-strike',
  name: 'Lucky Strike',
  size: [100, 100],
  slots: { outer: '#111111', ring: W, disc: '#E2001A', main: '#111111' },
  shapes: [
    { d: circle(50, 50, 49), fill: 'ring' },
    { d: circle(50, 50, 47) + circle(50, 50, 44, true), fill: 'outer' },
    { d: circle(50, 50, 31), fill: 'disc' },
    { d: circle(50, 50, 33) + circle(50, 50, 31, true), fill: 'outer' },
    text('LUCKY', 50, 18, 8, 'main', { weight: 900, align: 'center', tracking: 2 }),
    text('STRIKE', 50, 90, 8, 'main', { weight: 900, align: 'center', tracking: 2 }),
  ],
};

/** HSBC: the red and white hexagon of triangles, and the name. */
function hsbc(withName: boolean): Logo {
  const w = withName ? measure('HSBC', { weight: 900 }) : 0;
  return {
    id: withName ? 'hsbc' : 'hsbc-hexagon',
    name: withName ? 'HSBC' : 'HSBC (hexagon)',
    size: [140 + (withName ? w + 20 : 0), 100],
    slots: { red: '#DB0011', white: W, main: '#111111' },
    shapes: [
      { d: poly([[0, 50], [35, 0], [105, 0], [140, 50], [105, 100], [35, 100]]), fill: 'white' },
      { d: poly([[0, 50], [35, 0], [35, 100]]) + poly([[140, 50], [105, 0], [105, 100]]) + poly([[35, 0], [105, 0], [70, 50]]) + poly([[35, 100], [105, 100], [70, 50]]), fill: 'red' },
      ...(withName ? [text('HSBC', 160, 100, 100, 'main', { weight: 900 })] : []),
    ],
  };
}

/** AT&T: the striped globe and the name. */
function att(): Logo {
  const w = measure('AT&T', { weight: 800 });
  return {
    id: 'att-globe',
    name: 'AT&T (globe)',
    size: [w + 120, 100],
    slots: { globe: '#009FDB', main: '#0B3D91', band: W },
    shapes: [
      { d: circle(50, 50, 48), fill: 'globe' },
      { d: [22, 36, 50, 64, 78].map((y, i) => rrect(4 + i * 2, y - 3, 92 - i * 4, 5)).join(''), fill: 'band' },
      text('AT&T', 115, 80, 62, 'main', { weight: 800 }),
    ],
  };
}

/** The leaping jaguar: the cat stretched out over the engine cover. */
const JAGUAR_LEAPER: Logo = {
  id: 'jaguar-leaper',
  name: 'Jaguar (leaper)',
  size: [200, 60],
  slots: { main: W },
  shapes: [
    {
      d: 'M200 22C192 18 184 16 178 18C170 10 160 8 150 12C120 16 90 20 60 24C40 26 20 30 4 40C2 42 2 44 6 44C24 38 44 34 62 34C58 40 50 48 40 54L44 58C58 52 70 44 78 36C96 36 116 36 134 34C140 40 146 48 148 56L154 56C154 46 152 38 148 30C158 30 168 30 176 32C182 34 188 32 194 30C198 28 200 26 200 22Z',
      fill: 'main',
    },
  ],
};

/** Toyota: the three ellipses, and the name. */
function toyota(withName: boolean): Logo {
  const w = withName ? measure('TOYOTA', { weight: 800, tracking: 6 }) : 0;
  return {
    id: withName ? 'toyota' : 'toyota-emblem',
    name: withName ? 'Toyota' : 'Toyota (emblem)',
    size: [140 + (withName ? w + 20 : 0), 100],
    slots: { main: '#E2001A' },
    shapes: [
      { d: ellipse(70, 50, 68, 46) + ellipse(70, 50, 60, 38, true), fill: 'main' },
      { d: ellipse(70, 36, 38, 18) + ellipse(70, 36, 32, 12, true), fill: 'main' },
      { d: ellipse(70, 56, 16, 36) + ellipse(70, 56, 10, 30, true), fill: 'main' },
      ...(withName ? [text('TOYOTA', 160, 78, 56, 'main', { weight: 800, tracking: 6 })] : []),
    ],
  };
}

/** Panasonic: the blue name. */
const PANASONIC = wordmark('panasonic', 'Panasonic', 'Panasonic', '#0041C0', { weight: 900 });

export const LOGOS_2004: readonly Logo[] = [
  vodafone(true),
  vodafone(false),
  bridgestone(),
  west(),
  HP_BOX,
  fedex(),
  BMW,
  mildSeven(),
  ELF,
  TELEFONICA,
  LUCKY_STRIKE,
  hsbc(true),
  hsbc(false),
  att(),
  JAGUAR_LEAPER,
  toyota(true),
  toyota(false),
  PANASONIC,
  wordmark('olympus', 'Olympus', 'OLYMPUS', '#0B3D91', { weight: 800, tracking: 4 }),
  wordmark('acer', 'Acer', 'acer', W, { weight: 800, slant: 10 }),
  wordmark('siemens', 'Siemens', 'SIEMENS', '#111111', { weight: 900, tracking: 4 }),
  wordmark('mercedes-benz', 'Mercedes-Benz', 'Mercedes-Benz', '#111111', { weight: 600 }),
  wordmark('budweiser', 'Budweiser', 'Budweiser', '#C8102E', { weight: 800, slant: 12 }),
  wordmark('reuters', 'Reuters', 'REUTERS', '#1B2F7A', { weight: 800, tracking: 6 }),
  wordmark('allianz', 'Allianz', 'Allianz', W, { weight: 600 }),
  wordmark('hamleys', 'Hamleys', 'Hamleys', '#1B2F7A', { weight: 800, slant: 10 }),
  wordmark('hanjin', 'Hanjin', 'HANJIN', '#0B1E5B', { weight: 900 }),
  wordmark('michelin', 'Michelin', 'MICHELIN', W, { weight: 900, slant: 14 }),
  wordmark('mode', 'Mode', 'mode', '#FFD800', { weight: 800 }),
  wordmark('honda-serif', 'Honda (2004 name)', 'HONDA', '#E10600', { weight: 900, tracking: 8 }),
  wordmark('intercond', 'Intercond', 'INTERCOND', W, { weight: 800, tracking: 4 }),
  wordmark('becks', "Beck's", "BECK'S", W, { weight: 900, tracking: 4 }),
  wordmark('ugs', 'UGS', 'UGS', '#0B3D91', { weight: 900, tracking: 6 }),
  wordmark('pioneer', 'Pioneer', 'Pioneer', '#D21F26', { weight: 800 }),
  wordmark('denso', 'Denso', 'DENSO', '#E10600', { weight: 900 }),
  wordmark('kddi', 'KDDI', 'KDDI', '#111111', { weight: 900, slant: 8 }),
  wordmark('karcher', 'Karcher', 'KARCHER', '#111111', { weight: 900, slant: 6 }),
  wordmark('time', 'Time', 'TIME', '#111111', { weight: 900 }),
];
