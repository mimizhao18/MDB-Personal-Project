import { BLACK, CARBON, WHITE } from '../liveryHelpers';
import type { Livery, LiveryLayer } from '../liveryTypes';

// 2004 (V10 era): the best-known liveries, drawn from the photos in reference/gen2004/liveries/. Shapes are in the
// car's own measurements (see src/data/cars/gen2004.ts): nose 2.3, front axle 1.55, sidepods 0.85 to -1.9 (their top
// 0.64 at 0.3, 0.46 at -1.15), rear axle -1.55, tail -1.95; floor edge 0.06 to 0.16, engine cover top 0.82, airbox
// top 0.98. Logos come from src/data/logos; numbers are the race numbers of the photographed cars.

const solidParts = (c: string, flap = c, endplate = c) => ({ wing: c, flap, endplate, floor: CARBON });
/** The black floor edge under the sidepod. */
const floorEdge = (top = 0.14, color = BLACK): LiveryLayer => ({ color, path: `M0.85 0.06 L0.85 ${top} C0.3 ${top} -0.8 ${top} -1.95 ${top + 0.04} L-1.95 0.06 Z` });
/** A number on the side of the nose and on the nose's top. */
const numbers = (n: string, side: { x: number; y: number; h: number; color: string }, top: { x?: number; color: string }, more: { slant?: number } = {}) => [
  { view: 'side' as const, text: n, x: side.x, y: side.y, height: side.h, color: side.color, font: 'sans' as const, weight: 900 as const, slant: more.slant, align: 'center' as const },
  { view: 'top' as const, text: n, x: top.x ?? 1.95, y: 0, height: 0.09, color: top.color, font: 'sans' as const, weight: 900 as const, slant: more.slant, align: 'center' as const },
];

const F_RED = '#D80000';
const FERRARI: Livery = {
  id: 'ferrari-2004',
  name: 'Ferrari',
  era: 'gen2004',
  team: 'Scuderia Ferrari Marlboro',
  price: 60,
  primary: F_RED,
  secondary: '#FFFFFF',
  sidepod: 'v10',
  finish: 'gloss',
  helmet: F_RED,
  parts: solidParts(F_RED, F_RED, '#F4F4F4'),
  frontParts: { wing: '#F4F4F4', flap: F_RED, endplate: '#F4F4F4' },
  top: [
    // the white panel on the rear of the engine cover (the "barcode" area), the shield on the nose
    { color: WHITE, path: 'M-0.45 0.12 C-0.8 0.12 -1.2 0.1 -1.45 0.07 L-1.45 -0.07 C-1.2 -0.1 -0.8 -0.12 -0.45 -0.12 Z' },
  ],
  side: [
    floorEdge(0.12),
    // the white wedge on the engine cover behind the airbox, and the white lower front of the sidepod with its red line
    { color: WHITE, path: 'M-0.4 0.92 L-0.4 0.7 C-0.8 0.66 -1.2 0.6 -1.55 0.56 C-1.2 0.7 -0.8 0.82 -0.4 0.92 Z' },
    { color: WHITE, path: 'M1.3 0.12 C1.25 0.2 1.2 0.26 1.1 0.3 C0.8 0.33 0.5 0.32 0.25 0.28 C0.2 0.22 0.2 0.16 0.22 0.12 Z' },
    { color: F_RED, path: 'M1.2 0.18 C0.9 0.2 0.6 0.2 0.3 0.19 L0.3 0.175 C0.6 0.185 0.9 0.185 1.2 0.165 Z' },
  ],
  decals: [
    { view: 'side', logo: 'vodafone-mark', x: -0.72, y: 0.34, height: 0.24, colors: { disc: WHITE, mark: F_RED } },
    { view: 'side', logo: 'vodafone', x: -0.72, y: 0.18, height: 0.035, colors: { main: WHITE } },
    { view: 'side', logo: 'shell', x: -0.08, y: 0.36, height: 0.17 },
    { view: 'side', logo: 'ferrari-shield', x: 1.35, y: 0.5, height: 0.09 },
    { view: 'side', logo: 'vodafone-mark', x: 1.9, y: 0.36, height: 0.06 },
    { view: 'side', logo: 'fiat', x: -0.95, y: 0.6, height: 0.035 },
    { view: 'side', logo: 'acer', x: -1.35, y: 0.32, height: 0.025 },
    { view: 'side', logo: 'olympus', x: 0.6, y: 0.56, height: 0.02, colors: { main: WHITE } },
    // on top: the shield and Vodafone on the nose, Vodafone across the front wing
    { view: 'top', logo: 'ferrari-shield', x: 2.05, y: 0, height: 0.05, rotate: 90 },
    { view: 'top', logo: 'vodafone', x: 1.5, y: 0, height: 0.06, rotate: 180 },
    { view: 'top', logo: 'vodafone', x: 2.3, y: 0.4, height: 0.05, orient: 'across-front', colors: { main: F_RED, ring: F_RED } },
    { view: 'top', logo: 'vodafone', x: 2.3, y: -0.4, height: 0.05, orient: 'across-front', colors: { main: F_RED, ring: F_RED } },
  ],
  texts: numbers('1', { x: 1.75, y: 0.36, h: 0.06, color: WHITE }, { color: WHITE }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'shell-vpower', x: -1.82, y: 0.88, height: 0.04, colors: { main: F_RED } },
      { view: 'side', logo: 'bridgestone', x: -1.82, y: 0.78, height: 0.03 },
      { view: 'side', logo: 'amd', x: -1.82, y: 0.66, height: 0.045 },
      { view: 'side', logo: 'vodafone-mark', x: -1.82, y: 0.54, height: 0.05 },
    ],
    front: [{ view: 'side', logo: 'bridgestone', x: 2.24, y: 0.2, height: 0.03 }],
  },
};

const MCL_SILVER = '#A4A8B0';
const MCLAREN: Livery = {
  id: 'mclaren-2004',
  name: 'McLaren',
  era: 'gen2004',
  team: 'West McLaren Mercedes',
  price: 90,
  primary: MCL_SILVER,
  secondary: '#0E0E10',
  glow: '#E10600',
  sidepod: 'v10',
  finish: 'gloss',
  helmet: '#DADDE2',
  parts: solidParts(BLACK, BLACK, BLACK),
  top: [
    // silver catching the light, black rear engine cover and sidepod tops, the red-orange nose tip
    { path: 'M2.4 0.7 L-2.0 0.7 L-2.0 -0.7 L2.4 -0.7 Z', gradient: { from: [1.5, 0], to: [-0.5, 0], stops: [[0, '#B8BCC2'], [1, '#8E9299']] } },
    { color: BLACK, path: 'M-0.6 0.15 C-1.0 0.15 -1.6 0.12 -1.95 0.08 L-1.95 -0.08 C-1.6 -0.12 -1.0 -0.15 -0.6 -0.15 Z' },
    { color: BLACK, symmetric: true, path: 'M0.3 0.32 C-0.3 0.62 -1.0 0.6 -1.6 0.4 L-1.6 0.3 L0.3 0.3 Z' },
    { color: '#E8440A', path: 'M2.3 0.03 C2.25 0.05 2.2 0.06 2.12 0.065 L2.12 -0.065 C2.2 -0.06 2.25 -0.05 2.3 -0.03 Z' },
  ],
  side: [
    { path: 'M2.4 0.06 L2.4 1.0 L-2.0 1.0 L-2.0 0.06 Z', gradient: { from: [0, 0.8], to: [0, 0.2], stops: [[0, '#B8BCC2'], [1, '#7E828A']] } },
    // black lower body with the thin red line above it, the black rear of the cover
    { color: BLACK, path: 'M0.85 0.06 L0.85 0.16 C0.3 0.16 -0.8 0.16 -1.95 0.2 L-1.95 0.06 Z' },
    { color: '#E10600', path: 'M0.85 0.16 C0.3 0.16 -0.8 0.16 -1.95 0.2 L-1.95 0.215 C-0.8 0.175 0.3 0.175 0.85 0.175 Z' },
    { color: BLACK, path: 'M-0.6 0.9 C-0.6 0.75 -0.8 0.62 -1.1 0.55 C-1.4 0.48 -1.7 0.42 -1.95 0.4 L-1.95 0.5 C-1.5 0.62 -1.0 0.78 -0.6 0.9 Z' },
    { color: '#E8440A', path: 'M2.3 0.24 L2.3 0.32 L2.15 0.36 L2.15 0.25 Z' },
  ],
  decals: [
    { view: 'side', logo: 'west', x: -0.2, y: 0.4, height: 0.11 },
    { view: 'side', logo: 'mercedes-benz', x: 0.4, y: 0.3, height: 0.03 },
    { view: 'side', logo: 'siemens', x: 1.25, y: 0.48, height: 0.035 },
    { view: 'side', logo: 'mobil1', x: -0.95, y: 0.3, height: 0.04, colors: { main: '#111111' } },
    { view: 'side', logo: 'boss', x: -0.3, y: 0.58, height: 0.025, colors: { main: '#111111' } },
    { view: 'side', logo: 'mercedes-star', x: 1.95, y: 0.34, height: 0.06, colors: { main: '#2A2C30', shade: '#55595F' } },
    // on top: Siemens, SAP and Mobil 1 along the nose, the star at its tip, West on the wings
    { view: 'top', logo: 'mercedes-star', x: 2.15, y: 0, height: 0.07 },
    { view: 'top', logo: 'siemens', x: 1.45, y: 0, height: 0.03, rotate: 90 },
    { view: 'top', logo: 'sap', x: 1.1, y: 0, height: 0.05, rotate: 90 },
    { view: 'top', logo: 'mobil1', x: 0.75, y: 0, height: 0.03, rotate: 90, colors: { main: '#111111' } },
    { view: 'top', logo: 'west', x: -1.84, y: 0, height: 0.08, orient: 'across-rear' },
    { view: 'top', logo: 'west', x: 2.3, y: 0.4, height: 0.05, orient: 'across-front' },
    { view: 'top', logo: 'west', x: 2.3, y: -0.4, height: 0.05, orient: 'across-front' },
  ],
  texts: numbers('5', { x: 1.7, y: 0.42, h: 0.06, color: '#111111' }, { x: 1.8, color: '#111111' }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'west', x: -1.82, y: 0.78, height: 0.07 },
      { view: 'side', logo: 'mercedes-benz', x: -1.82, y: 0.62, height: 0.03, colors: { main: WHITE } },
    ],
    front: [{ view: 'side', logo: 'west', x: 2.24, y: 0.2, height: 0.05 }],
  },
};

const BMW_NAVY = '#1B2F7A';
const WILLIAMS: Livery = {
  id: 'williams-2004',
  name: 'Williams',
  era: 'gen2004',
  team: 'BMW WilliamsF1 Team',
  price: 120,
  primary: '#F2F4F8',
  secondary: BMW_NAVY,
  glow: '#2F5BD6',
  sidepod: 'v10',
  finish: 'gloss',
  helmet: '#DDE6F8',
  parts: solidParts('#F2F2F2', '#F2F2F2', '#F2F2F2'),
  frontParts: { wing: BMW_NAVY, flap: '#F2F2F2', endplate: BMW_NAVY },
  top: [
    // white on top with the navy band down the walrus nose, navy sidepods
    { color: BMW_NAVY, path: 'M2.3 0.035 C2.0 0.05 1.6 0.06 1.0 0.07 L1.0 -0.07 C1.6 -0.06 2.0 -0.05 2.3 -0.035 Z' },
    { color: '#F2F4F8', path: 'M2.2 0.012 L1.05 0.02 L1.05 -0.02 L2.2 -0.012 Z' },
    { color: BMW_NAVY, symmetric: true, path: 'M0.85 0.28 C0.3 0.4 -0.6 0.66 -1.4 0.6 L-1.4 0.28 Z' },
  ],
  side: [
    // the navy sidepods and lower body under the white upper body, and navy along the bottom of the nose
    { color: BMW_NAVY, path: 'M0.85 0.06 L0.85 0.5 C0.5 0.56 0.0 0.56 -0.6 0.52 C-1.1 0.48 -1.5 0.4 -1.95 0.34 L-1.95 0.06 Z' },
    { color: BMW_NAVY, path: 'M2.28 0.22 L2.28 0.28 C1.9 0.32 1.4 0.38 1.0 0.42 L1.0 0.26 C1.4 0.24 1.9 0.23 2.28 0.22 Z' },
  ],
  decals: [
    { view: 'side', logo: 'castrol', x: 0.35, y: 0.38, height: 0.07 },
    { view: 'side', logo: 'hp-box', x: -0.55, y: 0.36, height: 0.11, colors: { box: WHITE, main: BMW_NAVY } },
    { view: 'side', logo: 'petrobras', x: 0.35, y: 0.55, height: 0.025, colors: { main: WHITE } },
    { view: 'side', logo: 'budweiser', x: -0.85, y: 0.62, height: 0.04 },
    { view: 'side', logo: 'fedex', x: -1.3, y: 0.42, height: 0.035, colors: { fed: WHITE, ex: WHITE } },
    { view: 'side', logo: 'reuters', x: 1.25, y: 0.5, height: 0.025 },
    { view: 'side', logo: 'allianz', x: -0.9, y: 0.2, height: 0.025 },
    { view: 'side', logo: 'bmw', x: 1.95, y: 0.36, height: 0.06 },
    // on top: the BMW roundel, Castrol, Reuters and Hamleys along the nose, HP on the rear wing, FedEx and HP on the front
    { view: 'top', logo: 'bmw', x: 2.1, y: 0, height: 0.06 },
    { view: 'top', logo: 'castrol', x: 1.75, y: 0, height: 0.035, rotate: 90 },
    { view: 'top', logo: 'reuters', x: 1.45, y: 0, height: 0.022, rotate: 180 },
    { view: 'top', logo: 'hamleys', x: 1.2, y: 0, height: 0.03, rotate: 180 },
    { view: 'top', logo: 'hp-box', x: -1.84, y: 0, height: 0.065, orient: 'across-rear' },
    { view: 'top', logo: 'fedex', x: 2.33, y: 0.4, height: 0.05, orient: 'across-front', colors: { fed: WHITE, ex: WHITE } },
    { view: 'top', logo: 'fedex', x: 2.33, y: -0.4, height: 0.05, orient: 'across-front', colors: { fed: WHITE, ex: WHITE } },
    { view: 'top', logo: 'hp-box', x: 2.2, y: 0.4, height: 0.05, orient: 'across-front' },
    { view: 'top', logo: 'hp-box', x: 2.2, y: -0.4, height: 0.05, orient: 'across-front' },
  ],
  texts: numbers('3', { x: 1.7, y: 0.46, h: 0.06, color: BMW_NAVY }, { x: 1.8, color: BMW_NAVY }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'fedex', x: -1.82, y: 0.78, height: 0.045 },
      { view: 'side', logo: 'hp-box', x: -1.82, y: 0.62, height: 0.06 },
    ],
    front: [{ view: 'side', logo: 'hp-box', x: 2.24, y: 0.2, height: 0.05 }],
  },
};

const R_BLUE = '#3FA3E8';
const R_YELLOW = '#FFD800';
const R_NAVY = '#0B1E5B';
const RENAULT: Livery = {
  id: 'renault-2004',
  name: 'Renault',
  era: 'gen2004',
  team: 'Mild Seven Renault F1',
  price: 150,
  primary: R_BLUE,
  secondary: R_YELLOW,
  sidepod: 'v10',
  finish: 'gloss',
  helmet: R_YELLOW,
  parts: solidParts(R_BLUE, R_BLUE, R_NAVY),
  frontParts: { wing: R_NAVY, flap: R_NAVY, endplate: R_NAVY },
  top: [
    // the yellow nose and chassis and the yellow front of the sidepods; blue behind; a navy tail and nose tip
    { color: R_YELLOW, path: 'M2.1 0.16 C1.6 0.2 1.0 0.24 0.3 0.25 L0.3 -0.25 C1.0 -0.24 1.6 -0.2 2.1 -0.16 Z' },
    { color: R_YELLOW, symmetric: true, path: 'M0.85 0.2 C0.7 0.5 0.5 0.62 0.1 0.62 C0.0 0.45 0.0 0.3 0.05 0.2 Z' },
    { color: R_NAVY, path: 'M2.3 0.04 C2.25 0.06 2.18 0.07 2.1 0.07 L2.1 -0.07 C2.18 -0.07 2.25 -0.06 2.3 -0.04 Z' },
    { color: R_NAVY, path: 'M-1.5 0.1 C-1.7 0.09 -1.85 0.07 -1.95 0.05 L-1.95 -0.05 C-1.85 -0.07 -1.7 -0.09 -1.5 -0.1 Z' },
  ],
  side: [
    // the yellow nose, chassis and sidepod front, curving into the blue; navy floor edge and nose tip
    { color: R_YELLOW, path: 'M2.1 0.26 L2.1 0.46 C1.6 0.6 1.0 0.74 0.3 0.8 L0.3 0.62 C0.2 0.5 0.1 0.38 0.05 0.3 C0.05 0.22 0.1 0.16 0.2 0.14 L0.85 0.14 C1.3 0.18 1.7 0.22 2.1 0.26 Z' },
    floorEdge(0.14, R_NAVY),
    { color: R_NAVY, path: 'M2.3 0.26 L2.3 0.36 L2.1 0.4 L2.1 0.26 Z' },
  ],
  decals: [
    { view: 'side', logo: 'mild-seven', x: 0.42, y: 0.42, height: 0.06, colors: { main: R_BLUE, disc: WHITE } },
    { view: 'side', logo: 'mild-seven', x: -0.65, y: 0.4, height: 0.06 },
    { view: 'side', logo: 'hanjin', x: 0.75, y: 0.56, height: 0.025 },
    { view: 'side', logo: 'elf', x: 1.2, y: 0.46, height: 0.06 },
    { view: 'side', logo: 'renault-diamond', x: -1.15, y: 0.62, height: 0.06 },
    { view: 'side', logo: 'michelin', x: -1.3, y: 0.24, height: 0.022 },
    // on top: elf and the Renault diamond on the nose, Telefonica on the rear wing, Mild Seven on the front wing
    { view: 'top', logo: 'renault-diamond', x: 1.75, y: 0, height: 0.06, colors: { main: R_NAVY } },
    { view: 'top', logo: 'elf', x: 1.45, y: 0, height: 0.05, rotate: 90 },
    { view: 'top', logo: 'mild-seven', x: 0.75, y: 0, height: 0.045, rotate: 90, colors: { main: R_NAVY } },
    { view: 'top', logo: 'telefonica', x: -1.84, y: 0, height: 0.05, orient: 'across-rear' },
    { view: 'top', logo: 'mild-seven', x: 2.3, y: 0.4, height: 0.04, orient: 'across-front' },
    { view: 'top', logo: 'mild-seven', x: 2.3, y: -0.4, height: 0.04, orient: 'across-front' },
  ],
  texts: numbers('8', { x: 1.6, y: 0.44, h: 0.06, color: R_NAVY }, { x: 2.0, color: R_NAVY }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'michelin', x: -1.82, y: 0.78, height: 0.035 },
      { view: 'side', logo: 'elf', x: -1.82, y: 0.62, height: 0.06 },
    ],
    front: [{ view: 'side', logo: 'mode', x: 2.24, y: 0.2, height: 0.035 }],
  },
};

const BAR_RED = '#E10600';
const BAR_KHAKI = '#C8C09A';
const BAR: Livery = {
  id: 'bar-2004',
  name: 'BAR',
  era: 'gen2004',
  team: 'Lucky Strike BAR Honda',
  price: 180,
  primary: '#F4F4F4',
  secondary: BAR_RED,
  glow: BAR_RED,
  sidepod: 'v10',
  finish: 'gloss',
  helmet: '#F4F4F4',
  parts: solidParts(BLACK, BLACK, BLACK),
  frontParts: { wing: '#F4F4F4', flap: '#F4F4F4', endplate: BLACK },
  top: [
    // the red airbox, the khaki Intercond band and the black rear of the engine cover, a red nose tip
    { color: BAR_RED, path: 'M0.05 0.13 C-0.1 0.15 -0.35 0.14 -0.5 0.12 L-0.5 -0.12 C-0.35 -0.14 -0.1 -0.15 0.05 -0.13 Z' },
    { color: BAR_KHAKI, path: 'M-0.5 0.12 L-0.8 0.12 L-0.8 -0.12 L-0.5 -0.12 Z' },
    { color: BLACK, path: 'M-0.8 0.12 C-1.2 0.12 -1.6 0.1 -1.95 0.06 L-1.95 -0.06 C-1.6 -0.1 -1.2 -0.12 -0.8 -0.12 Z' },
    { color: BAR_RED, path: 'M2.3 0.035 C2.25 0.05 2.2 0.055 2.15 0.055 L2.15 -0.055 C2.2 -0.055 2.25 -0.05 2.3 -0.035 Z' },
  ],
  side: [
    // red airbox, the khaki band and the black rear cover, a red band low on the sidepod and the black floor edge
    { color: BAR_RED, path: 'M0.05 0.7 L0.05 0.98 L-0.5 0.96 L-0.5 0.7 C-0.3 0.69 -0.1 0.69 0.05 0.7 Z' },
    { color: BAR_KHAKI, path: 'M-0.5 0.6 L-0.5 0.96 L-0.85 0.9 L-0.85 0.56 Z' },
    { color: BLACK, path: 'M-0.85 0.9 L-0.85 0.56 C-1.2 0.5 -1.6 0.44 -1.95 0.42 L-1.95 0.5 C-1.6 0.62 -1.2 0.76 -0.85 0.9 Z' },
    { color: BAR_RED, path: 'M0.85 0.14 L0.85 0.28 C0.3 0.3 -0.8 0.3 -1.9 0.32 L-1.9 0.14 Z' },
    floorEdge(0.1),
  ],
  decals: [
    { view: 'side', logo: 'lucky-strike', x: -0.3, y: 0.36, height: 0.3 },
    { view: 'side', logo: 'honda-serif', x: -0.5, y: 0.48, height: 0.045 },
    { view: 'side', logo: 'intercond', x: -0.67, y: 0.78, height: 0.022, colors: { main: '#555555' } },
    { view: 'side', logo: 'ray-ban', x: 0.5, y: 0.5, width: 0.16, colors: { main: BAR_RED } },
    { view: 'side', logo: 'michelin', x: 0.15, y: 0.55, height: 0.022, colors: { main: '#111111' } },
    // on top: Lucky Strike and Honda along the car, Lucky Strike on the rear wing, Honda on the front
    { view: 'top', logo: 'lucky-strike', x: 1.55, y: 0, height: 0.1 },
    { view: 'top', logo: 'honda-serif', x: -1.2, y: 0, height: 0.05, rotate: 180, colors: { main: WHITE } },
    { view: 'top', logo: 'lucky-strike', x: -1.84, y: 0, height: 0.08, orient: 'across-rear' },
    { view: 'top', logo: 'honda-serif', x: 2.3, y: 0.4, height: 0.045, orient: 'across-front' },
    { view: 'top', logo: 'honda-serif', x: 2.3, y: -0.4, height: 0.045, orient: 'across-front' },
  ],
  texts: numbers('9', { x: 1.7, y: 0.42, h: 0.06, color: BAR_RED }, { x: 1.95, color: BAR_RED }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'intercond', x: -1.82, y: 0.84, height: 0.03 },
      { view: 'side', logo: 'lucky-strike', x: -1.82, y: 0.64, height: 0.12 },
    ],
    front: [{ view: 'side', logo: 'lucky-strike', x: 2.24, y: 0.2, height: 0.08 }],
  },
};

const J_GREEN = '#0F5A3C';
const J_SILVER = '#C8CCD2';
const JAGUAR: Livery = {
  id: 'jaguar-2004',
  name: 'Jaguar',
  era: 'gen2004',
  team: 'Jaguar Racing',
  price: 210,
  primary: J_GREEN,
  secondary: J_SILVER,
  glow: '#18B26B',
  sidepod: 'v10',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: solidParts(J_GREEN, J_GREEN, J_SILVER),
  frontParts: { wing: J_SILVER, flap: J_SILVER, endplate: J_SILVER },
  top: [
    // silver sidepod tops edged in red, the leaping cat along the engine cover
    { color: J_SILVER, symmetric: true, path: 'M0.85 0.3 C0.4 0.62 -0.6 0.66 -1.4 0.5 L-1.4 0.3 Z' },
    { color: '#D21F26', symmetric: true, path: 'M0.85 0.28 C0.4 0.6 -0.6 0.64 -1.4 0.48 L-1.4 0.45 C-0.6 0.61 0.4 0.57 0.85 0.25 Z' },
  ],
  side: [
    // the silver lower body with its red line, green above
    { color: J_SILVER, path: 'M0.85 0.12 L0.85 0.56 C0.5 0.6 0.0 0.6 -0.6 0.56 C-1.1 0.52 -1.5 0.44 -1.9 0.38 L-1.9 0.12 Z' },
    { color: '#D21F26', path: 'M0.85 0.56 C0.5 0.6 0.0 0.6 -0.6 0.56 C-1.1 0.52 -1.5 0.44 -1.9 0.38 L-1.9 0.36 C-1.5 0.42 -1.1 0.5 -0.6 0.54 C0.0 0.58 0.5 0.58 0.85 0.54 Z' },
    { color: J_SILVER, path: 'M2.28 0.22 L2.28 0.28 C1.8 0.34 1.3 0.42 0.85 0.5 L0.85 0.3 C1.3 0.27 1.8 0.24 2.28 0.22 Z' },
    floorEdge(0.12),
  ],
  decals: [
    { view: 'side', logo: 'hsbc-hexagon', x: -0.65, y: 0.33, height: 0.2 },
    { view: 'side', logo: 'att-globe', x: 0.35, y: 0.42, height: 0.05 },
    { view: 'side', logo: 'jaguar-leaper', x: -0.95, y: 0.7, width: 0.8 },
    { view: 'side', logo: 'hsbc', x: 0.0, y: 0.66, height: 0.035, colors: { main: WHITE } },
    { view: 'side', logo: 'becks', x: -0.25, y: 0.86, height: 0.022 },
    { view: 'side', logo: 'dupont', x: 1.75, y: 0.36, height: 0.04, colors: { main: J_GREEN, ring: J_GREEN } },
    { view: 'side', logo: 'castrol', x: -0.6, y: 0.62, height: 0.03 },
    // on top: the cat over the cover, Beck's on the nose, the HSBC hexagons on the rear wing, UGS on the front
    { view: 'top', logo: 'jaguar-leaper', x: -0.9, y: 0, width: 0.6, mirror: true },
    { view: 'top', logo: 'becks', x: 1.5, y: 0, height: 0.035, rotate: 180 },
    { view: 'top', logo: 'hsbc-hexagon', x: -1.84, y: 0.2, height: 0.07, orient: 'across-rear' },
    { view: 'top', logo: 'hsbc-hexagon', x: -1.84, y: -0.2, height: 0.07, orient: 'across-rear' },
    { view: 'top', logo: 'ugs', x: 2.3, y: 0.4, height: 0.045, orient: 'across-front' },
    { view: 'top', logo: 'ugs', x: 2.3, y: -0.4, height: 0.045, orient: 'across-front' },
  ],
  texts: numbers('14', { x: 2.0, y: 0.33, h: 0.05, color: WHITE }, { x: 1.85, color: WHITE }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'hsbc', x: -1.82, y: 0.78, height: 0.04 },
      { view: 'side', logo: 'michelin', x: -1.82, y: 0.62, height: 0.03, colors: { main: J_GREEN } },
    ],
    front: [{ view: 'side', logo: 'pioneer', x: 2.24, y: 0.2, height: 0.03 }],
  },
};

const T_RED = '#E10600';
const TOYOTA: Livery = {
  id: 'toyota-2004',
  name: 'Toyota',
  era: 'gen2004',
  team: 'Panasonic Toyota Racing',
  price: 240,
  primary: '#F2F2F2',
  secondary: T_RED,
  sidepod: 'v10',
  finish: 'gloss',
  helmet: '#1E88E5',
  parts: solidParts('#F2F2F2', '#F2F2F2', '#F2F2F2'),
  frontParts: { wing: '#F2F2F2', flap: '#F2F2F2', endplate: T_RED },
  top: [
    // the red brush strokes over the front of the sidepods and along the nose, a red nose tip
    { color: T_RED, symmetric: true, path: 'M0.85 0.2 C0.7 0.45 0.55 0.6 0.3 0.62 C0.4 0.55 0.42 0.5 0.3 0.48 C0.15 0.44 0.1 0.34 0.1 0.2 Z' },
    { color: T_RED, path: 'M2.3 0.04 C2.0 0.07 1.5 0.09 1.0 0.1 L1.0 -0.1 C1.5 -0.09 2.0 -0.07 2.3 -0.04 Z' },
  ],
  side: [
    // the red brush over the sidepod front, rough-edged as it fades back; red along the nose
    { color: T_RED, path: 'M0.85 0.14 L0.85 0.58 C0.6 0.62 0.4 0.62 0.25 0.6 C0.32 0.54 0.2 0.5 0.08 0.48 C0.18 0.44 0.1 0.38 -0.05 0.36 C0.05 0.3 0.0 0.24 -0.15 0.22 C-0.05 0.18 0.1 0.15 0.25 0.14 Z' },
    { color: T_RED, path: 'M2.28 0.24 L2.28 0.4 C1.8 0.5 1.3 0.6 0.85 0.66 L0.85 0.5 C1.3 0.44 1.8 0.34 2.28 0.24 Z' },
    floorEdge(0.1),
  ],
  decals: [
    { view: 'side', logo: 'panasonic', x: -0.55, y: 0.3, height: 0.07 },
    { view: 'side', logo: 'toyota', x: -0.6, y: 0.66, height: 0.045 },
    { view: 'side', logo: 'denso', x: -0.45, y: 0.78, height: 0.035 },
    { view: 'side', logo: 'esso', x: -0.1, y: 0.88, height: 0.035 },
    { view: 'side', logo: 'karcher', x: 0.55, y: 0.66, height: 0.02 },
    { view: 'side', logo: 'kddi', x: -1.3, y: 0.42, height: 0.025 },
    { view: 'side', logo: 'time', x: 2.05, y: 0.3, height: 0.02, colors: { main: WHITE } },
    // on top: the emblem on the nose, Toyota along it, Panasonic across the wings
    { view: 'top', logo: 'toyota-emblem', x: 2.0, y: 0, height: 0.05, colors: { main: WHITE } },
    { view: 'top', logo: 'toyota', x: 1.45, y: 0, height: 0.035, rotate: 180 },
    { view: 'top', logo: 'panasonic', x: -1.84, y: 0, height: 0.05, orient: 'across-rear' },
    { view: 'top', logo: 'panasonic', x: 2.3, y: 0.4, height: 0.04, orient: 'across-front' },
    { view: 'top', logo: 'panasonic', x: 2.3, y: -0.4, height: 0.04, orient: 'across-front' },
  ],
  texts: numbers('17', { x: 1.7, y: 0.4, h: 0.06, color: WHITE }, { x: 1.75, color: WHITE }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'toyota', x: -1.82, y: 0.78, height: 0.04 },
      { view: 'side', logo: 'esso', x: -1.82, y: 0.62, height: 0.05 },
    ],
    front: [{ view: 'side', logo: 'michelin', x: 2.24, y: 0.2, height: 0.025 }],
  },
};

export const LIVERIES_GEN2004: readonly Livery[] = [FERRARI, MCLAREN, WILLIAMS, RENAULT, BAR, JAGUAR, TOYOTA];
