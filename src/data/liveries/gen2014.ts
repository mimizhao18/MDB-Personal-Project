import { halftone, BLACK, CARBON, WHITE } from '../liveryHelpers';
import type { Livery, LiveryLayer } from '../liveryTypes';

// 2014 (the first V6 turbo-hybrid season): the best-known liveries, drawn from the 2014 photos in
// reference/gen2014/liveries/. Shapes are in the car's own measurements (see src/data/cars/gen2014.ts): nose 2.75,
// front axle 1.8, sidepods 1.0 to -2.1 (their top 0.6 at the front, 0.38 at -1.2), rear axle -1.8, tail -2.3;
// floor edge 0.06 to 0.17, airbox top 1.0. The ids are the save keys and never change; `renault-2014` is the
// Renault-engined Lotus E22. Logos come from src/data/logos; numbers are the race drivers'.

const parts = (wing: string, flap = wing, endplate = wing) => ({ wing, flap, endplate, floor: CARBON });
/** The black floor edge under the sidepod. */
const floorEdge = (top = 0.16, color = BLACK): LiveryLayer => ({ color, path: `M1.0 0.06 L1.0 ${top} C0.4 ${top} -0.8 ${top} -2.1 ${top + 0.06} L-2.1 0.06 Z` });
/** A number on the engine cover and on the nose. */
const numbers = (n: string, side: { x: number; y: number; h: number; color: string }, top: { x?: number; color: string }, more: { slant?: number; outline?: { color: string; width: number } } = {}) => [
  { view: 'side' as const, text: n, x: side.x, y: side.y, height: side.h, color: side.color, font: 'sans' as const, weight: 900 as const, slant: more.slant, outline: more.outline, align: 'center' as const },
  { view: 'top' as const, text: n, x: top.x ?? 1.55, y: 0, height: 0.1, color: top.color, font: 'sans' as const, weight: 900 as const, slant: more.slant, outline: more.outline, align: 'center' as const },
];

const F_RED = '#DC0000';
const FERRARI: Livery = {
  id: 'ferrari-2014',
  name: 'Ferrari',
  era: 'gen2014',
  team: 'Scuderia Ferrari',
  price: 50,
  primary: F_RED,
  secondary: '#FFFFFF',
  sidepod: 'hybrid',
  finish: 'gloss',
  helmet: '#E8E8E8',
  parts: parts(BLACK, BLACK, F_RED),
  frontParts: { wing: F_RED, flap: BLACK, endplate: BLACK },
  top: [
    // the white wedge on the rear of the engine cover, a black tail
    { color: WHITE, path: 'M-0.95 0.17 C-1.2 0.16 -1.45 0.12 -1.7 0.08 L-1.7 -0.08 C-1.45 -0.12 -1.2 -0.16 -0.95 -0.17 Z' },
    { color: BLACK, path: 'M-1.9 0.1 C-2.1 0.08 -2.25 0.05 -2.3 0.03 L-2.3 -0.03 C-2.25 -0.05 -2.1 -0.08 -1.9 -0.1 Z' },
  ],
  side: [
    floorEdge(0.17),
    // the white wedge on the engine cover that carries the Scuderia Ferrari name, pointing back
    { color: WHITE, path: 'M-0.85 0.9 L-0.85 0.66 C-1.2 0.62 -1.5 0.6 -1.75 0.58 C-1.5 0.68 -1.2 0.8 -0.85 0.9 Z' },
    // the white Santander box low on the front of the sidepod
    { color: WHITE, path: 'M0.95 0.2 L0.95 0.3 L0.55 0.3 L0.5 0.2 Z' },
  ],
  decals: [
    { view: 'side', logo: 'shell', x: 0.3, y: 0.38, height: 0.2, colors: { key: WHITE } },
    { view: 'side', logo: 'ups', x: -0.3, y: 0.36, height: 0.13 },
    { view: 'side', logo: 'santander', x: 1.75, y: 0.4, height: 0.045 },
    { view: 'side', logo: 'santander', x: 0.73, y: 0.25, height: 0.035, colors: { main: F_RED, mark: F_RED } },
    { view: 'side', logo: 'ferrari-shield', x: 0.85, y: 0.55, height: 0.08 },
    { view: 'side', logo: 'scuderia-ferrari', x: -1.18, y: 0.71, height: 0.028 },
    { view: 'side', logo: 'hublot', x: 0.55, y: 0.6, height: 0.025 },
    { view: 'side', logo: 'weichai', x: -0.8, y: 0.34, height: 0.03 },
    { view: 'side', logo: 'kaspersky', x: 2.3, y: 0.3, height: 0.025 },
    { view: 'side', logo: 'infor', x: 0.0, y: 0.1, height: 0.03 },
    { view: 'side', logo: 'fiat', x: -1.95, y: 0.55, height: 0.04 },
    // on top: the shield and Santander on the nose, the pecten, Santander across the wings
    { view: 'top', logo: 'ferrari-shield', x: 2.4, y: 0, height: 0.06, rotate: 90 },
    { view: 'top', logo: 'santander', x: 2.0, y: 0, height: 0.04, rotate: 180 },
    { view: 'top', logo: 'shell', x: 1.2, y: 0, height: 0.12, rotate: 90 },
    { view: 'top', logo: 'santander', x: -2.35, y: 0, height: 0.055, orient: 'across-rear' },
    { view: 'top', logo: 'santander', x: 2.7, y: 0.45, height: 0.045, orient: 'across-front' },
    { view: 'top', logo: 'santander', x: 2.7, y: -0.45, height: 0.045, orient: 'across-front' },
  ],
  texts: numbers('7', { x: 2.05, y: 0.32, h: 0.07, color: WHITE }, { x: 1.6, color: WHITE }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'shell-vpower', x: -2.35, y: 0.82, height: 0.05 },
      { view: 'side', logo: 'santander', x: -2.35, y: 0.68, height: 0.04 },
    ],
    front: [{ view: 'side', logo: 'santander', x: 2.5, y: 0.26, height: 0.035 }],
  },
};

const M_SILVER = '#C5C9CD';
const M_TEAL = '#00A19C';
const MERCEDES: Livery = {
  id: 'mercedes-2014',
  name: 'Mercedes',
  era: 'gen2014',
  team: 'Mercedes AMG Petronas F1 Team',
  price: 80,
  primary: M_SILVER,
  secondary: '#00D2BE',
  glow: '#00D2BE',
  sidepod: 'hybrid',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: parts(M_SILVER, M_SILVER, M_SILVER),
  frontParts: { wing: M_SILVER, flap: M_TEAL, endplate: M_SILVER },
  top: [
    // silver, with the teal sweep over the sidepods and a teal line down the engine cover
    { color: M_TEAL, symmetric: true, path: 'M0.95 0.4 C0.5 0.58 0.0 0.68 -0.5 0.64 C-0.9 0.6 -1.15 0.52 -1.25 0.46 L-1.2 0.42 C-1.0 0.5 -0.6 0.57 -0.3 0.58 C0.2 0.58 0.6 0.48 0.92 0.35 Z' },
    { color: M_TEAL, path: 'M-0.5 0.012 L-2.0 0.008 L-2.0 -0.008 L-0.5 -0.012 Z' },
  ],
  side: [
    floorEdge(0.14),
    // the teal sweep rising from the floor along the sidepod to the engine cover, a teal line along the nose
    { color: M_TEAL, path: 'M1.0 0.14 C1.0 0.24 0.8 0.34 0.3 0.42 C-0.4 0.48 -1.2 0.54 -1.9 0.5 L-1.9 0.44 C-1.2 0.46 -0.4 0.38 0.3 0.28 C0.6 0.22 0.8 0.17 0.85 0.14 Z' },
    { color: M_TEAL, path: 'M1.2 0.5 C1.6 0.45 2.1 0.38 2.6 0.28 L2.6 0.3 C2.1 0.4 1.6 0.47 1.2 0.52 Z' },
  ],
  decals: [
    { view: 'side', logo: 'petronas', x: -0.35, y: 0.34, height: 0.075, colors: { main: WHITE, mark: WHITE, inner: M_TEAL } },
    { view: 'side', logo: 'blackberry', x: 0.75, y: 0.5, height: 0.035 },
    { view: 'side', logo: 'mercedes-star', x: 1.6, y: 0.42, height: 0.08, colors: { main: '#2A2C30', shade: '#55595F' } },
    { view: 'side', logo: 'petronas-primax', x: -1.5, y: 0.62, height: 0.02 },
    { view: 'side', logo: 'amg', x: -0.9, y: 0.72, height: 0.035, colors: { main: '#111111' } },
    { view: 'side', logo: 'swissquote', x: 2.05, y: 0.36, height: 0.02 },
    { view: 'side', logo: 'iwc', x: 0.55, y: 0.6, height: 0.03 },
    // on top: the star at the nose, Petronas along it, Petronas across the wings
    { view: 'top', logo: 'mercedes-star', x: 2.45, y: 0, height: 0.09 },
    { view: 'top', logo: 'petronas-word', x: 2.0, y: 0, height: 0.04, rotate: 180 },
    { view: 'top', logo: 'petronas-word', x: -2.35, y: 0, height: 0.06, orient: 'across-rear' },
    { view: 'top', logo: 'petronas-word', x: 2.7, y: 0.45, height: 0.045, orient: 'across-front' },
    { view: 'top', logo: 'petronas-word', x: 2.7, y: -0.45, height: 0.045, orient: 'across-front' },
  ],
  texts: numbers('44', { x: 1.25, y: 0.46, h: 0.08, color: '#D40000' }, { color: '#D40000' }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'swissquote', x: -2.35, y: 0.8, height: 0.03 },
      { view: 'side', logo: 'petronas-word', x: -2.35, y: 0.66, height: 0.035 },
    ],
    front: [{ view: 'side', logo: 'petronas-word', x: 2.5, y: 0.26, height: 0.035 }],
  },
};

const MCLAREN: Livery = {
  id: 'mclaren-2014',
  name: 'McLaren',
  era: 'gen2014',
  team: 'McLaren Mercedes',
  price: 110,
  primary: '#B9BDC3',
  secondary: '#0E0E10',
  glow: '#E10600',
  sidepod: 'hybrid',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: parts(BLACK, BLACK, BLACK),
  top: [
    // chrome fading into black toward the tail and the sidepod edges
    { path: 'M2.9 0.8 L-2.4 0.8 L-2.4 -0.8 L2.9 -0.8 Z', gradient: { from: [0.6, 0], to: [-1.6, 0], stops: [[0, '#C3C7CC'], [0.55, '#6A6E74'], [1, BLACK]] } },
  ],
  side: [
    // the chrome running down into black: the lower body and the rear are black, the top and the nose silver
    { path: 'M2.9 0.06 L2.9 1.0 L-2.4 1.0 L-2.4 0.06 Z', gradient: { from: [0.3, 0.75], to: [-0.4, 0.15], stops: [[0, '#C3C7CC'], [0.5, '#7A7E84'], [1, BLACK]] } },
    halftone(BLACK, -0.55, -1.25, 0.06, 1.0, 0.03, 0, 0.022),
    { color: BLACK, path: 'M-1.2 1.0 L-2.4 1.0 L-2.4 0.06 L-1.2 0.06 Z' },
    { color: '#E10600', path: 'M2.2 0.27 L2.2 0.4 L1.95 0.43 L1.95 0.3 Z' },
  ],
  decals: [
    { view: 'side', logo: 'sap', x: -0.1, y: 0.36, height: 0.12 },
    { view: 'side', logo: 'johnnie-walker', x: -0.95, y: 0.66, height: 0.09 },
    { view: 'side', logo: 'mobil1', x: 0.6, y: 0.5, height: 0.035, colors: { main: '#111111' } },
    { view: 'side', logo: 'gsk', x: -1.25, y: 0.4, height: 0.03 },
    { view: 'side', logo: 'hugo-boss', x: 0.2, y: 0.62, height: 0.022 },
    { view: 'side', logo: 'santander', x: 1.4, y: 0.47, height: 0.03, colors: { main: '#E10600', mark: '#E10600' } },
    // on top: Mobil 1 on the nose, Johnnie Walker on the rear wing, asos across the front flaps
    { view: 'top', logo: 'mobil1', x: 1.9, y: 0, height: 0.04, rotate: 180, colors: { main: '#111111' } },
    { view: 'top', logo: 'johnnie-walker', x: -2.35, y: 0, height: 0.07, orient: 'across-rear' },
    { view: 'top', logo: 'asos', x: 2.7, y: 0.45, height: 0.04, orient: 'across-front' },
    { view: 'top', logo: 'asos', x: 2.7, y: -0.45, height: 0.04, orient: 'across-front' },
  ],
  texts: numbers('22', { x: 2.05, y: 0.33, h: 0.07, color: WHITE }, { x: 1.6, color: '#111111' }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'johnnie-walker', x: -2.35, y: 0.8, height: 0.05 },
      { view: 'side', logo: 'asos', x: -2.35, y: 0.64, height: 0.035 },
    ],
    front: [{ view: 'side', logo: 'santander', x: 2.5, y: 0.26, height: 0.035 }],
  },
};

const RB_NAVY = '#1C1F4F';
const RB_RED = '#E4002B';
const RB_YELLOW = '#FFC500';
const REDBULL: Livery = {
  id: 'redbull-2014',
  name: 'Red Bull',
  era: 'gen2014',
  team: 'Infiniti Red Bull Racing',
  price: 140,
  primary: RB_NAVY,
  secondary: RB_RED,
  glow: RB_RED,
  sidepod: 'hybrid',
  finish: 'matte',
  helmet: RB_NAVY,
  parts: parts(RB_NAVY, RB_NAVY, RB_RED),
  frontParts: { wing: RB_NAVY, flap: RB_NAVY, endplate: RB_RED },
  top: [
    // the purple sheen over the navy, the yellow nose and airbox, the bulls over the engine cover
    { path: 'M2.9 0.8 L-2.4 0.8 L-2.4 -0.8 L2.9 -0.8 Z', gradient: { from: [1.0, 0], to: [-1.8, 0], stops: [[0, RB_NAVY], [0.5, '#3A2A6E'], [1, RB_NAVY]] } },
    { path: 'M2.75 0.03 C2.4 0.07 2.0 0.1 1.6 0.11 C1.5 0.08 1.5 -0.08 1.6 -0.11 C2.0 -0.1 2.4 -0.07 2.75 -0.03 Z', gradient: { from: [2.75, 0], to: [1.55, 0], stops: [[0, '#FFD21A'], [1, '#FFB100']] } },
    { path: 'M0.06 0.13 C-0.1 0.15 -0.35 0.14 -0.5 0.08 L-0.5 -0.08 C-0.35 -0.14 -0.1 -0.15 0.06 -0.13 Z', gradient: { from: [0.05, 0], to: [-0.5, 0], stops: [[0, RB_YELLOW], [1, '#F39200']] } },
  ],
  side: [
    // the navy body with its purple sheen, the yellow airbox and nose, the red stripe along the pod and floor edge
    { path: 'M2.9 0.06 L2.9 1.0 L-2.4 1.0 L-2.4 0.06 Z', gradient: { from: [0.5, 0.2], to: [-1.0, 0.8], stops: [[0, RB_NAVY], [0.6, '#3A2A6E'], [1, RB_NAVY]] } },
    { path: 'M0.06 0.74 L0.06 0.99 L-0.5 0.98 C-0.6 0.88 -0.7 0.8 -0.8 0.74 Z', gradient: { from: [0.05, 0.9], to: [-0.8, 0.75], stops: [[0, RB_YELLOW], [1, '#F39200']] } },
    { path: 'M2.73 0.24 L2.73 0.3 C2.4 0.36 2.0 0.42 1.6 0.46 C1.55 0.4 1.55 0.32 1.6 0.28 C2.0 0.27 2.4 0.25 2.73 0.24 Z', gradient: { from: [2.7, 0], to: [1.6, 0], stops: [[0, '#FFD21A'], [1, '#FFB100']] } },
    { color: RB_RED, path: 'M1.0 0.44 C0.4 0.52 -0.4 0.5 -1.0 0.42 L-1.0 0.4 C-0.4 0.48 0.4 0.5 1.0 0.42 Z' },
    { color: RB_RED, path: 'M1.0 0.075 L-2.1 0.075 L-2.1 0.1 L1.0 0.1 Z' },
  ],
  decals: [
    { view: 'side', logo: 'redbull', x: -0.95, y: 0.66, width: 0.45 },
    { view: 'side', logo: 'redbull-bull', x: 2.15, y: 0.34, width: 0.36, mirror: true },
    { view: 'side', logo: 'infiniti', x: -0.3, y: 0.42, height: 0.19 },
    { view: 'side', logo: 'renault-diamond', x: -1.45, y: 0.5, height: 0.06 },
    { view: 'side', logo: 'casio', x: 0.55, y: 0.36, height: 0.025 },
    { view: 'side', logo: 'pepe-jeans', x: 0.6, y: 0.56, height: 0.025 },
    { view: 'side', logo: 'rauch', x: 1.15, y: 0.4, height: 0.03 },
    { view: 'side', logo: 'total', x: 1.95, y: 0.24, height: 0.035 },
    // on top: the bull along the nose, the bulls on the cover, Infiniti on the rear wing, TOTAL on the front flaps
    { view: 'top', logo: 'redbull-bull', x: 2.15, y: 0, width: 0.38, mirror: true },
    { view: 'top', logo: 'redbull', x: -0.95, y: 0, width: 0.3, rotate: 90 },
    { view: 'top', logo: 'infiniti', x: -2.35, y: 0, height: 0.07, orient: 'across-rear' },
    { view: 'top', logo: 'total', x: 2.7, y: 0.45, height: 0.05, orient: 'across-front' },
    { view: 'top', logo: 'total', x: 2.7, y: -0.45, height: 0.05, orient: 'across-front' },
  ],
  texts: numbers('1', { x: 1.3, y: 0.52, h: 0.08, color: RB_RED }, { x: 1.2, color: RB_RED }, { slant: 10 }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'total', x: -2.35, y: 0.82, height: 0.06 },
      { view: 'side', logo: 'infiniti', x: -2.35, y: 0.62, height: 0.07 },
    ],
    front: [{ view: 'side', logo: 'total', x: 2.5, y: 0.26, height: 0.05 }],
  },
};

const FI_SAFFRON = '#F08A1D';
const FI_GREEN = '#1A8A4A';
const FI_SILVER = '#E6E8EA';
const FORCEINDIA: Livery = {
  id: 'forceindia-2014',
  name: 'Force India',
  era: 'gen2014',
  team: 'Sahara Force India F1 Team',
  price: 170,
  primary: '#111114',
  secondary: FI_SAFFRON,
  glow: FI_SAFFRON,
  sidepod: 'hybrid',
  finish: 'gloss',
  helmet: '#E8E8E8',
  parts: parts(BLACK, BLACK, BLACK),
  frontParts: { wing: BLACK, flap: FI_SILVER, endplate: BLACK },
  top: [
    // the silver nose and chassis top, a saffron airbox top, a green band at the back of the engine cover
    { color: FI_SILVER, path: 'M2.75 0.08 C2.2 0.16 1.4 0.22 0.4 0.24 L0.4 -0.24 C1.4 -0.22 2.2 -0.16 2.75 -0.08 Z' },
    { color: FI_SAFFRON, path: 'M0.06 0.12 C-0.1 0.14 -0.35 0.13 -0.5 0.08 L-0.5 -0.08 C-0.35 -0.13 -0.1 -0.14 0.06 -0.12 Z' },
    { color: FI_GREEN, path: 'M-1.3 0.16 C-1.5 0.15 -1.7 0.13 -1.9 0.1 L-1.9 -0.1 C-1.7 -0.13 -1.5 -0.15 -1.3 -0.16 Z' },
  ],
  side: [
    // the silver nose and chassis, its edge sweeping down to the front of the sidepod
    { color: FI_SILVER, path: 'M2.75 0.2 L2.75 0.36 C2.0 0.5 1.3 0.62 0.6 0.66 C0.6 0.5 0.8 0.36 1.0 0.3 C1.6 0.26 2.2 0.22 2.75 0.2 Z' },
    // the saffron and green sweeps along the sidepod (the Indian tricolor, white being the silver)
    { color: FI_SAFFRON, path: 'M1.0 0.48 C0.5 0.62 -0.3 0.66 -1.0 0.62 L-1.0 0.56 C-0.3 0.6 0.5 0.56 1.0 0.42 Z' },
    { color: FI_GREEN, path: 'M1.0 0.2 C0.5 0.22 -0.3 0.24 -1.6 0.3 L-1.6 0.25 C-0.3 0.19 0.5 0.17 1.0 0.15 Z' },
    { color: FI_GREEN, path: 'M-0.9 0.62 C-1.3 0.6 -1.8 0.54 -2.2 0.48 L-2.2 0.44 C-1.8 0.5 -1.3 0.56 -0.9 0.58 Z' },
  ],
  decals: [
    { view: 'side', logo: 'sahara', x: -0.3, y: 0.37, height: 0.11 },
    { view: 'side', logo: 'royal-challenge', x: 0.62, y: 0.38, height: 0.06 },
    { view: 'side', logo: 'kingfisher', x: -0.75, y: 0.72, height: 0.03 },
    { view: 'side', logo: 'claro', x: 1.8, y: 0.42, height: 0.035, colors: { main: '#111111' } },
    { view: 'side', logo: 'smirnoff', x: -1.45, y: 0.4, height: 0.025 },
    { view: 'side', logo: 'whyte-mackay', x: -0.4, y: 0.88, height: 0.018 },
    { view: 'side', logo: 'astana', x: 2.3, y: 0.3, height: 0.022 },
    // on top: Sahara on the nose, Smirnoff on the rear wing, Claro across the front flaps
    { view: 'top', logo: 'sahara', x: 1.95, y: 0, height: 0.045, rotate: 180, colors: { main: '#111111' } },
    { view: 'top', logo: 'smirnoff', x: -2.35, y: 0, height: 0.055, orient: 'across-rear' },
    { view: 'top', logo: 'claro', x: 2.7, y: 0.45, height: 0.05, orient: 'across-front' },
    { view: 'top', logo: 'claro', x: 2.7, y: -0.45, height: 0.05, orient: 'across-front' },
  ],
  texts: numbers('11', { x: 1.5, y: 0.48, h: 0.07, color: '#111111' }, { x: 1.45, color: '#111111' }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'roshfrans', x: -2.35, y: 0.8, height: 0.04, colors: { main: FI_SAFFRON } },
      { view: 'side', logo: 'kingfisher', x: -2.35, y: 0.66, height: 0.035 },
    ],
    front: [{ view: 'side', logo: 'royal-challenge', x: 2.5, y: 0.26, height: 0.05 }],
  },
};

const LOTUS_GOLD = '#C9A227';
const LOTUS_RED = '#C8102E';
const LOTUS: Livery = {
  id: 'renault-2014', // the save key from before this livery was drawn as the Lotus E22 (Renault-engined); never renamed
  name: 'Lotus',
  era: 'gen2014',
  team: 'Lotus F1 Team',
  price: 200,
  primary: '#111111',
  secondary: LOTUS_GOLD,
  glow: LOTUS_GOLD,
  sidepod: 'hybrid',
  finish: 'gloss',
  helmet: '#E10600',
  parts: parts(BLACK, BLACK, LOTUS_RED),
  frontParts: { wing: BLACK, flap: LOTUS_RED, endplate: BLACK },
  top: [
    // black with gold pinstripes along the nose and the sidepods, the red airbox top
    { color: LOTUS_GOLD, path: 'M2.75 0.012 L0.3 0.012 L0.3 -0.012 L2.75 -0.012 Z' },
    { color: LOTUS_GOLD, symmetric: true, path: 'M0.9 0.48 C0.4 0.56 -0.4 0.58 -1.2 0.48 L-1.2 0.465 C-0.4 0.565 0.4 0.545 0.9 0.465 Z' },
    { color: LOTUS_RED, path: 'M0.06 0.12 C-0.1 0.14 -0.3 0.13 -0.42 0.08 L-0.42 -0.08 C-0.3 -0.13 -0.1 -0.14 0.06 -0.12 Z' },
  ],
  side: [
    // the gold pinstripes along the nose and the lower sidepod, the gold swoosh on the engine cover, the red airbox
    { color: LOTUS_GOLD, path: 'M2.73 0.29 C2.2 0.36 1.6 0.42 1.0 0.46 L1.0 0.475 C1.6 0.435 2.2 0.375 2.73 0.305 Z' },
    { color: LOTUS_GOLD, path: 'M1.0 0.21 C0.4 0.215 -0.8 0.225 -2.1 0.27 L-2.1 0.28 C-0.8 0.235 0.4 0.225 1.0 0.22 Z' },
    { stroke: { color: LOTUS_GOLD, width: 0.012 }, path: 'M-0.3 0.84 C-0.5 0.72 -0.8 0.64 -1.45 0.62' },
    { stroke: { color: LOTUS_GOLD, width: 0.008 }, path: 'M-0.38 0.58 C-0.6 0.6 -0.9 0.6 -1.4 0.58' },
    { color: LOTUS_RED, path: 'M0.06 0.76 L0.06 0.99 L-0.4 0.98 C-0.42 0.9 -0.44 0.82 -0.46 0.76 Z' },
  ],
  decals: [
    { view: 'side', logo: 'emc', x: -0.25, y: 0.36, height: 0.1 },
    { view: 'side', logo: 'sure', x: -0.85, y: 0.66, height: 0.05 },
    { view: 'side', logo: 'saxo-bank', x: -0.95, y: 0.36, height: 0.085 },
    { view: 'side', logo: 'renault', x: -1.45, y: 0.52, height: 0.03, colors: { main: LOTUS_GOLD } },
    { view: 'side', logo: 'microsoft', x: -1.6, y: 0.4, height: 0.022 },
    { view: 'side', logo: 'emaar', x: 0.55, y: 0.56, height: 0.022 },
    { view: 'side', logo: 'richard-mille', x: 1.45, y: 0.42, height: 0.02 },
    { view: 'side', logo: 'total', x: 0.6, y: 0.3, height: 0.03 },
    { view: 'side', logo: 'burn', x: 1.85, y: 0.34, height: 0.025 },
    // on top: the roundel and EMC on the nose, PDVSA on the rear wing, Burn across the front flaps
    { view: 'top', logo: 'lotus-roundel', x: 2.45, y: 0, height: 0.07 },
    { view: 'top', logo: 'emc', x: 1.85, y: 0, height: 0.05, rotate: 180 },
    { view: 'top', logo: 'pdvsa', x: -2.35, y: 0, height: 0.07, orient: 'across-rear' },
    { view: 'top', logo: 'burn', x: 2.7, y: 0.45, height: 0.045, orient: 'across-front' },
    { view: 'top', logo: 'burn', x: 2.7, y: -0.45, height: 0.045, orient: 'across-front' },
  ],
  texts: numbers('8', { x: 1.95, y: 0.32, h: 0.07, color: WHITE }, { x: 1.4, color: WHITE }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'pdvsa', x: -2.35, y: 0.8, height: 0.06 },
      { view: 'side', logo: 'microsoft', x: -2.35, y: 0.64, height: 0.03 },
    ],
    front: [{ view: 'side', logo: 'total', x: 2.5, y: 0.26, height: 0.045 }],
  },
};

const MARTINI_LIGHT = '#58B4F0';
const MARTINI_NAVY = '#0B3D91';
const MARTINI_RED = '#E10600';
/** The Martini stripes: light blue, navy, red, navy, light blue, as bands of a path (along the car, from a centre line). */
function martiniStripes(points: (w: number) => string): LiveryLayer[] {
  return [
    { color: MARTINI_LIGHT, path: points(1) },
    { color: MARTINI_NAVY, path: points(0.62) },
    { color: MARTINI_RED, path: points(0.28) },
  ];
}
const WILLIAMS: Livery = {
  id: 'williams-2014',
  name: 'Williams',
  era: 'gen2014',
  team: 'Williams Martini Racing',
  price: 230,
  primary: '#F4F4F4',
  secondary: '#0B3D91',
  sidepod: 'hybrid',
  finish: 'gloss',
  helmet: '#E8E8E8',
  parts: parts(BLACK, BLACK, BLACK),
  top: [
    // the Martini stripes down the middle of the car from the nose to the tail
    ...martiniStripes((w) => `M2.75 ${0.06 * w} L-2.3 ${0.06 * w} L-2.3 ${-0.06 * w} L2.75 ${-0.06 * w} Z`),
  ],
  side: [
    // the stripes over the engine cover seen from the side, and along the top of the nose and the sidepod
    ...martiniStripes((w) => `M-0.5 ${0.915 + 0.025 * w} C-1.0 ${0.86 + 0.025 * w} -1.6 ${0.7 + 0.025 * w} -2.25 ${0.51 + 0.025 * w} L-2.25 ${0.51 - 0.025 * w} C-1.6 ${0.7 - 0.025 * w} -1.0 ${0.86 - 0.025 * w} -0.5 ${0.915 - 0.025 * w} Z`),
    ...martiniStripes((w) => `M2.73 ${0.32 + 0.022 * w} C2.0 ${0.42 + 0.022 * w} 1.0 ${0.5 + 0.022 * w} 0.0 ${0.52 + 0.022 * w} C-0.6 ${0.5 + 0.022 * w} -1.2 ${0.38 + 0.022 * w} -2.0 ${0.28 + 0.022 * w} L-2.0 ${0.28 - 0.022 * w} C-1.2 ${0.38 - 0.022 * w} -0.6 ${0.5 - 0.022 * w} 0.0 ${0.52 - 0.022 * w} C1.0 ${0.5 - 0.022 * w} 2.0 ${0.42 - 0.022 * w} 2.73 ${0.32 - 0.022 * w} Z`),
    floorEdge(0.14),
  ],
  decals: [
    { view: 'side', logo: 'martini', x: -0.8, y: 0.66, height: 0.11 },
    { view: 'side', logo: 'petrobras', x: -0.25, y: 0.36, height: 0.045 },
    { view: 'side', logo: 'randstad', x: 0.55, y: 0.6, height: 0.028 },
    { view: 'side', logo: 'experian', x: 0.55, y: 0.4, height: 0.035 },
    { view: 'side', logo: 'genworth', x: -1.2, y: 0.25, height: 0.025 },
    { view: 'side', logo: 'wihuri', x: -1.5, y: 0.46, height: 0.025 },
    { view: 'side', logo: 'oris', x: 1.9, y: 0.3, height: 0.035 },
    // on top: Oris and Experian on the nose, MARTINI on the rear wing and across the front flaps
    { view: 'top', logo: 'oris', x: 2.2, y: 0.15, height: 0.035, rotate: 180 },
    { view: 'top', logo: 'experian', x: 1.7, y: 0.15, height: 0.03, rotate: 180 },
    { view: 'top', logo: 'martini', x: -2.35, y: 0, height: 0.07, orient: 'across-rear' },
    { view: 'top', logo: 'martini', x: 2.7, y: 0.45, height: 0.05, orient: 'across-front' },
    { view: 'top', logo: 'martini', x: 2.7, y: -0.45, height: 0.05, orient: 'across-front' },
  ],
  texts: numbers('19', { x: 1.3, y: 0.44, h: 0.07, color: MARTINI_NAVY }, { x: 1.4, color: MARTINI_NAVY }),
  wingTop: [
    { color: MARTINI_LIGHT, points: [[-2.44, -0.37], [-2.44, 0.37], [-2.47, 0.37], [-2.47, -0.37]] },
    { color: MARTINI_RED, points: [[-2.47, -0.37], [-2.47, 0.37], [-2.5, 0.37], [-2.5, -0.37]] },
    { color: MARTINI_NAVY, points: [[-2.5, -0.37], [-2.5, 0.37], [-2.52, 0.37], [-2.52, -0.37]] },
  ],
  plateDecals: {
    rear: [
      { view: 'side', logo: 'martini', x: -2.35, y: 0.8, height: 0.06 },
      { view: 'side', logo: 'genworth', x: -2.35, y: 0.66, height: 0.025, colors: { main: WHITE } },
    ],
    front: [{ view: 'side', logo: 'randstad', x: 2.5, y: 0.26, height: 0.03, colors: { main: WHITE } }],
  },
};

export const LIVERIES_GEN2014: readonly Livery[] = [FERRARI, MERCEDES, MCLAREN, REDBULL, FORCEINDIA, LOTUS, WILLIAMS];
