import { BLACK, CARBON, WHITE, both, ellipse, flank, noseCapShape, plateText, sideText, stripe, topText, wingText, layout } from '../liveryHelpers';
import type { Livery } from '../liveryTypes';

// 2014 (hybrid era, drawn as the 2018 cars): the best-known liveries, drawn from the 2018 photos in
// reference/gen2014/liveries/. Shapes are in the car's own measurements (see src/data/cars/gen2014.ts): nose 2.82,
// front axle 1.8, sidepods 1.0 to -2.1, rear axle -1.8, tail -2.3; floor edge 0.06 to 0.17, sidepod top about 0.6,
// engine cover top 0.94, shark fin 0.62 to 0.96 along -0.7 to -2.2.

const L = layout('gen2014');
const parts = (wing: string, flap = wing, endplate = wing, halo?: string) => ({ wing, flap, endplate, floor: CARBON, ...(halo ? { halo } : {}) });
const AIRBOX = [0.06, -1.4] as const;
const ABOX_Y = [0.62, 1.05] as const;
/** The black lower sidepod and floor edge most teams run (bare carbon). */
const lowerPod = (top = 0.2, color = BLACK) => ({ color, points: flank(L.podFront, L.podRear, 0.06, top) });

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
  parts: parts('#DC0000', '#DC0000', '#DC0000', '#DC0000'),
  top: [
    // the white number box on the engine cover, the yellow shield on the nose, black tail
    { color: WHITE, points: stripe(-0.95, -1.25, 0.12) },
    { color: BLACK, points: stripe(-2.0, L.tail - 0.05, 0.1) },
    { color: '#FFD800', points: ellipse(2.4, 0, 0.05, 0.035) },
  ],
  side: [
    // black floor edge, the yellow Shell roundel on the sidepod, the white number box on the cover and the nose
    lowerPod(0.18),
    { color: '#FFD800', points: ellipse(0.5, 0.36, 0.14, 0.12) },
    { color: WHITE, points: flank(-0.95, -1.3, 0.64, 0.8) },
    { color: WHITE, points: flank(1.75, 1.45, 0.44, 0.56) },
  ],
  texts: [
    sideText('SHELL', 0.5, 0.36, 0.045, '#DC0000'),
    sideText('LENOVO', -0.4, 0.3, 0.06, WHITE),
    sideText('RAY-BAN', -0.25, 0.5, 0.05, WHITE),
    sideText('SANTANDER', -0.5, 0.78, 0.05, WHITE),
    sideText('HUBLOT', 0.55, 0.6, 0.035, WHITE),
    sideText('SINGHA', 0.05, 0.62, 0.03, WHITE),
    sideText('5', -1.12, 0.72, 0.13, '#DC0000'),
    sideText('5', 1.6, 0.5, 0.1, '#DC0000'),
    sideText('AMD', 2.2, 0.4, 0.04, WHITE),
    sideText('KASPERSKY', 1.95, 0.46, 0.028, WHITE),
    sideText('MAHLE', 2.45, 0.36, 0.028, WHITE),
    topText('SANTANDER', 2.0, 0, 0.045, WHITE),
    topText('5', -1.1, 0, 0.12, '#DC0000'),
    wingText('FERRARI', -2.35, 0, 0.07, WHITE),
    wingText('SHELL', 2.75, 0.5, 0.06, WHITE, 'front'),
    wingText('SHELL', 2.75, -0.5, 0.06, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('V-POWER', -2.35, 0.82, 0.07, WHITE), plateText('UPS', -2.35, 0.66, 0.06, WHITE)], front: [plateText('SHELL', 2.5, 0.3, 0.06, WHITE)] },
};

const MERCEDES: Livery = {
  id: 'mercedes-2014',
  name: 'Mercedes',
  era: 'gen2014',
  team: 'Mercedes-AMG Petronas Motorsport',
  price: 80,
  primary: '#C5C9CD',
  secondary: '#00D2BE',
  glow: '#00D2BE',
  sidepod: 'hybrid',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: parts('#C5C9CD', '#C5C9CD', BLACK),
  top: [
    // silver all over: teal lines flowing along the nose and down the sidepod edges, a teal nose tip
    { color: '#00D2BE', points: noseCapShape(2.5, 2.82, 0.07) },
    ...both('#00D2BE', [[1.0, 0.4], [0.5, 0.56], [-0.2, 0.62], [-1.0, 0.5], [-1.0, 0.46], [-0.2, 0.57], [0.5, 0.51], [1.0, 0.35]]),
    { color: '#00D2BE', points: stripe(1.1, 2.4, 0.02) },
  ],
  side: [
    // black lower sidepod and floor edge, the teal swoosh from the nose along the sidepod to the rear
    lowerPod(0.2),
    { color: '#00D2BE', points: [[2.5, 0.42], [2.5, 0.46], [1.2, 0.5], [0.3, 0.44], [-1.2, 0.56], [-1.2, 0.5], [0.3, 0.38], [1.2, 0.46]] },
    { color: '#00D2BE', points: [[1.0, 0.24], [1.0, 0.3], [-0.5, 0.36], [-1.9, 0.44], [-1.9, 0.4], [-0.5, 0.3]] },
  ],
  texts: [
    sideText('PETRONAS', -0.35, 0.32, 0.09, '#00D2BE'),
    sideText('PETRONAS PRIMAX', -1.4, 0.56, 0.03, BLACK),
    sideText('QUALCOMM', -0.45, 0.84, 0.045, BLACK),
    sideText('AMG', -0.9, 0.7, 0.04, BLACK),
    sideText('44', -1.3, 0.78, 0.12, '#D40000'),
    sideText('44', 1.55, 0.5, 0.09, '#D40000'),
    sideText('IWC', 0.9, 0.56, 0.045, BLACK),
    sideText('TOMMY HILFIGER', 1.9, 0.44, 0.024, BLACK),
    sideText('PETRONAS', 2.3, 0.36, 0.028, '#00D2BE'),
    topText('PETRONAS', 1.9, 0, 0.05, BLACK),
    topText('44', -1.2, 0, 0.12, '#D40000'),
    wingText('PETRONAS', -2.35, 0, 0.075, '#00D2BE'),
    wingText('PETRONAS', 2.75, 0.5, 0.055, BLACK, 'front'),
    wingText('PETRONAS', 2.75, -0.5, 0.055, BLACK, 'front'),
  ],
  plateTexts: { rear: [plateText('EPSON', -2.35, 0.82, 0.07, WHITE), plateText('PETRONAS', -2.35, 0.66, 0.045, '#00D2BE')], front: [plateText('IWC', 2.5, 0.3, 0.07, WHITE)] },
};

const MCLAREN: Livery = {
  id: 'mclaren-2014',
  name: 'McLaren',
  era: 'gen2014',
  team: 'McLaren F1 Team',
  price: 110,
  primary: '#FF8000',
  secondary: '#2B3FA8',
  sidepod: 'hybrid',
  finish: 'gloss',
  helmet: '#E10600',
  parts: parts('#1F3A9E', '#1F3A9E', '#1F3A9E'),
  frontParts: { wing: '#FF8000', flap: '#FF8000', endplate: '#1F3A9E' },
  top: [
    // the blue rear of the engine cover and shark fin, fading in behind the airbox
    { color: '#1F3A9E', points: [[-0.6, 0.22], [-1.0, 0.2], [L.tail - 0.05, 0.1], [L.tail - 0.05, -0.1], [-1.0, -0.2], [-0.6, -0.22]] },
  ],
  side: [
    // the blue rear engine cover and fin, the black Kimoa box on the lower sidepod
    { color: '#1F3A9E', points: [[-0.6, 1.0], [-1.2, 0.95], [-2.2, 0.8], [-2.3, 0.5], [-1.3, 0.6], [-0.9, 0.6]] },
    { color: BLACK, points: flank(0.45, -0.05, 0.1, 0.22) },
    lowerPod(0.1),
  ],
  texts: [
    sideText('CHANDON', -0.3, 0.8, 0.06, WHITE),
    sideText('PETROBRAS', -0.4, 0.5, 0.045, BLACK),
    sideText('RENAULT', -1.35, 0.42, 0.05, BLACK),
    sideText('DELL TECHNOLOGIES', -0.5, 0.2, 0.035, BLACK),
    sideText('KIMOA', 0.2, 0.16, 0.045, WHITE),
    sideText('RICHARD MILLE', 1.35, 0.52, 0.03, BLACK),
    sideText('14', -1.6, 0.76, 0.1, '#7FB2FF'),
    sideText('14', 1.7, 0.5, 0.08, '#1F3A9E'),
    topText('14', -1.5, 0, 0.1, '#7FB2FF'),
    topText('KIMOA', 1.9, 0, 0.05, BLACK),
    wingText('CHANDON', -2.35, 0, 0.07, WHITE),
    wingText('MCLAREN', 2.75, 0.5, 0.05, BLACK, 'front'),
    wingText('MCLAREN', 2.75, -0.5, 0.05, BLACK, 'front'),
  ],
  plateTexts: { rear: [plateText('CHANDON', -2.35, 0.82, 0.06, WHITE), plateText('NTT', -2.35, 0.66, 0.06, WHITE)], front: [plateText('KIMOA', 2.5, 0.3, 0.06, WHITE)] },
};

const REDBULL: Livery = {
  id: 'redbull-2014',
  name: 'Red Bull',
  era: 'gen2014',
  team: 'Aston Martin Red Bull Racing',
  price: 140,
  primary: '#1A1F3C',
  secondary: '#E4002B',
  glow: '#E4002B',
  sidepod: 'hybrid',
  finish: 'matte',
  helmet: '#E4002B',
  parts: parts('#1A1F3C', '#1A1F3C', '#1A1F3C', '#1A1F3C'),
  top: [
    // the yellow nose and airbox with the red bulls charging across the cover, red flames on the front wing
    { color: '#FFC500', points: noseCapShape(1.3, 2.82, 0.14) },
    { color: '#FFC500', points: stripe(0.06, -0.6, 0.14) },
    { color: '#E4002B', points: ellipse(-0.6, 0, 0.3, 0.08) },
    { color: '#E4002B', points: ellipse(2.05, 0, 0.2, 0.05) },
  ],
  side: [
    // the yellow airbox with the red bull, the yellow nose flank with its bull, the Aston Martin wings
    { color: '#FFC500', points: flank(AIRBOX[0], -0.6, 0.82, ABOX_Y[1]) },
    { color: '#E4002B', points: ellipse(-0.7, 0.8, 0.3, 0.08) },
    { color: '#FFC500', points: [[1.3, 0.3], [1.3, 0.46], [2.8, 0.36], [2.8, 0.3]] },
    { color: '#E4002B', points: ellipse(2.0, 0.37, 0.25, 0.05) },
    { color: '#E4002B', points: flank(L.podFront, L.podRear, 0.06, 0.1) },
  ],
  texts: [
    sideText('ASTON MARTIN', -0.5, 0.36, 0.07, WHITE),
    sideText('RED BULL', -0.75, 0.68, 0.045, '#E4002B'),
    sideText('TAG HEUER', 0.5, 0.52, 0.045, '#FFD100'),
    sideText('CITRIX', 0.45, 0.6, 0.04, WHITE),
    sideText('MOBIL 1', 0.6, 0.44, 0.04, WHITE),
    sideText('RAUCH', -1.3, 0.5, 0.045, '#FF7A00'),
    sideText('33', -1.5, 0.78, 0.1, WHITE),
    sideText('33', 1.6, 0.56, 0.08, '#E4002B'),
    sideText('PIRELLI', 1.05, 0.56, 0.03, WHITE),
    topText('33', -1.4, 0, 0.1, WHITE),
    wingText('ASTON MARTIN', -2.35, 0, 0.065, WHITE),
    wingText('RED BULL', 2.75, 0.5, 0.06, '#E4002B', 'front'),
    wingText('RED BULL', 2.75, -0.5, 0.06, '#E4002B', 'front'),
  ],
  plateTexts: { front: [plateText('MOBIL 1', 2.5, 0.3, 0.06, WHITE)], rear: [plateText('ESSO', -2.35, 0.82, 0.08, '#E4002B'), plateText('ASTON MARTIN', -2.35, 0.64, 0.04, WHITE)] },
};

const FORCEINDIA: Livery = {
  id: 'forceindia-2014',
  name: 'Force India',
  era: 'gen2014',
  team: 'Sahara Force India F1 Team',
  price: 170,
  primary: '#E987B4',
  secondary: '#FFFFFF',
  glow: '#E987B4',
  sidepod: 'hybrid',
  finish: 'gloss',
  helmet: '#E8E8E8',
  parts: parts('#C9CCD1', '#E987B4', '#C9CCD1', '#E987B4'),
  frontParts: { wing: '#E987B4', flap: '#C9CCD1', endplate: '#E987B4' },
  top: [
    // the silver-white rear of the engine cover and fin, a silver band across the top of the sidepods
    { color: '#E6E8EA', points: [[-0.7, 0.24], [-1.1, 0.22], [L.tail - 0.05, 0.1], [L.tail - 0.05, -0.1], [-1.1, -0.22], [-0.7, -0.24]] },
    { color: '#E6E8EA', points: stripe(0.06, -0.3, 0.14) },
  ],
  side: [
    // the silver-white upper engine cover and fin with BWT, the white panel on the lower sidepod, black floor edge
    { color: '#E6E8EA', points: [[0.1, 0.78], [0.1, 1.0], [-0.7, 0.98], [-1.2, 0.95], [-2.2, 0.8], [-2.3, 0.5], [-1.3, 0.64], [-0.6, 0.72]] },
    lowerPod(0.14),
    { color: WHITE, points: [[0.6, 0.14], [0.6, 0.4], [-0.3, 0.44], [-1.3, 0.34], [-1.3, 0.14]] },
    { color: WHITE, points: [[1.5, 0.4], [1.5, 0.54], [2.1, 0.5], [2.1, 0.4]] },
  ],
  texts: [
    sideText('BWT', -0.3, 0.3, 0.16, '#0A3C9E'),
    sideText('BWT', -0.6, 0.88, 0.09, '#0A3C9E'),
    sideText('NEC', -0.1, 0.78, 0.05, BLACK),
    sideText('HYPE', 0.2, 0.86, 0.035, BLACK),
    sideText('KINGFISHER', -0.75, 0.62, 0.035, BLACK),
    sideText('CLARO', 0.5, 0.54, 0.04, BLACK),
    sideText('SAHARA', 1.8, 0.47, 0.05, BLACK),
    sideText('11', -1.5, 0.84, 0.1, '#D40000'),
    sideText('11', 2.35, 0.36, 0.06, '#D40000'),
    topText('BWT', 1.9, 0, 0.055, '#0A3C9E'),
    topText('11', -1.4, 0, 0.1, '#D40000'),
    wingText('BWT', -2.35, 0, 0.1, '#0A3C9E'),
    wingText('BWT', 2.75, 0.5, 0.07, '#0A3C9E', 'front'),
    wingText('BWT', 2.75, -0.5, 0.07, '#0A3C9E', 'front'),
  ],
  plateTexts: { rear: [plateText('KINGFISHER', -2.35, 0.82, 0.05, '#7A1F4B'), plateText('BWT', -2.35, 0.66, 0.07, '#0A3C9E')], front: [plateText('DUO', 2.5, 0.3, 0.06, BLACK)] },
};

const RENAULT: Livery = {
  id: 'renault-2014',
  name: 'Renault',
  era: 'gen2014',
  team: 'Renault Sport Formula One Team',
  price: 200,
  primary: '#111111',
  secondary: '#FFD800',
  glow: '#FFD800',
  sidepod: 'hybrid',
  finish: 'gloss',
  helmet: '#FFD800',
  parts: parts('#FFD800', '#FFD800', '#FFD800'),
  frontParts: { wing: BLACK, flap: BLACK, endplate: '#FFD800' },
  top: [
    // the yellow top of the nose and chassis around the cockpit, yellow edges along the engine cover
    { color: '#FFD800', points: stripe(0.1, 2.82, 0.2) },
    ...both('#FFD800', [[0.1, 0.2], [-0.6, 0.22], [-1.6, 0.14], [-2.2, 0.08], [-2.2, 0.06], [-1.6, 0.11], [-0.6, 0.19], [0.1, 0.17]]),
  ],
  side: [
    // the yellow nose and chassis top, the yellow line along the engine cover's edge, the white RCi roundel
    { color: '#FFD800', points: [[1.0, 0.5], [1.0, 0.62], [0.3, 0.64], [2.82, 0.44], [2.82, 0.36]] },
    { color: '#FFD800', points: [[0.1, 0.62], [0.1, 0.66], [-1.3, 0.62], [-2.2, 0.5], [-2.2, 0.46], [-1.3, 0.58]] },
    { color: '#FFD800', points: [[-0.7, 0.98], [-1.2, 0.96], [-2.2, 0.82], [-2.2, 0.79], [-1.2, 0.93], [-0.7, 0.95]] },
    { color: WHITE, points: ellipse(-0.2, 0.36, 0.11, 0.11) },
  ],
  texts: [
    sideText('MAPFRE', 0.55, 0.42, 0.07, WHITE),
    sideText('RCI', -0.2, 0.36, 0.045, BLACK),
    sideText('INFINITI', -0.85, 0.8, 0.06, WHITE),
    sideText('CASTROL EDGE', -1.1, 0.5, 0.04, WHITE),
    sideText('RENAULT', -1.35, 0.36, 0.045, WHITE),
    sideText('27', -1.6, 0.74, 0.11, '#9A9A9A'),
    sideText('BP ULTIMATE', 0.7, 0.58, 0.028, WHITE),
    sideText('RENAULT', 2.0, 0.4, 0.035, BLACK),
    topText('RENAULT', 1.7, 0, 0.06, BLACK),
    topText('27', -1.5, 0, 0.1, '#9A9A9A'),
    wingText('RENAULT', -2.35, 0, 0.09, BLACK),
    wingText('RENAULT', 2.75, 0.5, 0.055, '#FFD800', 'front'),
    wingText('RENAULT', 2.75, -0.5, 0.055, '#FFD800', 'front'),
  ],
  plateTexts: { rear: [plateText('CASTROL', -2.35, 0.82, 0.06, WHITE), plateText('MICROSOFT', -2.35, 0.66, 0.045, WHITE)], front: [plateText('RENAULT', 2.5, 0.3, 0.05, BLACK)] },
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
  parts: parts('#F4F4F4', '#F4F4F4', '#F4F4F4', WHITE),
  top: [
    // the Martini stripes: navy, light blue, red and light blue, sweeping diagonally over the engine cover
    { color: '#0B3D91', points: [[-0.2, 0.25], [-0.5, 0.25], [-1.4, -0.25], [-1.1, -0.25]] },
    { color: '#58B4F0', points: [[-0.5, 0.25], [-0.65, 0.25], [-1.55, -0.25], [-1.4, -0.25]] },
    { color: '#E10600', points: [[-0.65, 0.25], [-0.95, 0.25], [-1.85, -0.25], [-1.55, -0.25]] },
    { color: '#58B4F0', points: [[-0.95, 0.25], [-1.1, 0.25], [-2.0, -0.25], [-1.85, -0.25]] },
    { color: '#0B3D91', points: stripe(1.4, 2.82, 0.03) },
    { color: '#58B4F0', points: stripe(1.4, 2.82, 0.012) },
  ],
  side: [
    // the diagonal Martini bands over the engine cover and fin, and along the nose
    { color: '#0B3D91', points: [[-0.2, 1.0], [-0.45, 1.0], [-1.1, 0.5], [-0.85, 0.5]] },
    { color: '#58B4F0', points: [[-0.45, 1.0], [-0.6, 1.0], [-1.25, 0.5], [-1.1, 0.5]] },
    { color: '#E10600', points: [[-0.6, 1.0], [-0.95, 0.98], [-1.6, 0.5], [-1.25, 0.5]] },
    { color: '#58B4F0', points: [[-0.95, 0.98], [-1.1, 0.96], [-1.75, 0.5], [-1.6, 0.5]] },
    { color: '#0B3D91', points: [[-1.1, 0.96], [-1.3, 0.94], [-1.95, 0.5], [-1.75, 0.5]] },
    { color: '#0B3D91', points: [[1.0, 0.56], [1.0, 0.6], [2.8, 0.42], [2.8, 0.38]] },
    { color: '#E10600', points: [[1.0, 0.52], [1.0, 0.56], [2.8, 0.38], [2.8, 0.34]] },
    { color: '#58B4F0', points: [[1.0, 0.49], [1.0, 0.52], [2.8, 0.34], [2.8, 0.31]] },
  ],
  texts: [
    sideText('MARTINI', -0.7, 0.74, 0.07, WHITE),
    sideText('REXONA', -0.3, 0.34, 0.08, '#0B3D91'),
    sideText('SMP RACING', 1.2, 0.5, 0.04, BLACK),
    sideText('CANADA LIFE', 0.4, 0.62, 0.028, '#0B3D91'),
    sideText('JCB', 0.45, 0.2, 0.04, '#FFD100'),
    sideText('18', -1.45, 0.86, 0.1, '#E10600'),
    sideText('18', 1.75, 0.48, 0.09, '#0B3D91'),
    sideText('ORIS', 2.35, 0.36, 0.028, BLACK),
    topText('MARTINI', 1.9, 0.09, 0.045, '#0B3D91'),
    topText('18', -0.6, 0, 0.1, '#E10600'),
    wingText('MARTINI', -2.35, 0, 0.09, '#0B3D91'),
    wingText('MARTINI', 2.75, 0.5, 0.06, '#0B3D91', 'front'),
    wingText('MARTINI', 2.75, -0.5, 0.06, '#0B3D91', 'front'),
  ],
  wingTop: [
    { color: '#0B3D91', points: [[-2.44, -0.5], [-2.44, 0.5], [-2.47, 0.5], [-2.47, -0.5]] },
    { color: '#E10600', points: [[-2.47, -0.5], [-2.47, 0.5], [-2.5, 0.5], [-2.5, -0.5]] },
    { color: '#58B4F0', points: [[-2.5, -0.5], [-2.5, 0.5], [-2.52, 0.5], [-2.52, -0.5]] },
  ],
  plateTexts: { rear: [plateText('JCB', -2.35, 0.82, 0.09, '#FFD100'), plateText('MARTINI', -2.35, 0.64, 0.05, '#0B3D91')], front: [plateText('REXONA', 2.5, 0.3, 0.05, '#0B3D91')] },
};

export const LIVERIES_GEN2014: readonly Livery[] = [FERRARI, MERCEDES, MCLAREN, REDBULL, FORCEINDIA, RENAULT, WILLIAMS];
