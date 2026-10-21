import { BLACK, CARBON, WHITE } from '../liveryHelpers';
import type { Livery, LiveryLayer } from '../liveryTypes';

// 1980s (turbo era): the most famous liveries, drawn from the photos in reference/gen1980s/liveries/. Shapes are in
// the car's own measurements (see src/data/cars/gen1980s.ts): nose 2.45, front axle 1.43, sidepods 0.7 to -1.7 (their
// top 0.54 from 0.15 to -0.3, 0.42 at -1.15), rear axle -1.43, tail -1.85; floor 0.06, cockpit rim 0.73, roll hoop
// 0.94. Logos come from src/data/logos; numbers are the race numbers of the photographed cars.

const solidParts = (c: string, flap = c, endplate = c) => ({ wing: c, flap, endplate, floor: CARBON });
/** A number on the side of the nose and on its top. */
const numbers = (n: string, side: { x: number; y: number; h: number; color: string }, top: { x?: number; color: string }, more: { slant?: number; outline?: { color: string; width: number } } = {}) => [
  { view: 'side' as const, text: n, x: side.x, y: side.y, height: side.h, color: side.color, font: 'sans' as const, weight: 900 as const, slant: more.slant, outline: more.outline, align: 'center' as const },
  { view: 'top' as const, text: n, x: top.x ?? 1.85, y: 0, height: 0.11, color: top.color, font: 'sans' as const, weight: 900 as const, slant: more.slant, outline: more.outline, align: 'center' as const },
];
/** A pinstripe as an outline along a path. */
const pin = (color: string, path: string, width = 0.008): LiveryLayer => ({ stroke: { color, width }, path });

const F_RED = '#D8281C';
const FERRARI: Livery = {
  id: 'ferrari-1980s',
  name: 'Ferrari',
  era: 'gen1980s',
  team: 'Scuderia Ferrari',
  price: 30,
  primary: F_RED,
  secondary: '#FFFFFF',
  sidepod: 'turbo',
  finish: 'gloss',
  helmet: '#F4F4F4',
  parts: { wing: CARBON, flap: CARBON, endplate: CARBON, floor: CARBON },
  top: [],
  side: [
    // the white Fiat panel on the engine cover
    { color: WHITE, path: 'M-0.12 0.62 L-0.12 0.71 L-0.58 0.68 L-0.58 0.6 Z' },
  ],
  decals: [
    { view: 'side', logo: 'fiat', x: -0.35, y: 0.655, height: 0.06, colors: { box: WHITE, main: '#1B2F7A' } },
    { view: 'side', logo: 'agip', x: 0.98, y: 0.4, height: 0.09 },
    { view: 'side', logo: 'ferrari-shield', x: 0.52, y: 0.6, height: 0.1 },
    { view: 'side', logo: 'enichem', x: 1.55, y: 0.33, height: 0.035 },
    { view: 'side', logo: 'magneti-marelli', x: 1.95, y: 0.2, height: 0.02 },
    { view: 'side', logo: 'longines', x: -0.1, y: 0.4, height: 0.035 },
    { view: 'side', logo: 'goodyear', x: -0.95, y: 0.4, height: 0.035 },
    // on top: Agip and the shield, EniChem along the nose, Goodyear on the wings
    { view: 'top', logo: 'agip', x: 1.2, y: 0.12, height: 0.07, rotate: 90 },
    { view: 'top', logo: 'ferrari-shield', x: 0.9, y: 0.17, height: 0.06, rotate: 90 },
    { view: 'top', logo: 'enichem', x: 1.5, y: 0, height: 0.04, rotate: 180 },
    { view: 'top', logo: 'goodyear', x: -1.62, y: 0, height: 0.06, orient: 'across-rear' },
    { view: 'top', logo: 'goodyear', x: 2.35, y: 0.5, height: 0.045, orient: 'across-front' },
    { view: 'top', logo: 'goodyear', x: 2.35, y: -0.5, height: 0.045, orient: 'across-front' },
  ],
  texts: numbers('28', { x: 2.0, y: 0.215, h: 0.08, color: WHITE }, { color: WHITE }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'goodyear', x: -1.6, y: 0.86, height: 0.04 },
      { view: 'side', logo: 'agip', x: -1.6, y: 0.64, height: 0.1 },
    ],
    front: [{ view: 'side', logo: 'digital', x: 2.27, y: 0.2, height: 0.035, colors: { main: '#1B2F7A' } }],
  },
};

const MCL_RED = '#FF3B1F';
const MCLAREN: Livery = {
  id: 'mclaren-1980s',
  name: 'McLaren',
  era: 'gen1980s',
  team: 'Marlboro McLaren International',
  price: 60,
  primary: '#F4F4F4',
  secondary: MCL_RED,
  glow: MCL_RED,
  sidepod: 'turbo',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: solidParts(MCL_RED, MCL_RED, MCL_RED),
  frontParts: { wing: '#F4F4F4', flap: '#F4F4F4', endplate: '#F4F4F4' },
  top: [
    // the Marlboro chevron: red over the cockpit cowl, pointing forward, and red at the tail
    { color: MCL_RED, path: 'M1.35 0.0 L0.3 0.26 L0.3 -0.26 Z M1.35 0.0 L0.3 0.26 L0.15 0.26 L0.15 -0.26 L0.3 -0.26 Z' },
    { color: MCL_RED, path: 'M-1.3 0.22 C-1.5 0.2 -1.7 0.15 -1.85 0.1 L-1.85 -0.1 C-1.7 -0.15 -1.5 -0.2 -1.3 -0.22 Z' },
    { color: MCL_RED, symmetric: true, path: 'M-1.1 0.2 L-1.7 0.2 L-1.7 0.5 Z' },
  ],
  side: [
    // the red chevron down the side: from the cockpit down to the front of the sidepod, and the red rear body
    { color: MCL_RED, path: 'M0.45 0.76 L1.35 0.45 L1.35 0.32 L0.72 0.32 C0.6 0.4 0.5 0.55 0.3 0.62 Z' },
    { color: MCL_RED, path: 'M-1.85 0.62 L-1.25 0.72 L-0.3 0.21 L-0.3 0.06 L-1.85 0.06 Z' },
    { color: MCL_RED, path: 'M0.7 0.06 L0.7 0.12 L-0.3 0.12 L-0.3 0.06 Z' },
    // the louvres on the engine cover beside the roll hoop
    ...Array.from({ length: 7 }, (_, i): LiveryLayer => ({ color: '#222222', path: `M${-0.1 - i * 0.06} 0.84 L${-0.12 - i * 0.06} 0.84 L${-0.16 - i * 0.06} 0.7 L${-0.14 - i * 0.06} 0.7 Z` })),
  ],
  decals: [
    { view: 'side', logo: 'shell', x: 0.1, y: 0.34, height: 0.16 },
    { view: 'side', logo: 'marlboro', x: -0.85, y: 0.42, height: 0.07, colors: { main: WHITE, roof: WHITE } },
    { view: 'side', logo: 'honda-h', x: 1.65, y: 0.33, height: 0.06 },
    { view: 'side', logo: 'tag-80s', x: -1.1, y: 0.28, height: 0.025, colors: { main: WHITE } },
    { view: 'side', logo: 'goodyear', x: 1.95, y: 0.16, height: 0.02, colors: { main: '#111111' } },
    // on top: the Honda H and the name, the Shell pecten on the nose, Shell across the front wing, Marlboro on the rear
    { view: 'top', logo: 'honda-h', x: 1.7, y: 0, height: 0.08, colors: { main: WHITE, ink: '#111111' } },
    { view: 'top', logo: 'shell', x: 2.25, y: 0, height: 0.07 },
    { view: 'top', logo: 'marlboro', x: -0.5, y: 0, height: 0.08, rotate: 180, colors: { main: MCL_RED, roof: MCL_RED } },
    { view: 'top', logo: 'marlboro', x: -1.62, y: 0, height: 0.07, orient: 'across-rear', colors: { main: WHITE, roof: WHITE } },
  ],
  texts: [
    ...numbers('12', { x: 2.05, y: 0.22, h: 0.07, color: MCL_RED }, { x: 1.95, color: MCL_RED }),
    { view: 'top', text: 'Shell', x: 2.35, y: 0.5, height: 0.06, color: '#111111', font: 'sans', weight: 800, orient: 'across-front' },
    { view: 'top', text: 'Shell', x: 2.35, y: -0.5, height: 0.06, color: '#111111', font: 'sans', weight: 800, orient: 'across-front' },
  ],
  plateDecals: {
    rear: [{ view: 'side', logo: 'showa', x: -1.6, y: 0.52, height: 0.035 }],
    front: [{ view: 'side', logo: 'goodyear', x: 2.28, y: 0.2, height: 0.035, colors: { main: '#111111' } }],
  },
  plateTexts: { rear: [{ view: 'side', text: '12', x: -1.6, y: 0.78, height: 0.13, color: WHITE, font: 'sans', weight: 900, align: 'center' }] },
};

const GOLD = '#D4AF37';
const LOTUS: Livery = {
  id: 'lotus-1980s',
  name: 'Lotus',
  era: 'gen1980s',
  team: 'John Player Special Team Lotus',
  price: 90,
  primary: '#0E0E10',
  secondary: GOLD,
  sidepod: 'turbo',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: { wing: BLACK, flap: BLACK, endplate: BLACK, floor: CARBON },
  top: [
    // gold pinstripes along the nose and round the sidepod tops
    pin(GOLD, 'M2.4 0.02 L0.9 0.1', 0.008),
    pin(GOLD, 'M2.4 -0.02 L0.9 -0.1', 0.008),
    { stroke: { color: GOLD, width: 0.008 }, symmetric: true, path: 'M0.65 0.2 C0.6 0.5 0.4 0.62 0.0 0.62 C-0.6 0.6 -1.2 0.46 -1.6 0.2' },
  ],
  side: [
    // gold pinstripes along the nose, the sidepod top and the bottom of the body
    pin(GOLD, 'M2.4 0.21 C1.8 0.3 1.2 0.44 0.75 0.52'),
    pin(GOLD, 'M0.7 0.5 C0.2 0.53 -0.5 0.52 -1.6 0.28'),
    pin(GOLD, 'M0.7 0.135 L-1.7 0.135'),
    // the DeLonghi box outline drawn as a gold pinstripe rectangle with rounded ends
    { stroke: { color: GOLD, width: 0.006 }, path: 'M0.45 0.22 L-0.25 0.22 A0.08 0.08 0 0 1 -0.25 0.38 L0.45 0.38 A0.08 0.08 0 0 1 0.45 0.22 Z' },
  ],
  decals: [
    { view: 'side', logo: 'john-player-special', x: -0.05, y: 0.62, height: 0.045 },
    { view: 'side', logo: 'delonghi', x: 0.1, y: 0.3, height: 0.08, colors: { main: GOLD, ring: '#0E0E10' } },
    { view: 'side', logo: 'jps', x: 1.35, y: 0.38, height: 0.06 },
    { view: 'side', logo: 'renault', x: -0.85, y: 0.6, height: 0.035, colors: { main: GOLD } },
    { view: 'side', logo: 'elf', x: 1.85, y: 0.25, height: 0.04, colors: { red: GOLD, blue: '#0E0E10', main: '#0E0E10' } },
    { view: 'side', logo: 'micromax', x: 0.55, y: 0.6, height: 0.02, colors: { main: GOLD } },
    // on top: JPS on the nose and the sidepods, John Player Special on the rear wing, Goodyear and JPS on the front wing
    { view: 'top', logo: 'jps', x: 1.15, y: 0, height: 0.09, rotate: 90 },
    { view: 'top', logo: 'jps', x: -0.4, y: 0.4, height: 0.07, rotate: 90 },
    { view: 'top', logo: 'jps', x: -0.4, y: -0.4, height: 0.07, rotate: 90 },
    { view: 'top', logo: 'john-player-special', x: -1.62, y: 0, height: 0.045, orient: 'across-rear' },
    { view: 'top', logo: 'goodyear', x: 2.35, y: 0.5, height: 0.04, orient: 'across-front', colors: { main: GOLD } },
    { view: 'top', logo: 'goodyear', x: 2.35, y: -0.5, height: 0.04, orient: 'across-front', colors: { main: GOLD } },
  ],
  texts: numbers('12', { x: -0.65, y: 0.3, h: 0.08, color: GOLD }, { x: 1.55, color: GOLD }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'elf', x: -1.6, y: 0.76, height: 0.08, colors: { red: GOLD, blue: '#0E0E10', main: '#0E0E10' } },
      { view: 'side', logo: 'goodyear', x: -1.6, y: 0.58, height: 0.03, colors: { main: GOLD } },
    ],
    front: [{ view: 'side', logo: 'jps', x: 2.28, y: 0.2, height: 0.06 }],
  },
};

const W_NAVY = '#1B2F7A';
const W_YELLOW = '#FFD800';
const WILLIAMS: Livery = {
  id: 'williams-1980s',
  name: 'Williams',
  era: 'gen1980s',
  team: 'Canon Williams Honda',
  price: 120,
  primary: '#F2F2F2',
  secondary: W_NAVY,
  glow: '#2F5BD6',
  sidepod: 'turbo',
  finish: 'gloss',
  helmet: '#1E3C8A',
  parts: solidParts('#F2F2F2', '#F2F2F2', '#F2F2F2'),
  frontParts: { wing: '#17171A', flap: '#17171A', endplate: W_YELLOW },
  top: [
    // the navy nose with a white tip panel, the yellow cowl round the cockpit with the ICI roundel, a navy sidepod line
    { color: W_NAVY, path: 'M2.45 0.06 C2.0 0.12 1.4 0.18 0.9 0.22 L0.9 -0.22 C1.4 -0.18 2.0 -0.12 2.45 -0.06 Z' },
    { color: W_YELLOW, path: 'M0.95 0.22 C0.6 0.27 0.2 0.28 -0.05 0.25 L-0.05 -0.25 C0.2 -0.28 0.6 -0.27 0.95 -0.22 Z' },
    { color: W_NAVY, symmetric: true, path: 'M0.7 0.4 C0.2 0.44 -0.6 0.44 -1.5 0.38 L-1.5 0.42 C-0.6 0.48 0.2 0.48 0.7 0.44 Z' },
  ],
  side: [
    // the navy lower nose flank, the yellow cowl, the navy band along the top of the sidepod
    { color: W_NAVY, path: 'M2.45 0.13 L2.45 0.2 C1.9 0.3 1.2 0.44 0.4 0.62 L0.4 0.1 L2.45 0.1 Z' },
    { color: W_YELLOW, path: 'M-0.05 0.5 L-0.05 0.75 C0.3 0.74 0.6 0.72 0.95 0.66 L0.95 0.5 Z' },
    { color: W_NAVY, path: 'M0.7 0.48 C0.2 0.53 -0.5 0.53 -1.7 0.3 L-1.7 0.26 C-0.5 0.49 0.2 0.49 0.7 0.44 Z' },
  ],
  decals: [
    { view: 'side', logo: 'canon', x: -0.5, y: 0.3, height: 0.08 },
    { view: 'side', logo: 'mobil1', x: 1.65, y: 0.3, height: 0.05, colors: { main: WHITE } },
    { view: 'side', logo: 'honda-h', x: 1.15, y: 0.38, height: 0.06, colors: { main: WHITE, ink: W_NAVY } },
    { view: 'side', logo: 'tactel', x: 0.45, y: 0.6, height: 0.035 },
    { view: 'side', logo: 'denim', x: -1.1, y: 0.4, height: 0.025 },
    { view: 'side', logo: 'calma', x: -0.25, y: 0.46, height: 0.025 },
    // on top: ICI on the cowl, Honda and Mobil along the nose, Canon on the wings
    { view: 'top', logo: 'ici', x: 1.02, y: 0, height: 0.14 },
    { view: 'top', logo: 'tactel', x: 0.25, y: 0, height: 0.035, rotate: 180 },
    { view: 'top', logo: 'honda-h', x: 1.35, y: 0, height: 0.06, colors: { main: WHITE, ink: W_NAVY } },
    { view: 'top', logo: 'mobil1', x: 1.75, y: 0, height: 0.04, rotate: 180, colors: { main: WHITE } },
    { view: 'top', logo: 'canon', x: -1.62, y: 0, height: 0.09, orient: 'across-rear' },
    { view: 'top', logo: 'canon', x: 2.35, y: 0.5, height: 0.06, orient: 'across-front' },
    { view: 'top', logo: 'canon', x: 2.35, y: -0.5, height: 0.06, orient: 'across-front' },
  ],
  texts: numbers('5', { x: 2.1, y: 0.2, h: 0.07, color: '#E10600' }, { x: 2.05, color: '#E10600' }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'honda', x: -1.6, y: 0.8, height: 0.05, colors: { main: W_NAVY } },
      { view: 'side', logo: 'mobil', x: -1.6, y: 0.56, height: 0.05, colors: { main: W_NAVY } },
    ],
    front: [{ view: 'side', logo: 'tactel', x: 2.28, y: 0.2, height: 0.04 }],
  },
};

const B_GREEN = '#2DB4A0';
const BENETTON: Livery = {
  id: 'benetton-1980s',
  name: 'Benetton',
  era: 'gen1980s',
  team: 'Benetton Formula',
  price: 150,
  primary: B_GREEN,
  secondary: '#F2F2F2',
  glow: B_GREEN,
  sidepod: 'turbo',
  finish: 'gloss',
  helmet: '#F4F4F4',
  parts: solidParts(BLACK, BLACK, BLACK),
  top: [
    // the white engine cover and rear of the sidepods covered in paint strokes
    { color: WHITE, path: 'M-0.05 0.3 C-0.6 0.55 -1.2 0.5 -1.85 0.1 L-1.85 -0.1 C-1.2 -0.5 -0.6 -0.55 -0.05 -0.3 Z' },
  ],
  side: [
    // the white rear sidepod and engine cover, with the green front of the car
    { color: WHITE, path: 'M-0.35 0.06 L-0.35 0.74 C-0.8 0.68 -1.3 0.6 -1.85 0.5 L-1.85 0.06 Z' },
    { color: WHITE, path: 'M-0.35 0.06 C-0.25 0.3 -0.2 0.5 -0.35 0.74 L-0.45 0.74 L-0.45 0.06 Z' },
  ],
  decals: [
    { view: 'side', logo: 'benetton', x: 0.15, y: 0.42, height: 0.07 },
    { view: 'side', logo: 'sisley', x: -0.85, y: 0.42, height: 0.05, colors: { main: B_GREEN } },
    { view: 'side', logo: 'riello', x: -1.1, y: 0.22, height: 0.08 },
    { view: 'side', logo: 'benetton-strokes', x: -0.95, y: 0.62, width: 0.8 },
    { view: 'side', logo: 'bmw-m-power', x: -0.7, y: 0.74, height: 0.02 },
    { view: 'side', logo: 'riello', x: 0.95, y: 0.36, height: 0.05 },
    { view: 'side', logo: 'bmw', x: 1.85, y: 0.2, height: 0.04 },
    // on top: the paint strokes over the cover, benetton on the nose, Flying Tigers on the front wing
    { view: 'top', logo: 'benetton-strokes', x: -0.9, y: 0.2, width: 0.8 },
    { view: 'top', logo: 'benetton-strokes', x: -0.9, y: -0.2, width: 0.8, mirror: true },
    { view: 'top', logo: 'benetton', x: 0.9, y: 0, height: 0.06, rotate: 180 },
    { view: 'top', logo: 'benetton', x: -1.62, y: 0, height: 0.07, orient: 'across-rear' },
    { view: 'top', logo: 'flying-tigers', x: 2.35, y: 0.5, height: 0.04, orient: 'across-front' },
    { view: 'top', logo: 'flying-tigers', x: 2.35, y: -0.5, height: 0.04, orient: 'across-front' },
  ],
  texts: numbers('20', { x: 1.9, y: 0.24, h: 0.07, color: WHITE }, { x: 2.0, color: WHITE }),
  plateDecals: {
    rear: [{ view: 'side', logo: 'pirelli', x: -1.6, y: 0.52, height: 0.04 }],
    front: [{ view: 'side', logo: 'flying-tigers', x: 2.28, y: 0.2, height: 0.03 }],
  },
  plateTexts: { rear: [{ view: 'side', text: '20', x: -1.6, y: 0.78, height: 0.12, color: WHITE, font: 'sans', weight: 900, align: 'center' }] },
};

const C_YELLOW = '#FFC80A';
const C_BLUE = '#0033A0';
const CAMEL: Livery = {
  id: 'lotuscamel-1980s',
  name: 'Lotus Camel',
  era: 'gen1980s',
  team: 'Camel Team Lotus Honda',
  price: 180,
  primary: C_YELLOW,
  secondary: C_BLUE,
  glow: C_YELLOW,
  sidepod: 'turbo',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: solidParts(C_YELLOW, C_YELLOW, C_YELLOW),
  top: [],
  side: [],
  decals: [
    { view: 'side', logo: 'camel', x: -0.2, y: 0.6, height: 0.07 },
    { view: 'side', logo: 'camel-animal', x: 0.45, y: 0.44, height: 0.08 },
    { view: 'side', logo: 'delonghi', x: -0.35, y: 0.3, height: 0.1 },
    { view: 'side', logo: 'honda', x: -1.0, y: 0.58, height: 0.03, colors: { main: C_BLUE } },
    { view: 'side', logo: 'goodyear', x: -0.95, y: 0.66, height: 0.022, colors: { main: C_BLUE } },
    { view: 'side', logo: 'micromax', x: 0.85, y: 0.62, height: 0.02 },
    { view: 'side', logo: 'elf', x: 1.6, y: 0.3, height: 0.04, colors: { red: C_BLUE, blue: C_YELLOW, main: C_YELLOW } },
    // on top: LOTUS and the camel on the cover and nose, CAMEL across the wings
    { view: 'top', logo: 'lotus', x: -0.55, y: 0, height: 0.07, rotate: 180 },
    { view: 'top', logo: 'camel-animal', x: 1.05, y: 0, height: 0.1, rotate: 90 },
    { view: 'top', logo: 'camel', x: 1.55, y: 0, height: 0.05, rotate: 180 },
    { view: 'top', logo: 'camel', x: -1.62, y: 0, height: 0.09, orient: 'across-rear' },
    { view: 'top', logo: 'camel', x: 2.35, y: 0.5, height: 0.06, orient: 'across-front' },
    { view: 'top', logo: 'camel', x: 2.35, y: -0.5, height: 0.06, orient: 'across-front' },
  ],
  texts: numbers('12', { x: -0.95, y: 0.26, h: 0.08, color: C_BLUE }, { x: 2.0, color: C_BLUE }),
  plateDecals: {
    rear: [{ view: 'side', logo: 'elf', x: -1.6, y: 0.78, height: 0.08, colors: { red: C_BLUE, blue: C_YELLOW, main: C_YELLOW } }],
    front: [{ view: 'side', logo: 'camel', x: 2.28, y: 0.2, height: 0.04 }],
  },
  plateTexts: { rear: [{ view: 'side', text: '12', x: -1.6, y: 0.54, height: 0.09, color: C_BLUE, font: 'sans', weight: 900, align: 'center' }] },
};

const P_NAVY = '#1A2A6E';
const BRABHAM: Livery = {
  id: 'brabham-1980s',
  name: 'Brabham',
  era: 'gen1980s',
  team: 'Parmalat Brabham BMW',
  price: 210,
  primary: P_NAVY,
  secondary: '#F2F2F2',
  glow: '#2F6BE0',
  sidepod: 'turbo',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: solidParts('#F2F2F2', '#F2F2F2', '#F2F2F2'),
  frontParts: { wing: P_NAVY, flap: P_NAVY, endplate: P_NAVY },
  top: [
    // the white top of the arrow-head nose and the chassis up to the roll hoop, a thin red line down its middle
    { color: WHITE, path: 'M2.45 0.0 L1.0 0.22 L0.0 0.25 L0.0 -0.25 L1.0 -0.22 Z' },
    { color: '#D21F26', path: 'M2.4 0.004 L0.0 0.006 L0.0 -0.006 L2.4 -0.004 Z' },
  ],
  side: [
    // the white upper nose and cockpit side, sweeping up from the nose tip
    { color: WHITE, path: 'M2.45 0.15 L2.45 0.2 C1.9 0.32 1.2 0.5 0.0 0.76 L0.0 0.6 C0.8 0.44 1.6 0.28 2.45 0.15 Z' },
  ],
  decals: [
    { view: 'side', logo: 'parmalat', x: -0.25, y: 0.38, height: 0.07 },
    { view: 'side', logo: 'parmalat', x: 0.95, y: 0.52, height: 0.04, colors: { main: P_NAVY } },
    { view: 'side', logo: 'fila', x: 0.55, y: 0.6, height: 0.05 },
    { view: 'side', logo: 'bmw', x: 0.3, y: 0.68, height: 0.05 },
    { view: 'side', logo: 'santal', x: 1.75, y: 0.24, height: 0.035 },
    { view: 'side', logo: 'bmw-m-stripes', x: -1.25, y: 0.5, height: 0.04 },
    // on top: Parmalat on the cockpit and the rear wing, Santal and Castrol on the front wing, the M stripes
    { view: 'top', logo: 'parmalat', x: 0.5, y: 0, height: 0.045, rotate: 180, colors: { main: P_NAVY } },
    { view: 'top', logo: 'parmalat', x: -1.62, y: 0, height: 0.07, orient: 'across-rear' },
    { view: 'top', logo: 'santal', x: 2.35, y: 0.5, height: 0.05, orient: 'across-front' },
    { view: 'top', logo: 'santal', x: 2.35, y: -0.5, height: 0.05, orient: 'across-front' },
    { view: 'top', logo: 'bmw-m-stripes', x: 2.3, y: 0.25, height: 0.03 },
  ],
  texts: numbers('5', { x: -0.95, y: 0.4, h: 0.12, color: WHITE }, { x: 1.4, color: P_NAVY }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'parmalat', x: -1.6, y: 0.8, height: 0.04, colors: { main: P_NAVY } },
      { view: 'side', logo: 'bmw', x: -1.6, y: 0.58, height: 0.07 },
    ],
    front: [{ view: 'side', logo: 'castrol', x: 2.28, y: 0.2, height: 0.035 }],
  },
};

export const LIVERIES_GEN1980S: readonly Livery[] = [FERRARI, MCLAREN, LOTUS, WILLIAMS, BENETTON, CAMEL, BRABHAM];
