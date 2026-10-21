import { grille, BLACK, CARBON, WHITE, both, ellipse, flank, noseCapShape, plateText, podBand, sideText, stripe, topText, wingText, layout } from '../liveryHelpers';
import type { Livery } from '../liveryTypes';

// 2022 (ground effect): every team on the grid, drawn from photos of the real cars (reference/gen2022/liveries/).
// Shapes are in the car's own measurements (see src/data/cars/gen2022.ts): x along the car (nose 2.95, front axle
// 1.8, sidepods 0.98 to -1.95, rear axle -1.8, tail -2.34), y up (floor edge 0.06 to 0.16, sidepod top about 0.6,
// engine cover top 0.9), z across (sidepods out to 0.75).

const L = layout('gen2022');
const mid = L.podMid; // a height halfway up the sidepod, for the big lettering (about 0.36)
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
    // cooling louvres on the engine cover behind the airbox, the yellow shield on the nose, a white Santander flag
    ...podBand(BLACK, -0.25, -0.7, 0.16, 0.26),
    { color: '#FFD200', points: ellipse(2.62, 0, 0.05, 0.035) },
    { color: WHITE, points: stripe(2.2, 2.32, 0.1) },
  ],
  side: [
    ...grille(-0.7, -0.25, 0.7, 0.8, 4),
    // the black floor edge, and the big yellow Shell roundel on the sidepod
    lowerPod(0.2),
    { color: '#FFD200', points: ellipse(0.15, 0.37, 0.17, 0.14) },
    // small Italian flag on the airbox
    { color: '#009246', points: flank(-0.32, -0.36, 0.78, 0.83) },
    { color: WHITE, points: flank(-0.36, -0.4, 0.78, 0.83) },
    { color: '#CE2B37', points: flank(-0.4, -0.44, 0.78, 0.83) },
  ],
  texts: [
    sideText('SHELL', 0.15, 0.37, 0.055, '#D40000'),
    sideText('CEVA', -0.35, 0.36, 0.075, WHITE),
    sideText('RAY-BAN', -0.85, 0.36, 0.06, WHITE),
    sideText('SANTANDER', -1.05, 0.66, 0.06, WHITE),
    sideText('VELAS', -0.15, 0.86, 0.04, WHITE),
    sideText('AWS', 0.72, 0.52, 0.04, WHITE),
    sideText('RICHARD MILLE', 1.25, 0.43, 0.035, WHITE),
    sideText('SNAPDRAGON', -0.35, 0.13, 0.045, WHITE),
    sideText('SANTANDER', 2.05, 0.3, 0.03, WHITE),
    sideText('MAHLE', 2.4, 0.26, 0.028, WHITE),
    topText('SANTANDER', 2.26, 0, 0.04, '#D40000'),
    topText('AWS', 1.5, 0, 0.05, WHITE),
    wingText('V-POWER', -2.26, 0, 0.065, WHITE),
    wingText('VELAS', -2.06, 0, 0.05, WHITE),
    wingText('AWS', 2.75, 0.55, 0.06, WHITE, 'front'),
    wingText('AWS', 2.75, -0.55, 0.06, WHITE, 'front'),
  ],
  plateTexts: { front: [plateText('AWS', 2.62, 0.22, 0.06, WHITE)], rear: [plateText('V-POWER', -2.2, 0.8, 0.06, WHITE), plateText('VELAS', -2.2, 0.68, 0.05, WHITE)] },
};

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
  frontParts: { wing: '#C4C7CB', flap: BLACK, endplate: '#C4C7CB' },
  top: [
    // silver all over with a black tail; the teal lines run along the edges of the narrow sidepods
    { color: BLACK, points: stripe(-1.7, L.tail - 0.05, 0.16) },
    ...both('#00D2BE', [[0.98, 0.3], [0.7, 0.42], [0.3, 0.48], [-0.2, 0.46], [-0.7, 0.4], [-1.3, 0.3], [-1.3, 0.26], [-0.7, 0.35], [-0.2, 0.41], [0.3, 0.43], [0.7, 0.37], [0.98, 0.26]]),
  ],
  side: [
    // black floor edge, the teal swoosh sweeping up along the sidepod, black lower engine cover at the back
    lowerPod(0.2),
    { color: '#00D2BE', points: [[0.98, 0.2], [0.98, 0.27], [-0.2, 0.31], [-1.9, 0.38], [-1.9, 0.32], [-0.2, 0.25]] },
    { color: BLACK, points: [[-1.3, 0.2], [-2.25, 0.2], [-2.25, 0.5], [-1.3, 0.38]] },
  ],
  texts: [
    sideText('PETRONAS', -0.35, 0.4, 0.085, '#00D2BE'),
    sideText('INEOS', -0.4, 0.8, 0.07, '#D40000'),
    sideText('TEAMVIEWER', 0.55, 0.52, 0.04, BLACK),
    sideText('AMD', 0.75, 0.6, 0.035, BLACK),
    sideText('IWC', 1.55, 0.36, 0.05, BLACK),
    sideText('CROWDSTRIKE', 1.0, 0.6, 0.028, BLACK),
    sideText('PETRONAS', -1.65, 0.3, 0.035, WHITE),
    topText('PETRONAS', 1.9, 0, 0.05, '#00D2BE'),
    wingText('PETRONAS', -2.26, 0, 0.065, '#00D2BE'),
    wingText('INEOS', 2.75, 0.55, 0.06, '#D40000', 'front'),
    wingText('INEOS', 2.75, -0.55, 0.06, '#D40000', 'front'),
  ],
  plateTexts: { front: [plateText('INEOS', 2.62, 0.22, 0.06, '#D40000')], rear: [plateText('PETRONAS', -2.2, 0.76, 0.055, '#00D2BE')] },
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

const REDBULL: Livery = {
  id: 'redbull-2022',
  name: 'Red Bull',
  era: 'gen2022',
  team: 'Oracle Red Bull Racing',
  price: 100,
  primary: '#1C2340',
  secondary: '#E4002B',
  glow: '#E4002B',
  sidepod: 'downwash',
  finish: 'matte',
  helmet: '#FF8A00',
  parts: parts('#1C2340', '#1C2340', '#1C2340', '#1C2340'),
  top: [
    // the yellow nose with the red bulls on it, a red stripe along the top of the engine cover
    { color: '#FFC500', points: noseCapShape(1.35, 2.95, 0.14) },
    { color: '#E4002B', points: ellipse(2.1, 0, 0.2, 0.05) },
    { color: '#E4002B', points: stripe(-0.4, -1.6, 0.03) },
  ],
  side: [
    // the yellow nose flank with the red bull, the Red Bull badge on the engine cover, a red floor edge
    { color: '#FFC500', points: [[1.3, 0.16], [1.3, 0.42], [2.92, 0.24], [2.92, 0.13]] },
    { color: '#E4002B', points: ellipse(2.05, 0.28, 0.26, 0.06) },
    { color: '#E4002B', points: ellipse(-0.65, 0.76, 0.3, 0.075) },
    { color: '#FFC500', points: ellipse(-0.3, 0.78, 0.085, 0.085) },
    { color: '#E4002B', points: flank(L.podFront, L.podRear, 0.06, 0.1) },
  ],
  texts: [
    sideText('ORACLE', -0.2, 0.36, 0.14, WHITE),
    sideText('RED BULL', -0.75, 0.64, 0.05, WHITE),
    sideText('BYBIT', 0.9, 0.5, 0.055, WHITE),
    sideText('TAG HEUER', 0.5, 0.58, 0.038, '#FFD100'),
    sideText('MOBIL 1', -1.5, 0.58, 0.05, WHITE),
    sideText('TEZOS', 0.0, 0.62, 0.035, WHITE),
    sideText('HRC', -1.2, 0.5, 0.04, WHITE),
    sideText('CLARO', 2.4, 0.19, 0.032, WHITE),
    topText('BYBIT', 1.0, 0, 0.06, WHITE),
    wingText('BYBIT', -2.26, 0, 0.08, WHITE),
    wingText('BYBIT', 2.75, 0.55, 0.07, WHITE, 'front'),
    wingText('BYBIT', 2.75, -0.55, 0.07, WHITE, 'front'),
  ],
  plateTexts: { front: [plateText('CLARO', 2.62, 0.22, 0.06, WHITE)], rear: [plateText('ESSO', -2.2, 0.76, 0.08, '#E4002B'), plateText('MOBIL 1', -2.2, 0.6, 0.05, WHITE)] },
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
