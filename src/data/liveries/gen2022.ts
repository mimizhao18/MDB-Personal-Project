import { BLACK, CARBON, WHITE, both, ellipse, flank, noseCapShape, podBand, sideText, stripe, topText, layout } from '../liveryHelpers';
import type { Livery } from '../liveryTypes';

// 2022 (ground effect): every team on the grid. Shapes are in the car's own measurements (see src/data/cars/gen2022.ts).

const L = layout('gen2022');
const mid = L.podMid; // a height halfway up the sidepod, for the big lettering
const carbonParts = { wing: CARBON, flap: CARBON, endplate: CARBON, floor: CARBON };
const solidParts = (c: string, flap = c, endplate = c) => ({ wing: c, flap, endplate, floor: CARBON });

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
  parts: carbonParts,
  top: [
    // black tail of the engine cover, and the yellow Ferrari badge on it
    { color: BLACK, points: stripe(-1.45, L.tail - 0.1, 0.2) },
    { color: '#FFEB00', points: [[-0.82, 0.07], [-0.9, 0.0], [-0.82, -0.07], [-0.98, -0.07], [-1.06, 0.0], [-0.98, 0.07]] },
    // white band across the front of the nose
    { color: WHITE, points: stripe(2.34, 2.46, 0.11) },
  ],
  side: [
    // black lower half of the sidepod, and the yellow Shell scallop on the red above it
    { color: BLACK, points: flank(L.podFront, L.podRear, 0.06, 0.24) },
    { color: '#FFD800', points: ellipse(-0.05, mid + 0.04, 0.17, 0.12) },
  ],
  texts: [
    sideText('SHELL', -0.05, mid + 0.04, 0.055, '#DC0000'),
    sideText('SANTANDER', -0.6, mid + 0.14, 0.1, WHITE),
    sideText('RICHARD MILLE', -1.2, 0.64, 0.045, WHITE),
    sideText('AWS', 0.55, mid + 0.2, 0.06, WHITE),
    sideText('CEVA', -1.55, 0.5, 0.055, WHITE),
    topText('VELAS', 2.02, 0, 0.06, WHITE),
  ],
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
  parts: solidParts('#0E0E10'),
  top: [
    // teal nose tip, a thin teal line down the engine cover, and a teal edge along the outside of the sidepods
    { color: '#00D2BE', points: noseCapShape(2.3, 2.9, 0.1) },
    { color: '#00D2BE', points: stripe(-0.75, L.tail - 0.05, 0.025) },
    ...both('#00D2BE', [[0.95, 0.38], [0.7, 0.46], [0.3, 0.5], [-0.2, 0.46], [-0.7, 0.38], [-1.2, 0.28], [-1.7, 0.18], [-1.7, 0.13], [-1.2, 0.23], [-0.7, 0.33], [-0.2, 0.41], [0.3, 0.45], [0.7, 0.41], [0.95, 0.33]]),
  ],
  side: [{ color: '#00D2BE', points: flank(0.95, -2.0, 0.28, 0.31) }],
  texts: [
    sideText('PETRONAS', -0.45, mid + 0.04, 0.11, '#00D2BE'),
    sideText('INEOS', -1.4, 0.62, 0.06, WHITE),
    sideText('UBS', 0.3, mid + 0.04, 0.07, WHITE),
    sideText('TIBCO', -1.55, 0.46, 0.05, '#00D2BE'),
    topText('PETRONAS', 1.75, 0, 0.06, '#00D2BE'),
  ],
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
  parts: solidParts('#FF8000', '#FF8000', '#FF8000'),
  top: [
    // blue engine cover tail, and a blue sweep on the back half of the sidepods
    { color: '#47C7FC', points: stripe(-0.9, L.tail - 0.1, 0.1) },
    ...both('#47C7FC', [[-0.5, 0.64], [-1.2, 0.45], [-1.9, 0.2], [-1.9, 0.12], [-1.0, 0.24], [-0.4, 0.34]]),
    { color: '#47C7FC', points: noseCapShape(2.55, 2.92, 0.1) },
  ],
  side: [{ color: '#47C7FC', points: flank(0.9, -2.05, 0.06, 0.3) }],
  texts: [
    sideText('CHROME', -0.3, mid + 0.2, 0.1, WHITE),
    sideText('MASTERCARD', -0.85, mid + 0.06, 0.07, '#0B1F5C'),
    sideText('GULF', 0.45, mid + 0.08, 0.07, '#0B1F5C'),
    sideText('KAPPA', -1.5, 0.52, 0.05, WHITE),
    topText('MCLAREN', 1.8, 0, 0.07, '#0B1F5C'),
  ],
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
  parts: solidParts('#1C2B5E', '#E4002B', '#1C2B5E'),
  top: [
    // yellow nose, red sweep across the top of the sidepods, red stripe on the engine cover
    { color: '#FFD100', points: noseCapShape(2.34, 2.92, 0.08) },
    ...both('#E4002B', [[0.9, 0.3], [0.7, 0.58], [0.3, 0.7], [-0.3, 0.7], [-0.9, 0.54], [-0.3, 0.5], [0.3, 0.54], [0.7, 0.4]]),
    { color: '#E4002B', points: stripe(-1.0, L.tail - 0.05, 0.04) },
  ],
  side: [{ color: '#E4002B', points: flank(0.95, -2.05, 0.07, 0.15) }],
  texts: [
    sideText('ORACLE', -0.5, mid + 0.06, 0.11, WHITE),
    sideText('MOBIL 1', -1.4, 0.58, 0.055, WHITE),
    sideText('TAG HEUER', 0.35, mid + 0.14, 0.05, '#FFD100'),
    sideText('RED BULL', -1.55, 0.44, 0.06, '#E4002B'),
    topText('RED BULL', 1.85, 0, 0.06, '#FFD100'),
  ],
};

const ALPINE: Livery = {
  id: 'alpine-2022',
  name: 'Alpine',
  era: 'gen2022',
  team: 'BWT Alpine F1 Team',
  price: 120,
  primary: '#1360DE',
  secondary: '#FF69C8',
  glow: '#FF69C8',
  sidepod: 'downwash',
  finish: 'gloss',
  parts: solidParts('#1360DE', '#F4F4F4', '#1360DE'),
  top: [
    // pink engine cover and a pink flash over the sidepods, white nose
    { color: '#FF69C8', points: stripe(-0.9, L.tail - 0.1, 0.17) },
    ...both('#FF69C8', [[0.9, 0.36], [0.7, 0.6], [0.2, 0.66], [-0.6, 0.62], [-0.6, 0.52], [0.2, 0.54], [0.7, 0.46]]),
    { color: WHITE, points: noseCapShape(2.3, 2.92, 0.09) },
  ],
  side: [{ color: WHITE, points: flank(0.9, -2.05, 0.06, 0.14) }],
  texts: [
    sideText('ALPINE', -0.35, mid + 0.1, 0.13, WHITE),
    sideText('BWT', -1.45, 0.52, 0.08, WHITE),
    sideText('RENAULT', 0.4, mid + 0.08, 0.05, WHITE),
    sideText('OTRO', -1.0, 0.64, 0.05, WHITE),
    topText('ALPINE', 1.9, 0, 0.07, '#1360DE'),
  ],
};

const ASTONMARTIN: Livery = {
  id: 'astonmartin-2022',
  name: 'Aston Martin',
  era: 'gen2022',
  team: 'Aston Martin Aramco Cognizant F1 Team',
  price: 130,
  primary: '#00665E',
  secondary: '#CFE600',
  sidepod: 'slim',
  finish: 'gloss',
  parts: solidParts('#00665E', '#CFE600', '#00665E'),
  top: [
    // lime nose tip, lime stripes down the engine cover and along the sidepod tops
    { color: '#CFE600', points: noseCapShape(2.45, 2.92, 0.1) },
    { color: '#CFE600', points: stripe(-0.8, L.tail - 0.05, 0.03) },
    ...podBand('#CFE600', 0.9, -1.3, 0.34, 0.38),
  ],
  side: [{ color: '#CFE600', points: flank(0.95, -1.9, 0.07, 0.11) }],
  texts: [
    sideText('COGNIZANT', -0.45, mid + 0.06, 0.1, WHITE),
    sideText('ARAMCO', -1.35, 0.58, 0.06, WHITE),
    sideText('ASTON MARTIN', 0.2, mid + 0.14, 0.05, '#CFE600'),
    topText('ARAMCO', 1.9, 0, 0.06, '#CFE600'),
  ],
};

const ALPHATAURI: Livery = {
  id: 'alphatauri-2022',
  name: 'AlphaTauri',
  era: 'gen2022',
  team: 'Scuderia AlphaTauri',
  price: 140,
  primary: '#12203D',
  secondary: '#F4F4F4',
  sidepod: 'downwash',
  finish: 'matte',
  parts: solidParts('#12203D', '#F4F4F4', '#12203D'),
  top: [
    { color: WHITE, points: noseCapShape(2.3, 2.92, 0.1) },
    { color: WHITE, points: stripe(-0.8, L.tail - 0.05, 0.06) },
    ...podBand(WHITE, 0.7, -0.4, 0.38, 0.46),
  ],
  side: [{ color: WHITE, points: flank(0.95, -2.05, 0.07, 0.13) }],
  texts: [
    sideText('ALPHATAURI', -0.4, mid + 0.06, 0.11, WHITE),
    sideText('RED BULL', -1.45, 0.58, 0.055, '#E4002B'),
    sideText('HONDA', 0.4, mid + 0.1, 0.06, WHITE),
    topText('ALPHATAURI', 1.8, 0, 0.06, '#12203D'),
  ],
};

const ALFAROMEO: Livery = {
  id: 'alfaromeo-2022',
  name: 'Alfa Romeo',
  era: 'gen2022',
  team: 'Alfa Romeo F1 Team ORLEN',
  price: 150,
  primary: '#B50E1E',
  secondary: '#F4F4F4',
  sidepod: 'slim',
  finish: 'matte',
  parts: solidParts('#B50E1E', BLACK, BLACK),
  top: [
    { color: BLACK, points: stripe(-1.3, L.tail - 0.1, 0.18) },
    { color: WHITE, points: stripe(0.8, 2.9, 0.025) },
    ...podBand(BLACK, 0.9, -1.4, 0.34, 0.4),
  ],
  side: [{ color: BLACK, points: flank(0.95, -2.0, 0.06, 0.2) }, { color: WHITE, points: flank(0.95, -2.0, 0.2, 0.23) }],
  texts: [
    sideText('ORLEN', -0.4, mid + 0.08, 0.13, WHITE),
    sideText('ALFA ROMEO', -1.25, 0.58, 0.05, WHITE),
    sideText('STAKE', 0.4, mid + 0.1, 0.06, WHITE),
    topText('ORLEN', 1.9, 0, 0.07, WHITE),
  ],
};

const HAAS: Livery = {
  id: 'haas-2022',
  name: 'Haas',
  era: 'gen2022',
  team: 'MoneyGram Haas F1 Team',
  price: 160,
  primary: '#F2F2F2',
  secondary: '#E10600',
  sidepod: 'downwash',
  finish: 'gloss',
  parts: solidParts('#F2F2F2', '#E10600', BLACK),
  top: [
    { color: '#E10600', points: noseCapShape(2.3, 2.92, 0.1) },
    { color: BLACK, points: stripe(-1.2, L.tail - 0.1, 0.2) },
    ...podBand('#E10600', 0.8, -1.2, 0.5, 0.6),
  ],
  side: [{ color: BLACK, points: flank(0.95, -2.05, 0.06, 0.2) }, { color: '#E10600', points: flank(0.95, -2.05, 0.2, 0.26) }],
  texts: [
    sideText('MONEYGRAM', -0.4, mid + 0.1, 0.1, '#1B1B1B'),
    sideText('HAAS', 0.4, mid + 0.14, 0.09, '#E10600'),
    sideText('F1 TEAM', -1.4, 0.58, 0.05, '#1B1B1B'),
    topText('HAAS', 1.9, 0, 0.08, WHITE),
  ],
};

const WILLIAMS: Livery = {
  id: 'williams-2022',
  name: 'Williams',
  era: 'gen2022',
  team: 'Williams Racing',
  price: 170,
  primary: '#0B2B6A',
  secondary: '#00A3E0',
  sidepod: 'downwash',
  finish: 'gloss',
  parts: solidParts('#0B2B6A', '#00A3E0', '#0B2B6A'),
  top: [
    { color: '#00A3E0', points: noseCapShape(2.3, 2.92, 0.1) },
    { color: WHITE, points: stripe(-0.8, L.tail - 0.1, 0.07) },
    ...both('#00A3E0', [[0.9, 0.3], [0.7, 0.56], [0.2, 0.68], [-0.5, 0.64], [-0.5, 0.56], [0.2, 0.58], [0.7, 0.46]]),
  ],
  side: [{ color: '#00A3E0', points: flank(0.95, -2.05, 0.06, 0.14) }],
  texts: [
    sideText('ROKIT', -0.4, mid + 0.1, 0.12, WHITE),
    sideText('WILLIAMS', -1.35, 0.58, 0.06, '#00A3E0'),
    sideText('KOMATSU', 0.4, mid + 0.1, 0.055, WHITE),
    topText('ROKIT', 1.9, 0, 0.07, WHITE),
  ],
};

export const LIVERIES_GEN2022: readonly Livery[] = [FERRARI, MERCEDES, MCLAREN, REDBULL, ALPINE, ASTONMARTIN, ALPHATAURI, ALFAROMEO, HAAS, WILLIAMS];
