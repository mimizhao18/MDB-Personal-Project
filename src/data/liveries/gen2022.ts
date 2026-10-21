import { grille, BLACK, CARBON, WHITE, ellipse, flank, noseCapShape, plateText, podBand, sideText, stripe, topText, wingText, layout } from '../liveryHelpers';
import type { Livery, LiveryLayer } from '../liveryTypes';

// 2022 (ground effect): every team on the grid, drawn from photos of the real cars (reference/gen2022/liveries/).
// Shapes are in the car's own measurements (see src/data/cars/gen2022.ts): x along the car (nose 2.95, front axle
// 1.8, sidepods 0.98 to -1.95, rear axle -1.8, tail -2.34), y up (floor edge 0.06 to 0.16, sidepod top about 0.6,
// engine cover top 0.9), z across (sidepods out to 0.75).

const L = layout('gen2022');
const parts = (wing: string, flap = wing, endplate = wing, halo?: string) => ({ wing, flap, endplate, floor: CARBON, ...(halo ? { halo } : {}) });
const AIRBOX = [0.08, -1.3] as const; // along the car, where the airbox and engine cover hump stand
const ABOX_Y = [0.62, 0.96] as const;
/** The black lower sidepod and floor edge most teams run (bare carbon). */
const lowerPod = (top = 0.2, color = BLACK) => ({ color, points: flank(L.podFront, L.podRear, 0.06, top) });
/** The upper flank of the engine cover, from the airbox back to the tail, as a side-view polygon. */
const coverFlank = (color: string, y0 = 0.56) => ({ color, points: [[0.1, y0], [0.1, 0.96], [-0.5, 0.95], [-1.1, 0.86], [-2.25, 0.5], [-2.25, 0.4], [-1.1, y0]] as const });

const FERRARI: Livery = {
  id: 'ferrari-2022',
  name: 'Ferrari',
  era: 'gen2022',
  team: 'Scuderia Ferrari',
  price: 0,
  primary: '#D40000',
  secondary: '#FFD200',
  sidepod: 'scoop',
  finish: 'gloss',
  helmet: '#D40000',
  parts: parts(CARBON),
  frontParts: { wing: CARBON, flap: '#D40000', endplate: CARBON },
  top: [
    // the louvres on the engine cover behind the airbox: darker red slats, not holes
    ...Array.from({ length: 6 }, (_, i): LiveryLayer => ({ color: '#A80000', symmetric: true, path: `M${-0.28 - i * 0.075} 0.17 C${-0.3 - i * 0.075} 0.21 ${-0.3 - i * 0.075} 0.24 ${-0.29 - i * 0.075} 0.27 L${-0.31 - i * 0.075} 0.27 C${-0.32 - i * 0.075} 0.24 ${-0.32 - i * 0.075} 0.21 ${-0.3 - i * 0.075} 0.17 Z` })),
  ],
  side: [
    // the black floor edge under the sidepod, rising a little toward the back
    { color: BLACK, path: 'M1.0 0.06 L1.0 0.19 C0.6 0.2 0.0 0.19 -0.8 0.2 C-1.3 0.21 -1.7 0.25 -1.95 0.3 L-1.95 0.06 Z' },
    // the Italian flag on the airbox
    { color: '#009246', points: flank(-0.32, -0.36, 0.78, 0.83) },
    { color: WHITE, points: flank(-0.36, -0.4, 0.78, 0.83) },
    { color: '#CE2B37', points: flank(-0.4, -0.44, 0.78, 0.83) },
  ],
  decals: [
    // the sidepod: the Shell pecten with its white keyline, Ceva, the Ray-Ban script
    { view: 'side', logo: 'shell', x: 0.32, y: 0.38, height: 0.32, colors: { key: WHITE } },
    { view: 'side', logo: 'ceva', x: -0.17, y: 0.44, height: 0.08 },
    { view: 'side', logo: 'ray-ban', x: -0.64, y: 0.4, width: 0.4 },
    // the engine cover: Santander, aws; the floor edge: Snapdragon and the small suppliers
    { view: 'side', logo: 'santander', x: -1.1, y: 0.6, height: 0.072 },
    { view: 'side', logo: 'aws', x: 0.42, y: 0.8, height: 0.09 },
    { view: 'side', logo: 'snapdragon', x: 0.9, y: 0.13, height: 0.06 },
    { view: 'side', logo: 'vistajet', x: 0.12, y: 0.13, height: 0.025 },
    { view: 'side', logo: 'skf', x: -0.12, y: 0.13, height: 0.03 },
    { view: 'side', logo: 'ngk', x: -0.28, y: 0.135, height: 0.04 },
    { view: 'side', logo: 'brembo', x: -0.45, y: 0.13, height: 0.03 },
    // the shield on the side of the chassis, Richard Mille ahead of the sidepod, Santander and Mahle on the nose
    { view: 'side', logo: 'ferrari-shield', x: 1.38, y: 0.6, height: 0.16 },
    { view: 'side', logo: 'richard-mille', x: 1.27, y: 0.5, height: 0.028 },
    { view: 'side', logo: 'santander', x: 2.05, y: 0.31, height: 0.032 },
    { view: 'side', logo: 'mahle', x: 2.42, y: 0.25, height: 0.026 },
    // on top: the shield near the tip of the nose, Santander, aws and the pecten along the nose, Velas before the cockpit
    { view: 'top', logo: 'ferrari-shield', x: 2.62, y: 0, height: 0.07, rotate: 90 },
    { view: 'top', logo: 'mahle', x: 2.42, y: 0, height: 0.03, rotate: 180 },
    { view: 'top', logo: 'santander', x: 2.2, y: 0, height: 0.035, rotate: 180 },
    { view: 'top', logo: 'aws', x: 1.95, y: 0, height: 0.07, rotate: 90 },
    { view: 'top', logo: 'shell', x: 1.72, y: 0, height: 0.17, rotate: 90 },
    { view: 'top', logo: 'velas', x: 1.22, y: 0, height: 0.03, rotate: 90 },
    { view: 'top', logo: 'shell-vpower', x: -2.26, y: 0, height: 0.07, orient: 'across-rear', colors: { key: WHITE } },
    { view: 'top', logo: 'velas', x: -2.07, y: 0, height: 0.04, orient: 'across-rear' },
    { view: 'top', logo: 'aws', x: 2.75, y: 0.55, height: 0.075, orient: 'across-front' },
    { view: 'top', logo: 'aws', x: 2.75, y: -0.55, height: 0.075, orient: 'across-front' },
  ],
  texts: [
    // the race number: yellow with a black outline, on the engine cover and the nose
    { view: 'side', text: '16', x: -0.72, y: 0.7, height: 0.12, color: '#FFD200', font: 'sans', weight: 900, align: 'center', outline: { color: BLACK, width: 0.008 } },
    { view: 'top', text: '16', x: 1.42, y: 0, height: 0.12, color: '#FFD200', font: 'sans', weight: 900, align: 'center', outline: { color: BLACK, width: 0.007 } },
  ],
  plateDecals: {
    front: [{ view: 'side', logo: 'aws', x: 2.62, y: 0.22, height: 0.08 }],
    rear: [
      { view: 'side', logo: 'shell-vpower', x: -2.2, y: 0.8, height: 0.06, colors: { key: WHITE } },
      { view: 'side', logo: 'velas', x: -2.2, y: 0.68, height: 0.035 },
    ],
  },
};

const MERC_TEAL = '#00A19C';
const MERC_RED = '#A3192A';
const MERCEDES: Livery = {
  id: 'mercedes-2022',
  name: 'Mercedes',
  era: 'gen2022',
  team: 'Mercedes-AMG Petronas',
  price: 60,
  primary: '#C4C7CB',
  secondary: '#00D2BE',
  glow: '#00D2BE',
  sidepod: 'slim',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: parts(BLACK),
  frontParts: { wing: '#C4C7CB', flap: BLACK, endplate: MERC_RED },
  top: [
    // silver all over with a black tail; teal lines along the edges of the narrow sidepods; the red airbox top
    { color: BLACK, path: 'M-1.6 0.17 C-1.9 0.17 -2.2 0.15 -2.3 0.1 L-2.3 -0.1 C-2.2 -0.15 -1.9 -0.17 -1.6 -0.17 Z' },
    { color: MERC_TEAL, symmetric: true, path: 'M0.98 0.3 C0.6 0.43 0.0 0.48 -0.7 0.4 C-1.0 0.36 -1.2 0.31 -1.3 0.28 L-1.3 0.255 C-1.0 0.33 -0.6 0.37 0.0 0.44 C0.5 0.41 0.8 0.33 0.98 0.27 Z' },
    { color: MERC_RED, path: 'M0.12 0.13 C0.0 0.15 -0.3 0.14 -0.45 0.1 L-0.45 -0.1 C-0.3 -0.14 0.0 -0.15 0.12 -0.13 Z' },
  ],
  side: [
    // the black floor edge, the teal stripe sweeping along the bottom of the sidepod, the black rear of the cover
    { color: BLACK, path: 'M1.0 0.06 L1.0 0.2 C0.5 0.2 -0.4 0.17 -1.95 0.2 L-1.95 0.06 Z' },
    { color: MERC_TEAL, path: 'M0.98 0.29 C0.6 0.26 0.2 0.24 -0.3 0.24 C-0.9 0.24 -1.5 0.28 -1.95 0.32 L-1.95 0.285 C-1.5 0.245 -0.9 0.205 -0.3 0.205 C0.2 0.205 0.6 0.22 0.98 0.25 Z' },
    { color: BLACK, path: 'M-1.35 0.2 C-1.6 0.3 -1.9 0.42 -2.25 0.5 L-2.25 0.2 Z' },
    // the red airbox (its intake and the roll hoop) with INEOS on it
    { color: MERC_RED, path: 'M0.12 0.82 L0.12 0.99 L-0.4 0.97 C-0.3 0.9 -0.2 0.85 -0.05 0.8 Z' },
  ],
  decals: [
    { view: 'side', logo: 'petronas', x: -0.22, y: 0.325, height: 0.075, colors: { main: '#1D1F22', mark: MERC_TEAL } },
    { view: 'side', logo: 'teamviewer', x: 0.25, y: 0.53, height: 0.045 },
    { view: 'side', logo: 'amd', x: 0.72, y: 0.55, height: 0.03 },
    { view: 'side', logo: 'ineos', x: -0.08, y: 0.9, height: 0.05 },
    { view: 'side', logo: 'iwc', x: 2.3, y: 0.31, height: 0.05 },
    { view: 'side', logo: 'crowdstrike', x: 1.1, y: 0.56, height: 0.025 },
    { view: 'side', logo: 'mercedes-star', x: 1.55, y: 0.4, height: 0.08, colors: { main: '#2A2C30', shade: '#55595F' } },
    // on top: the star at the tip of the nose, Petronas along it, INEOS on the front wing, Petronas on the rear wing
    { view: 'top', logo: 'mercedes-star', x: 2.66, y: 0, height: 0.1 },
    { view: 'top', logo: 'petronas-word', x: 2.05, y: 0, height: 0.045, rotate: 180, colors: { main: MERC_TEAL } },
    { view: 'top', logo: 'ineos', x: -0.15, y: 0, height: 0.05, rotate: 180 },
    { view: 'top', logo: 'petronas-word', x: -2.26, y: 0, height: 0.07, orient: 'across-rear', colors: { main: MERC_TEAL } },
    { view: 'top', logo: 'ineos', x: 2.75, y: 0.55, height: 0.06, orient: 'across-front', colors: { main: MERC_RED } },
    { view: 'top', logo: 'ineos', x: 2.75, y: -0.55, height: 0.06, orient: 'across-front', colors: { main: MERC_RED } },
  ],
  texts: [
    // Hamilton's 44 in neon yellow with a dark edge on the engine cover, Petronas Primax beside it
    { view: 'side', text: '44', x: -1.0, y: 0.6, height: 0.11, color: '#D7F205', font: 'sans', weight: 900, slant: 8, align: 'center', outline: { color: '#1D1F22', width: 0.006 } },
    { view: 'side', text: 'PETRONAS\nPRIMAX', x: -1.0, y: 0.76, height: 0.02, color: '#1D1F22', font: 'sans', weight: 800, align: 'center' },
    { view: 'top', text: '44', x: 1.45, y: 0, height: 0.1, color: '#D7F205', font: 'sans', weight: 900, slant: 8, align: 'center', outline: { color: '#1D1F22', width: 0.006 } },
  ],
  plateDecals: {
    front: [{ view: 'side', logo: 'ineos', x: 2.62, y: 0.22, height: 0.055 }],
    rear: [
      { view: 'side', logo: 'petronas-word', x: -2.2, y: 0.78, height: 0.045, colors: { main: MERC_TEAL } },
      { view: 'side', logo: 'crowdstrike', x: -2.2, y: 0.64, height: 0.03, colors: { main: WHITE } },
    ],
  },
};

const MCLAREN: Livery = {
  id: 'mclaren-2022',
  name: 'McLaren',
  era: 'gen2022',
  team: 'McLaren F1 Team',
  price: 80,
  primary: '#FF8000',
  secondary: '#47C7FC',
  sidepod: 'downwash',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: parts(BLACK, BLACK, BLACK, '#FF8000'),
  frontParts: { wing: BLACK, flap: '#FF8000', endplate: BLACK },
  top: [
    // black engine cover and tail with a papaya airbox, a blue nose tip
    { color: BLACK, points: stripe(-0.35, L.tail - 0.05, 0.22) },
    ...podBand(BLACK, -0.6, -1.95, 0.14, 0.7),
    { color: '#47C7FC', points: noseCapShape(2.6, 2.95, 0.09) },
  ],
  side: [
    // black engine cover flanks with "android", black lower body with the blue swoosh, the yellow DeWalt box
    coverFlank(BLACK, 0.6),
    lowerPod(0.22),
    { color: '#47C7FC', points: [[0.98, 0.22], [0.98, 0.3], [-0.2, 0.34], [-1.5, 0.3], [-1.5, 0.24], [-0.2, 0.26]] },
    { color: BLACK, points: [[1.3, 0.3], [1.3, 0.52], [0.8, 0.56], [0.8, 0.3]] },
    { color: '#FFD400', points: flank(0.55, 0.15, 0.1, 0.17) },
  ],
  texts: [
    sideText('VELO', 0.0, 0.4, 0.11, WHITE),
    sideText('ANDROID', -0.55, 0.74, 0.07, WHITE),
    sideText('CADENCE', -0.9, 0.4, 0.04, WHITE),
    sideText('WEBEX', -0.95, 0.52, 0.04, WHITE),
    sideText('ARROW', -0.5, 0.52, 0.04, WHITE),
    sideText('TEZOS', 1.05, 0.42, 0.05, WHITE),
    sideText('RICHARD MILLE', 1.4, 0.57, 0.032, WHITE),
    sideText('DEWALT', 0.35, 0.135, 0.04, BLACK),
    sideText('OKX', -1.9, 0.55, 0.05, WHITE),
    topText('ARTURA', -0.9, 0, 0.045, WHITE),
    wingText('OKX', -2.26, 0, 0.08, WHITE),
    wingText('VELO', 2.75, 0.55, 0.07, WHITE, 'front'),
    wingText('VELO', 2.75, -0.55, 0.07, WHITE, 'front'),
  ],
  plateTexts: { front: [plateText('VELO', 2.62, 0.22, 0.07, WHITE)], rear: [plateText('OKX', -2.2, 0.76, 0.08, WHITE), plateText('HILTON', -2.2, 0.6, 0.045, WHITE)] },
};

const RB_NAVY = '#1C2340';
const RB_RED = '#E4002B';
const RB_YELLOW = '#FFC906';
const REDBULL: Livery = {
  id: 'redbull-2022',
  name: 'Red Bull',
  era: 'gen2022',
  team: 'Oracle Red Bull Racing',
  price: 100,
  primary: RB_NAVY,
  secondary: RB_RED,
  glow: RB_RED,
  sidepod: 'downwash',
  finish: 'matte',
  helmet: '#FF8A00',
  parts: parts(RB_NAVY, RB_NAVY, RB_NAVY, RB_NAVY),
  top: [
    // the yellow nose, the yellow-to-orange airbox, a red stripe down the engine cover
    { path: 'M2.95 0.02 C2.7 0.05 2.2 0.085 1.75 0.11 C1.6 0.09 1.6 -0.09 1.75 -0.11 C2.2 -0.085 2.7 -0.05 2.95 -0.02 Z', gradient: { from: [2.95, 0], to: [1.7, 0], stops: [[0, '#FFD21A'], [1, '#FFB100']] } },
    { path: 'M0.12 0.12 C0.0 0.14 -0.4 0.14 -0.62 0.06 L-0.62 -0.06 C-0.4 -0.14 0.0 -0.14 0.12 -0.12 Z', gradient: { from: [0.1, 0], to: [-0.6, 0], stops: [[0, RB_YELLOW], [1, '#F39200']] } },
    { color: RB_RED, path: 'M-0.62 0.025 L-1.7 0.012 L-1.7 -0.012 L-0.62 -0.025 Z' },
  ],
  side: [
    // the yellow nose flank, the yellow-to-orange airbox flank, the red floor edge
    { path: 'M2.93 0.13 L2.93 0.25 C2.5 0.32 2.0 0.39 1.6 0.42 C1.55 0.33 1.55 0.22 1.6 0.16 C2.1 0.15 2.5 0.14 2.93 0.13 Z', gradient: { from: [2.9, 0], to: [1.6, 0], stops: [[0, '#FFD21A'], [1, '#FFB100']] } },
    { path: 'M0.12 0.66 L0.12 0.98 L-0.55 0.96 C-0.8 0.88 -1.0 0.76 -1.15 0.64 C-0.8 0.6 -0.4 0.6 0.12 0.66 Z', gradient: { from: [0.1, 0.85], to: [-1.1, 0.65], stops: [[0, RB_YELLOW], [0.6, '#F7A600'], [1, '#EF7D00']] } },
    { color: RB_RED, path: 'M0.98 0.075 L-1.95 0.075 L-1.95 0.1 L0.98 0.1 Z' },
    // the short red flashes beside BYBIT on the chassis
    { color: RB_RED, path: 'M1.55 0.5 L1.75 0.47 L1.76 0.49 L1.56 0.52 Z' },
    { color: RB_RED, path: 'M0.92 0.55 L1.0 0.54 L1.01 0.56 L0.93 0.57 Z' },
  ],
  decals: [
    // the charging bull: big over the airbox and the engine cover, and along the nose (both charge forward)
    { view: 'side', logo: 'redbull-bull', x: -0.6, y: 0.6, width: 0.56, mirror: true },
    { view: 'side', logo: 'redbull-bull', x: 2.15, y: 0.28, width: 0.42, mirror: true },
    { view: 'top', logo: 'redbull-bull', x: 2.2, y: 0, width: 0.4, mirror: true },
    { view: 'top', logo: 'redbull-bull', x: -0.75, y: 0, width: 0.45, mirror: true },
    // ORACLE on the sidepod, BYBIT on the chassis, the Honda HRC mark and Mobil 1 on the engine cover
    { view: 'side', logo: 'oracle', x: 0.05, y: 0.33, height: 0.08 },
    { view: 'side', logo: 'bybit', x: 1.25, y: 0.5, height: 0.05 },
    { view: 'side', logo: 'hrc', x: -1.35, y: 0.55, height: 0.04 },
    { view: 'side', logo: 'mobil1', x: -1.5, y: 0.44, height: 0.035 },
    { view: 'side', logo: 'tag-heuer', x: 0.55, y: 0.6, height: 0.06 },
    { view: 'side', logo: 'claro', x: 2.42, y: 0.2, height: 0.035 },
    // on top: TAG Heuer and ORACLE before the cockpit, BYBIT on the rear wing and across the front wing flaps
    { view: 'top', logo: 'tag-heuer', x: 1.38, y: 0, height: 0.09, rotate: 90 },
    { view: 'top', logo: 'oracle', x: 1.12, y: 0, height: 0.03, rotate: 180 },
    { view: 'top', logo: 'bybit', x: -2.26, y: 0, height: 0.085, orient: 'across-rear' },
    { view: 'top', logo: 'bybit', x: 2.62, y: 0.5, height: 0.05, orient: 'across-front' },
    { view: 'top', logo: 'bybit', x: 2.62, y: -0.5, height: 0.05, orient: 'across-front' },
  ],
  texts: [
    // the big red "Red Bull" across the front wing main plane, read from the front
    { view: 'top', text: 'Red', x: 2.82, y: 0.48, height: 0.075, color: RB_RED, font: 'sans', weight: 900, orient: 'across-front' },
    { view: 'top', text: 'Bull', x: 2.82, y: -0.48, height: 0.075, color: RB_RED, font: 'sans', weight: 900, orient: 'across-front' },
    // the number, red on the nose
    { view: 'top', text: '1', x: 1.58, y: 0, height: 0.12, color: RB_RED, font: 'sans', weight: 900, slant: 10, align: 'center' },
    { view: 'side', text: '1', x: 1.62, y: 0.43, height: 0.08, color: RB_RED, font: 'sans', weight: 900, slant: 10, align: 'center' },
  ],
  plateDecals: {
    front: [{ view: 'side', logo: 'mobil1', x: 2.62, y: 0.22, height: 0.045 }],
    rear: [
      { view: 'side', logo: 'esso', x: -2.2, y: 0.62, height: 0.06 },
      { view: 'side', logo: 'mobil1', x: -2.2, y: 0.78, height: 0.04 },
    ],
  },
};

const ALPINE: Livery = {
  id: 'alpine-2022',
  name: 'Alpine',
  era: 'gen2022',
  team: 'BWT Alpine F1 Team',
  price: 120,
  primary: '#1E7FDA',
  secondary: '#F27AB6',
  glow: '#F27AB6',
  sidepod: 'downwash',
  finish: 'gloss',
  helmet: '#1E7FDA',
  parts: parts(BLACK, BLACK, BLACK, '#1E7FDA'),
  top: [
    ...podBand(BLACK, -0.5, -1.1, 0.16, 0.28),
    // black tail; the pink panels on the lower sidepods show from above at their outer edge
    { color: BLACK, points: stripe(-1.5, L.tail - 0.05, 0.19) },
    ...podBand('#F27AB6', 0.6, -1.2, 0.62, 0.76),
  ],
  side: [
    ...grille(-1.1, -0.5, 0.74, 0.84, 4),
    // the black lower body, the pink BWT panel above it, the red MAPFRE box and the Castrol badge
    lowerPod(0.2),
    { color: '#F27AB6', points: [[0.6, 0.2], [0.6, 0.44], [-0.2, 0.44], [-1.25, 0.34], [-1.25, 0.2]] },
    { color: '#D81E2B', points: flank(1.35, 0.75, 0.32, 0.44) },
    { color: WHITE, points: flank(-0.1, -0.7, 0.78, 0.88) },
  ],
  texts: [
    sideText('BWT', -0.2, 0.32, 0.15, '#0A3C9E'),
    sideText('MAPFRE', 1.05, 0.38, 0.05, WHITE),
    sideText('CASTROL', -0.4, 0.83, 0.045, '#D81E2B'),
    sideText('RENAULT E-TECH', -0.45, 0.92, 0.028, WHITE),
    sideText('ALPINE', -1.35, 0.56, 0.055, WHITE),
    sideText('MICROSOFT', 0.6, 0.13, 0.038, WHITE),
    sideText('DUPONT', -0.2, 0.13, 0.038, WHITE),
    sideText('BINANCE', -0.9, 0.13, 0.035, WHITE),
    topText('BWT', 1.9, 0, 0.055, '#F27AB6'),
    wingText('BWT', -2.26, 0, 0.09, '#F27AB6'),
    wingText('BWT', 2.75, 0.55, 0.07, '#F27AB6', 'front'),
    wingText('BWT', 2.75, -0.55, 0.07, '#F27AB6', 'front'),
  ],
  plateTexts: { front: [plateText('MANDIANT', 2.62, 0.22, 0.045, WHITE)], rear: [plateText('CASTROL', -2.2, 0.76, 0.06, WHITE), plateText('BWT', -2.2, 0.6, 0.07, '#F27AB6')] },
};

const ASTONMARTIN: Livery = {
  id: 'astonmartin-2022',
  name: 'Aston Martin',
  era: 'gen2022',
  team: 'Aston Martin Aramco Cognizant F1 Team',
  price: 130,
  primary: '#0A6E5C',
  secondary: '#C5E400',
  sidepod: 'slim',
  finish: 'gloss',
  helmet: '#0A6E5C',
  parts: parts('#0A6E5C', '#0A6E5C', '#0A6E5C', '#0A6E5C'),
  top: [
    ...podBand(BLACK, -0.2, -0.55, 0.16, 0.26),
    // the lime line down the middle of the engine cover, lime edges on the sidepods
    { color: '#C5E400', points: stripe(-0.25, -1.4, 0.015) },
    ...podBand('#C5E400', 0.9, -1.4, 0.36, 0.39),
  ],
  side: [
    ...grille(-0.55, -0.2, 0.78, 0.86, 3),
    // black floor edge, the lime line rising from the sidepod front to the rear of the engine cover
    lowerPod(0.16),
    { color: '#C5E400', points: [[0.98, 0.16], [0.98, 0.2], [-0.6, 0.26], [-1.95, 0.5], [-1.95, 0.46], [-0.6, 0.22]] },
    { color: '#C5E400', points: ellipse(1.5, 0.37, 0.09, 0.035) },
  ],
  texts: [
    sideText('COGNIZANT', -0.35, 0.36, 0.1, WHITE),
    sideText('ARAMCO', -0.95, 0.72, 0.07, WHITE),
    sideText('CRYPTO.COM', -1.35, 0.56, 0.042, WHITE),
    sideText('PERONI', 0.55, 0.52, 0.042, WHITE),
    sideText('BOMBARDIER', -0.3, 0.9, 0.028, WHITE),
    sideText('ASTON MARTIN', 1.5, 0.37, 0.025, '#0A6E5C'),
    sideText('ARAMCO', 2.2, 0.26, 0.032, WHITE),
    sideText('JUNIPER', 0.8, 0.6, 0.03, WHITE),
    topText('ARAMCO', 1.9, 0, 0.05, '#C5E400'),
    wingText('COGNIZANT', -2.26, 0, 0.065, WHITE),
    wingText('ARAMCO', 2.75, 0.55, 0.07, WHITE, 'front'),
    wingText('ARAMCO', 2.75, -0.55, 0.07, WHITE, 'front'),
  ],
  wingTop: [{ color: '#C5E400', points: [[-2.42, -0.45], [-2.42, 0.45], [-2.4, 0.45], [-2.4, -0.45]] }],
  plateTexts: { front: [plateText('BOSS', 2.62, 0.22, 0.07, WHITE)], rear: [plateText('JCB', -2.2, 0.76, 0.09, '#FFD100'), plateText('COGNIZANT', -2.2, 0.6, 0.04, WHITE)] },
};

const ALPHATAURI: Livery = {
  id: 'alphatauri-2022',
  name: 'AlphaTauri',
  era: 'gen2022',
  team: 'Scuderia AlphaTauri',
  price: 140,
  primary: '#1C2541',
  secondary: '#F4F4F4',
  sidepod: 'downwash',
  finish: 'matte',
  helmet: '#FF6A00',
  parts: parts('#1C2541', '#1C2541', '#1C2541', WHITE),
  top: [
    // the white airbox and engine cover with the navy bull splash, a white nose tip
    { color: WHITE, points: stripe(0.1, -1.7, 0.3) },
    { color: '#1C2541', points: [[-0.2, 0.12], [-0.5, 0.18], [-0.85, 0.05], [-0.7, -0.1], [-0.35, -0.08], [-0.15, 0.0]] },
    { color: '#1C2541', points: ellipse(-1.1, 0.0, 0.2, 0.08) },
    { color: WHITE, points: noseCapShape(2.4, 2.95, 0.09) },
  ],
  side: [
    // the white upper body with the navy bull's head, a white line along the lower sidepod
    coverFlank(WHITE, 0.58),
    { color: '#1C2541', points: ellipse(-0.75, 0.74, 0.32, 0.14) },
    { color: WHITE, points: ellipse(-1.15, 0.77, 0.09, 0.08) },
    { color: '#1C2541', points: ellipse(-0.3, 0.68, 0.12, 0.06) },
    { color: WHITE, points: flank(L.podFront, L.podRear, 0.2, 0.23) },
  ],
  texts: [
    sideText('ALPHATAURI', -0.2, 0.37, 0.12, WHITE),
    sideText('BUZZ', -0.35, 0.86, 0.045, '#1C2541'),
    sideText('HRC', -1.35, 0.52, 0.045, WHITE),
    sideText('ZIBA', 1.35, 0.4, 0.045, WHITE),
    sideText('ICM', 1.05, 0.52, 0.04, WHITE),
    sideText('RAPIDAPI', 0.75, 0.6, 0.03, WHITE),
    sideText('FASHION', 0.5, 0.15, 0.035, WHITE),
    topText('ALPHATAURI', 1.9, 0, 0.045, WHITE),
    wingText('ALPHATAURI', -2.26, 0, 0.08, WHITE),
    wingText('FASHION MEETS FUNCTION', -2.06, 0, 0.04, WHITE),
    wingText('TAURI', 2.75, 0.55, 0.09, WHITE, 'front'),
    wingText('TAURI', 2.75, -0.55, 0.09, WHITE, 'front'),
  ],
  plateTexts: { front: [plateText('ZIBA', 2.62, 0.22, 0.07, WHITE), plateText('EPICOR', 2.62, 0.34, 0.035, WHITE)], rear: [plateText('ALPHATAURI', -2.2, 0.76, 0.045, WHITE)] },
};

const ALFAROMEO: Livery = {
  id: 'alfaromeo-2022',
  name: 'Alfa Romeo',
  era: 'gen2022',
  team: 'Alfa Romeo F1 Team ORLEN',
  price: 150,
  primary: '#A50F1D',
  secondary: '#F4F4F4',
  sidepod: 'slim',
  finish: 'gloss',
  helmet: '#2A6BF0',
  parts: parts('#A50F1D', '#A50F1D', '#A50F1D', WHITE),
  frontParts: { wing: BLACK, flap: WHITE, endplate: WHITE },
  top: [
    // the white airbox and sidepods, red nose and red rear of the engine cover
    { color: WHITE, points: stripe(0.1, -0.6, 0.15) },
    ...podBand(WHITE, 0.98, -0.9, 0.17, 0.76),
    { color: '#A50F1D', points: stripe(-0.9, -1.3, 0.3) },
  ],
  side: [
    lowerPod(0.16),
    // the white airbox flank and the white sidepod, red behind
    { color: WHITE, points: flank(AIRBOX[0], -0.55, ABOX_Y[0], ABOX_Y[1]) },
    { color: WHITE, points: [[0.98, 0.16], [0.98, 0.62], [0.2, 0.64], [-0.75, 0.6], [-1.0, 0.3], [-1.0, 0.16]] },
    { color: WHITE, points: flank(1.3, 1.1, 0.3, 0.42) },
  ],
  texts: [
    sideText('ORLEN', -0.05, 0.32, 0.1, '#A50F1D'),
    sideText('ALFA ROMEO', -1.15, 0.66, 0.075, WHITE),
    sideText('CAMOZZI', 0.6, 0.56, 0.035, BLACK),
    sideText('ADLER', 1.2, 0.36, 0.035, '#A50F1D'),
    sideText('SINGHA', 1.6, 0.4, 0.03, WHITE),
    sideText('PATH', 0.4, 0.64, 0.03, '#A50F1D'),
    sideText('ORLEN', -1.5, 0.45, 0.045, WHITE),
    topText('ORLEN', 2.0, 0, 0.05, WHITE),
    wingText('ORLEN', -2.26, 0, 0.08, WHITE),
    wingText('ORLEN', 2.75, 0.55, 0.06, '#A50F1D', 'front'),
    wingText('ORLEN', 2.75, -0.55, 0.06, '#A50F1D', 'front'),
  ],
  plateTexts: { front: [plateText('ORLEN', 2.62, 0.22, 0.06, '#A50F1D')], rear: [plateText('ORLEN', -2.2, 0.76, 0.08, WHITE)] },
};

const HAAS: Livery = {
  id: 'haas-2022',
  name: 'Haas',
  era: 'gen2022',
  team: 'Haas F1 Team',
  price: 160,
  primary: '#F2F2F2',
  secondary: '#E10600',
  sidepod: 'downwash',
  finish: 'gloss',
  helmet: '#E10600',
  parts: parts('#F2F2F2', '#F2F2F2', '#F2F2F2', WHITE),
  frontParts: { wing: '#F2F2F2', flap: '#F2F2F2', endplate: BLACK },
  top: [
    ...podBand(BLACK, 0.2, -0.6, 0.17, 0.27),
    // a red stripe down the engine cover and red edges along the sidepods
    { color: '#E10600', points: stripe(-0.5, L.tail - 0.05, 0.045) },
    ...podBand('#E10600', 0.9, -1.5, 0.52, 0.58),
  ],
  side: [
    ...grille(-0.6, 0.2, 0.74, 0.84, 5),
    // black floor edge with the red band above it, a red stripe along the lower nose, the blue 1&1 box
    lowerPod(0.16),
    { color: '#E10600', points: flank(L.podFront, L.podRear, 0.16, 0.22) },
    { color: '#E10600', points: [[1.0, 0.3], [1.0, 0.36], [2.9, 0.2], [2.9, 0.16]] },
    { color: '#0B3D91', points: flank(0.98, 0.76, 0.4, 0.52) },
  ],
  texts: [
    sideText('HAAS', -0.3, 0.35, 0.16, '#E10600'),
    sideText('1&1', 0.87, 0.46, 0.05, WHITE),
    sideText('IONOS', 0.55, 0.57, 0.04, BLACK),
    sideText('HAAS TOOLING', -0.2, 0.9, 0.028, '#E10600'),
    sideText('TRANSFERMATE', -1.4, 0.56, 0.035, BLACK),
    sideText('HAAS', 1.9, 0.26, 0.04, '#E10600'),
    topText('HAAS', 2.0, 0, 0.05, '#E10600'),
    wingText('HAAS', -2.26, 0, 0.08, '#E10600'),
    wingText('HAAS', 2.75, 0.55, 0.07, '#E10600', 'front'),
    wingText('HAAS', 2.75, -0.55, 0.07, '#E10600', 'front'),
  ],
  plateTexts: { front: [plateText('TRANSFERMATE', 2.62, 0.22, 0.04, WHITE)], rear: [plateText('1&1', -2.2, 0.76, 0.09, '#0B3D91'), plateText('HAAS', -2.2, 0.58, 0.06, '#E10600')] },
};

const WILLIAMS: Livery = {
  id: 'williams-2022',
  name: 'Williams',
  era: 'gen2022',
  team: 'Williams Racing',
  price: 170,
  primary: '#0B1C52',
  secondary: '#1E6FE8',
  glow: '#2B7DFF',
  sidepod: 'downwash',
  finish: 'gloss',
  helmet: '#2A6BF0',
  parts: parts(BLACK, BLACK, BLACK),
  top: [
    // the bright blue engine cover and airbox, a bright blue nose, black tail
    { color: '#1E6FE8', points: stripe(0.1, -2.0, 0.22) },
    { color: '#52B7FF', points: stripe(-0.5, -1.2, 0.06) },
    { color: BLACK, points: stripe(-2.0, L.tail - 0.05, 0.19) },
    { color: '#1E6FE8', points: noseCapShape(1.5, 2.95, 0.13) },
    ...podBand('#1E6FE8', 0.9, -1.2, 0.6, 0.7),
  ],
  side: [
    // black lower body, the bright blue upper engine cover and the blue stripe along the sidepod
    lowerPod(0.22),
    coverFlank('#1E6FE8', 0.58),
    { color: '#52B7FF', points: [[-0.3, 0.9], [-0.9, 0.86], [-1.5, 0.66], [-1.0, 0.7]] },
    { color: '#1E6FE8', points: flank(0.98, -0.6, 0.22, 0.26) },
    { color: '#1E6FE8', points: [[1.3, 0.3], [1.3, 0.44], [2.9, 0.24], [2.9, 0.16]] },
  ],
  texts: [
    sideText('DORILTON', -0.4, 0.38, 0.065, WHITE),
    sideText('DURACELL', 0.45, 0.42, 0.045, WHITE),
    sideText('W', -0.75, 0.74, 0.1, WHITE),
    sideText('LAVAZZA', -0.3, 0.9, 0.032, WHITE),
    sideText('BANG & OLUFSEN', 0.5, 0.54, 0.03, WHITE),
    sideText('ACRONIS', 0.4, 0.14, 0.04, WHITE),
    sideText('FUZION', 1.9, 0.3, 0.035, WHITE),
    sideText('ZEISS', 2.3, 0.24, 0.03, WHITE),
    topText('W', 1.4, 0, 0.09, WHITE),
    wingText('WILLIAMS RACING', -2.26, 0, 0.06, '#52B7FF'),
    wingText('W', 2.75, 0.55, 0.08, '#1E6FE8', 'front'),
    wingText('W', 2.75, -0.55, 0.08, '#1E6FE8', 'front'),
  ],
  plateTexts: { front: [plateText('DUCATI', 2.62, 0.22, 0.05, WHITE)], rear: [plateText('WILLIAMS', -2.2, 0.76, 0.055, WHITE)] },
};

export const LIVERIES_GEN2022: readonly Livery[] = [FERRARI, MERCEDES, MCLAREN, REDBULL, ALPINE, ASTONMARTIN, ALPHATAURI, ALFAROMEO, HAAS, WILLIAMS];
