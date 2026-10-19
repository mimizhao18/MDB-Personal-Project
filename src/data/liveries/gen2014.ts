import { BLACK, CARBON, WHITE, ellipse, flank, noseCapShape, podBand, sideText, stripe, topText, layout } from '../liveryHelpers';
import type { Livery } from '../liveryTypes';

// 2014 (hybrid era, drawn as the 2018-20 cars): the best-known liveries. Shapes are in the car's own measurements
// (see src/data/cars/gen2014.ts).

const L = layout('gen2014');
const mid = L.podMid;
const solidParts = (c: string, flap = c, endplate = c) => ({ wing: c, flap, endplate, floor: CARBON });

const FERRARI: Livery = {
  id: 'ferrari-2014',
  name: 'Ferrari',
  era: 'gen2014',
  team: 'Scuderia Ferrari Mission Winnow',
  price: 50,
  primary: '#DC0000',
  secondary: '#FFFFFF',
  sidepod: 'hybrid',
  finish: 'gloss',
  parts: { wing: CARBON, flap: CARBON, endplate: CARBON, floor: CARBON },
  top: [
    { color: BLACK, points: stripe(-1.4, L.tail - 0.05, 0.17) },
    { color: '#FFD800', points: ellipse(2.05, 0, 0.13, 0.09) },
    ...podBand(WHITE, 0.9, -0.3, 0.64, 0.7),
  ],
  side: [{ color: BLACK, points: flank(1.0, -2.1, 0.06, 0.2) }],
  texts: [
    topText('SHELL', 2.05, 0, 0.05, '#DC0000'),
    topText('MAHLE', 1.55, 0, 0.05, WHITE),
    sideText('SANTANDER', -0.4, mid + 0.12, 0.09, WHITE),
    sideText('RICHARD MILLE', -1.35, 0.6, 0.045, WHITE),
    sideText('PIRELLI', 0.5, mid + 0.12, 0.05, WHITE),
    sideText('MISSION WINNOW', -0.5, mid - 0.04, 0.04, WHITE),
  ],
};

const MERCEDES: Livery = {
  id: 'mercedes-2014',
  name: 'Mercedes',
  era: 'gen2014',
  team: 'Mercedes-AMG Petronas Motorsport',
  price: 80,
  primary: '#B8BCC2',
  secondary: '#00D2BE',
  glow: '#00D2BE',
  sidepod: 'hybrid',
  finish: 'gloss',
  parts: solidParts(BLACK),
  top: [
    { color: BLACK, points: stripe(-0.8, L.tail - 0.05, 0.2) },
    { color: '#00D2BE', points: noseCapShape(2.3, 2.85, 0.08) },
    ...podBand('#00D2BE', 0.8, -1.2, 0.6, 0.66),
  ],
  side: [{ color: BLACK, points: flank(1.0, -2.1, 0.06, 0.22) }, { color: '#00D2BE', points: flank(1.0, -1.9, 0.3, 0.33) }],
  texts: [
    sideText('PETRONAS', -0.35, mid + 0.1, 0.11, '#007F73'),
    sideText('IWC', 0.55, mid + 0.14, 0.07, BLACK),
    sideText('TIBCO', -1.3, 0.58, 0.05, WHITE),
    sideText('EPSON', -1.5, 0.4, 0.045, '#00D2BE'),
    topText('PETRONAS', 1.7, 0, 0.055, BLACK),
  ],
};

const MCLAREN: Livery = {
  id: 'mclaren-2014',
  name: 'McLaren',
  era: 'gen2014',
  team: 'McLaren F1 Team',
  price: 110,
  primary: '#FF8000',
  secondary: '#47C7FC',
  sidepod: 'hybrid',
  finish: 'gloss',
  parts: solidParts('#FF8000'),
  top: [
    { color: '#47C7FC', points: stripe(-0.9, L.tail - 0.05, 0.1) },
    { color: '#47C7FC', points: noseCapShape(2.4, 2.85, 0.1) },
    ...podBand('#47C7FC', -0.4, -1.5, 0.12, 0.4),
  ],
  side: [{ color: '#47C7FC', points: flank(1.0, -2.1, 0.06, 0.26) }],
  texts: [
    sideText('CHANDON', -0.3, mid + 0.14, 0.1, WHITE),
    sideText('JOHNNIE WALKER', 0.3, mid + 0.02, 0.05, '#0B1F5C'),
    sideText('SMC', -1.3, 0.55, 0.06, WHITE),
    topText('MCLAREN', 1.7, 0, 0.065, '#0B1F5C'),
  ],
};

const REDBULL: Livery = {
  id: 'redbull-2014',
  name: 'Red Bull',
  era: 'gen2014',
  team: 'Aston Martin Red Bull Racing',
  price: 140,
  primary: '#1C2B5E',
  secondary: '#E4002B',
  glow: '#E4002B',
  sidepod: 'hybrid',
  finish: 'matte',
  parts: solidParts('#1C2B5E', '#E4002B', '#1C2B5E'),
  top: [
    { color: '#E4002B', points: stripe(2.2, 2.85, 0.1) },
    ...podBand('#E4002B', 0.9, -0.9, 0.3, 0.7),
    { color: '#E4002B', points: stripe(-1.0, -2.3, 0.05) },
  ],
  side: [{ color: '#E4002B', points: flank(1.0, -2.1, 0.08, 0.15) }],
  texts: [
    sideText('ASTON MARTIN', -0.4, mid + 0.14, 0.07, WHITE),
    sideText('TAG HEUER', 0.4, mid + 0.04, 0.055, '#FFD100'),
    sideText('INFINITI', -1.35, 0.58, 0.05, WHITE),
    topText('RED BULL', 1.8, 0, 0.06, '#FFD100'),
  ],
};

const FORCEINDIA: Livery = {
  id: 'forceindia-2014',
  name: 'Force India',
  era: 'gen2014',
  team: 'Sahara Force India F1 Team',
  price: 170,
  primary: '#F26BB5',
  secondary: '#FFFFFF',
  glow: '#F26BB5',
  sidepod: 'hybrid',
  finish: 'gloss',
  parts: solidParts('#F26BB5', WHITE, '#F26BB5'),
  top: [
    { color: WHITE, points: noseCapShape(2.3, 2.85, 0.1) },
    { color: BLACK, points: stripe(-1.2, L.tail - 0.05, 0.16) },
    ...podBand(WHITE, 0.8, -0.6, 0.5, 0.58),
  ],
  side: [{ color: BLACK, points: flank(1.0, -2.1, 0.06, 0.18) }, { color: WHITE, points: flank(1.0, -2.1, 0.18, 0.22) }],
  texts: [
    sideText('BWT', -0.3, mid + 0.1, 0.13, WHITE),
    sideText('SAHARA', 0.5, mid + 0.14, 0.06, BLACK),
    sideText('FORCE INDIA', -1.3, 0.55, 0.05, WHITE),
    topText('BWT', 1.8, 0, 0.07, WHITE),
  ],
};

const RENAULT: Livery = {
  id: 'renault-2014',
  name: 'Renault',
  era: 'gen2014',
  team: 'Renault Sport Formula One Team',
  price: 200,
  primary: '#FFD800',
  secondary: '#111111',
  glow: '#FFD800',
  sidepod: 'hybrid',
  finish: 'gloss',
  parts: solidParts(BLACK, '#FFD800', BLACK),
  top: [
    { color: BLACK, points: stripe(-1.0, L.tail - 0.05, 0.19) },
    { color: BLACK, points: noseCapShape(2.4, 2.85, 0.08) },
    ...podBand(BLACK, 0.9, -0.6, 0.32, 0.4),
  ],
  side: [{ color: BLACK, points: flank(1.0, -2.1, 0.06, 0.2) }],
  texts: [
    sideText('RENAULT', -0.3, mid + 0.14, 0.12, BLACK),
    sideText('TOTAL', 0.5, mid + 0.14, 0.07, '#E10600'),
    sideText('CATERPILLAR', -1.3, 0.56, 0.045, BLACK),
    sideText('INFINITI', -0.3, mid - 0.02, 0.05, BLACK),
    topText('RENAULT', 1.75, 0, 0.065, BLACK),
  ],
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
  parts: solidParts('#0B3D91', '#F4F4F4', '#0B3D91'),
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
  ],
  texts: [
    sideText('MARTINI', -0.3, mid + 0.14, 0.11, '#0B3D91'),
    sideText('ROKIT', 0.55, mid + 0.18, 0.07, '#E10600'),
    sideText('WILLIAMS', -1.3, 0.6, 0.055, '#0B3D91'),
    topText('MARTINI', 1.8, 0.09, 0.05, '#0B3D91'),
  ],
};

export const LIVERIES_GEN2014: readonly Livery[] = [FERRARI, MERCEDES, MCLAREN, REDBULL, FORCEINDIA, RENAULT, WILLIAMS];
