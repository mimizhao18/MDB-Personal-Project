import { BLACK, CARBON, WHITE, both, ellipse, flank, noseCapShape, plateText, podBand, sideText, stripe, topText, wingText, layout } from '../liveryHelpers';
import type { Livery } from '../liveryTypes';

// 2022 (ground effect): every team on the grid, drawn from photos of the real cars. Shapes are in the car's own
// measurements (see src/data/cars/gen2022.ts).

const L = layout('gen2022');
const mid = L.podMid; // a height halfway up the sidepod, for the big lettering
const parts = (wing: string, flap = wing, endplate = wing) => ({ wing, flap, endplate, floor: CARBON });
const AIRBOX = [0.06, -1.1] as const; // along the car, where the airbox and engine cover hump stand
const ABOX_Y = [0.72, 1.05] as const;

const FERRARI: Livery = {
  id: 'ferrari-2022',
  name: 'Ferrari',
  era: 'gen2022',
  team: 'Scuderia Ferrari',
  price: 0,
  primary: '#DC0000',
  secondary: '#FFEB00',
  sidepod: 'scoop',
  finish: 'gloss',
  parts: parts(CARBON),
  top: [
    // black tail of the engine cover, and the yellow Ferrari badge on it
    { color: BLACK, points: stripe(-1.45, L.tail - 0.1, 0.2) },
    { color: '#FFEB00', points: [[-0.82, 0.07], [-0.9, 0.0], [-0.82, -0.07], [-0.98, -0.07], [-1.06, 0.0], [-0.98, 0.07]] },
    { color: WHITE, points: stripe(2.34, 2.46, 0.11) },
  ],
  side: [
    // the big yellow Shell scallop on the sidepod, and a thin black floor edge
    { color: '#FFD800', points: ellipse(0.2, mid + 0.02, 0.2, 0.15) },
    { color: BLACK, points: flank(L.podFront, L.podRear, 0.06, 0.12) },
  ],
  texts: [
    sideText('SHELL', 0.2, mid + 0.02, 0.07, '#DC0000'),
    sideText('CEVA', -0.25, mid + 0.04, 0.06, WHITE),
    sideText('RAY-BAN', -0.7, mid + 0.04, 0.07, WHITE),
    sideText('SANTANDER', -1.55, 0.55, 0.07, WHITE),
    sideText('RICHARD MILLE', 0.9, mid + 0.2, 0.04, WHITE),
    sideText('SNAPDRAGON', -0.5, 0.15, 0.04, WHITE),
    topText('AWS', 2.05, 0, 0.07, WHITE),
    wingText('V-POWER', -2.3, 0, 0.07, WHITE),
  ],
  plateTexts: { front: [plateText('AWS', 2.3, 0.2, 0.06, WHITE)], rear: [plateText('V-POWER', -2.35, 0.72, 0.07, WHITE), plateText('VELAS', -2.35, 0.6, 0.05, WHITE)] },
};

const MERCEDES: Livery = {
  id: 'mercedes-2022',
  name: 'Mercedes',
  era: 'gen2022',
  team: 'Mercedes-AMG Petronas',
  price: 60,
  primary: '#0E0E10',
  secondary: '#00D2BE',
  sidepod: 'slim',
  finish: 'matte',
  parts: parts(BLACK),
  top: [
    // teal nose tip, a thin teal line down the engine cover, and a teal edge along the outside of the sidepods
    { color: '#00D2BE', points: noseCapShape(2.3, 2.9, 0.1) },
    { color: '#00D2BE', points: stripe(-0.75, L.tail - 0.05, 0.025) },
    ...both('#00D2BE', [[0.95, 0.38], [0.7, 0.46], [0.3, 0.5], [-0.2, 0.46], [-0.7, 0.38], [-1.2, 0.28], [-1.7, 0.18], [-1.7, 0.13], [-1.2, 0.23], [-0.7, 0.33], [-0.2, 0.41], [0.3, 0.45], [0.7, 0.41], [0.95, 0.33]]),
  ],
  side: [
    { color: '#00D2BE', points: flank(0.95, -2.0, 0.28, 0.31) },
    { color: '#C8CCD0', points: flank(0.95, -2.0, 0.31, 0.33) },
  ],
  texts: [
    sideText('PETRONAS', -0.45, mid - 0.02, 0.11, WHITE),
    sideText('INEOS', -1.4, 0.62, 0.06, '#E10600'),
    sideText('UBS', 0.3, mid + 0.06, 0.07, WHITE),
    sideText('TIBCO', -1.55, 0.46, 0.05, '#00D2BE'),
    sideText('AMG', 0.05, 0.55, 0.045, WHITE),
    topText('PETRONAS', 1.75, 0, 0.06, '#00D2BE'),
    wingText('PETRONAS', -2.3, 0, 0.07, '#00D2BE'),
  ],
  plateTexts: { front: [plateText('IWC', 2.3, 0.2, 0.07, WHITE)], rear: [plateText('INEOS', -2.35, 0.72, 0.07, WHITE)] },
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
  parts: parts(BLACK, BLACK, '#FF8000'),
  top: [
    // black airbox, engine cover and rear, papaya sidepod fronts, blue stripes
    { color: BLACK, points: stripe(0.06, L.tail - 0.1, 0.2) },
    ...podBand(BLACK, -0.7, -1.9, 0.14, 0.62),
    { color: '#47C7FC', points: noseCapShape(2.55, 2.92, 0.1) },
  ],
  side: [
    { color: BLACK, points: flank(AIRBOX[0], AIRBOX[1], ABOX_Y[0], ABOX_Y[1]) },
    { color: BLACK, points: flank(-0.7, L.podRear, 0.06, 0.5) },
    { color: '#47C7FC', points: [[0.9, 0.1], [0.9, 0.14], [-0.7, 0.18], [-0.7, 0.1]] },
  ],
  texts: [
    sideText('VELO', 0.15, mid + 0.04, 0.14, BLACK),
    sideText('ANDROID', -0.3, 0.88, 0.065, WHITE),
    sideText('CADENCE', -1.0, 0.3, 0.045, WHITE),
    sideText('WEBEX', -1.0, 0.52, 0.045, WHITE),
    sideText('TEZO', 0.8, mid + 0.18, 0.045, WHITE),
    sideText('RICHARD MILLE', 0.55, 0.52, 0.035, WHITE),
    wingText('OKX', -2.3, 0, 0.08, WHITE),
  ],
  plateTexts: { front: [plateText('VELO', 2.3, 0.2, 0.08, BLACK)], rear: [plateText('OKX', -2.35, 0.72, 0.08, BLACK)] },
};

const REDBULL: Livery = {
  id: 'redbull-2022',
  name: 'Red Bull',
  era: 'gen2022',
  team: 'Oracle Red Bull Racing',
  price: 100,
  primary: '#1C2B5E',
  secondary: '#E4002B',
  glow: '#E4002B',
  sidepod: 'downwash',
  finish: 'matte',
  parts: parts('#1C2B5E', '#E4002B', '#1C2B5E'),
  top: [
    // yellow nose and airbox, red sweep across the top of the sidepods, red stripe on the engine cover
    { color: '#FFC400', points: noseCapShape(2.3, 2.92, 0.09) },
    { color: '#FFC400', points: stripe(0.06, -0.8, 0.14) },
    ...both('#E4002B', [[0.9, 0.3], [0.7, 0.58], [0.3, 0.7], [-0.3, 0.7], [-0.9, 0.54], [-0.3, 0.5], [0.3, 0.54], [0.7, 0.4]]),
    { color: '#E4002B', points: stripe(-1.0, L.tail - 0.05, 0.04) },
  ],
  side: [
    { color: '#FFC400', points: flank(AIRBOX[0], -0.8, 0.9, ABOX_Y[1]) },
    { color: '#FF7A00', points: ellipse(-0.35, 0.86, 0.25, 0.09) },
    { color: '#E4002B', points: flank(0.95, -2.05, 0.07, 0.13) },
  ],
  texts: [
    sideText('RED BULL', -0.35, 0.86, 0.055, '#E4002B'),
    sideText('ORACLE', -0.35, mid + 0.04, 0.15, WHITE),
    sideText('MOBIL 1', -1.45, 0.6, 0.05, WHITE),
    sideText('TAG HEUER', 0.55, mid + 0.18, 0.045, '#FFD100'),
    sideText('ROKT', 0.7, 0.55, 0.045, WHITE),
    topText('RED BULL', 1.9, 0, 0.06, '#E4002B'),
    wingText('ORACLE', -2.3, 0, 0.08, WHITE),
    wingText('RED BULL', 2.7, 0.5, 0.09, '#FF7A00', 'front'),
    wingText('RED BULL', 2.7, -0.5, 0.09, '#FF7A00', 'front'),
  ],
  plateTexts: { front: [plateText('CLARO', 2.3, 0.2, 0.07, WHITE)], rear: [plateText('MOBIL 1', -2.35, 0.72, 0.07, WHITE)] },
};

const ALPINE: Livery = {
  id: 'alpine-2022',
  name: 'Alpine',
  era: 'gen2022',
  team: 'BWT Alpine F1 Team',
  price: 120,
  primary: '#2293D1',
  secondary: '#F5A0D0',
  glow: '#F5A0D0',
  sidepod: 'downwash',
  finish: 'gloss',
  parts: parts(BLACK, BLACK, BLACK),
  top: [
    // black engine cover tail, a pink panel on the sidepods
    { color: BLACK, points: stripe(-1.2, L.tail - 0.1, 0.19) },
    ...podBand('#F5A0D0', 0.8, -0.8, 0.3, 0.6),
    { color: WHITE, points: noseCapShape(2.4, 2.92, 0.08) },
  ],
  side: [
    // the lower body is black, with the pink panel above it
    { color: BLACK, points: flank(0.95, -2.05, 0.06, 0.2) },
    { color: '#F5A0D0', points: [[0.7, 0.2], [0.7, 0.46], [-0.3, 0.46], [-0.9, 0.3], [-0.9, 0.2]] },
  ],
  texts: [
    sideText('BWT', -0.1, mid - 0.0, 0.18, '#0A5ADB'),
    sideText('CASTROL', -0.35, 0.9, 0.05, WHITE),
    sideText('MAPFRE', 0.85, 0.35, 0.04, WHITE),
    sideText('ALPINE', -1.3, 0.55, 0.06, WHITE),
    wingText('ALPINE', -2.3, 0, 0.07, WHITE),
  ],
  plateTexts: { rear: [plateText('CASTROL', -2.35, 0.72, 0.06, BLACK)] },
};

const ASTONMARTIN: Livery = {
  id: 'astonmartin-2022',
  name: 'Aston Martin',
  era: 'gen2022',
  team: 'Aston Martin Aramco Cognizant F1 Team',
  price: 130,
  primary: '#0F7F73',
  secondary: '#CFE600',
  sidepod: 'slim',
  finish: 'gloss',
  parts: parts(BLACK, BLACK, BLACK),
  top: [
    // lime lines along the engine cover and the sidepods, black tail
    { color: BLACK, points: stripe(-1.2, L.tail - 0.1, 0.2) },
    { color: '#CFE600', points: stripe(-0.2, -1.2, 0.02) },
    ...podBand('#CFE600', 0.9, -1.3, 0.34, 0.37),
  ],
  side: [
    { color: BLACK, points: flank(0.95, -2.0, 0.06, 0.2) },
    { color: '#CFE600', points: flank(0.95, -2.0, 0.205, 0.23) },
  ],
  texts: [
    sideText('COGNIZANT', -0.45, mid + 0.0, 0.12, WHITE),
    sideText('ARAMCO', -0.3, 0.88, 0.065, WHITE),
    sideText('CRYPTO.COM', -0.95, mid + 0.17, 0.045, WHITE),
    sideText('PERONI', 0.5, mid + 0.14, 0.05, WHITE),
    sideText('ASTON MARTIN', 0.0, 0.14, 0.05, '#CFE600'),
    wingText('COGNIZANT', -2.3, 0, 0.07, WHITE),
  ],
  plateTexts: { front: [plateText('BOSS', 2.3, 0.2, 0.07, WHITE)], rear: [plateText('JCB', -2.35, 0.72, 0.09, '#FFD100')] },
};

const ALPHATAURI: Livery = {
  id: 'alphatauri-2022',
  name: 'AlphaTauri',
  era: 'gen2022',
  team: 'Scuderia AlphaTauri',
  price: 140,
  primary: '#11203A',
  secondary: '#F4F4F4',
  sidepod: 'downwash',
  finish: 'matte',
  parts: parts('#11203A', '#11203A', '#11203A'),
  top: [
    // the white airbox and engine cover with its navy bull splash, white nose
    { color: WHITE, points: stripe(0.06, -1.5, 0.17) },
    { color: '#11203A', points: [[-0.1, 0.1], [-0.4, 0.15], [-0.7, 0.0], [-0.5, -0.12], [-0.2, -0.05]] },
    { color: WHITE, points: noseCapShape(2.3, 2.92, 0.1) },
    ...podBand(WHITE, 0.7, -0.4, 0.4, 0.46),
  ],
  side: [
    { color: WHITE, points: flank(AIRBOX[0], -1.4, ABOX_Y[0], ABOX_Y[1]) },
    { color: WHITE, points: flank(0.95, -2.05, 0.2, 0.23) },
  ],
  texts: [
    sideText('ALPHATAURI', -0.4, mid + 0.0, 0.13, WHITE),
    sideText('BUZZ', -0.3, 0.84, 0.05, '#11203A'),
    sideText('HRC', -1.45, 0.5, 0.045, WHITE),
    wingText('ALPHATAURI', -2.3, 0, 0.09, WHITE),
    wingText('TAURI', 2.7, 0.5, 0.09, WHITE, 'front'),
    wingText('TAURI', 2.7, -0.5, 0.09, WHITE, 'front'),
  ],
  plateTexts: { front: [plateText('ZIBA', 2.3, 0.2, 0.07, WHITE)] },
};

const ALFAROMEO: Livery = {
  id: 'alfaromeo-2022',
  name: 'Alfa Romeo',
  era: 'gen2022',
  team: 'Alfa Romeo F1 Team ORLEN',
  price: 150,
  primary: '#9C1527',
  secondary: '#F4F4F4',
  sidepod: 'slim',
  finish: 'gloss',
  parts: parts(BLACK, '#9C1527', BLACK),
  top: [
    // the white airbox and the white front of the sidepods
    { color: WHITE, points: stripe(0.06, -0.6, 0.15) },
    ...podBand(WHITE, 0.9, -0.3, 0.17, 0.4),
    { color: WHITE, points: stripe(0.8, 2.9, 0.02) },
  ],
  side: [
    { color: BLACK, points: flank(0.95, -2.0, 0.06, 0.16) },
    { color: WHITE, points: flank(AIRBOX[0], -0.7, ABOX_Y[0], ABOX_Y[1]) },
    { color: WHITE, points: flank(0.9, -0.3, 0.16, 0.46) },
  ],
  texts: [
    sideText('ORLEN', 0.25, mid + 0.0, 0.11, '#9C1527'),
    sideText('ALFA ROMEO', -1.15, 0.6, 0.075, WHITE),
    sideText('ADLER', 0.9, 0.5, 0.04, '#9C1527'),
    wingText('ORLEN', -2.3, 0, 0.08, WHITE),
  ],
  plateTexts: { front: [plateText('ORLEN', 2.3, 0.2, 0.07, WHITE)], rear: [plateText('ORLEN', -2.35, 0.72, 0.08, WHITE)] },
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
  parts: parts('#F2F2F2', '#E10600', '#F2F2F2'),
  top: [
    // red nose tip and swooshes over the sidepods, a red stripe on the engine cover
    { color: '#E10600', points: noseCapShape(2.3, 2.92, 0.1) },
    { color: '#E10600', points: stripe(-0.8, L.tail - 0.1, 0.05) },
    ...podBand('#E10600', 0.8, -1.4, 0.5, 0.58),
  ],
  side: [
    { color: BLACK, points: flank(0.95, -2.05, 0.06, 0.13) },
    { color: '#E10600', points: [[0.95, 0.4], [0.95, 0.46], [-0.6, 0.22], [-2.0, 0.5], [-2.0, 0.56], [-0.6, 0.3]] },
  ],
  texts: [
    sideText('HAAS', -0.4, 0.17, 0.15, '#E10600'),
    sideText('1&1', -1.7, 0.5, 0.07, '#0B3D91'),
    sideText('HAAS F1 TEAM', 0.5, mid + 0.14, 0.04, '#E10600'),
    wingText('HAAS', -2.3, 0, 0.08, '#E10600'),
  ],
  plateTexts: { rear: [plateText('1&1', -2.35, 0.72, 0.09, '#0B3D91')] },
};

const WILLIAMS: Livery = {
  id: 'williams-2022',
  name: 'Williams',
  era: 'gen2022',
  team: 'Williams Racing',
  price: 170,
  primary: '#0B1C52',
  secondary: '#2B7DFF',
  glow: '#2B7DFF',
  sidepod: 'downwash',
  finish: 'gloss',
  parts: parts(BLACK, BLACK, '#0B1C52'),
  top: [
    // bright blue edges and nose, black tail
    { color: '#2B7DFF', points: noseCapShape(2.0, 2.92, 0.1) },
    { color: BLACK, points: stripe(-1.2, L.tail - 0.1, 0.19) },
    ...podBand('#2B7DFF', 0.9, -1.0, 0.6, 0.66),
  ],
  side: [
    { color: BLACK, points: flank(0.95, -2.05, 0.06, 0.2) },
    { color: '#2B7DFF', points: flank(0.95, -0.5, 0.2, 0.24) },
    { color: '#52B7FF', points: flank(AIRBOX[0], -0.7, 0.96, ABOX_Y[1]) },
  ],
  texts: [
    sideText('DORILTON', -0.4, mid + 0.02, 0.08, WHITE),
    sideText('W', -0.35, 0.9, 0.09, '#52B7FF'),
    sideText('BANG & OLUFSEN', 0.0, 0.5, 0.04, WHITE),
    sideText('DURACELL', -1.3, 0.4, 0.045, WHITE),
    wingText('WILLIAMS RACING', -2.3, 0, 0.07, '#52B7FF'),
  ],
  plateTexts: { front: [plateText('DUCATI', 2.3, 0.2, 0.06, WHITE)] },
};

export const LIVERIES_GEN2022: readonly Livery[] = [FERRARI, MERCEDES, MCLAREN, REDBULL, ALPINE, ASTONMARTIN, ALPHATAURI, ALFAROMEO, HAAS, WILLIAMS];
