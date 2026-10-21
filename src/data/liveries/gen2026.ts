import { halftone, BLACK, CARBON, WHITE } from '../liveryHelpers';
import type { Livery, LiveryLayer } from '../liveryTypes';

// 2026: every team on the grid, drawn from the 2026 Chinese GP photos (reference/gen2026/liveries/). Shapes are in
// the car's own measurements (see src/data/cars/gen2026.ts): nose 2.85, front axle 1.7, sidepods 0.75 to -1.85
// (their top falls from 0.55 at the front to 0.25 at the back), rear axle -1.7, tail -2.2; floor edge 0.06 to 0.16,
// engine cover top 0.86 at the airbox. Logos come from src/data/logos; numbers are the race drivers'.

const parts = (wing: string, flap = wing, endplate = wing, halo?: string) => ({ wing, flap, endplate, floor: CARBON, ...(halo ? { halo } : {}) });
/** The black floor edge under the sidepod, rising toward the back. */
const floorEdge = (top = 0.16, color = BLACK): LiveryLayer => ({ color, path: `M0.8 0.06 L0.8 ${top} C0.2 ${top} -0.8 ${top} -1.9 ${top + 0.06} L-1.9 0.06 Z` });
/** A number in the team's style, on the engine cover and the nose. */
const numbers = (n: string, side: { x: number; y: number; h: number; color: string }, top: { color: string }, more: { slant?: number; outline?: { color: string; width: number }; weight?: 600 | 800 | 900 } = {}) => [
  { view: 'side' as const, text: n, x: side.x, y: side.y, height: side.h, color: side.color, font: 'sans' as const, weight: more.weight ?? 900, slant: more.slant, outline: more.outline, align: 'center' as const },
  { view: 'top' as const, text: n, x: 1.4, y: 0, height: 0.09, color: top.color, font: 'sans' as const, weight: more.weight ?? 900, slant: more.slant, outline: more.outline, align: 'center' as const },
];

const FERRARI_RED = '#D40000';
const FERRARI: Livery = {
  id: 'ferrari-2026',
  name: 'Ferrari',
  era: 'gen2026',
  team: 'Scuderia Ferrari HP',
  price: 100,
  primary: FERRARI_RED,
  secondary: '#FFFFFF',
  sidepod: 'compact',
  finish: 'gloss',
  helmet: FERRARI_RED,
  parts: parts(CARBON, FERRARI_RED, CARBON),
  frontParts: { wing: CARBON, flap: CARBON, endplate: CARBON },
  top: [
    // the white airbox and engine cover, its white sweeping out over the shoulders; the tail stays red
    { color: WHITE, path: 'M0.12 0.2 C-0.3 0.3 -0.8 0.28 -1.3 0.18 C-1.6 0.12 -1.8 0.08 -1.9 0.05 L-1.9 -0.05 C-1.8 -0.08 -1.6 -0.12 -1.3 -0.18 C-0.8 -0.28 -0.3 -0.3 0.12 -0.2 Z' },
  ],
  side: [
    floorEdge(0.15),
    // the white upper body: from the airbox down over the cover side, its lower edge sloping to the tail
    { color: WHITE, path: 'M0.12 0.62 L0.12 0.98 L-0.6 0.96 C-1.1 0.84 -1.6 0.66 -2.1 0.46 L-2.1 0.4 C-1.6 0.48 -1.0 0.54 -0.5 0.56 C-0.2 0.58 0.0 0.6 0.12 0.62 Z' },
  ],
  decals: [
    { view: 'side', logo: 'hp', x: -0.5, y: 0.67, height: 0.13 },
    { view: 'side', logo: 'ibm', x: -0.02, y: 0.8, height: 0.035, colors: { main: '#0F62FE' } },
    { view: 'side', logo: 'unicredit', x: -0.7, y: 0.47, height: 0.04 },
    { view: 'side', logo: 'shell', x: 0.12, y: 0.3, height: 0.16 },
    { view: 'side', logo: 'ceva', x: -0.42, y: 0.28, height: 0.055 },
    { view: 'side', logo: 'puma', x: 0.45, y: 0.47, height: 0.03 },
    { view: 'side', logo: 'richard-mille', x: 1.1, y: 0.44, height: 0.022 },
    { view: 'side', logo: 'ferrari-shield', x: 1.38, y: 0.4, height: 0.09 },
    { view: 'side', logo: 'unicredit', x: 2.1, y: 0.3, height: 0.025 },
    // on top: the shield on the nose, Shell and UniCredit along it, V-Power on the rear wing, UniCredit on the front flaps
    { view: 'top', logo: 'ferrari-shield', x: 2.55, y: 0, height: 0.06, rotate: 90 },
    { view: 'top', logo: 'shell', x: 1.85, y: 0, height: 0.12, rotate: 90 },
    { view: 'top', logo: 'unicredit', x: 2.2, y: 0, height: 0.03, rotate: 180 },
    { view: 'top', logo: 'hp', x: -0.3, y: 0, height: 0.14 },
    { view: 'top', logo: 'shell-vpower', x: -2.15, y: 0, height: 0.06, orient: 'across-rear' },
    { view: 'top', logo: 'unicredit', x: 2.65, y: 0.5, height: 0.045, orient: 'across-front' },
    { view: 'top', logo: 'unicredit', x: 2.65, y: -0.5, height: 0.045, orient: 'across-front' },
  ],
  texts: numbers('16', { x: -1.05, y: 0.62, h: 0.07, color: FERRARI_RED }, { color: WHITE }),
  wingTop: [{ color: FERRARI_RED, points: [[-2.3, -0.44], [-2.3, 0.44], [-2.34, 0.44], [-2.34, -0.44]] }],
  plateDecals: {
    front: [{ view: 'side', logo: 'unicredit', x: 2.6, y: 0.2, height: 0.035 }],
    rear: [
      { view: 'side', logo: 'shell-vpower', x: -2.1, y: 0.78, height: 0.05 },
      { view: 'side', logo: 'peroni', x: -2.1, y: 0.62, height: 0.06 },
    ],
  },
};

const MERC_TEAL = '#00A19C';
const MERCEDES: Livery = {
  id: 'mercedes-2026',
  name: 'Mercedes',
  era: 'gen2026',
  team: 'Mercedes-AMG Petronas',
  price: 120,
  primary: '#0C0E11',
  secondary: '#00D2BE',
  glow: '#00D2BE',
  sidepod: 'compact',
  finish: 'gloss',
  helmet: '#E8E8E8',
  parts: parts(BLACK),
  top: [
    // black, with teal lines along the sidepods and down the engine cover, and the silver stars fading over the cover
    { color: MERC_TEAL, path: 'M0.1 0.014 L-1.3 0.008 L-1.3 -0.008 L0.1 -0.014 Z' },
    { color: MERC_TEAL, symmetric: true, path: 'M0.75 0.32 C0.5 0.5 0.0 0.57 -0.6 0.5 L-0.6 0.47 C0.0 0.54 0.5 0.47 0.72 0.3 Z' },
    { color: '#C8CCD0', symmetric: true, path: 'M0.7 0.3 C0.45 0.46 0.0 0.52 -0.55 0.45 L-0.55 0.435 C0.0 0.505 0.45 0.445 0.68 0.29 Z' },
  ],
  side: [
    // the teal and silver speed lines sweeping up the sidepod onto the engine cover
    { color: MERC_TEAL, path: 'M0.75 0.2 C0.4 0.23 -0.2 0.32 -1.0 0.56 L-1.0 0.5 C-0.2 0.27 0.4 0.18 0.75 0.15 Z' },
    { color: '#C8CCD0', path: 'M0.75 0.25 C0.4 0.28 -0.2 0.37 -1.0 0.6 L-1.0 0.585 C-0.2 0.355 0.4 0.265 0.75 0.235 Z' },
    { color: MERC_TEAL, path: 'M0.75 0.3 C0.4 0.33 -0.1 0.42 -0.8 0.62 L-0.8 0.61 C-0.1 0.41 0.4 0.32 0.75 0.29 Z' },
    { color: MERC_TEAL, path: 'M1.6 0.33 C1.3 0.36 1.0 0.4 0.78 0.44 L0.78 0.4 C1.0 0.36 1.3 0.32 1.6 0.29 Z' },
  ],
  decals: [
    { view: 'side', logo: 'petronas', x: 0.0, y: 0.31, height: 0.055, colors: { main: WHITE, mark: MERC_TEAL } },
    { view: 'side', logo: 'mercedes-stars', x: -1.15, y: 0.55, width: 0.55, colors: { main: '#8E949B' } },
    { view: 'side', logo: 'microsoft', x: -0.15, y: 0.8, height: 0.04 },
    { view: 'side', logo: 'solera', x: -0.6, y: 0.62, height: 0.025 },
    { view: 'side', logo: 'amd', x: 0.55, y: 0.6, height: 0.025, colors: { main: WHITE } },
    { view: 'side', logo: 'teamviewer', x: 0.2, y: 0.56, height: 0.03, colors: { main: WHITE, box: WHITE, arrow: BLACK } },
    { view: 'side', logo: 'amg', x: 1.15, y: 0.47, height: 0.035 },
    { view: 'side', logo: 'iwc', x: 1.6, y: 0.36, height: 0.045, colors: { main: WHITE } },
    { view: 'side', logo: 'signify', x: 0.3, y: 0.11, height: 0.025 },
    { view: 'side', logo: 'ineos', x: 2.2, y: 0.28, height: 0.025 },
    { view: 'side', logo: 'mercedes-star', x: 1.95, y: 0.36, height: 0.06 },
    // on top: the star on the nose, INEOS, Microsoft on the front flaps, Petronas on the rear wing
    { view: 'top', logo: 'mercedes-star', x: 2.55, y: 0, height: 0.09 },
    { view: 'top', logo: 'ineos', x: 2.05, y: 0, height: 0.04, rotate: 180 },
    { view: 'top', logo: 'petronas-word', x: -2.15, y: 0, height: 0.06, orient: 'across-rear', colors: { main: MERC_TEAL } },
    { view: 'top', logo: 'microsoft', x: 2.65, y: 0.5, height: 0.04, orient: 'across-front' },
    { view: 'top', logo: 'microsoft', x: 2.65, y: -0.5, height: 0.04, orient: 'across-front' },
  ],
  texts: numbers('63', { x: -1.4, y: 0.5, h: 0.08, color: WHITE }, { color: WHITE }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'snapdragon', x: -2.1, y: 0.8, height: 0.035 },
      { view: 'side', logo: 'crowdstrike', x: -2.1, y: 0.66, height: 0.03, colors: { main: WHITE } },
    ],
    front: [{ view: 'side', logo: 'microsoft', x: 2.6, y: 0.2, height: 0.035 }],
  },
};

const PAPAYA = '#FF8000';
const ANTHRACITE = '#232529';
const MCLAREN: Livery = {
  id: 'mclaren-2026',
  name: 'McLaren',
  era: 'gen2026',
  team: 'McLaren Mastercard F1 Team',
  price: 140,
  primary: PAPAYA,
  secondary: '#47C7FC',
  sidepod: 'compact',
  finish: 'gloss',
  helmet: '#B5E61D',
  parts: parts(PAPAYA, PAPAYA, PAPAYA),
  frontParts: { wing: BLACK, flap: PAPAYA, endplate: BLACK },
  top: [
    // the anthracite airbox and engine cover cut by a diagonal, papaya again at the tail; anthracite pod rears
    { color: ANTHRACITE, path: 'M0.15 0.26 C-0.3 0.32 -0.8 0.3 -1.15 0.24 L-1.45 -0.1 L-1.45 -0.24 C-0.8 -0.3 -0.3 -0.32 0.15 -0.26 Z' },
    { color: ANTHRACITE, symmetric: true, path: 'M-0.55 0.14 C-0.8 0.5 -1.2 0.62 -1.85 0.6 L-1.85 0.14 Z' },
  ],
  side: [
    // the anthracite rear: the cover and the lower body behind a diagonal, with a papaya slash at the tail
    { color: ANTHRACITE, path: 'M0.12 0.6 L0.12 0.98 L-0.5 0.96 C-1.1 0.84 -1.6 0.66 -2.1 0.46 L-2.1 0.06 L-0.1 0.06 L-0.35 0.2 C-0.1 0.35 0.0 0.5 0.12 0.6 Z' },
    { color: PAPAYA, path: 'M-1.2 0.62 L-0.95 0.7 L-1.55 0.42 L-1.85 0.36 Z' },
    { color: BLACK, path: 'M0.8 0.06 L0.8 0.12 C0.2 0.12 -0.6 0.12 -2.1 0.16 L-2.1 0.06 Z' },
    { color: ANTHRACITE, path: 'M2.85 0.18 L2.85 0.22 C2.4 0.25 1.9 0.3 1.5 0.33 L1.5 0.18 Z' },
  ],
  decals: [
    { view: 'side', logo: 'gemini', x: -0.75, y: 0.62, height: 0.06 },
    { view: 'side', logo: 'allwin', x: -0.15, y: 0.85, height: 0.035, colors: { main: '#1AA39A' } },
    { view: 'side', logo: 'dell-tech', x: -0.75, y: 0.4, height: 0.03 },
    { view: 'side', logo: 'cisco', x: -0.2, y: 0.42, height: 0.025 },
    { view: 'side', logo: 'club-avolta', x: 0.3, y: 0.42, height: 0.02, colors: { main: ANTHRACITE } },
    { view: 'side', logo: 'richard-mille', x: 1.15, y: 0.47, height: 0.02, colors: { main: ANTHRACITE } },
    { view: 'side', logo: 'dp-world', x: 1.1, y: 0.38, height: 0.03, colors: { main: ANTHRACITE } },
    { view: 'side', logo: 'mclaren-speedmark', x: 0.0, y: 0.28, height: 0.05, colors: { main: ANTHRACITE } },
    { view: 'side', logo: 'jack-daniels', x: 2.0, y: 0.3, height: 0.02, colors: { main: ANTHRACITE } },
    // on top: the speedmark on the nose, Etihad on the rear wing, Workday across the front flaps
    { view: 'top', logo: 'mclaren-speedmark', x: 2.2, y: 0, height: 0.05, colors: { main: ANTHRACITE }, rotate: 180 },
    { view: 'top', logo: 'gemini', x: -0.75, y: 0, height: 0.05, rotate: 180 },
    { view: 'top', logo: 'etihad', x: -2.15, y: 0, height: 0.055, orient: 'across-rear' },
    { view: 'top', logo: 'workday', x: 2.65, y: 0.5, height: 0.05, orient: 'across-front' },
    { view: 'top', logo: 'workday', x: 2.65, y: -0.5, height: 0.05, orient: 'across-front' },
  ],
  texts: numbers('81', { x: -0.3, y: 0.68, h: 0.06, color: WHITE }, { color: ANTHRACITE }),
  plateDecals: {
    rear: [{ view: 'side', logo: 'dropbox', x: -2.1, y: 0.76, height: 0.045 }],
    front: [{ view: 'side', logo: 'workday', x: 2.6, y: 0.2, height: 0.04 }],
  },
};

const RB_NAVY = '#1A1F3C';
const RB_RED = '#E4002B';
const RB_YELLOW = '#FFC906';
const REDBULL: Livery = {
  id: 'redbull-2026',
  name: 'Red Bull',
  era: 'gen2026',
  team: 'Oracle Red Bull Racing',
  price: 160,
  primary: RB_NAVY,
  secondary: RB_RED,
  glow: RB_RED,
  sidepod: 'compact',
  finish: 'matte',
  helmet: '#FF8A00',
  parts: parts(RB_NAVY, RB_NAVY, RB_NAVY, RB_NAVY),
  top: [
    // the yellow nose and airbox, the Red Bull bulls charging back over the engine cover
    { path: 'M2.85 0.02 C2.6 0.05 2.2 0.08 1.7 0.1 C1.6 0.08 1.6 -0.08 1.7 -0.1 C2.2 -0.08 2.6 -0.05 2.85 -0.02 Z', gradient: { from: [2.85, 0], to: [1.65, 0], stops: [[0, '#FFD21A'], [1, '#FFB100']] } },
    { path: 'M0.12 0.12 C0.0 0.14 -0.4 0.13 -0.6 0.06 L-0.6 -0.06 C-0.4 -0.13 0.0 -0.14 0.12 -0.12 Z', gradient: { from: [0.1, 0], to: [-0.6, 0], stops: [[0, RB_YELLOW], [1, '#F39200']] } },
  ],
  side: [
    // the yellow nose flank, the yellow airbox, the red floor edge
    { path: 'M2.83 0.2 L2.83 0.28 C2.4 0.33 2.0 0.4 1.6 0.44 C1.55 0.36 1.55 0.26 1.6 0.2 Z', gradient: { from: [2.8, 0], to: [1.6, 0], stops: [[0, '#FFD21A'], [1, '#FFB100']] } },
    { path: 'M0.12 0.72 L0.12 0.97 L-0.45 0.94 C-0.5 0.85 -0.55 0.78 -0.6 0.72 C-0.4 0.7 -0.1 0.7 0.12 0.72 Z', gradient: { from: [0.1, 0.9], to: [-0.6, 0.75], stops: [[0, RB_YELLOW], [1, '#F39200']] } },
    { color: RB_RED, path: 'M0.75 0.075 L-1.85 0.075 L-1.85 0.1 L0.75 0.1 Z' },
  ],
  decals: [
    { view: 'side', logo: 'redbull', x: -0.9, y: 0.55, width: 0.46 },
    { view: 'side', logo: 'redbull-bull', x: 2.15, y: 0.3, width: 0.36, mirror: true },
    { view: 'side', logo: 'oracle', x: 0.05, y: 0.3, height: 0.07 },
    { view: 'side', logo: 'rokt', x: 0.15, y: 0.6, height: 0.03 },
    { view: 'side', logo: 'carlyle', x: 0.95, y: 0.44, height: 0.022 },
    { view: 'side', logo: '1password', x: 0.95, y: 0.37, height: 0.022 },
    { view: 'side', logo: 'ford', x: -1.45, y: 0.48, height: 0.04 },
    { view: 'side', logo: 'att', x: 2.35, y: 0.23, height: 0.022 },
    { view: 'side', logo: 'indeed', x: 0.3, y: 0.11, height: 0.025 },
    // on top: the bull along the nose, the bulls on the cover, Mobil 1 across the wings
    { view: 'top', logo: 'redbull-bull', x: 2.15, y: 0, width: 0.36, mirror: true },
    { view: 'top', logo: 'redbull', x: -0.95, y: 0, width: 0.3, rotate: 90 },
    { view: 'top', logo: 'mobil1', x: -2.15, y: 0, height: 0.06, orient: 'across-rear' },
    { view: 'top', logo: 'mobil', x: 2.65, y: 0.5, height: 0.05, orient: 'across-front' },
    { view: 'top', logo: 'mobil', x: 2.65, y: -0.5, height: 0.05, orient: 'across-front' },
  ],
  texts: numbers('3', { x: -1.35, y: 0.55, h: 0.08, color: WHITE }, { color: RB_RED }, { slant: 10 }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'mobil1', x: -2.1, y: 0.78, height: 0.045 },
      { view: 'side', logo: 'heineken', x: -2.1, y: 0.64, height: 0.03 },
    ],
    front: [{ view: 'side', logo: 'mobil', x: 2.6, y: 0.2, height: 0.04 }],
  },
};

const RB_VCARB_NAVY = '#1F2F7A';
const RACINGBULLS: Livery = {
  id: 'racingbulls-2026',
  name: 'Racing Bulls',
  era: 'gen2026',
  team: 'Visa Cash App Racing Bulls F1 Team',
  price: 180,
  primary: '#EEF0F6',
  secondary: RB_VCARB_NAVY,
  sidepod: 'compact',
  finish: 'gloss',
  helmet: '#F06BAE',
  parts: parts('#14172B', '#14172B', '#14172B'),
  frontParts: { wing: '#14172B', flap: WHITE, endplate: WHITE },
  top: [
    // white over the top; the yellow airbox; the navy tail; the yellow nose
    { path: 'M0.12 0.12 C0.0 0.14 -0.4 0.13 -0.6 0.06 L-0.6 -0.06 C-0.4 -0.13 0.0 -0.14 0.12 -0.12 Z', gradient: { from: [0.1, 0], to: [-0.6, 0], stops: [[0, RB_YELLOW], [1, '#F39200']] } },
    { color: RB_VCARB_NAVY, path: 'M-1.3 0.15 C-1.7 0.13 -2.1 0.08 -2.2 0.05 L-2.2 -0.05 C-2.1 -0.08 -1.7 -0.13 -1.3 -0.15 Z' },
    { path: 'M2.85 0.02 C2.6 0.05 2.2 0.08 1.75 0.1 C1.65 0.08 1.65 -0.08 1.75 -0.1 C2.2 -0.08 2.6 -0.05 2.85 -0.02 Z', gradient: { from: [2.85, 0], to: [1.7, 0], stops: [[0, '#FFD21A'], [1, '#FF9A1F']] } },
  ],
  side: [
    // the navy lower body glowing lighter blue toward its upper edge, which sweeps up behind the sidepod
    { path: 'M0.8 0.06 L0.8 0.24 C0.3 0.27 -0.5 0.32 -1.0 0.42 C-1.4 0.5 -1.8 0.58 -2.1 0.62 L-2.1 0.06 Z', gradient: { from: [0, 0.06], to: [0, 0.45], stops: [[0, '#151C4A'], [0.7, RB_VCARB_NAVY], [1, '#3D6BE0']] } },
    { color: RB_VCARB_NAVY, path: 'M2.83 0.2 L2.83 0.22 C2.3 0.24 1.8 0.27 1.3 0.3 L0.8 0.2 L0.8 0.12 L2.83 0.12 Z' },
    { path: 'M0.12 0.72 L0.12 0.97 L-0.45 0.94 C-0.5 0.85 -0.55 0.78 -0.6 0.72 C-0.4 0.7 -0.1 0.7 0.12 0.72 Z', gradient: { from: [0.1, 0.9], to: [-0.6, 0.75], stops: [[0, RB_YELLOW], [1, '#F39200']] } },
    { path: 'M2.83 0.2 L2.83 0.28 C2.4 0.33 2.0 0.4 1.65 0.43 C1.6 0.35 1.6 0.26 1.65 0.2 Z', gradient: { from: [2.8, 0], to: [1.6, 0], stops: [[0, '#FFD21A'], [1, '#FF9A1F']] } },
  ],
  decals: [
    { view: 'side', logo: 'visa', x: 0.05, y: 0.36, height: 0.08 },
    { view: 'side', logo: 'redbull', x: -0.85, y: 0.58, width: 0.4 },
    { view: 'side', logo: 'cash-app', x: 0.3, y: 0.52, height: 0.03 },
    { view: 'side', logo: 'hugo', x: 0.75, y: 0.47, height: 0.03 },
    { view: 'side', logo: 'mobil', x: 0.7, y: 0.4, height: 0.025, colors: { main: RB_VCARB_NAVY } },
    { view: 'side', logo: 'ford', x: -0.6, y: 0.4, height: 0.035 },
    { view: 'side', logo: 'redbull-bull', x: 2.2, y: 0.3, width: 0.34, mirror: true },
    // on top: VISA on the rear wing, Cash App across the front flaps
    { view: 'top', logo: 'redbull-bull', x: 2.2, y: 0, width: 0.34, mirror: true },
    { view: 'top', logo: 'visa', x: -2.15, y: 0, height: 0.07, orient: 'across-rear', colors: { main: WHITE } },
    { view: 'top', logo: 'cash-app', x: 2.65, y: 0.5, height: 0.04, orient: 'across-front', colors: { main: WHITE } },
    { view: 'top', logo: 'cash-app', x: 2.65, y: -0.5, height: 0.04, orient: 'across-front', colors: { main: WHITE } },
  ],
  texts: numbers('30', { x: -1.25, y: 0.5, h: 0.07, color: RB_RED }, { color: RB_VCARB_NAVY }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'visa', x: -2.1, y: 0.78, height: 0.05, colors: { main: WHITE } },
      { view: 'side', logo: 'mobil1', x: -2.1, y: 0.64, height: 0.035 },
    ],
    front: [{ view: 'side', logo: 'cash-app', x: 2.6, y: 0.2, height: 0.035 }],
  },
};

const ALPINE_BLUE = '#1E3780';
const ALPINE_PINK = '#F06BAE';
const ALPINE: Livery = {
  id: 'alpine-2026',
  name: 'Alpine',
  era: 'gen2026',
  team: 'BWT Alpine F1 Team',
  price: 200,
  primary: '#1446B0',
  secondary: ALPINE_PINK,
  glow: ALPINE_PINK,
  sidepod: 'compact',
  finish: 'gloss',
  helmet: '#5CD3F0',
  parts: parts(BLACK, BLACK, ALPINE_PINK, ALPINE_PINK),
  frontParts: { wing: BLACK, flap: BLACK, endplate: ALPINE_PINK },
  top: [
    // a deep blue, darker toward the tail; a pink line down the engine cover and a pink nose tip
    { path: 'M2.9 0.3 L-2.3 0.3 L-2.3 -0.3 L2.9 -0.3 Z', gradient: { from: [1.0, 0], to: [-2.2, 0], stops: [[0, '#22409A'], [1, '#18275E']] } },
    { color: ALPINE_PINK, path: 'M-0.4 0.02 L-1.5 0.01 L-1.5 -0.01 L-0.4 -0.02 Z' },
    { color: ALPINE_PINK, path: 'M2.85 0.03 C2.75 0.05 2.65 0.06 2.55 0.065 L2.55 -0.065 C2.65 -0.06 2.75 -0.05 2.85 -0.03 Z' },
  ],
  side: [
    // the body darkening from the sidepod back and down, the black floor edge, a pink flash on the rear of the cover
    { path: 'M2.9 0.06 L2.9 0.98 L-2.3 0.98 L-2.3 0.06 Z', gradient: { from: [0.8, 0.7], to: [-1.5, 0.15], stops: [[0, '#22409A'], [1, '#18275E']] } },
    floorEdge(0.13),
    { color: ALPINE_PINK, path: 'M-1.15 0.56 C-1.3 0.56 -1.5 0.5 -1.9 0.42 L-1.6 0.42 C-1.4 0.46 -1.25 0.5 -1.15 0.56 Z' },
    { color: ALPINE_PINK, path: 'M2.55 0.2 L2.85 0.2 L2.85 0.28 L2.55 0.3 Z' },
  ],
  decals: [
    { view: 'side', logo: 'bwt', x: -0.15, y: 0.29, height: 0.11, colors: { main: ALPINE_PINK, edge: ALPINE_PINK } },
    { view: 'side', logo: 'eni', x: -0.6, y: 0.7, height: 0.045 },
    { view: 'side', logo: 'msc', x: 0.25, y: 0.47, height: 0.035 },
    { view: 'side', logo: 'alpine-a', x: 0.45, y: 0.56, height: 0.03 },
    { view: 'side', logo: 'mercado-libre', x: -0.15, y: 0.6, height: 0.022 },
    { view: 'side', logo: 'avature', x: 0.6, y: 0.4, height: 0.022 },
    { view: 'side', logo: 'delphi', x: -0.5, y: 0.1, height: 0.022 },
    { view: 'side', logo: 'alpine', x: 1.45, y: 0.36, height: 0.022 },
    // on top: the A and BWT on the nose, ALPINE on the rear wing, BWT across the front flaps
    { view: 'top', logo: 'alpine-a', x: 2.25, y: 0, height: 0.06, rotate: 90 },
    { view: 'top', logo: 'bwt', x: 1.85, y: 0, height: 0.05, rotate: 180, colors: { main: ALPINE_PINK, edge: ALPINE_PINK } },
    { view: 'top', logo: 'alpine', x: -2.15, y: 0, height: 0.045, orient: 'across-rear' },
    { view: 'top', logo: 'bwt', x: 2.65, y: 0.5, height: 0.05, orient: 'across-front', colors: { main: ALPINE_PINK, edge: ALPINE_PINK } },
    { view: 'top', logo: 'bwt', x: 2.65, y: -0.5, height: 0.05, orient: 'across-front', colors: { main: ALPINE_PINK, edge: ALPINE_PINK } },
  ],
  texts: numbers('43', { x: -1.35, y: 0.6, h: 0.08, color: WHITE }, { color: WHITE }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'eni', x: -2.1, y: 0.78, height: 0.05 },
      { view: 'side', logo: 'msc', x: -2.1, y: 0.63, height: 0.035 },
    ],
    front: [{ view: 'side', logo: 'bwt', x: 2.6, y: 0.2, height: 0.05, colors: { main: ALPINE_BLUE, edge: ALPINE_BLUE } }],
  },
};

const AM_GREEN = '#0A7A66';
const AM_LIME = '#C9E200';
const ASTONMARTIN: Livery = {
  id: 'astonmartin-2026',
  name: 'Aston Martin',
  era: 'gen2026',
  team: 'Aston Martin Aramco F1 Team',
  price: 220,
  primary: AM_GREEN,
  secondary: AM_LIME,
  sidepod: 'compact',
  finish: 'gloss',
  helmet: AM_GREEN,
  parts: parts(AM_GREEN, AM_GREEN, AM_GREEN, AM_GREEN),
  top: [
    // lime lines down the engine cover's shoulders and along the sidepod tops
    { color: AM_LIME, symmetric: true, path: 'M0.0 0.2 C-0.6 0.21 -1.3 0.15 -2.1 0.06 L-2.1 0.045 C-1.3 0.135 -0.6 0.195 0.0 0.185 Z' },
    { color: AM_LIME, symmetric: true, path: 'M0.7 0.3 C0.4 0.33 0.0 0.34 -0.6 0.32 L-0.6 0.305 C0.0 0.325 0.4 0.315 0.7 0.285 Z' },
  ],
  side: [
    // the green darkening low down, the black floor edge, the lime line along it, the lime arc over aramco
    { path: 'M2.9 0.06 L2.9 0.5 L-2.3 0.5 L-2.3 0.06 Z', gradient: { from: [0, 0.45], to: [0, 0.12], stops: [[0, AM_GREEN], [1, '#06483C']] } },
    floorEdge(0.12),
    { color: AM_LIME, path: 'M0.75 0.13 C0.2 0.14 -0.6 0.19 -1.85 0.4 L-1.85 0.375 C-0.6 0.165 0.2 0.115 0.75 0.105 Z' },
    { color: AM_LIME, path: 'M0.55 0.44 C0.2 0.47 -0.3 0.47 -0.65 0.43 L-0.65 0.41 C-0.3 0.45 0.2 0.45 0.55 0.42 Z' },
  ],
  decals: [
    { view: 'side', logo: 'aramco', x: -0.1, y: 0.28, height: 0.09 },
    { view: 'side', logo: 'maaden', x: -0.55, y: 0.66, height: 0.035 },
    { view: 'side', logo: 'coreweave', x: -0.2, y: 0.78, height: 0.022 },
    { view: 'side', logo: 'cohere', x: 0.0, y: 0.55, height: 0.03 },
    { view: 'side', logo: 'honda', x: -1.15, y: 0.55, height: 0.03 },
    { view: 'side', logo: 'valvoline', x: -0.95, y: 0.46, height: 0.025 },
    { view: 'side', logo: 'boss', x: 0.55, y: 0.48, height: 0.025 },
    { view: 'side', logo: 'pepperstone', x: 0.95, y: 0.42, height: 0.02 },
    { view: 'side', logo: 'cognizant', x: 0.3, y: 0.08, height: 0.025 },
    { view: 'side', logo: 'aston-wings', x: 1.4, y: 0.36, height: 0.04 },
    { view: 'side', logo: 'nexgen', x: 2.1, y: 0.29, height: 0.02 },
    // on top: the wings and aramco on the nose, aramco on the rear wing and across the front flaps
    { view: 'top', logo: 'aston-wings', x: 2.2, y: 0, height: 0.06, rotate: 90 },
    { view: 'top', logo: 'aramco', x: 1.8, y: 0, height: 0.04, rotate: 180, colors: { main: AM_LIME } },
    { view: 'top', logo: 'aramco', x: -2.15, y: 0, height: 0.065, orient: 'across-rear', colors: { main: '#7FD8E8' } },
    { view: 'top', logo: 'aramco', x: 2.65, y: 0.5, height: 0.055, orient: 'across-front' },
    { view: 'top', logo: 'aramco', x: 2.65, y: -0.5, height: 0.055, orient: 'across-front' },
  ],
  texts: numbers('14', { x: -1.35, y: 0.6, h: 0.08, color: WHITE }, { color: WHITE }),
  wingTop: [{ color: AM_LIME, points: [[-2.3, -0.44], [-2.3, 0.44], [-2.33, 0.44], [-2.33, -0.44]] }],
  plateDecals: {
    rear: [
      { view: 'side', logo: 'arm', x: -2.1, y: 0.78, height: 0.05 },
      { view: 'side', logo: 'servicenow', x: -2.1, y: 0.64, height: 0.03 },
    ],
    front: [{ view: 'side', logo: 'glenfiddich', x: 2.6, y: 0.2, height: 0.025 }],
  },
};

const WIL_BLUE = '#1A8FE0';
const WIL_NAVY = '#0B2B6A';
const WILLIAMS: Livery = {
  id: 'williams-2026',
  name: 'Williams',
  era: 'gen2026',
  team: 'Atlassian Williams Racing',
  price: 240,
  primary: WIL_BLUE,
  secondary: '#FFFFFF',
  sidepod: 'compact',
  finish: 'gloss',
  helmet: '#2A6BF0',
  parts: parts(BLACK, BLACK, WIL_NAVY),
  frontParts: { wing: BLACK, flap: BLACK, endplate: BLACK },
  top: [
    // blue on top with a black tail; the white Komatsu panel shows at the sidepods' outer edges
    { color: '#15161A', path: 'M-1.5 0.14 C-1.8 0.12 -2.1 0.08 -2.2 0.05 L-2.2 -0.05 C-2.1 -0.08 -1.8 -0.12 -1.5 -0.14 Z' },
    { color: WHITE, symmetric: true, path: 'M0.55 0.6 C0.2 0.66 -0.4 0.66 -0.8 0.58 L-0.8 0.64 C-0.4 0.72 0.2 0.72 0.55 0.66 Z' },
  ],
  side: [
    // black below, the white lower sidepod panel with the navy Komatsu, the blue above shading darker at the back
    { path: 'M2.9 0.06 L2.9 0.98 L-2.3 0.98 L-2.3 0.06 Z', gradient: { from: [0.5, 0], to: [-2.0, 0], stops: [[0, WIL_BLUE], [1, '#1268B8']] } },
    { color: BLACK, path: 'M2.9 0.06 L2.9 0.18 C2.3 0.2 1.6 0.22 0.8 0.22 C0.2 0.18 -0.8 0.18 -2.3 0.3 L-2.3 0.06 Z' },
    { color: WHITE, path: 'M0.55 0.14 C0.45 0.2 0.45 0.3 0.55 0.34 C0.0 0.35 -0.6 0.32 -1.2 0.26 C-1.25 0.2 -1.25 0.16 -1.2 0.12 C-0.6 0.12 0.0 0.13 0.55 0.14 Z' },
  ],
  decals: [
    { view: 'side', logo: 'komatsu', x: -0.3, y: 0.23, height: 0.055 },
    { view: 'side', logo: 'atlassian', x: -0.55, y: 0.62, height: 0.05 },
    { view: 'side', logo: 'barclays', x: -0.05, y: 0.42, height: 0.03 },
    { view: 'side', logo: 'stephens', x: 1.0, y: 0.4, height: 0.035 },
    { view: 'side', logo: 'duracell', x: -0.2, y: 0.82, height: 0.022 },
    { view: 'side', logo: 'gulf', x: -1.25, y: 0.42, height: 0.045 },
    { view: 'side', logo: 'kraken', x: 0.35, y: 0.55, height: 0.025 },
    { view: 'side', logo: 'claude', x: 0.65, y: 0.52, height: 0.025 },
    { view: 'side', logo: 'brillio', x: 0.75, y: 0.45, height: 0.022 },
    { view: 'side', logo: 'keeper', x: 0.3, y: 0.08, height: 0.022 },
    // on top: the W and ATLASSIAN on the nose, Komatsu on the rear wing, BW Scores across the front flaps
    { view: 'top', logo: 'williams-w', x: 2.3, y: 0, height: 0.06, rotate: 90 },
    { view: 'top', logo: 'atlassian', x: 1.8, y: 0, height: 0.035, rotate: 180 },
    { view: 'top', logo: 'komatsu', x: -2.15, y: 0, height: 0.06, orient: 'across-rear', colors: { main: WHITE } },
    { view: 'top', logo: 'bw-scores', x: 2.65, y: 0.5, height: 0.04, orient: 'across-front' },
    { view: 'top', logo: 'bw-scores', x: 2.65, y: -0.5, height: 0.04, orient: 'across-front' },
  ],
  texts: numbers('23', { x: -1.35, y: 0.6, h: 0.08, color: WHITE }, { color: WHITE }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'komatsu', x: -2.1, y: 0.78, height: 0.04, colors: { main: WHITE } },
      { view: 'side', logo: 'estrella-galicia', x: -2.1, y: 0.64, height: 0.022 },
    ],
    front: [{ view: 'side', logo: 'bw-scores', x: 2.6, y: 0.2, height: 0.035 }],
  },
};

const HAAS_RED = '#E10600';
const HAAS: Livery = {
  id: 'haas-2026',
  name: 'Haas',
  era: 'gen2026',
  team: 'TGR Haas F1 Team',
  price: 260,
  primary: '#F2F2F2',
  secondary: HAAS_RED,
  sidepod: 'compact',
  finish: 'gloss',
  helmet: HAAS_RED,
  parts: parts('#F2F2F2', '#F2F2F2', '#F2F2F2', WHITE),
  frontParts: { wing: '#F2F2F2', flap: HAAS_RED, endplate: '#F2F2F2' },
  top: [
    // the red airbox and nose top, a black tail, red lines along the sidepods
    { color: HAAS_RED, path: 'M0.12 0.12 C0.0 0.14 -0.35 0.13 -0.5 0.08 L-0.5 -0.08 C-0.35 -0.13 0.0 -0.14 0.12 -0.12 Z' },
    { color: BLACK, path: 'M-1.6 0.13 C-1.9 0.11 -2.1 0.08 -2.2 0.05 L-2.2 -0.05 C-2.1 -0.08 -1.9 -0.11 -1.6 -0.13 Z' },
    { color: HAAS_RED, path: 'M2.85 0.03 C2.4 0.05 2.0 0.07 1.7 0.08 L1.7 -0.08 C2.0 -0.07 2.4 -0.05 2.85 -0.03 Z' },
    { color: HAAS_RED, symmetric: true, path: 'M0.7 0.42 C0.3 0.47 -0.2 0.47 -0.6 0.42 L-0.6 0.4 C-0.2 0.45 0.3 0.45 0.7 0.4 Z' },
  ],
  side: [
    // black low down, the red line along the chassis from the nose, the red airbox
    floorEdge(0.14),
    { color: HAAS_RED, path: 'M2.83 0.22 C2.3 0.26 1.6 0.33 0.8 0.42 C0.3 0.47 -0.3 0.5 -0.9 0.5 L-0.9 0.47 C-0.3 0.47 0.3 0.44 0.8 0.39 C1.6 0.3 2.3 0.23 2.83 0.19 Z' },
    { color: HAAS_RED, path: 'M0.12 0.74 L0.12 0.97 L-0.45 0.94 C-0.48 0.86 -0.5 0.8 -0.52 0.74 Z' },
  ],
  decals: [
    { view: 'side', logo: 'haas', x: -0.15, y: 0.29, height: 0.1, colors: { main: '#111111', cut: '#F2F2F2' } },
    { view: 'side', logo: 'gr', x: -0.8, y: 0.6, height: 0.14 },
    { view: 'side', logo: 'ruckus', x: -0.2, y: 0.83, height: 0.022 },
    { view: 'side', logo: 'fix', x: 0.45, y: 0.5, height: 0.03, colors: { main: '#111111' } },
    { view: 'side', logo: 'orion180', x: 0.95, y: 0.47, height: 0.022, colors: { main: '#111111' } },
    { view: 'side', logo: 'mphasis', x: 2.05, y: 0.32, height: 0.022, colors: { main: HAAS_RED } },
    { view: 'side', logo: 'uchicago', x: 1.4, y: 0.4, height: 0.02, colors: { main: '#111111' } },
    // on top: GR on the engine cover and the nose, HAAS on the rear wing, Mphasis across the front flaps
    { view: 'top', logo: 'gr', x: 1.95, y: 0, height: 0.05, rotate: 180 },
    { view: 'top', logo: 'gr', x: -0.95, y: 0, height: 0.07, rotate: 180 },
    { view: 'top', logo: 'haas', x: -2.15, y: 0, height: 0.07, orient: 'across-rear', colors: { main: HAAS_RED, cut: '#F2F2F2' } },
    { view: 'top', logo: 'mphasis', x: 2.65, y: 0.5, height: 0.04, orient: 'across-front', colors: { main: HAAS_RED } },
    { view: 'top', logo: 'mphasis', x: 2.65, y: -0.5, height: 0.04, orient: 'across-front', colors: { main: HAAS_RED } },
  ],
  texts: numbers('87', { x: -1.25, y: 0.5, h: 0.07, color: HAAS_RED }, { color: WHITE }, { slant: 10 }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'gr', x: -2.1, y: 0.78, height: 0.06 },
      { view: 'side', logo: 'haas', x: -2.1, y: 0.62, height: 0.04, colors: { cut: '#F2F2F2' } },
    ],
    front: [{ view: 'side', logo: 'haas-tooling', x: 2.6, y: 0.2, height: 0.025 }],
  },
};

const AUDI_TITANIUM = '#6E7278';
const AUDI_RED = '#E5383B';
const AUDI: Livery = {
  id: 'audi-2026',
  name: 'Audi',
  era: 'gen2026',
  team: 'Audi Revolut F1 Team',
  price: 280,
  primary: AUDI_TITANIUM,
  secondary: AUDI_RED,
  glow: AUDI_RED,
  sidepod: 'compact',
  finish: 'matte',
  helmet: AUDI_RED,
  parts: parts(BLACK, BLACK, BLACK),
  frontParts: { wing: AUDI_TITANIUM, flap: BLACK, endplate: AUDI_TITANIUM },
  top: [
    // titanium with a darker engine cover top, the red rear of the sidepods, the red ring round the airbox mouth
    { color: '#3C3F44', path: 'M-0.1 0.15 C-0.5 0.17 -1.0 0.15 -1.4 0.1 L-1.4 -0.1 C-1.0 -0.15 -0.5 -0.17 -0.1 -0.15 Z' },
    { color: AUDI_RED, symmetric: true, path: 'M-0.8 0.16 C-0.9 0.4 -1.2 0.5 -1.75 0.46 L-1.75 0.16 Z' },
    { color: AUDI_RED, path: `M0.15 0 A0.1 0.1 0 1 0 -0.05 0 A0.1 0.1 0 1 0 0.15 0 Z M0.12 0 A0.07 0.07 0 1 1 -0.02 0 A0.07 0.07 0 1 1 0.12 0 Z`, rule: 'evenodd' },
  ],
  side: [
    // a metallic sheen from light at the top to darker low down
    { path: 'M2.9 0.06 L2.9 0.98 L-2.3 0.98 L-2.3 0.06 Z', gradient: { from: [0, 0.9], to: [0, 0.1], stops: [[0, '#7A7E84'], [0.5, '#5E6268'], [1, '#383B40']] } },
    floorEdge(0.12),
    // the red slash on the rear of the sidepod
    { color: AUDI_RED, path: 'M-0.75 0.12 C-0.65 0.28 -0.6 0.4 -0.62 0.5 C-0.95 0.52 -1.4 0.44 -1.85 0.36 L-1.85 0.12 Z' },
    // the red ring round the airbox mouth
    { color: AUDI_RED, path: 'M0.12 0.78 A0.07 0.11 0 1 0 -0.02 0.78 A0.07 0.11 0 1 0 0.12 0.78 Z M0.1 0.78 A0.05 0.085 0 1 1 0.0 0.78 A0.05 0.085 0 1 1 0.1 0.78 Z', rule: 'evenodd' },
  ],
  decals: [
    { view: 'side', logo: 'revolut', x: -0.15, y: 0.3, height: 0.06 },
    { view: 'side', logo: 'audi-rings', x: -0.85, y: 0.6, height: 0.055 },
    { view: 'side', logo: 'bp', x: -0.4, y: 0.7, height: 0.03 },
    { view: 'side', logo: 'castrol', x: -0.35, y: 0.58, height: 0.035 },
    { view: 'side', logo: 'gillette', x: 0.55, y: 0.56, height: 0.025 },
    { view: 'side', logo: 'qatar-airways', x: 1.15, y: 0.4, height: 0.025 },
    { view: 'side', logo: 'ninjaone', x: 0.3, y: 0.09, height: 0.022 },
    { view: 'side', logo: 'revolut-r', x: 1.9, y: 0.32, height: 0.05 },
    // on top: the rings on the engine cover and the nose, Revolut on the rear wing, Visit Qatar across the front flaps
    { view: 'top', logo: 'audi-rings', x: -0.75, y: 0, height: 0.05, rotate: 180 },
    { view: 'top', logo: 'audi-rings', x: 2.3, y: 0, height: 0.035, rotate: 180 },
    { view: 'top', logo: 'revolut-r', x: 1.85, y: 0, height: 0.06, rotate: 90 },
    { view: 'top', logo: 'revolut', x: -2.15, y: 0, height: 0.055, orient: 'across-rear', colors: { main: WHITE } },
    { view: 'top', logo: 'visit-qatar', x: 2.65, y: 0.5, height: 0.03, orient: 'across-front' },
    { view: 'top', logo: 'visit-qatar', x: 2.65, y: -0.5, height: 0.03, orient: 'across-front' },
  ],
  texts: numbers('27', { x: -1.3, y: 0.5, h: 0.07, color: WHITE }, { color: WHITE }),
  plateDecals: {
    rear: [
      { view: 'side', logo: 'audi-rings', x: -2.1, y: 0.78, height: 0.045 },
      { view: 'side', logo: 'revolut', x: -2.1, y: 0.64, height: 0.035, colors: { main: WHITE } },
    ],
    front: [{ view: 'side', logo: 'visit-qatar', x: 2.6, y: 0.2, height: 0.025 }],
  },
};

const CADILLAC: Livery = {
  id: 'cadillac-2026',
  name: 'Cadillac',
  era: 'gen2026',
  team: 'Cadillac Formula 1 Team',
  price: 300,
  primary: '#E9EAEC',
  secondary: '#111114',
  glow: '#C8102E',
  sidepod: 'compact',
  finish: 'gloss',
  helmet: '#F4F4F4',
  parts: parts('#F2F2F2', '#F2F2F2', '#F2F2F2', WHITE),
  frontParts: { wing: BLACK, flap: '#F2F2F2', endplate: '#F2F2F2' },
  top: [
    // black nose and tail, black along the sidepods' outer edges, a chequered fade over the rear of the cover
    { color: BLACK, path: 'M2.85 0.06 C2.4 0.1 1.9 0.13 1.4 0.15 L1.4 -0.15 C1.9 -0.13 2.4 -0.1 2.85 -0.06 Z' },
    { color: BLACK, path: 'M-1.4 0.14 C-1.8 0.12 -2.1 0.08 -2.2 0.05 L-2.2 -0.05 C-2.1 -0.08 -1.8 -0.12 -1.4 -0.14 Z' },
    { color: BLACK, symmetric: true, path: 'M0.75 0.52 C0.2 0.62 -0.8 0.6 -1.85 0.5 L-1.85 0.66 L0.75 0.66 Z' },
    halftone('#9A9DA3', -0.8, -1.5, -0.2, 0.2, 0.035, 0.012, 0.004),
  ],
  side: [
    // the black nose and chassis running back as a diagonal across the sidepod, black low down, grey checks fading
    { color: BLACK, path: 'M2.85 0.14 L2.85 0.3 C2.4 0.36 1.9 0.44 1.5 0.5 C1.2 0.54 0.9 0.56 0.75 0.56 C0.5 0.4 0.2 0.24 -0.3 0.06 L2.85 0.06 Z' },
    floorEdge(0.18),
    halftone('#9A9DA3', -0.9, -1.7, 0.44, 0.74, 0.035, 0.014, 0.003),
  ],
  decals: [
    { view: 'side', logo: 'twg', x: -0.5, y: 0.25, height: 0.085 },
    { view: 'side', logo: 'jim-beam', x: 0.35, y: 0.1, height: 0.025 },
    { view: 'side', logo: 'claro', x: 1.0, y: 0.42, height: 0.03 },
    { view: 'side', logo: 'cadillac', x: 1.35, y: 0.33, height: 0.035 },
    { view: 'side', logo: 'core-scientific', x: -0.25, y: 0.62, height: 0.02, colors: { main: BLACK } },
    // on top: the crest on the nose, CADILLAC on the cover, IFS on the rear wing, Cadillac across the front flaps
    { view: 'top', logo: 'cadillac', x: 2.1, y: 0, height: 0.04, rotate: 180 },
    { view: 'top', logo: 'cadillac', x: -0.55, y: 0, height: 0.04, rotate: 180, colors: { main: BLACK, frame: BLACK, a: WHITE } },
    { view: 'top', logo: 'ifs', x: -2.15, y: 0, height: 0.07, orient: 'across-rear' },
    { view: 'top', logo: 'cadillac', x: 2.65, y: 0.5, height: 0.035, orient: 'across-front', colors: { main: BLACK, frame: BLACK, a: WHITE } },
    { view: 'top', logo: 'cadillac', x: 2.65, y: -0.5, height: 0.035, orient: 'across-front', colors: { main: BLACK, frame: BLACK, a: WHITE } },
  ],
  texts: numbers('77', { x: -1.55, y: 0.38, h: 0.07, color: BLACK }, { color: WHITE }),
  plateDecals: {
    rear: [{ view: 'side', logo: 'ifs', x: -2.1, y: 0.76, height: 0.06 }],
    front: [{ view: 'side', logo: 'cadillac', x: 2.6, y: 0.2, height: 0.03, colors: { main: BLACK, frame: BLACK, a: WHITE } }],
  },
};

export const LIVERIES_GEN2026: readonly Livery[] = [FERRARI, MERCEDES, MCLAREN, REDBULL, RACINGBULLS, ALPINE, ASTONMARTIN, WILLIAMS, HAAS, AUDI, CADILLAC];
