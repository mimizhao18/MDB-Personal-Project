import { BLACK, CARBON, WHITE, both, ellipse, flank, noseCapShape, plateText, podBand, sideText, stripe, topText, wingText, layout } from '../liveryHelpers';
import type { Livery } from '../liveryTypes';

// 2014 (hybrid era, drawn as the 2018-20 cars): the best-known liveries, drawn from photos of the real cars. Shapes
// are in the car's own measurements (see src/data/cars/gen2014.ts).

const L = layout('gen2014');
const mid = L.podMid;
const parts = (wing: string, flap = wing, endplate = wing) => ({ wing, flap, endplate, floor: CARBON });
const ABOX_Y = [0.72, 1.05] as const;

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
  parts: parts(CARBON, CARBON, CARBON),
  top: [
    { color: BLACK, points: stripe(-1.4, L.tail - 0.05, 0.17) },
    { color: '#FFD800', points: ellipse(2.05, 0, 0.13, 0.09) },
    ...podBand(WHITE, 0.9, -0.3, 0.64, 0.7),
  ],
  side: [
    { color: BLACK, points: flank(1.0, -2.1, 0.06, 0.2) },
    { color: '#FFD800', points: ellipse(0.45, mid + 0.05, 0.15, 0.12) },
  ],
  texts: [
    topText('SHELL', 2.05, 0, 0.05, '#DC0000'),
    topText('MAHLE', 1.6, 0, 0.05, WHITE),
    topText('PALANTIR', 1.3, 0, 0.04, WHITE),
    sideText('SHELL', 0.45, mid + 0.05, 0.055, '#DC0000'),
    sideText('CEVA', 0.05, mid + 0.14, 0.07, WHITE),
    sideText('RAY-BAN', -0.55, mid + 0.04, 0.12, WHITE),
    sideText('SANTANDER', -1.15, mid + 0.2, 0.075, WHITE),
    sideText('RICHARD MILLE', 1.25, 0.34, 0.045, WHITE),
    sideText('PIRELLI', 0.8, mid + 0.18, 0.05, WHITE),
  ],
  plateTexts: { rear: [plateText('V-POWER', -2.35, 0.82, 0.08, WHITE), plateText('VELAS', -2.35, 0.66, 0.08, WHITE)] },
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
  parts: parts(BLACK, '#00D2BE', BLACK),
  top: [
    // silver in front, black from the airbox back, teal flowing lines and nose tip
    { color: BLACK, points: stripe(0.06, L.tail - 0.05, 0.22) },
    { color: '#00D2BE', points: noseCapShape(2.3, 2.85, 0.08) },
    ...podBand(BLACK, -0.3, -2.0, 0.2, 0.7),
    ...podBand('#00D2BE', 0.8, -0.3, 0.6, 0.66),
  ],
  side: [
    { color: BLACK, points: flank(0.1, -2.1, 0.06, 1.1) },
    { color: '#00D2BE', points: [[1.0, 0.2], [1.0, 0.26], [0.0, 0.34], [-1.0, 0.56], [-1.0, 0.5], [0.0, 0.28]] },
    { color: '#00D2BE', points: flank(1.0, 0.1, 0.34, 0.37) },
  ],
  texts: [
    sideText('PETRONAS', -0.5, mid + 0.08, 0.1, '#00D2BE'),
    sideText('IWC', 0.6, mid + 0.14, 0.07, BLACK),
    sideText('TIBCO', -1.3, 0.62, 0.05, WHITE),
    sideText('EPSON', -1.5, 0.42, 0.045, '#00D2BE'),
    topText('PETRONAS', 1.7, 0, 0.055, BLACK),
    wingText('PETRONAS', -2.3, 0, 0.08, WHITE),
  ],
  plateTexts: { rear: [plateText('EPSON', -2.35, 0.8, 0.07, WHITE)] },
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
  parts: parts('#FF8000', '#2B3FA8', '#FF8000'),
  top: [
    { color: '#2B3FA8', points: stripe(-0.2, L.tail - 0.05, 0.1) },
    { color: '#2B3FA8', points: noseCapShape(2.4, 2.85, 0.1) },
  ],
  side: [{ color: '#2B3FA8', points: flank(-0.2, -2.1, 0.78, 1.05) }],
  texts: [
    sideText('DELL', 0.3, mid + 0.1, 0.1, BLACK),
    sideText('KIMOA', -0.2, mid + 0.14, 0.06, BLACK),
    sideText('SAP', -1.0, mid + 0.04, 0.07, BLACK),
    sideText('RICHARD MILLE', -1.3, 0.55, 0.04, BLACK),
    topText('KIMOA', 1.7, 0, 0.06, BLACK),
    wingText('CHANDON', -2.3, 0, 0.08, WHITE),
  ],
  plateTexts: { rear: [plateText('SMC', -2.35, 0.78, 0.07, WHITE)] },
};

const REDBULL: Livery = {
  id: 'redbull-2014',
  name: 'Red Bull',
  era: 'gen2014',
  team: 'Aston Martin Red Bull Racing',
  price: 140,
  primary: '#16192E',
  secondary: '#E4002B',
  glow: '#E4002B',
  sidepod: 'hybrid',
  finish: 'matte',
  parts: parts('#16192E', '#E4002B', '#16192E'),
  top: [
    // yellow nose, a yellow airbox with a red flame, red flames across the sidepods and engine cover
    { color: '#FFC400', points: noseCapShape(1.5, 2.85, 0.12) },
    { color: '#FFC400', points: stripe(0.06, -0.8, 0.14) },
    ...both('#E4002B', [[0.9, 0.3], [0.5, 0.45], [0.0, 0.7], [-0.6, 0.6], [-1.2, 0.3], [-0.6, 0.45], [0.0, 0.5], [0.5, 0.3]]),
    { color: '#E4002B', points: stripe(-0.9, -2.3, 0.07) },
  ],
  side: [
    { color: '#FFC400', points: flank(0.06, -0.8, 0.9, ABOX_Y[1]) },
    { color: '#FF7A00', points: ellipse(-0.35, 0.86, 0.25, 0.09) },
    { color: '#E4002B', points: flank(1.0, -2.1, 0.08, 0.16) },
    // the nose side is yellow-orange with the red bull across it
    { color: '#FFB000', points: flank(1.0, 2.5, 0.18, 0.4) },
    { color: '#E4002B', points: ellipse(1.75, 0.3, 0.3, 0.09) },
  ],
  texts: [
    sideText('ASTON MARTIN', -0.45, mid + 0.1, 0.075, WHITE),
    sideText('TAG HEUER', 0.5, mid + 0.04, 0.055, '#FFD100'),
    sideText('INFINITI', -1.35, 0.58, 0.05, WHITE),
    sideText('PIRELLI', 0.7, 0.55, 0.045, WHITE),
    sideText('RAUCH', 0.75, mid + 0.12, 0.06, '#FF7A00'),
    topText('RED BULL', 1.6, 0, 0.06, '#E4002B'),
    wingText('ASTON MARTIN', -2.3, 0, 0.07, WHITE),
  ],
  plateTexts: { front: [plateText('CLARO', 2.35, 0.3, 0.07, WHITE)], rear: [plateText('RED BULL', -2.35, 0.78, 0.07, WHITE)] },
};

const FORCEINDIA: Livery = {
  id: 'forceindia-2014',
  name: 'Force India',
  era: 'gen2014',
  team: 'Racing Point Force India F1 Team',
  price: 170,
  primary: '#E87CA5',
  secondary: '#FFFFFF',
  glow: '#E87CA5',
  sidepod: 'hybrid',
  finish: 'gloss',
  parts: parts('#E87CA5', '#F4F4F4', BLACK),
  top: [
    // white airbox top and engine cover top, silver-white pod panels
    { color: '#E6E8EA', points: stripe(0.06, -1.3, 0.14) },
    { color: WHITE, points: noseCapShape(2.3, 2.85, 0.1) },
    ...podBand('#E6E8EA', 0.8, -1.0, 0.18, 0.4),
  ],
  side: [
    { color: BLACK, points: flank(1.0, -2.1, 0.06, 0.14) },
    { color: '#E6E8EA', points: flank(0.5, -1.6, 0.14, 0.4) },
    { color: '#E6E8EA', points: flank(0.06, -0.9, 0.9, ABOX_Y[1]) },
  ],
  texts: [
    sideText('BWT', -0.45, mid + 0.04, 0.17, '#1D4ED8'),
    sideText('BWT', -0.35, 0.92, 0.1, '#1D4ED8'),
    sideText('SAHARA', 0.6, mid + 0.16, 0.06, BLACK),
    sideText('KINGFISHER', -1.3, 0.55, 0.045, '#1D4ED8'),
    sideText('NEC', -0.8, 0.8, 0.06, BLACK),
    sideText('HYPE', -0.5, 0.72, 0.04, BLACK),
    wingText('BWT', -2.3, 0, 0.1, '#1D4ED8'),
  ],
  plateTexts: { rear: [plateText('KINGFISHER', -2.35, 0.78, 0.05, WHITE)] },
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
  parts: parts(BLACK, '#FFD800', BLACK),
  top: [
    // yellow nose, yellow front of the car and sidepod fronts, black behind
    { color: '#FFD800', points: noseCapShape(0.4, 2.85, 0.2) },
    ...podBand('#FFD800', 1.0, 0.0, 0.2, 0.55),
  ],
  side: [
    { color: '#FFD800', points: flank(1.0, 0.1, 0.06, 0.55) },
    { color: '#FFD800', points: flank(0.06, -0.9, 0.9, ABOX_Y[1]) },
  ],
  texts: [
    sideText('MAPFRE', -0.2, mid + 0.14, 0.075, WHITE),
    sideText('RENAULT', -1.1, mid + 0.04, 0.09, '#FFD800'),
    sideText('INFINITI', 0.5, mid + 0.14, 0.05, BLACK),
    sideText('CATERPILLAR', -1.4, 0.55, 0.045, WHITE),
    topText('RENAULT', 1.6, 0, 0.06, BLACK),
    wingText('RENAULT', -2.3, 0, 0.1, BLACK),
  ],
  plateTexts: { rear: [plateText('TOTAL', -2.35, 0.78, 0.07, '#FFD800')] },
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
  parts: parts(BLACK, BLACK, BLACK),
  top: [
    // the Martini stripes: dark blue, light blue and red, side by side down the middle of the car
    { color: '#0B3D91', points: stripe(L.nose, L.tail, 0.07) },
    { color: '#1E88E5', points: stripe(L.nose, L.tail, 0.045) },
    { color: '#E10600', points: stripe(L.nose, L.tail, 0.02) },
  ],
  side: [
    { color: '#0B3D91', points: flank(1.0, -2.1, 0.22, 0.27) },
    { color: '#1E88E5', points: flank(1.0, -2.1, 0.17, 0.22) },
    { color: '#E10600', points: flank(1.0, -2.1, 0.12, 0.17) },
    // the red patch on the engine cover with the white Martini lettering
    { color: '#E10600', points: ellipse(-1.0, 0.7, 0.3, 0.12) },
  ],
  texts: [
    sideText('MARTINI', -1.0, 0.7, 0.07, WHITE),
    sideText('SMP RACING', 0.55, mid + 0.18, 0.05, '#0B3D91'),
    sideText('ORIS', -0.2, mid + 0.14, 0.05, '#0B3D91'),
    topText('MARTINI', 1.6, 0.09, 0.05, '#0B3D91'),
    wingText('MARTINI', -2.3, 0, 0.09, WHITE),
  ],
  plateTexts: { rear: [plateText('JCB', -2.35, 0.78, 0.09, '#FFD100')] },
};

export const LIVERIES_GEN2014: readonly Livery[] = [FERRARI, MERCEDES, MCLAREN, REDBULL, FORCEINDIA, RENAULT, WILLIAMS];
