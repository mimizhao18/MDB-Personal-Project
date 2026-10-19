import { BLACK, CARBON, WHITE, ellipse, flank, noseCapShape, plateText, podBand, sideText, stripe, topText, wingText, layout } from '../liveryHelpers';
import type { Livery } from '../liveryTypes';

// 2004 (V10 era): the best-known liveries. Shapes are in the car's own measurements (see src/data/cars/gen2004.ts).

const L = layout('gen2004');
const mid = L.podMid;
const solidParts = (c: string, flap = c, endplate = c) => ({ wing: c, flap, endplate, floor: CARBON });

const FERRARI: Livery = {
  id: 'ferrari-2004',
  name: 'Ferrari',
  era: 'gen2004',
  team: 'Scuderia Ferrari Marlboro',
  price: 60,
  primary: '#D80000',
  secondary: '#FFFFFF',
  sidepod: 'v10',
  finish: 'gloss',
  parts: solidParts('#D80000', '#F4F4F4', '#D80000'),
  top: [
    // white nose bands (the "barcode"), black tail, white panel on the front of the sidepods
    { color: WHITE, points: stripe(2.0, 2.1, 0.1) },
    { color: WHITE, points: stripe(1.8, 1.9, 0.14) },
    { color: BLACK, points: stripe(-1.3, L.tail - 0.05, 0.14) },
    ...podBand(WHITE, 0.8, 0.2, 0.3, 0.5),
  ],
  side: [
    { color: WHITE, points: flank(0.85, 0.1, 0.12, 0.4) },
    { color: '#FFD800', points: ellipse(-0.45, mid + 0.02, 0.15, 0.11) },
  ],
  texts: [
    sideText('SHELL', -0.45, mid + 0.02, 0.05, '#D80000'),
    sideText('VODAFONE', -1.15, mid + 0.1, 0.085, WHITE),
    topText('MARLBORO', 2.2, 0, 0.055, WHITE),
    sideText('BRIDGESTONE', -1.25, 0.62, 0.05, WHITE),
    sideText('FIAT', 0.5, 0.62, 0.05, WHITE),
    wingText('VODAFONE', -1.92, 0, 0.07, WHITE),
  ],
  plateTexts: { rear: [plateText('BRIDGESTONE', -1.9, 0.92, 0.04, WHITE)], front: [plateText('FIAT', 2.5, 0.2, 0.04, WHITE)] },
};

const MCLAREN: Livery = {
  id: 'mclaren-2004',
  name: 'McLaren',
  era: 'gen2004',
  team: 'West McLaren Mercedes',
  price: 90,
  primary: '#838890',
  secondary: '#0E0E10',
  glow: '#E10600',
  sidepod: 'v10',
  finish: 'gloss',
  parts: solidParts('#838890', BLACK, BLACK),
  top: [
    { color: BLACK, points: noseCapShape(2.2, 2.6, 0.1) },
    { color: BLACK, points: stripe(-0.4, L.tail - 0.05, 0.06) },
    ...podBand('#E10600', 0.7, 0.1, 0.5, 0.54),
  ],
  side: [{ color: BLACK, points: flank(0.85, -1.9, 0.06, 0.18) }, { color: '#E10600', points: flank(0.85, -1.9, 0.18, 0.2) }],
  texts: [
    sideText('WEST', -0.35, mid + 0.14, 0.12, '#E10600'),
    sideText('MERCEDES', 0.35, mid + 0.1, 0.06, BLACK),
    sideText('SIEMENS', -1.3, 0.6, 0.055, '#F57F17'),
    sideText('MOBIL 1', -1.2, 0.38, 0.05, '#E10600'),
    topText('MERCEDES', 2.0, 0, 0.05, WHITE),
    wingText('WEST', -1.92, 0, 0.08, '#E10600'),
  ],
  plateTexts: { rear: [plateText('MERCEDES', -1.9, 0.92, 0.045, '#E10600')] },
};

const WILLIAMS: Livery = {
  id: 'williams-2004',
  name: 'Williams',
  era: 'gen2004',
  team: 'BMW WilliamsF1 Team',
  price: 120,
  primary: '#1E3C8A',
  secondary: '#F2F2F2',
  glow: '#2F5BD6',
  sidepod: 'v10',
  finish: 'gloss',
  parts: solidParts('#1E3C8A', '#F2F2F2', '#1E3C8A'),
  top: [
    { color: WHITE, points: stripe(1.6, 2.6, 0.08) },
    ...podBand(WHITE, 0.8, -0.4, 0.3, 0.42),
    { color: WHITE, points: stripe(-0.5, -1.9, 0.05) },
  ],
  side: [{ color: WHITE, points: flank(0.85, -1.6, 0.14, 0.22) }],
  texts: [
    sideText('BMW', -0.35, mid + 0.18, 0.15, WHITE),
    sideText('HP', 0.45, mid + 0.14, 0.08, WHITE),
    sideText('FEDEX', -1.2, 0.62, 0.06, WHITE),
    sideText('ALLIANZ', -1.2, 0.4, 0.045, '#1E3C8A'),
    topText('WILLIAMS', 2.0, 0, 0.055, WHITE),
    wingText('BMW', -1.92, 0, 0.09, WHITE),
  ],
  plateTexts: { rear: [plateText('FEDEX', -1.9, 0.92, 0.06, WHITE)] },
};

const RENAULT: Livery = {
  id: 'renault-2004',
  name: 'Renault',
  era: 'gen2004',
  team: 'Mild Seven Renault F1',
  price: 150,
  primary: '#0F3A9A',
  secondary: '#FFD800',
  sidepod: 'v10',
  finish: 'gloss',
  parts: solidParts('#FFD800', '#0F3A9A', '#FFD800'),
  top: [
    { color: '#FFD800', points: stripe(1.7, 2.6, 0.1) },
    { color: '#FFD800', points: stripe(-0.5, L.tail - 0.05, 0.1) },
    ...podBand('#FFD800', 0.7, -0.2, 0.34, 0.5),
  ],
  side: [{ color: '#FFD800', points: flank(0.85, -1.8, 0.06, 0.16) }],
  texts: [
    sideText('MILD SEVEN', -0.4, mid + 0.14, 0.075, WHITE),
    sideText('ELF', 0.45, mid + 0.14, 0.09, '#FFD800'),
    sideText('RENAULT', -1.2, 0.6, 0.06, WHITE),
    sideText('ING', -1.3, 0.4, 0.06, '#F57F17'),
    topText('RENAULT', 2.0, 0, 0.055, '#0F3A9A'),
    wingText('MILD SEVEN', -1.92, 0, 0.07, '#0F3A9A'),
  ],
  plateTexts: { rear: [plateText('ELF', -1.9, 0.92, 0.07, '#0F3A9A')] },
};

const BAR: Livery = {
  id: 'bar-2004',
  name: 'BAR',
  era: 'gen2004',
  team: 'Lucky Strike BAR Honda',
  price: 180,
  primary: '#F2F2F2',
  secondary: '#E10600',
  glow: '#E10600',
  sidepod: 'v10',
  finish: 'gloss',
  parts: solidParts('#F2F2F2', '#E10600', '#F2F2F2'),
  top: [
    { color: '#E10600', points: noseCapShape(2.1, 2.6, 0.12) },
    { color: '#0B1F5C', points: stripe(-0.6, L.tail - 0.05, 0.1) },
    ...podBand('#E10600', 0.7, -0.3, 0.3, 0.44),
  ],
  side: [{ color: '#E10600', points: flank(0.85, -1.9, 0.06, 0.2) }, { color: '#0B1F5C', points: flank(0.85, -1.9, 0.2, 0.24) }],
  texts: [
    sideText('LUCKY STRIKE', -0.4, mid + 0.14, 0.075, '#1B1B1B'),
    sideText('HONDA', 0.4, mid + 0.16, 0.09, '#E10600'),
    sideText('BAR', -1.3, 0.6, 0.07, '#1B1B1B'),
    topText('LUCKY STRIKE', 2.0, 0, 0.05, WHITE),
    wingText('LUCKY STRIKE', -1.92, 0, 0.06, '#1B1B1B'),
  ],
  plateTexts: { rear: [plateText('HONDA', -1.9, 0.92, 0.06, '#1B1B1B')] },
};

const JAGUAR: Livery = {
  id: 'jaguar-2004',
  name: 'Jaguar',
  era: 'gen2004',
  team: 'Jaguar Racing',
  price: 210,
  primary: '#0A4D2E',
  secondary: '#C0C0C0',
  glow: '#18B26B',
  sidepod: 'v10',
  finish: 'gloss',
  parts: solidParts('#0A4D2E', '#C0C0C0', '#0A4D2E'),
  top: [
    { color: '#C0C0C0', points: noseCapShape(2.1, 2.6, 0.12) },
    { color: '#C0C0C0', points: stripe(-0.5, L.tail - 0.05, 0.04) },
    ...podBand('#C0C0C0', 0.7, -0.3, 0.46, 0.5),
  ],
  side: [{ color: '#C0C0C0', points: flank(0.85, -1.9, 0.14, 0.17) }],
  texts: [
    sideText('JAGUAR', -0.4, mid + 0.12, 0.12, '#C0C0C0'),
    sideText('HP', 0.45, mid + 0.14, 0.09, WHITE),
    sideText('COSWORTH', -1.2, 0.6, 0.05, WHITE),
    topText('JAGUAR', 2.0, 0, 0.06, WHITE),
    wingText('JAGUAR', -1.92, 0, 0.08, '#C0C0C0'),
  ],
  plateTexts: { rear: [plateText('HP', -1.9, 0.92, 0.07, WHITE)] },
};

const TOYOTA: Livery = {
  id: 'toyota-2004',
  name: 'Toyota',
  era: 'gen2004',
  team: 'Panasonic Toyota Racing',
  price: 240,
  primary: '#F2F2F2',
  secondary: '#E10600',
  sidepod: 'v10',
  finish: 'gloss',
  parts: solidParts('#F2F2F2', '#E10600', '#F2F2F2'),
  top: [
    { color: '#E10600', points: noseCapShape(2.1, 2.6, 0.12) },
    { color: '#E10600', points: stripe(-0.6, L.tail - 0.05, 0.08) },
    ...podBand('#E10600', 0.7, -0.4, 0.28, 0.4),
  ],
  side: [{ color: '#E10600', points: flank(0.85, -1.9, 0.06, 0.2) }],
  texts: [
    sideText('PANASONIC', -0.4, mid + 0.14, 0.075, '#0B3D91'),
    sideText('TOYOTA', 0.4, mid + 0.16, 0.08, '#E10600'),
    sideText('BRIDGESTONE', -1.2, 0.6, 0.045, '#1B1B1B'),
    topText('TOYOTA', 2.0, 0, 0.06, WHITE),
    wingText('PANASONIC', -1.92, 0, 0.06, '#0B3D91'),
  ],
  plateTexts: { rear: [plateText('TOYOTA', -1.9, 0.92, 0.06, '#E10600')] },
};

export const LIVERIES_GEN2004: readonly Livery[] = [FERRARI, MCLAREN, WILLIAMS, RENAULT, BAR, JAGUAR, TOYOTA];
