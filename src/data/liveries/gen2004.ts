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
  parts: solidParts('#F4F4F4', '#17171A', '#D80000'),
  top: [
    // white nose bands (the "barcode"), the white back of the airbox, black tail, white panel on the front of the sidepods
    { color: WHITE, points: stripe(1.75, 1.85, 0.1) },
    { color: WHITE, points: stripe(1.55, 1.65, 0.14) },
    { color: WHITE, points: stripe(-0.3, -1.0, 0.1) },
    { color: BLACK, points: stripe(-1.3, L.tail - 0.05, 0.14) },
    ...podBand(WHITE, 1.0, 0.4, 0.3, 0.5),
  ],
  side: [
    // the white wedge behind the airbox, the white lower sidepod panel, the Vodafone roundel, Shell scallop and Ferrari shield
    { color: WHITE, points: [[-0.25, 1.1], [-0.25, 0.7], [-1.0, 0.7]] },
    { color: WHITE, points: [[1.2, 0.14], [1.1, 0.42], [0.4, 0.42], [0.45, 0.14]] },
    { color: WHITE, points: ellipse(-0.4, 0.3, 0.19, 0.19) },
    { color: '#FFD800', points: ellipse(0.0, 0.37, 0.15, 0.13) },
    { color: '#FFD800', points: ellipse(1.0, 0.53, 0.06, 0.075) },
  ],
  texts: [
    sideText('SHELL', 0.0, 0.37, 0.05, '#D80000'),
    sideText('VODAFONE', -0.4, 0.3, 0.05, '#D80000'),
    topText('MARLBORO', 1.95, 0, 0.055, WHITE),
    sideText('BRIDGESTONE', -1.25, 0.62, 0.05, WHITE),
    sideText('FIAT', 0.7, 0.62, 0.05, WHITE),
    wingText('VODAFONE', -1.84, 0, 0.07, '#D80000'),
  ],
  plateTexts: { rear: [plateText('V-POWER', -1.82, 0.84, 0.05, WHITE), plateText('BRIDGESTONE', -1.82, 0.74, 0.04, WHITE), plateText('AMD', -1.82, 0.64, 0.05, WHITE)], front: [plateText('VODAFONE', 2.24, 0.2, 0.05, WHITE)] },
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
    { color: BLACK, points: noseCapShape(1.95, 2.3, 0.1) },
    { color: BLACK, points: stripe(-0.4, L.tail - 0.05, 0.06) },
    ...podBand('#E10600', 0.7, 0.1, 0.5, 0.54),
  ],
  side: [{ color: BLACK, points: flank(0.85, -1.9, 0.06, 0.18) }, { color: '#E10600', points: flank(0.85, -1.9, 0.18, 0.2) }],
  texts: [
    sideText('WEST', -0.35, mid + 0.14, 0.12, '#E10600'),
    sideText('MERCEDES', 0.35, mid + 0.1, 0.06, BLACK),
    sideText('SIEMENS', -1.3, 0.6, 0.055, '#F57F17'),
    sideText('MOBIL 1', -1.2, 0.38, 0.05, '#E10600'),
    topText('MERCEDES', 1.75, 0, 0.05, WHITE),
    wingText('WEST', -1.84, 0, 0.08, '#E10600'),
  ],
  plateTexts: { rear: [plateText('MERCEDES', -1.82, 0.68, 0.045, '#E10600')] },
};

const WILLIAMS: Livery = {
  id: 'williams-2004',
  name: 'Williams',
  era: 'gen2004',
  team: 'BMW WilliamsF1 Team',
  price: 120,
  primary: '#F2F4F8',
  secondary: '#1B2F7A',
  glow: '#2F5BD6',
  sidepod: 'v10',
  finish: 'gloss',
  parts: solidParts('#F2F2F2', '#F2F2F2', '#F2F2F2'),
  frontParts: { wing: '#1B2F7A', flap: '#1B2F7A', endplate: '#1B2F7A' },
  top: [
    // white upper body with a navy nose tip, navy sidepod sides, a red-orange tip on the airbox
    { color: '#1B2F7A', points: noseCapShape(2.0, 2.3, 0.12) },
    ...podBand('#1B2F7A', 0.85, -1.2, 0.5, 0.62),
    { color: '#E8401C', points: stripe(0.0, -0.14, 0.08) },
  ],
  side: [
    { color: '#1B2F7A', points: [[1.0, 0.06], [1.0, 0.3], [0.2, 0.42], [-0.9, 0.36], [-1.7, 0.3], [-1.7, 0.06]] },
    { color: '#E8401C', points: flank(0.0, -0.15, 1.05, 1.17) },
  ],
  texts: [
    sideText('BMW', -0.35, 0.24, 0.13, WHITE),
    sideText('HP', 0.45, 0.22, 0.08, WHITE),
    sideText('FEDEX', -1.2, 0.6, 0.06, '#1B2F7A'),
    sideText('ALLIANZ', -1.2, 0.4, 0.045, '#1B2F7A'),
    topText('WILLIAMS', 1.75, 0, 0.055, WHITE),
    wingText('ALLIANZ', -1.84, 0, 0.07, '#1B2F7A'),
  ],
  plateTexts: { rear: [plateText('FEDEX', -1.82, 0.72, 0.06, '#1B2F7A')], front: [plateText('FEDEX', 2.24, 0.2, 0.05, WHITE)] },
};

const RENAULT: Livery = {
  id: 'renault-2004',
  name: 'Renault',
  era: 'gen2004',
  team: 'Mild Seven Renault F1',
  price: 150,
  primary: '#2E8AD8',
  secondary: '#FFD800',
  sidepod: 'v10',
  finish: 'gloss',
  parts: solidParts(BLACK, BLACK, '#2E8AD8'),
  top: [
    // yellow nose and cockpit surround, azure blue behind, black tail
    { color: '#FFD800', points: stripe(0.45, 2.3, 0.2) },
    { color: '#FFD800', points: noseCapShape(1.7, 2.3, 0.14) },
    ...podBand('#FFD800', 0.85, 0.35, 0.3, 0.5),
    { color: BLACK, points: stripe(-1.4, L.tail - 0.05, 0.12) },
  ],
  side: [
    { color: '#FFD800', points: [[0.4, 0.4], [0.4, 0.78], [2.3, 0.5], [2.3, 0.32]] },
    { color: '#FFD800', points: [[0.85, 0.3], [0.85, 0.5], [0.35, 0.5], [0.35, 0.3]] },
    { color: '#1E5FB0', points: flank(0.3, -1.7, 0.06, 0.16) },
  ],
  texts: [
    sideText('FERNANDO ALONSO', -0.2, mid - 0.02, 0.06, WHITE),
    sideText('ELF', 1.0, 0.42, 0.08, '#0A3A8C'),
    sideText('MILD SEVEN', -1.05, 0.66, 0.05, WHITE),
    sideText('RENAULT', -0.9, 0.38, 0.05, WHITE),
    sideText('ING', -1.3, 0.3, 0.06, '#F57F17'),
    topText('RENAULT', 1.75, 0, 0.055, '#0A3A8C'),
    wingText('INFINITI', -1.84, 0, 0.06, '#C8FF00'),
  ],
  plateTexts: { rear: [plateText('MICHELIN', -1.82, 0.72, 0.05, WHITE)] },
};

const BAR: Livery = {
  id: 'bar-2004',
  name: 'BAR',
  era: 'gen2004',
  team: 'Lucky Strike BAR Honda',
  price: 180,
  primary: '#F4F4F4',
  secondary: '#E10600',
  glow: '#E10600',
  sidepod: 'v10',
  finish: 'gloss',
  parts: solidParts('#F2F2F2', '#F2F2F2', '#E10600'),
  frontParts: { wing: '#17171A', flap: '#17171A', endplate: '#17171A' },
  top: [
    // white car with a red cockpit surround and airbox, a small red nose flash
    { color: '#E10600', points: stripe(0.2, 0.9, 0.2) },
    { color: '#E10600', points: stripe(0.1, -0.6, 0.13) },
    { color: '#E10600', points: noseCapShape(2.15, 2.3, 0.05) },
  ],
  side: [
    { color: '#E10600', points: flank(0.1, -0.5, 0.78, 1.15) },
    // the red Lucky Strike roundel and the red band behind it
    { color: '#E10600', points: ellipse(0.35, 0.34, 0.17, 0.17) },
    { color: '#E10600', points: [[-0.2, 0.16], [-0.2, 0.52], [-1.0, 0.52], [-1.0, 0.16]] },
  ],
  texts: [
    sideText('LUCKY STRIKE', -0.6, 0.34, 0.07, WHITE),
    sideText('LS', 0.35, 0.34, 0.1, WHITE),
    sideText('RAY-BAN', 0.95, 0.5, 0.05, BLACK),
    sideText('BARF1.COM', 1.5, 0.34, 0.045, BLACK),
    sideText('HONDA', -1.25, 0.64, 0.07, '#E10600'),
    topText('LUCKY STRIKE', 1.75, 0, 0.05, '#E10600'),
    wingText('HONDA', -1.84, 0, 0.09, '#E10600'),
  ],
  plateTexts: { rear: [plateText('MICHELIN', -1.82, 0.72, 0.05, WHITE)], front: [plateText('LUCKIES', 2.22, 0.2, 0.05, WHITE)] },
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
    { color: '#C0C0C0', points: noseCapShape(1.85, 2.3, 0.12) },
    { color: '#C0C0C0', points: stripe(-0.5, L.tail - 0.05, 0.04) },
    ...podBand('#C0C0C0', 0.7, -0.3, 0.46, 0.5),
  ],
  side: [{ color: '#C0C0C0', points: flank(0.85, -1.9, 0.14, 0.17) }],
  texts: [
    sideText('JAGUAR', -0.4, mid + 0.12, 0.12, '#C0C0C0'),
    sideText('HP', 0.45, mid + 0.14, 0.09, WHITE),
    sideText('COSWORTH', -1.2, 0.6, 0.05, WHITE),
    topText('JAGUAR', 1.75, 0, 0.06, WHITE),
    wingText('JAGUAR', -1.84, 0, 0.08, '#C0C0C0'),
  ],
  plateTexts: { rear: [plateText('HP', -1.82, 0.68, 0.07, WHITE)] },
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
    { color: '#E10600', points: noseCapShape(1.85, 2.3, 0.12) },
    { color: '#E10600', points: stripe(-0.6, L.tail - 0.05, 0.08) },
    ...podBand('#E10600', 0.7, -0.4, 0.28, 0.4),
  ],
  side: [{ color: '#E10600', points: flank(0.85, -1.9, 0.06, 0.2) }],
  texts: [
    sideText('PANASONIC', -0.4, mid + 0.14, 0.075, '#0B3D91'),
    sideText('TOYOTA', 0.4, mid + 0.16, 0.08, '#E10600'),
    sideText('BRIDGESTONE', -1.2, 0.6, 0.045, '#1B1B1B'),
    topText('TOYOTA', 1.75, 0, 0.06, WHITE),
    wingText('PANASONIC', -1.84, 0, 0.06, '#0B3D91'),
  ],
  plateTexts: { rear: [plateText('TOYOTA', -1.82, 0.68, 0.06, '#E10600')] },
};

export const LIVERIES_GEN2004: readonly Livery[] = [FERRARI, MCLAREN, WILLIAMS, RENAULT, BAR, JAGUAR, TOYOTA];
