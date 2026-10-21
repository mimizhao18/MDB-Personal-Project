import { BLACK, CARBON, WHITE, both, ellipse, flank, noseCapShape, plateText, podBand, sideText, stripe, topText, wingText, layout } from '../../../src/data/liveryHelpers';
import type { Livery } from '../../../src/data/liveryTypes';

// 2014 (the first V6 turbo-hybrid season): the best-known liveries, drawn from the 2014 photos in
// reference/gen2014/liveries/. Shapes are in the car's own measurements (see src/data/cars/gen2014.ts): nose 2.75,
// front axle 1.8, sidepods 1.0 to -2.1, rear axle -1.8, tail -2.3; floor edge 0.06 to 0.17, sidepod top about 0.6,
// airbox top 0.94. The ids are the save keys and never change; `renault-2014` is the Renault-engined Lotus E22.

const L = layout('gen2014');
const parts = (wing: string, flap = wing, endplate = wing) => ({ wing, flap, endplate, floor: CARBON });
const AIRBOX = [0.06, -1.4] as const;
const ABOX_Y = [0.62, 0.96] as const;
/** The black lower sidepod and floor edge most teams run (bare carbon). */
const lowerPod = (top = 0.2, color = BLACK) => ({ color, points: flank(L.podFront, L.podRear, 0.06, top) });
/** The engine cover flank from the airbox back to the tail. */
const coverFlank = (color: string, y0 = 0.6) => ({ color, points: [[0.1, y0], [0.1, 0.96], [-0.7, 0.94], [-1.2, 0.86], [-2.2, 0.56], [-2.3, 0.46], [-1.3, y0]] as const });

const FERRARI: Livery = {
  id: 'ferrari-2014',
  name: 'Ferrari',
  era: 'gen2014',
  team: 'Scuderia Ferrari',
  price: 50,
  primary: '#DC0000',
  secondary: '#FFFFFF',
  sidepod: 'hybrid',
  finish: 'gloss',
  helmet: '#E8E8E8',
  parts: parts(BLACK, BLACK, '#DC0000'),
  frontParts: { wing: '#DC0000', flap: BLACK, endplate: BLACK },
  top: [
    // the white panel on the rear of the engine cover with the shield, a black tail, the shield on the nose
    { color: WHITE, points: [[-1.0, 0.16], [-1.0, -0.16], [-1.6, -0.1], [-1.6, 0.1]] },
    { color: BLACK, points: stripe(-1.9, L.tail - 0.05, 0.1) },
    { color: '#FFD800', points: ellipse(2.3, 0, 0.05, 0.035) },
  ],
  side: [
    // black floor edge, the white Santander flashes on the nose and the sidepod, the Shell roundel, the UPS box, the white cover panel
    lowerPod(0.18),
    { color: WHITE, points: [[2.1, 0.3], [2.1, 0.4], [1.3, 0.46], [1.3, 0.34]] },
    { color: WHITE, points: [[0.95, 0.2], [0.95, 0.32], [0.55, 0.32], [0.5, 0.2]] },
    { color: '#FFD800', points: ellipse(0.3, 0.34, 0.14, 0.12) },
    { color: '#5A3A1E', points: flank(-0.2, -0.5, 0.26, 0.42) },
    { color: WHITE, points: [[-0.9, 0.9], [-0.9, 0.68], [-1.7, 0.6], [-1.7, 0.8]] },
    { color: '#FFD800', points: ellipse(-1.05, 0.78, 0.05, 0.065) },
  ],
  texts: [
    sideText('SANTANDER', 1.7, 0.38, 0.045, '#DC0000'),
    sideText('SANTANDER', 0.72, 0.26, 0.035, '#DC0000'),
    sideText('SHELL', 0.3, 0.34, 0.045, '#DC0000'),
    sideText('UPS', -0.35, 0.34, 0.055, '#FFB500'),
    sideText('HUBLOT', 0.65, 0.56, 0.035, WHITE),
    sideText('WEICHAI', -0.85, 0.34, 0.035, WHITE),
    sideText('FIAT', -1.95, 0.6, 0.045, WHITE),
    sideText('SCUDERIA FERRARI', -1.3, 0.66, 0.03, '#DC0000'),
    sideText('KASPERSKY', 2.4, 0.26, 0.028, WHITE),
    sideText('7', 2.0, 0.26, 0.07, WHITE),
    sideText('INFOR', 0.1, 0.12, 0.035, WHITE),
    topText('SANTANDER', 1.9, 0, 0.045, WHITE),
    topText('7', 2.35, 0, 0.06, WHITE),
    wingText('V-POWER', -2.35, 0, 0.06, WHITE),
    wingText('SANTANDER', 2.7, 0.45, 0.05, WHITE, 'front'),
    wingText('SANTANDER', 2.7, -0.45, 0.05, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('V-POWER', -2.35, 0.82, 0.07, WHITE), plateText('SANTANDER', -2.35, 0.66, 0.05, WHITE)], front: [plateText('SANTANDER', 2.5, 0.26, 0.045, WHITE)] },
};

const MERCEDES: Livery = {
  id: 'mercedes-2014',
  name: 'Mercedes',
  era: 'gen2014',
  team: 'Mercedes AMG Petronas F1 Team',
  price: 80,
  primary: '#C5C9CD',
  secondary: '#00D2BE',
  glow: '#00D2BE',
  sidepod: 'hybrid',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: parts('#C5C9CD', '#C5C9CD', '#C5C9CD'),
  frontParts: { wing: '#C5C9CD', flap: '#00D2BE', endplate: '#C5C9CD' },
  top: [
    // silver with the teal Petronas sweep over the sidepods and down the engine cover sides
    ...both('#00D2BE', [[0.9, 0.42], [0.3, 0.6], [-0.4, 0.66], [-1.2, 0.5], [-1.2, 0.44], [-0.4, 0.6], [0.3, 0.52], [0.9, 0.36]]),
    { color: '#00D2BE', points: stripe(-0.5, -2.0, 0.015) },
  ],
  side: [
    // black floor edge, the teal sweep rising from the floor along the sidepod to the engine cover, a teal line on the nose
    lowerPod(0.14),
    { color: '#00D2BE', points: [[1.0, 0.14], [1.0, 0.3], [0.3, 0.44], [-0.6, 0.5], [-1.3, 0.56], [-1.9, 0.52], [-1.9, 0.44], [-1.3, 0.46], [-0.6, 0.38], [0.3, 0.26]] },
    { color: '#00D2BE', points: [[1.3, 0.48], [1.3, 0.5], [2.5, 0.32], [2.5, 0.3]] },
  ],
  texts: [
    sideText('PETRONAS', -0.4, 0.3, 0.09, WHITE),
    sideText('BLACKBERRY', 0.75, 0.5, 0.04, BLACK),
    sideText('PETRONAS PRIMAX', -1.55, 0.62, 0.028, BLACK),
    sideText('AMG', -0.9, 0.74, 0.04, BLACK),
    sideText('44', 1.65, 0.46, 0.09, '#D40000'),
    sideText('SWISSQUOTE', 2.0, 0.38, 0.026, BLACK),
    sideText('PETRONAS', 2.3, 0.32, 0.028, '#00D2BE'),
    sideText('IWC', 0.6, 0.6, 0.035, BLACK),
    topText('PETRONAS', 2.0, 0, 0.045, '#00D2BE'),
    topText('44', 1.5, 0, 0.1, '#D40000'),
    wingText('PETRONAS', -2.35, 0, 0.065, '#00D2BE'),
    wingText('PETRONAS', 2.7, 0.45, 0.05, '#00D2BE', 'front'),
    wingText('PETRONAS', 2.7, -0.45, 0.05, '#00D2BE', 'front'),
  ],
  plateTexts: { rear: [plateText('SWISSQUOTE', -2.35, 0.8, 0.045, BLACK), plateText('PETRONAS', -2.35, 0.64, 0.045, '#00D2BE')], front: [plateText('PETRONAS', 2.5, 0.26, 0.045, '#00D2BE')] },
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
    // chrome body with the black engine cover and tail, black rear halves of the sidepods, a red nose flash
    { color: BLACK, points: stripe(-0.4, L.tail - 0.05, 0.22) },
    ...podBand(BLACK, -0.6, -2.1, 0.16, 0.7),
    { color: '#E10600', points: stripe(1.9, 2.2, 0.08) },
  ],
  side: [
    // the black lower body and rear, the black engine cover flank with Johnnie Walker, the red Santander band
    lowerPod(0.22),
    coverFlank(BLACK, 0.6),
    { color: BLACK, points: [[-0.5, 0.22], [-0.5, 0.6], [-2.1, 0.5], [-2.1, 0.22]] },
    { color: '#E10600', points: flank(1.0, 0.1, 0.22, 0.3) },
    { color: '#E10600', points: flank(2.2, 1.9, 0.26, 0.44) },
  ],
  texts: [
    sideText('JOHNNIE WALKER', -0.7, 0.78, 0.045, WHITE),
    sideText('SANTANDER', 0.55, 0.26, 0.045, WHITE),
    sideText('MOBIL 1', 0.4, 0.46, 0.05, BLACK),
    sideText('GSK', -1.2, 0.4, 0.045, WHITE),
    sideText('HUGO BOSS', -0.3, 0.6, 0.032, BLACK),
    sideText('22', 2.05, 0.35, 0.08, WHITE),
    sideText('SAP', 1.35, 0.5, 0.04, BLACK),
    topText('MOBIL 1', 1.5, 0, 0.05, BLACK),
    topText('22', 2.05, 0, 0.06, WHITE),
    wingText('ASOS', -2.35, 0, 0.08, WHITE),
    wingText('MOBIL 1', 2.7, 0.45, 0.05, WHITE, 'front'),
    wingText('MOBIL 1', 2.7, -0.45, 0.05, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('JOHNNIE WALKER', -2.35, 0.8, 0.04, WHITE), plateText('ASOS', -2.35, 0.64, 0.06, WHITE)], front: [plateText('SANTANDER', 2.5, 0.26, 0.045, WHITE)] },
};

const REDBULL: Livery = {
  id: 'redbull-2014',
  name: 'Red Bull',
  era: 'gen2014',
  team: 'Infiniti Red Bull Racing',
  price: 140,
  primary: '#1C1F4F',
  secondary: '#E4002B',
  glow: '#E4002B',
  sidepod: 'hybrid',
  finish: 'matte',
  helmet: '#1C1F4F',
  parts: parts('#1C1F4F', '#1C1F4F', '#E4002B'),
  frontParts: { wing: '#1C1F4F', flap: '#1C1F4F', endplate: '#E4002B' },
  top: [
    // the yellow nose and airbox with the red bulls charging back over the engine cover, red flames on the sidepods
    { color: '#FFC500', points: noseCapShape(1.6, 2.75, 0.12) },
    { color: '#FFC500', points: stripe(0.06, -0.5, 0.14) },
    { color: '#E4002B', points: ellipse(-0.4, 0, 0.35, 0.09) },
    { color: '#E4002B', points: ellipse(2.1, 0, 0.18, 0.045) },
  ],
  side: [
    // the yellow airbox and the red bull across the engine cover, the yellow nose flank with its bull, a red stripe along the pod
    { color: '#FFC500', points: flank(AIRBOX[0], -0.5, 0.8, ABOX_Y[1]) },
    { color: '#E4002B', points: ellipse(-0.6, 0.78, 0.35, 0.09) },
    { color: '#FFC500', points: [[1.6, 0.3], [1.6, 0.44], [2.75, 0.3], [2.75, 0.24]] },
    { color: '#E4002B', points: ellipse(2.15, 0.33, 0.22, 0.05) },
    { color: '#E4002B', points: flank(L.podFront, -1.0, 0.44, 0.48) },
    { color: '#E4002B', points: flank(L.podFront, L.podRear, 0.06, 0.1) },
  ],
  texts: [
    sideText('INFINITI', -0.3, 0.32, 0.08, WHITE),
    sideText('RED BULL', -0.6, 0.66, 0.045, '#E4002B'),
    sideText('RENAULT', -1.4, 0.56, 0.045, WHITE),
    sideText('RAUCH', 0.55, 0.26, 0.04, '#FF7A00'),
    sideText('PEPE JEANS', 0.6, 0.54, 0.032, WHITE),
    sideText('CASIO', -1.3, 0.4, 0.035, WHITE),
    sideText('1', 1.3, 0.5, 0.08, WHITE),
    sideText('TOTAL', 1.9, 0.26, 0.035, WHITE),
    topText('RED BULL', 1.4, 0, 0.055, '#E4002B'),
    topText('1', 1.0, 0, 0.09, WHITE),
    wingText('INFINITI', -2.35, 0, 0.07, WHITE),
    wingText('RED BULL', 2.7, 0.45, 0.055, '#E4002B', 'front'),
    wingText('RED BULL', 2.7, -0.45, 0.055, '#E4002B', 'front'),
  ],
  plateTexts: { rear: [plateText('TOTAL', -2.35, 0.8, 0.07, WHITE), plateText('INFINITI', -2.35, 0.64, 0.045, WHITE)], front: [plateText('TOTAL', 2.5, 0.26, 0.055, WHITE)] },
};

const FORCEINDIA: Livery = {
  id: 'forceindia-2014',
  name: 'Force India',
  era: 'gen2014',
  team: 'Sahara Force India F1 Team',
  price: 170,
  primary: '#111114',
  secondary: '#F08A1D',
  glow: '#F08A1D',
  sidepod: 'hybrid',
  finish: 'gloss',
  helmet: '#E8E8E8',
  parts: parts(BLACK, BLACK, BLACK),
  frontParts: { wing: BLACK, flap: '#E6E8EA', endplate: BLACK },
  top: [
    // the silver-white nose and chassis top, saffron sidepod tops behind the inlets, a green band ahead of the rear wing
    { color: '#E6E8EA', points: noseCapShape(0.4, 2.75, 0.24) },
    ...podBand('#F08A1D', 0.9, -0.9, 0.2, 0.7),
    { color: '#1A8A4A', points: stripe(-1.4, -1.9, 0.14) },
  ],
  side: [
    // the silver-white nose flank, the saffron sidepod with Sahara, a green stripe along the cover, black everywhere else
    { color: '#E6E8EA', points: [[1.0, 0.3], [1.0, 0.62], [0.2, 0.64], [2.75, 0.34], [2.75, 0.22], [1.3, 0.3]] },
    { color: '#F08A1D', points: [[1.0, 0.2], [1.0, 0.56], [-0.2, 0.58], [-1.0, 0.44], [-1.0, 0.2]] },
    { color: '#1A8A4A', points: [[-1.0, 0.58], [-0.4, 0.64], [-2.2, 0.56], [-2.2, 0.5]] },
    { color: '#E6E8EA', points: flank(AIRBOX[0], -0.6, 0.84, ABOX_Y[1]) },
  ],
  texts: [
    sideText('SAHARA', 0.2, 0.4, 0.085, WHITE),
    sideText('FORCE INDIA', 0.3, 0.28, 0.035, WHITE),
    sideText('KINGFISHER', -0.6, 0.72, 0.04, WHITE),
    sideText('SMIRNOFF', -1.5, 0.36, 0.04, WHITE),
    sideText('CLARO', 1.9, 0.42, 0.04, BLACK),
    sideText('11', 1.5, 0.5, 0.08, BLACK),
    sideText('WHYTE & MACKAY', -0.6, 0.9, 0.028, BLACK),
    topText('SAHARA', 1.9, 0, 0.05, BLACK),
    topText('11', 1.4, 0, 0.09, BLACK),
    wingText('SMIRNOFF', -2.35, 0, 0.065, WHITE),
    wingText('CLARO', 2.7, 0.45, 0.055, BLACK, 'front'),
    wingText('CLARO', 2.7, -0.45, 0.055, BLACK, 'front'),
  ],
  plateTexts: { rear: [plateText('KINGFISHER', -2.35, 0.8, 0.045, WHITE), plateText('SAHARA', -2.35, 0.64, 0.05, '#F08A1D')], front: [plateText('CLARO', 2.5, 0.26, 0.05, WHITE)] },
};

const LOTUS: Livery = {
  id: 'renault-2014', // the save key from before this livery was drawn as the Lotus E22 (Renault-engined); never renamed
  name: 'Lotus',
  era: 'gen2014',
  team: 'Lotus F1 Team',
  price: 200,
  primary: '#111111',
  secondary: '#C9A227',
  glow: '#C9A227',
  sidepod: 'hybrid',
  finish: 'gloss',
  helmet: '#E10600',
  parts: parts(BLACK, BLACK, '#C8102E'),
  frontParts: { wing: BLACK, flap: '#C8102E', endplate: BLACK },
  top: [
    // black with gold pinstripes along the nose and over the sidepods, the red airbox top
    { color: '#C9A227', points: stripe(0.3, 2.75, 0.02) },
    ...podBand('#C9A227', 0.9, -1.2, 0.5, 0.53),
    { color: '#C8102E', points: stripe(0.06, -0.4, 0.12) },
  ],
  side: [
    // gold lines along the nose and the lower sidepod, the red airbox and the red PDVSA flash on the engine cover
    { color: '#C9A227', points: [[1.0, 0.44], [1.0, 0.47], [2.75, 0.32], [2.75, 0.29]] },
    { color: '#C9A227', points: flank(L.podFront, L.podRear, 0.2, 0.225) },
    { color: '#C8102E', points: flank(AIRBOX[0], -0.4, 0.78, ABOX_Y[1]) },
    { color: '#C8102E', points: [[-0.5, 0.7], [-0.5, 0.78], [-1.2, 0.7], [-1.2, 0.62]] },
  ],
  texts: [
    sideText('EMC', -0.3, 0.36, 0.1, WHITE),
    sideText('BURN', 0.55, 0.5, 0.045, WHITE),
    sideText('PDVSA', -0.85, 0.7, 0.04, WHITE),
    sideText('TOTAL', 0.6, 0.32, 0.035, WHITE),
    sideText('RICHARD MILLE', 1.5, 0.4, 0.03, WHITE),
    sideText('8', 2.0, 0.3, 0.07, WHITE),
    sideText('RENAULT', -1.3, 0.56, 0.04, '#C9A227'),
    sideText('MICROSOFT', -1.5, 0.4, 0.03, WHITE),
    topText('EMC', 1.7, 0, 0.055, WHITE),
    topText('8', 2.2, 0, 0.06, WHITE),
    wingText('PDVSA', -2.35, 0, 0.08, WHITE),
    wingText('BURN', 2.7, 0.45, 0.05, WHITE, 'front'),
    wingText('BURN', 2.7, -0.45, 0.05, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('PDVSA', -2.35, 0.8, 0.07, WHITE), plateText('MICROSOFT', -2.35, 0.64, 0.04, WHITE)], front: [plateText('TOTAL', 2.5, 0.26, 0.05, WHITE)] },
};

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
    // the Martini stripes down the middle of the car from nose to tail: light blue, navy, red, navy, light blue
    { color: '#58B4F0', points: stripe(L.tail, L.nose, 0.07) },
    { color: '#0B3D91', points: stripe(L.tail, L.nose, 0.05) },
    { color: '#E10600', points: stripe(L.tail, L.nose, 0.02) },
  ],
  side: [
    // the stripes over the engine cover seen from the side, and along the top of the nose
    { color: '#58B4F0', points: [[-0.5, 0.94], [-1.2, 0.86], [-2.2, 0.56], [-2.2, 0.5], [-1.2, 0.8], [-0.5, 0.88]] },
    { color: '#0B3D91', points: [[-0.5, 0.9], [-1.2, 0.83], [-2.2, 0.53], [-2.2, 0.51], [-1.2, 0.81], [-0.5, 0.88]] },
    { color: '#E10600', points: [[-0.5, 0.92], [-1.2, 0.845], [-2.2, 0.545], [-2.2, 0.535], [-1.2, 0.835], [-0.5, 0.91]] },
    { color: '#58B4F0', points: [[1.3, 0.5], [1.3, 0.54], [2.75, 0.34], [2.75, 0.3]] },
    { color: '#E10600', points: [[1.3, 0.515], [1.3, 0.525], [2.75, 0.325], [2.75, 0.315]] },
  ],
  texts: [
    sideText('MARTINI', -0.5, 0.32, 0.09, '#0B3D91'),
    sideText('PDVSA', -1.4, 0.56, 0.045, '#E10600'),
    sideText('RANDSTAD', 0.5, 0.56, 0.035, '#0B3D91'),
    sideText('EXPERIAN', 1.7, 0.4, 0.035, '#0B3D91'),
    sideText('ORIS', 2.2, 0.28, 0.04, '#0B3D91'),
    sideText('19', 1.3, 0.5, 0.08, '#0B3D91'),
    sideText('PETROBRAS', 0.4, 0.14, 0.035, '#0B3D91'),
    topText('MARTINI', 1.0, 0.1, 0.04, '#0B3D91'),
    topText('19', 1.5, 0.12, 0.07, '#0B3D91'),
    wingText('MARTINI', -2.35, 0, 0.09, WHITE),
    wingText('MARTINI', 2.7, 0.45, 0.055, '#0B3D91', 'front'),
    wingText('MARTINI', 2.7, -0.45, 0.055, '#0B3D91', 'front'),
  ],
  wingTop: [
    { color: '#58B4F0', points: [[-2.44, -0.37], [-2.44, 0.37], [-2.47, 0.37], [-2.47, -0.37]] },
    { color: '#E10600', points: [[-2.47, -0.37], [-2.47, 0.37], [-2.5, 0.37], [-2.5, -0.37]] },
    { color: '#0B3D91', points: [[-2.5, -0.37], [-2.5, 0.37], [-2.52, 0.37], [-2.52, -0.37]] },
  ],
  plateTexts: { rear: [plateText('MARTINI', -2.35, 0.8, 0.06, WHITE), plateText('PDVSA', -2.35, 0.64, 0.05, '#E10600')], front: [plateText('RANDSTAD', 2.5, 0.26, 0.04, WHITE)] },
};

export const LIVERIES_GEN2014: readonly Livery[] = [FERRARI, MERCEDES, MCLAREN, REDBULL, FORCEINDIA, LOTUS, WILLIAMS];
