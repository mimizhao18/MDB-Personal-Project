import { halftone, BLACK, CARBON, WHITE, flank } from '../liveryHelpers';
import type { Livery, LiveryLayer } from '../liveryTypes';

// 2022 (ground effect): every team on the grid, drawn from photos of the real cars (reference/gen2022/liveries/).
// Shapes are in the car's own measurements (see src/data/cars/gen2022.ts): x along the car (nose 2.95, front axle
// 1.8, sidepods 0.98 to -1.95, rear axle -1.8, tail -2.34), y up (floor edge 0.06 to 0.16, sidepod top about 0.6,
// engine cover top 0.9), z across (sidepods out to 0.75).

const parts = (wing: string, flap = wing, endplate = wing, halo?: string) => ({ wing, flap, endplate, floor: CARBON, ...(halo ? { halo } : {}) });
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
/** The W13's silver: a mid grey that the clearcoat and the studio lights brighten (a light grey reads as white). */
const MERC_SILVER = '#8A8E95';
const MERCEDES: Livery = {
  id: 'mercedes-2022',
  name: 'Mercedes',
  era: 'gen2022',
  team: 'Mercedes-AMG Petronas',
  price: 60,
  primary: MERC_SILVER,
  secondary: '#00D2BE',
  glow: '#00D2BE',
  sidepod: 'slim',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: parts(BLACK),
  frontParts: { wing: MERC_SILVER, flap: BLACK, endplate: MERC_RED },
  top: [
    // metallic silver, a touch darker toward the tail
    { path: 'M3.1 1.1 L-2.8 1.1 L-2.8 -1.1 L3.1 -1.1 Z', gradient: { from: [1.5, 0], to: [-1.6, 0], stops: [[0, '#959AA1'], [1, '#7A7E85']] } },
    // silver all over with a black tail; teal lines along the edges of the narrow sidepods; the red airbox top
    { color: BLACK, path: 'M-1.6 0.17 C-1.9 0.17 -2.2 0.15 -2.3 0.1 L-2.3 -0.1 C-2.2 -0.15 -1.9 -0.17 -1.6 -0.17 Z' },
    { color: MERC_TEAL, symmetric: true, path: 'M0.98 0.3 C0.6 0.43 0.0 0.48 -0.7 0.4 C-1.0 0.36 -1.2 0.31 -1.3 0.28 L-1.3 0.255 C-1.0 0.33 -0.6 0.37 0.0 0.44 C0.5 0.41 0.8 0.33 0.98 0.27 Z' },
    { color: MERC_RED, path: 'M0.12 0.13 C0.0 0.15 -0.3 0.14 -0.45 0.1 L-0.45 -0.1 C-0.3 -0.14 0.0 -0.15 0.12 -0.13 Z' },
  ],
  side: [
    // metallic silver: brighter high up where the light catches it, darker low down
    { path: 'M3.1 0 L3.1 1.2 L-2.8 1.2 L-2.8 0 Z', gradient: { from: [0, 0.85], to: [0, 0.2], stops: [[0, '#999DA4'], [1, '#72767D']] } },
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

const PAPAYA = '#FF8000';
const MCL_BLUE = '#47C7FC';
const ANTHRACITE = '#25272B';
const MCLAREN: Livery = {
  id: 'mclaren-2022',
  name: 'McLaren',
  era: 'gen2022',
  team: 'McLaren F1 Team',
  price: 80,
  primary: PAPAYA,
  secondary: MCL_BLUE,
  sidepod: 'downwash',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: parts(BLACK, BLACK, BLACK, PAPAYA),
  frontParts: { wing: BLACK, flap: PAPAYA, endplate: PAPAYA },
  top: [
    // the anthracite engine cover and tail with a papaya airbox, black rear of the sidepods, a blue nose tip
    { color: ANTHRACITE, path: 'M0.15 0.3 C-0.4 0.36 -1.0 0.34 -1.6 0.24 C-1.9 0.18 -2.2 0.12 -2.3 0.08 L-2.3 -0.08 C-2.2 -0.12 -1.9 -0.18 -1.6 -0.24 C-1.0 -0.34 -0.4 -0.36 0.15 -0.3 Z' },
    { color: ANTHRACITE, symmetric: true, path: 'M-0.55 0.14 C-0.8 0.5 -1.2 0.66 -1.95 0.62 L-1.95 0.14 Z' },
    { color: PAPAYA, path: 'M0.12 0.13 C0.0 0.15 -0.3 0.14 -0.42 0.1 L-0.42 -0.1 C-0.3 -0.14 0.0 -0.15 0.12 -0.13 Z' },
    { color: MCL_BLUE, path: 'M2.95 0.03 C2.85 0.07 2.7 0.085 2.6 0.09 L2.6 -0.09 C2.7 -0.085 2.85 -0.07 2.95 -0.03 Z' },
  ],
  side: [
    // black lower body; the papaya sidepod panel tapering back to a point, with the blue swoosh under it
    { color: BLACK, path: 'M1.3 0.06 L1.3 0.5 L-2.25 0.5 L-2.25 0.06 Z' },
    { color: PAPAYA, path: 'M0.98 0.6 C0.5 0.6 -0.2 0.57 -0.72 0.54 C-0.3 0.45 0.4 0.32 0.9 0.25 C0.97 0.3 0.99 0.45 0.98 0.6 Z' },
    { color: MCL_BLUE, path: 'M-1.05 0.56 C-0.3 0.43 0.4 0.3 0.9 0.23 L0.92 0.27 C0.4 0.33 -0.3 0.46 -0.72 0.54 Z' },
    // the anthracite engine cover above, papaya airbox, a papaya line along the cover's shoulder
    coverFlank(ANTHRACITE, 0.6),
    { color: PAPAYA, path: 'M0.12 0.8 L0.12 0.98 L-0.42 0.96 C-0.35 0.88 -0.2 0.82 0.12 0.8 Z' },
    { color: PAPAYA, path: 'M0.05 0.64 C-0.5 0.62 -1.1 0.58 -1.7 0.53 L-1.7 0.51 C-1.1 0.56 -0.5 0.6 0.05 0.62 Z' },
    // the blue band along the top of the chassis ahead of the sidepod (Richard Mille's)
    { color: MCL_BLUE, path: 'M1.0 0.5 C1.2 0.5 1.4 0.48 1.6 0.46 L1.6 0.42 C1.4 0.44 1.2 0.46 1.0 0.46 Z' },
  ],
  decals: [
    { view: 'side', logo: 'velo', x: 0.32, y: 0.44, height: 0.1 },
    { view: 'side', logo: 'android', x: -0.6, y: 0.71, height: 0.055 },
    { view: 'side', logo: 'smartsheet', x: -0.92, y: 0.62, height: 0.028 },
    { view: 'side', logo: 'arrow-electronics', x: -0.52, y: 0.635, height: 0.03 },
    { view: 'side', logo: 'webex', x: -0.14, y: 0.66, height: 0.035 },
    { view: 'side', logo: 'gulf', x: -1.22, y: 0.6, height: 0.075 },
    { view: 'side', logo: 'cadence', x: -1.0, y: 0.43, height: 0.032 },
    { view: 'side', logo: 'okx', x: 0.6, y: 0.62, height: 0.02 },
    { view: 'side', logo: 'tezos', x: 1.3, y: 0.36, height: 0.045 },
    { view: 'side', logo: 'richard-mille', x: 1.36, y: 0.475, height: 0.02 },
    { view: 'side', logo: 'dewalt', x: 0.75, y: 0.14, height: 0.045 },
    { view: 'side', logo: 'artura', x: -0.15, y: 0.91, height: 0.025 },
    // on top: the speedmark and ARTURA on the airbox, OKX on the rear wing, VELO on the front flaps
    { view: 'top', logo: 'artura', x: -0.15, y: 0, height: 0.03, rotate: 180 },
    { view: 'top', logo: 'mclaren-speedmark', x: 1.95, y: 0, height: 0.05, colors: { main: '#FFFFFF' }, rotate: 180 },
    { view: 'top', logo: 'okx', x: -2.26, y: 0, height: 0.08, orient: 'across-rear' },
    { view: 'top', logo: 'velo', x: 2.72, y: 0.52, height: 0.06, orient: 'across-front', colors: { main: WHITE, mark: WHITE } },
    { view: 'top', logo: 'velo', x: 2.72, y: -0.52, height: 0.06, orient: 'across-front', colors: { main: WHITE, mark: WHITE } },
  ],
  texts: [
    // Norris's 4, papaya on the engine cover fin and white on the nose
    { view: 'side', text: '4', x: -1.45, y: 0.6, height: 0.1, color: PAPAYA, font: 'sans', weight: 900, align: 'center' },
    { view: 'top', text: '4', x: 1.5, y: 0, height: 0.1, color: WHITE, font: 'sans', weight: 900, align: 'center' },
  ],
  plateDecals: {
    front: [{ view: 'side', logo: 'velo', x: 2.62, y: 0.22, height: 0.05 }],
    rear: [
      { view: 'side', logo: 'okx', x: -2.2, y: 0.78, height: 0.05 },
      { view: 'side', logo: 'hilton', x: -2.2, y: 0.62, height: 0.035 },
    ],
  },
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

const ALPINE_BLUE = '#1E7FDA';
const ALPINE_PINK = '#F27AB6';
const ALPINE: Livery = {
  id: 'alpine-2022',
  name: 'Alpine',
  era: 'gen2022',
  team: 'BWT Alpine F1 Team',
  price: 120,
  primary: ALPINE_BLUE,
  secondary: ALPINE_PINK,
  glow: ALPINE_PINK,
  sidepod: 'downwash',
  finish: 'gloss',
  helmet: ALPINE_BLUE,
  parts: parts(BLACK, ALPINE_PINK, BLACK, ALPINE_BLUE),
  frontParts: { wing: BLACK, flap: ALPINE_BLUE, endplate: BLACK },
  top: [
    // blue on top, fading through dots into a black tail; the pink panels show at the sidepods' outer edges
    { color: BLACK, path: 'M-1.55 0.22 C-1.9 0.2 -2.2 0.14 -2.3 0.1 L-2.3 -0.1 C-2.2 -0.14 -1.9 -0.2 -1.55 -0.22 Z' },
    halftone(BLACK, -0.7, -1.6, -0.3, 0.3, 0.03, 0, 0.017),
    { color: ALPINE_PINK, symmetric: true, path: 'M0.55 0.64 C0.2 0.72 -0.5 0.72 -0.95 0.62 L-0.95 0.7 C-0.5 0.78 0.2 0.78 0.55 0.72 Z' },
  ],
  side: [
    // black below the shoulder line, and the black lower nose
    { color: BLACK, path: 'M1.6 0.06 L1.6 0.5 C1.3 0.56 1.0 0.6 0.6 0.61 L-0.9 0.6 C-1.4 0.6 -1.9 0.52 -2.25 0.46 L-2.25 0.06 Z' },
    { color: BLACK, path: 'M2.93 0.12 L2.93 0.17 C2.5 0.2 2.0 0.24 1.6 0.28 L1.6 0.12 Z' },
    // the dotted fade from blue to black over the rear of the engine cover
    halftone(BLACK, -0.75, -1.7, 0.6, 0.86, 0.026, 0, 0.016),
    // the pink BWT panel on the sidepod
    { color: ALPINE_PINK, path: 'M0.5 0.2 C0.42 0.32 0.42 0.46 0.52 0.56 C0.0 0.55 -0.5 0.53 -0.88 0.49 C-0.98 0.38 -1.02 0.28 -1.06 0.17 C-0.6 0.17 0.0 0.18 0.5 0.2 Z' },
  ],
  decals: [
    { view: 'side', logo: 'bwt', x: -0.25, y: 0.37, height: 0.19, colors: { edge: WHITE } },
    { view: 'side', logo: 'mapfre', x: 1.32, y: 0.48, height: 0.05 },
    { view: 'side', logo: 'castrol', x: -0.55, y: 0.67, height: 0.06 },
    { view: 'side', logo: 'renault-etech', x: -0.15, y: 0.8, height: 0.05 },
    { view: 'side', logo: 'alpine-a', x: 0.05, y: 0.9, height: 0.045 },
    { view: 'side', logo: 'microsoft', x: 1.12, y: 0.36, height: 0.028 },
    { view: 'side', logo: 'dupont', x: 0.82, y: 0.16, height: 0.035 },
    { view: 'side', logo: 'binance', x: -0.15, y: 0.13, height: 0.024 },
    { view: 'side', logo: 'alpine', x: -1.0, y: 0.56, height: 0.022 },
    { view: 'side', logo: 'mandiant', x: 2.25, y: 0.24, height: 0.022 },
    // on top: the A on the nose, BWT in pink, BWT on the rear wing's pink flap
    { view: 'top', logo: 'alpine-a', x: 2.2, y: 0, height: 0.07, rotate: 90 },
    { view: 'top', logo: 'bwt', x: 1.75, y: 0, height: 0.06, rotate: 180, colors: { main: ALPINE_PINK, edge: ALPINE_BLUE } },
    { view: 'top', logo: 'bwt', x: -2.26, y: 0, height: 0.075, orient: 'across-rear', colors: { edge: ALPINE_PINK } },
    { view: 'top', logo: 'bwt', x: 2.72, y: 0.52, height: 0.06, orient: 'across-front', colors: { main: ALPINE_PINK, edge: ALPINE_BLUE } },
    { view: 'top', logo: 'bwt', x: 2.72, y: -0.52, height: 0.06, orient: 'across-front', colors: { main: ALPINE_PINK, edge: ALPINE_BLUE } },
  ],
  texts: [
    // Ocon's 31 on the engine cover and the nose
    { view: 'side', text: '31', x: -1.3, y: 0.66, height: 0.085, color: WHITE, font: 'sans', weight: 900, slant: 8, align: 'center' },
    { view: 'top', text: '31', x: 1.42, y: 0, height: 0.09, color: WHITE, font: 'sans', weight: 900, slant: 8, align: 'center' },
  ],
  plateDecals: {
    front: [{ view: 'side', logo: 'mandiant', x: 2.62, y: 0.22, height: 0.035 }],
    rear: [
      { view: 'side', logo: 'castrol', x: -2.2, y: 0.76, height: 0.06 },
      { view: 'side', logo: 'bwt', x: -2.2, y: 0.6, height: 0.06, colors: { main: ALPINE_PINK, edge: BLACK } },
    ],
  },
};

const AM_GREEN = '#0A6E5C';
const AM_LIME = '#C5E400';
const ASTONMARTIN: Livery = {
  id: 'astonmartin-2022',
  name: 'Aston Martin',
  era: 'gen2022',
  team: 'Aston Martin Aramco Cognizant F1 Team',
  price: 130,
  primary: AM_GREEN,
  secondary: AM_LIME,
  sidepod: 'slim',
  finish: 'gloss',
  helmet: AM_GREEN,
  parts: parts(AM_GREEN, AM_GREEN, BLACK, AM_GREEN),
  frontParts: { wing: BLACK, flap: AM_GREEN, endplate: BLACK },
  top: [
    // a lime line down each shoulder of the engine cover, lime edges along the narrow sidepods, a darker tail
    { color: AM_LIME, symmetric: true, path: 'M0.05 0.2 C-0.6 0.21 -1.3 0.16 -2.2 0.07 L-2.2 0.05 C-1.3 0.14 -0.6 0.19 0.05 0.18 Z' },
    { color: AM_LIME, symmetric: true, path: 'M0.95 0.36 C0.4 0.4 -0.5 0.39 -1.4 0.34 L-1.4 0.32 C-0.5 0.37 0.4 0.38 0.95 0.34 Z' },
    { color: '#073F35', path: 'M-1.5 0.15 C-1.9 0.13 -2.2 0.1 -2.3 0.08 L-2.3 -0.08 C-2.2 -0.1 -1.9 -0.13 -1.5 -0.15 Z' },
  ],
  side: [
    // the green darkening toward the floor, the black lower body under a lime line that runs from the nose to the tail
    { path: 'M1.6 0.2 L1.6 0.6 L-2.25 0.6 L-2.25 0.2 Z', gradient: { from: [0, 0.6], to: [0, 0.25], stops: [[0, AM_GREEN], [1, '#06483C']] } },
    { color: BLACK, path: 'M2.93 0.12 L2.93 0.17 C2.4 0.22 1.8 0.28 1.3 0.3 C0.6 0.29 -0.4 0.3 -1.2 0.36 C-1.6 0.4 -1.9 0.44 -2.25 0.5 L-2.25 0.06 L2.93 0.06 Z' },
    { color: AM_LIME, path: 'M2.93 0.17 C2.4 0.22 1.8 0.28 1.3 0.3 C0.6 0.29 -0.4 0.3 -1.2 0.36 C-1.6 0.4 -1.9 0.44 -2.25 0.5 L-2.25 0.525 C-1.9 0.465 -1.6 0.425 -1.2 0.385 C-0.4 0.325 0.6 0.315 1.3 0.325 C1.8 0.305 2.4 0.245 2.93 0.195 Z' },
    // the lime line along the top of the engine cover
    { color: AM_LIME, path: 'M0.0 0.86 C-0.5 0.8 -1.2 0.66 -2.1 0.48 L-2.1 0.455 C-1.2 0.635 -0.5 0.775 0.0 0.835 Z' },
  ],
  decals: [
    { view: 'side', logo: 'cognizant', x: -0.22, y: 0.4, height: 0.095 },
    { view: 'side', logo: 'aramco', x: -0.4, y: 0.68, height: 0.08 },
    { view: 'side', logo: 'crypto-com', x: -0.95, y: 0.56, height: 0.04 },
    { view: 'side', logo: 'peroni', x: 0.48, y: 0.55, height: 0.06 },
    { view: 'side', logo: 'sentinelone', x: 0.2, y: 0.63, height: 0.025 },
    { view: 'side', logo: 'bombardier', x: -0.1, y: 0.86, height: 0.022 },
    { view: 'side', logo: 'aston-wings', x: 1.38, y: 0.48, height: 0.05 },
    { view: 'side', logo: 'aston-martin', x: 0.9, y: 0.13, height: 0.03 },
    { view: 'side', logo: 'epos', x: 1.28, y: 0.36, height: 0.025 },
    { view: 'side', logo: 'boss', x: 2.35, y: 0.27, height: 0.03 },
    // on top: the wings on the nose, aramco on the airbox, cognizant on the rear wing, Peroni on the front wing
    { view: 'top', logo: 'aston-wings', x: 2.2, y: 0, height: 0.07, rotate: 90 },
    { view: 'top', logo: 'aramco', x: -0.2, y: 0, height: 0.045, rotate: 180 },
    { view: 'top', logo: 'cognizant', x: -2.26, y: 0, height: 0.065, orient: 'across-rear' },
    { view: 'top', logo: 'aramco', x: 2.72, y: 0.52, height: 0.055, orient: 'across-front' },
    { view: 'top', logo: 'aramco', x: 2.72, y: -0.52, height: 0.055, orient: 'across-front' },
  ],
  texts: [
    { view: 'side', text: '5', x: -1.4, y: 0.6, height: 0.09, color: WHITE, font: 'sans', weight: 800, align: 'center' },
    { view: 'top', text: '5', x: 1.45, y: 0, height: 0.09, color: WHITE, font: 'sans', weight: 800, align: 'center' },
  ],
  wingTop: [{ color: AM_LIME, points: [[-2.42, -0.45], [-2.42, 0.45], [-2.4, 0.45], [-2.4, -0.45]] }],
  plateDecals: {
    front: [{ view: 'side', logo: 'peroni', x: 2.62, y: 0.22, height: 0.07 }],
    rear: [
      { view: 'side', logo: 'jcb', x: -2.2, y: 0.78, height: 0.06 },
      { view: 'side', logo: 'juniper', x: -2.2, y: 0.64, height: 0.03 },
    ],
  },
};

const AT_NAVY = '#1C2541';
const ALPHATAURI: Livery = {
  id: 'alphatauri-2022',
  name: 'AlphaTauri',
  era: 'gen2022',
  team: 'Scuderia AlphaTauri',
  price: 140,
  primary: AT_NAVY,
  secondary: '#F4F4F4',
  sidepod: 'downwash',
  finish: 'matte',
  helmet: '#FF6A00',
  parts: parts(AT_NAVY, AT_NAVY, AT_NAVY, WHITE),
  top: [
    // white over the sidepods and the engine cover, with the navy bull's head swirling over the cover
    { color: WHITE, path: 'M0.95 0.62 C0.5 0.72 -0.3 0.7 -1.0 0.55 C-1.5 0.42 -1.9 0.3 -2.25 0.12 L-2.25 -0.12 C-1.9 -0.3 -1.5 -0.42 -1.0 -0.55 C-0.3 -0.7 0.5 -0.72 0.95 -0.62 Z' },
    { color: AT_NAVY, symmetric: true, path: 'M-0.2 0.14 C-0.4 0.3 -0.75 0.32 -0.95 0.18 C-1.1 0.08 -1.0 0.02 -0.85 0.06 C-0.7 0.12 -0.55 0.1 -0.45 0.02 L-0.3 0.02 Z' },
    { color: AT_NAVY, path: 'M-1.05 0.0 C-1.2 0.1 -1.5 0.08 -1.55 0.0 C-1.5 -0.08 -1.2 -0.1 -1.05 0.0 Z' },
    { color: AT_NAVY, path: 'M0.12 0.12 C0.0 0.14 -0.25 0.13 -0.35 0.08 L-0.35 -0.08 C-0.25 -0.13 0.0 -0.14 0.12 -0.12 Z' },
    // the white pinstripes along the nose
    { color: WHITE, symmetric: true, path: 'M2.95 0.07 C2.4 0.11 1.8 0.16 1.0 0.22 L1.0 0.235 C1.8 0.175 2.4 0.125 2.95 0.085 Z' },
  ],
  side: [
    // the white upper body over the sidepod and engine cover, edged with a white pinstripe below it
    { color: WHITE, path: 'M0.95 0.5 C0.4 0.52 -0.4 0.5 -1.1 0.44 C-1.6 0.4 -2.0 0.36 -2.25 0.34 L-2.25 0.5 C-1.6 0.62 -0.9 0.78 0.12 0.98 L0.95 0.98 Z' },
    { color: WHITE, path: 'M0.98 0.44 C0.4 0.465 -0.4 0.445 -1.1 0.385 C-1.6 0.345 -2.0 0.305 -2.25 0.285 L-2.25 0.27 C-2.0 0.29 -1.6 0.33 -1.1 0.37 C-0.4 0.43 0.4 0.45 0.98 0.425 Z' },
    // the navy bull's head on the engine cover: the sweep of its head and its horn
    { color: AT_NAVY, path: 'M-0.25 0.95 C-0.35 0.78 -0.55 0.66 -0.8 0.64 C-1.05 0.62 -1.2 0.7 -1.25 0.78 C-1.1 0.74 -0.95 0.74 -0.85 0.8 C-0.72 0.88 -0.6 0.92 -0.25 0.95 Z' },
    { color: AT_NAVY, path: 'M-0.55 0.62 C-0.7 0.56 -0.9 0.55 -1.05 0.6 C-0.95 0.5 -0.8 0.48 -0.6 0.52 Z' },
    { color: AT_NAVY, path: 'M0.1 0.98 C0.0 0.9 -0.1 0.84 -0.18 0.86 C-0.12 0.92 -0.05 0.96 0.1 0.98 Z' },
    // the white pinstripe along the nose
    { color: WHITE, path: 'M2.93 0.235 C2.4 0.29 1.8 0.38 1.1 0.5 L1.1 0.515 C1.8 0.395 2.4 0.305 2.93 0.25 Z' },
  ],
  decals: [
    { view: 'side', logo: 'alphatauri', x: -0.25, y: 0.29, height: 0.075 },
    { view: 'side', logo: 'buzz', x: 0.1, y: 0.62, height: 0.035, colors: { main: AT_NAVY } },
    { view: 'side', logo: 'hrc', x: -1.35, y: 0.52, height: 0.04 },
    { view: 'side', logo: 'ziba', x: 1.35, y: 0.38, height: 0.05 },
    { view: 'side', logo: 'icm', x: 1.05, y: 0.5, height: 0.03 },
    { view: 'side', logo: 'rapidapi', x: 0.72, y: 0.58, height: 0.022, colors: { main: AT_NAVY } },
    // on top: ALPHATAURI on the rear wing with FASHION MEETS FUNCTION, TAURI big across the front flaps
    { view: 'top', logo: 'alphatauri', x: -2.26, y: 0, height: 0.065, orient: 'across-rear' },
    { view: 'top', logo: 'fashion-meets-function', x: -2.07, y: 0, height: 0.03, orient: 'across-rear' },
    { view: 'top', logo: 'icm', x: 1.95, y: 0, height: 0.035, rotate: 180 },
  ],
  texts: [
    { view: 'top', text: 'TAURI', x: 2.74, y: 0.5, height: 0.09, color: WHITE, font: 'sans', weight: 900, orient: 'across-front' },
    { view: 'top', text: 'TAURI', x: 2.74, y: -0.5, height: 0.09, color: WHITE, font: 'sans', weight: 900, orient: 'across-front' },
    // Tsunoda's 22 on the engine cover and the nose
    { view: 'side', text: '22', x: -1.5, y: 0.58, height: 0.09, color: AT_NAVY, font: 'sans', weight: 900, align: 'center' },
    { view: 'top', text: '22', x: 1.5, y: 0, height: 0.1, color: WHITE, font: 'sans', weight: 900, align: 'center' },
  ],
  plateDecals: {
    front: [
      { view: 'side', logo: 'ziba', x: 2.62, y: 0.22, height: 0.06 },
      { view: 'side', logo: 'epicor', x: 2.62, y: 0.34, height: 0.025 },
    ],
    rear: [{ view: 'side', logo: 'alphatauri', x: -2.2, y: 0.76, height: 0.035 }],
  },
};

const ALFA_RED = '#A50F1D';
const ALFAROMEO: Livery = {
  id: 'alfaromeo-2022',
  name: 'Alfa Romeo',
  era: 'gen2022',
  team: 'Alfa Romeo F1 Team ORLEN',
  price: 150,
  primary: ALFA_RED,
  secondary: '#F4F4F4',
  sidepod: 'slim',
  finish: 'gloss',
  helmet: '#2A6BF0',
  parts: parts(ALFA_RED, ALFA_RED, BLACK, ALFA_RED),
  frontParts: { wing: BLACK, flap: BLACK, endplate: WHITE },
  top: [
    // the white airbox and sidepods (a white sweep over the shoulders), red nose and red rear of the engine cover
    { color: WHITE, path: 'M0.15 0.16 C0.0 0.2 -0.35 0.18 -0.6 0.12 L-0.6 -0.12 C-0.35 -0.18 0.0 -0.2 0.15 -0.16 Z' },
    { color: WHITE, symmetric: true, path: 'M0.98 0.17 C0.8 0.6 0.6 0.76 0.3 0.78 C-0.3 0.78 -0.7 0.66 -0.95 0.5 C-0.7 0.35 -0.45 0.22 -0.25 0.17 Z' },
  ],
  side: [
    // the black floor edge, the white sidepod and airbox, red behind them with a curved boundary
    { color: BLACK, path: 'M1.0 0.06 L1.0 0.17 C0.4 0.17 -0.6 0.17 -1.95 0.22 L-1.95 0.06 Z' },
    { color: WHITE, path: 'M0.98 0.17 L0.98 0.62 C0.6 0.64 0.3 0.66 0.15 0.7 L0.12 0.98 L-0.5 0.96 C-0.5 0.8 -0.6 0.66 -0.85 0.55 C-1.0 0.45 -1.05 0.3 -1.05 0.17 Z' },
  ],
  decals: [
    { view: 'side', logo: 'orlen', x: -0.15, y: 0.34, height: 0.075, colors: { main: ALFA_RED } },
    { view: 'side', logo: 'alfa-romeo-script', x: -0.98, y: 0.58, width: 0.4 },
    { view: 'side', logo: 'tonale', x: -1.02, y: 0.46, height: 0.028 },
    { view: 'side', logo: 'quadrifoglio', x: -0.62, y: 0.72, height: 0.05 },
    { view: 'side', logo: 'camozzi', x: 0.55, y: 0.6, height: 0.03 },
    { view: 'side', logo: 'path', x: 0.75, y: 0.66, height: 0.02, colors: { main: ALFA_RED } },
    { view: 'side', logo: 'web-eyewear', x: 1.25, y: 0.5, height: 0.025 },
    { view: 'side', logo: 'singha', x: 1.6, y: 0.4, height: 0.025 },
    { view: 'side', logo: 'cielo', x: 1.85, y: 0.35, height: 0.025 },
    // on top: ORLEN on the nose, ORLEN boxes on the rear wing, Accelleron on the front flaps
    { view: 'top', logo: 'orlen', x: 2.05, y: 0, height: 0.045, rotate: 180, colors: { main: WHITE, mark: WHITE } },
    { view: 'top', logo: 'orlen', x: -2.26, y: 0.24, height: 0.055, orient: 'across-rear', colors: { main: WHITE, mark: WHITE } },
    { view: 'top', logo: 'orlen', x: -2.26, y: -0.24, height: 0.055, orient: 'across-rear', colors: { main: WHITE, mark: WHITE } },
    { view: 'top', logo: 'accelleron', x: 2.72, y: 0.52, height: 0.04, orient: 'across-front' },
    { view: 'top', logo: 'accelleron', x: 2.72, y: -0.52, height: 0.04, orient: 'across-front' },
  ],
  texts: [
    // Bottas's 77, white on the red engine cover and on the nose
    { view: 'side', text: '77', x: -1.55, y: 0.5, height: 0.09, color: WHITE, font: 'sans', weight: 900, slant: 6, align: 'center' },
    { view: 'top', text: '77', x: 1.5, y: 0, height: 0.1, color: WHITE, font: 'sans', weight: 900, slant: 6, align: 'center' },
  ],
  plateDecals: {
    front: [{ view: 'side', logo: 'orlen', x: 2.62, y: 0.22, height: 0.05 }],
    rear: [{ view: 'side', logo: 'orlen', x: -2.2, y: 0.76, height: 0.06, colors: { main: WHITE, mark: WHITE } }],
  },
};

const HAAS_RED = '#E10600';
const HAAS: Livery = {
  id: 'haas-2022',
  name: 'Haas',
  era: 'gen2022',
  team: 'Haas F1 Team',
  price: 160,
  primary: '#F2F2F2',
  secondary: HAAS_RED,
  sidepod: 'downwash',
  finish: 'gloss',
  helmet: HAAS_RED,
  parts: parts('#F2F2F2', '#F2F2F2', '#F2F2F2', WHITE),
  frontParts: { wing: '#F2F2F2', flap: '#F2F2F2', endplate: BLACK },
  top: [
    // a red line down the middle of the nose and along the shoulders of the engine cover to the rear wing
    { color: HAAS_RED, path: 'M2.95 0.012 L1.7 0.02 L1.7 -0.02 L2.95 -0.012 Z' },
    { color: HAAS_RED, symmetric: true, path: 'M-0.3 0.21 C-0.9 0.22 -1.5 0.17 -2.2 0.08 L-2.2 0.05 C-1.5 0.14 -0.9 0.19 -0.3 0.18 Z' },
  ],
  side: [
    // the black floor edge, and the red sweep: along the chassis from the nose, down under HAAS and up the engine cover
    { color: BLACK, path: 'M1.0 0.06 L1.0 0.18 C0.4 0.18 -0.6 0.18 -1.95 0.24 L-1.95 0.06 Z' },
    { color: HAAS_RED, path: 'M2.93 0.21 C2.4 0.27 1.8 0.38 1.3 0.48 C1.05 0.53 0.98 0.5 0.9 0.4 C0.7 0.27 0.3 0.24 -0.2 0.24 C-0.7 0.24 -1.05 0.27 -1.25 0.36 C-1.45 0.46 -1.6 0.62 -1.75 0.8 L-1.85 0.78 C-1.7 0.6 -1.55 0.42 -1.35 0.3 C-1.1 0.19 -0.6 0.18 -0.2 0.18 C0.3 0.18 0.75 0.21 0.95 0.33 C1.05 0.4 1.15 0.42 1.3 0.4 C1.8 0.31 2.4 0.22 2.93 0.16 Z' },
  ],
  decals: [
    { view: 'side', logo: 'haas', x: -0.15, y: 0.38, height: 0.13, colors: { cut: '#F2F2F2' } },
    { view: 'side', logo: '1and1', x: 0.75, y: 0.52, height: 0.05 },
    { view: 'side', logo: 'ionos', x: 0.55, y: 0.62, height: 0.025 },
    { view: 'side', logo: 'haas-tooling', x: -0.5, y: 0.74, height: 0.025 },
    { view: 'side', logo: 'transfermate', x: -1.0, y: 0.56, height: 0.025 },
    // on top: HAAS on the nose and on the rear wing, HAAS across the front flaps
    { view: 'top', logo: 'haas', x: 2.0, y: 0, height: 0.05, rotate: 180 },
    { view: 'top', logo: 'haas', x: -2.26, y: 0, height: 0.075, orient: 'across-rear' },
    { view: 'top', logo: 'haas', x: 2.72, y: 0.52, height: 0.06, orient: 'across-front' },
    { view: 'top', logo: 'haas', x: 2.72, y: -0.52, height: 0.06, orient: 'across-front' },
  ],
  texts: [
    // Schumacher's 47, red on the white engine cover and on the nose
    { view: 'side', text: '47', x: -1.3, y: 0.6, height: 0.09, color: HAAS_RED, font: 'sans', weight: 900, slant: 10, align: 'center' },
    { view: 'top', text: '47', x: 1.5, y: 0, height: 0.1, color: HAAS_RED, font: 'sans', weight: 900, slant: 10, align: 'center' },
  ],
  plateDecals: {
    front: [{ view: 'side', logo: 'transfermate', x: 2.62, y: 0.22, height: 0.03, colors: { main: WHITE } }],
    rear: [
      { view: 'side', logo: '1and1', x: -2.2, y: 0.76, height: 0.08 },
      { view: 'side', logo: 'haas', x: -2.2, y: 0.6, height: 0.045 },
    ],
  },
};

const WIL_BLUE = '#1E4FE0';
const WIL_LIGHT = '#00A3E0';
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
    // bright blue facets over the engine cover and sidepods, a blue top to the nose, black tail and pod fronts
    { color: WIL_BLUE, path: 'M0.6 0.72 C0.0 0.76 -0.9 0.62 -1.7 0.3 L-2.3 0.1 L-2.3 -0.1 L-1.7 -0.3 C-0.9 -0.62 0.0 -0.76 0.6 -0.72 Z' },
    { color: '#3A6BF2', symmetric: true, path: 'M0.1 0.6 L-0.6 0.62 L-0.2 0.3 Z' },
    { color: '#1636B8', symmetric: true, path: 'M-0.6 0.62 L-1.3 0.45 L-0.75 0.2 Z' },
    { color: WIL_BLUE, path: 'M2.95 0.04 C2.4 0.07 1.8 0.1 1.0 0.14 L1.0 -0.14 C1.8 -0.1 2.4 -0.07 2.95 -0.04 Z' },
    { color: WIL_LIGHT, symmetric: true, path: 'M2.95 0.04 C2.4 0.07 1.8 0.1 1.0 0.14 L1.0 0.155 C1.8 0.115 2.4 0.085 2.95 0.055 Z' },
  ],
  side: [
    // black chassis and pod fronts; the blue rear body cut by a long diagonal, with lighter and darker facets
    { color: BLACK, path: 'M2.93 0.06 L2.93 0.3 L-2.25 0.3 L-2.25 0.06 Z' },
    { color: BLACK, path: 'M0.55 0.98 L-0.38 0.28 L1.6 0.28 L1.6 0.98 Z' },
    { color: WIL_BLUE, path: 'M0.55 0.98 L-0.38 0.28 C-0.8 0.3 -1.3 0.38 -1.75 0.48 C-1.95 0.52 -2.15 0.5 -2.25 0.46 L-2.25 0.98 Z' },
    { color: '#3A6BF2', path: 'M-0.6 0.9 L-0.95 0.42 L-0.3 0.48 Z' },
    { color: '#1636B8', path: 'M-0.95 0.42 L-1.25 0.85 L-1.55 0.47 Z' },
    { color: '#2A5CF0', path: 'M0.2 0.86 L-0.2 0.55 L-0.45 0.9 Z' },
    // the light blue and red lines where the blue meets the black at the back
    { color: WIL_LIGHT, path: 'M-1.75 0.48 C-1.3 0.38 -0.8 0.3 -0.38 0.28 L-0.36 0.3 C-0.8 0.32 -1.3 0.4 -1.75 0.5 Z' },
    { color: '#E4002B', path: 'M-1.2 0.4 L-0.85 0.27 L-0.83 0.285 L-1.18 0.415 Z' },
    // a blue band along the top of the chassis and nose
    { color: WIL_BLUE, path: 'M2.93 0.24 C2.4 0.3 1.8 0.4 1.0 0.56 L1.0 0.62 L0.55 0.62 L0.55 0.66 L1.0 0.66 C1.8 0.48 2.4 0.36 2.93 0.29 Z' },
  ],
  decals: [
    { view: 'side', logo: 'williams-w', x: -0.3, y: 0.72, height: 0.06, colors: { main: WIL_LIGHT, inner: WIL_LIGHT } },
    { view: 'side', logo: 'bang-olufsen', x: 0.15, y: 0.58, height: 0.022 },
    { view: 'side', logo: 'dorilton', x: -0.1, y: 0.4, height: 0.04 },
    { view: 'side', logo: 'duracell', x: 1.25, y: 0.5, height: 0.04 },
    { view: 'side', logo: 'acronis', x: 2.25, y: 0.24, height: 0.028 },
    { view: 'side', logo: 'lavazza', x: -0.1, y: 0.9, height: 0.025 },
    // on top: the W on the nose, the W and WILLIAMS RACING on the rear wing, Duracell across the front flaps
    { view: 'top', logo: 'williams-w', x: 2.3, y: 0, height: 0.07, rotate: 90 },
    { view: 'top', logo: 'williams-racing', x: -2.26, y: 0, height: 0.05, orient: 'across-rear', colors: { main: WIL_LIGHT } },
    { view: 'top', logo: 'duracell', x: 2.72, y: 0.52, height: 0.045, orient: 'across-front' },
    { view: 'top', logo: 'duracell', x: 2.72, y: -0.52, height: 0.045, orient: 'across-front' },
  ],
  texts: [
    // Latifi's 6, white on the blue engine cover and on the nose
    { view: 'side', text: '6', x: -1.25, y: 0.64, height: 0.09, color: WHITE, font: 'sans', weight: 800, align: 'center' },
    { view: 'top', text: '6', x: 1.5, y: 0, height: 0.1, color: WHITE, font: 'sans', weight: 800, align: 'center' },
  ],
  plateDecals: {
    front: [{ view: 'side', logo: 'ducati', x: 2.62, y: 0.22, height: 0.035 }],
    rear: [{ view: 'side', logo: 'williams', x: -2.2, y: 0.76, height: 0.035 }],
  },
};

export const LIVERIES_GEN2022: readonly Livery[] = [FERRARI, MERCEDES, MCLAREN, REDBULL, ALPINE, ASTONMARTIN, ALPHATAURI, ALFAROMEO, HAAS, WILLIAMS];
