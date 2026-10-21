import { BLACK, CARBON, WHITE, both, ellipse, flank, noseCapShape, plateText, podBand, sideText, stripe, topText, wingText, layout } from '../../../src/data/liveryHelpers';
import type { Livery } from '../../../src/data/liveryTypes';

// 2004 (V10 era): the best-known liveries, drawn from the photos in reference/gen2004/liveries/. Shapes are in the
// car's own measurements (see src/data/cars/gen2004.ts): nose 2.3, front axle 1.55, sidepods 0.85 to -1.9, rear axle
// -1.55, tail -1.95; floor edge 0.06 to 0.16, sidepod top about 0.62, engine cover top 0.82, airbox top 0.98.

const L = layout('gen2004');
const solidParts = (c: string, flap = c, endplate = c) => ({ wing: c, flap, endplate, floor: CARBON });
const AIRBOX = [0.05, -1.4] as const;

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
  helmet: '#D80000',
  parts: solidParts('#D80000', '#D80000', '#F4F4F4'),
  frontParts: { wing: '#F4F4F4', flap: '#D80000', endplate: '#F4F4F4' },
  top: [
    // the white "barcode" on the rear of the engine cover, the yellow shield on the nose
    { color: WHITE, points: [[-0.5, 0.12], [-0.5, -0.12], [-1.4, -0.08], [-1.4, 0.08]] },
    { color: '#FFD800', points: ellipse(2.05, 0, 0.05, 0.035) },
  ],
  side: [
    // the white wedge on the rear engine cover, the white lower sidepod panel, the Vodafone roundel and the Shell scallop
    { color: WHITE, points: [[-0.45, 0.9], [-0.45, 0.66], [-1.5, 0.52], [-1.5, 0.66]] },
    { color: WHITE, points: [[1.3, 0.1], [1.2, 0.3], [0.5, 0.36], [0.2, 0.3], [0.2, 0.1]] },
    { color: WHITE, points: ellipse(-0.7, 0.32, 0.17, 0.17) },
    { color: '#D80000', points: ellipse(-0.7, 0.32, 0.1, 0.1) },
    { color: '#FFD800', points: ellipse(-0.05, 0.36, 0.13, 0.12) },
    { color: '#FFD800', points: ellipse(1.35, 0.5, 0.05, 0.065) },
    { color: WHITE, points: flank(2.0, 1.8, 0.33, 0.37) },
  ],
  texts: [
    sideText('SHELL', -0.05, 0.36, 0.045, '#D80000'),
    sideText('VODAFONE', -0.7, 0.2, 0.035, '#D80000'),
    sideText('VODAFONE', 0.55, 0.55, 0.04, WHITE),
    sideText('VODAFONE', 0.75, 0.2, 0.04, '#D80000'),
    sideText('FIAT', -0.9, 0.56, 0.04, WHITE),
    sideText('MARLBORO', -1.0, 0.72, 0.045, '#D80000'),
    sideText('ACER', -1.3, 0.3, 0.035, WHITE),
    sideText('OLYMPUS', 2.0, 0.42, 0.028, '#0B3D91'),
    sideText('1', 1.9, 0.3, 0.07, WHITE),
    topText('MARLBORO', 1.65, 0, 0.055, WHITE),
    topText('VODAFONE', 1.0, 0, 0.045, WHITE),
    topText('1', 2.05, 0, 0.06, WHITE),
    wingText('MARLBORO', -1.84, 0, 0.07, WHITE),
    wingText('VODAFONE', 2.3, 0.4, 0.05, '#D80000', 'front'),
    wingText('VODAFONE', 2.3, -0.4, 0.05, '#D80000', 'front'),
  ],
  plateTexts: { rear: [plateText('V-POWER', -1.82, 0.86, 0.05, '#D80000'), plateText('BRIDGESTONE', -1.82, 0.74, 0.04, BLACK), plateText('AMD', -1.82, 0.62, 0.05, '#0A7A3A')], front: [plateText('BRIDGESTONE', 2.24, 0.2, 0.04, BLACK)] },
};

const MCLAREN: Livery = {
  id: 'mclaren-2004',
  name: 'McLaren',
  era: 'gen2004',
  team: 'West McLaren Mercedes',
  price: 90,
  primary: '#A4A8B0',
  secondary: '#0E0E10',
  glow: '#E10600',
  sidepod: 'v10',
  finish: 'gloss',
  helmet: '#DADDE2',
  parts: solidParts(BLACK, BLACK, BLACK),
  top: [
    // the black rear engine cover and tail, black sidepod tops behind the inlets, the red-orange flash by the cockpit
    { color: BLACK, points: stripe(-0.6, L.tail - 0.05, 0.14) },
    ...podBand(BLACK, 0.3, -1.6, 0.3, 0.62),
    ...both('#E8440A', [[0.5, 0.26], [0.3, 0.3], [0.1, 0.26], [0.3, 0.22]]),
  ],
  side: [
    // black lower body with a thin red line above it, the black rear cover flank
    { color: BLACK, points: flank(0.85, -1.9, 0.06, 0.16) },
    { color: '#E10600', points: flank(0.85, -1.9, 0.16, 0.18) },
    { color: BLACK, points: [[-0.6, 0.9], [-0.6, 0.6], [-1.95, 0.42], [-1.95, 0.5], [-1.2, 0.72]] },
  ],
  texts: [
    sideText('WEST', -0.2, 0.44, 0.1, WHITE),
    sideText('MERCEDES-BENZ', 0.3, 0.3, 0.04, BLACK),
    sideText('SIEMENS', 1.3, 0.5, 0.045, BLACK),
    sideText('MOBIL 1', -0.9, 0.32, 0.045, '#E10600'),
    sideText('BOSS', -0.3, 0.6, 0.035, BLACK),
    sideText('5', 1.8, 0.4, 0.07, BLACK),
    topText('SIEMENS', 1.4, 0, 0.05, BLACK),
    topText('5', 1.9, 0, 0.06, BLACK),
    topText('MOBIL 1', 0.8, 0, 0.04, '#E10600'),
    wingText('WEST', -1.84, 0, 0.09, WHITE),
    wingText('WEST', 2.3, 0.4, 0.06, WHITE, 'front'),
    wingText('WEST', 2.3, -0.4, 0.06, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('WEST', -1.82, 0.78, 0.08, WHITE), plateText('MERCEDES', -1.82, 0.62, 0.04, WHITE)], front: [plateText('WEST', 2.24, 0.2, 0.06, WHITE)] },
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
  helmet: '#DDE6F8',
  parts: solidParts('#F2F2F2', '#F2F2F2', '#F2F2F2'),
  frontParts: { wing: '#F2F2F2', flap: '#1B2F7A', endplate: '#1B2F7A' },
  top: [
    // white car with a navy band down the nose and navy sidepods, a navy nose tip
    { color: '#1B2F7A', points: stripe(1.0, 2.1, 0.035) },
    { color: '#1B2F7A', points: noseCapShape(2.15, 2.3, 0.06) },
    ...podBand('#1B2F7A', 0.85, -1.4, 0.26, 0.62),
  ],
  side: [
    // the navy sidepods and lower body, the BMW roundel on the nose
    { color: '#1B2F7A', points: [[0.85, 0.06], [0.85, 0.5], [0.3, 0.56], [-0.6, 0.52], [-1.9, 0.36], [-1.9, 0.06]] },
    { color: WHITE, points: ellipse(1.95, 0.32, 0.045, 0.045) },
    { color: '#1B2F7A', points: ellipse(1.95, 0.32, 0.03, 0.03) },
  ],
  texts: [
    sideText('CASTROL', 0.25, 0.3, 0.055, WHITE),
    sideText('PETROBRAS', 0.35, 0.56, 0.035, WHITE),
    sideText('HP', -0.55, 0.32, 0.08, WHITE),
    sideText('BUDWEISER', -1.0, 0.56, 0.04, '#1B2F7A'),
    sideText('FEDEX', -1.3, 0.68, 0.045, '#1B2F7A'),
    sideText('REUTERS', 1.3, 0.44, 0.035, '#1B2F7A'),
    sideText('ALLIANZ', -0.9, 0.2, 0.035, WHITE),
    sideText('3', 1.75, 0.46, 0.07, '#1B2F7A'),
    topText('BUD', 1.05, 0, 0.05, '#1B2F7A'),
    topText('REUTERS', 1.5, 0, 0.04, '#1B2F7A'),
    topText('3', 1.85, 0, 0.06, '#1B2F7A'),
    wingText('HP INVENT', -1.84, 0, 0.07, '#1B2F7A'),
    wingText('FEDEX', 2.3, 0.4, 0.06, WHITE, 'front'),
    wingText('FEDEX', 2.3, -0.4, 0.06, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('FEDEX', -1.82, 0.78, 0.06, '#1B2F7A'), plateText('HP', -1.82, 0.62, 0.07, '#1B2F7A')], front: [plateText('HP', 2.24, 0.2, 0.06, WHITE)] },
};

const RENAULT: Livery = {
  id: 'renault-2004',
  name: 'Renault',
  era: 'gen2004',
  team: 'Mild Seven Renault F1',
  price: 150,
  primary: '#3FA3E8',
  secondary: '#FFD800',
  sidepod: 'v10',
  finish: 'gloss',
  helmet: '#FFD800',
  parts: solidParts('#3FA3E8', '#3FA3E8', '#0B1E5B'),
  frontParts: { wing: '#0B1E5B', flap: '#0B1E5B', endplate: '#0B1E5B' },
  top: [
    // the yellow nose and chassis and the yellow front half of the sidepods, light blue behind, navy tail
    { color: '#FFD800', points: stripe(0.3, 2.1, 0.22) },
    ...podBand('#FFD800', 0.85, 0.1, 0.2, 0.6),
    { color: '#0B1E5B', points: noseCapShape(2.1, 2.3, 0.07) },
    { color: '#0B1E5B', points: stripe(-1.5, L.tail - 0.05, 0.1) },
  ],
  side: [
    // the yellow nose, chassis and sidepod fronts; navy lower body, floor edge and nose tip
    { color: '#FFD800', points: [[0.3, 0.3], [0.3, 0.8], [0.9, 0.68], [2.1, 0.46], [2.1, 0.26], [0.85, 0.3]] },
    { color: '#FFD800', points: [[0.85, 0.3], [0.85, 0.56], [0.1, 0.6], [0.1, 0.3]] },
    { color: '#0B1E5B', points: flank(0.85, -1.9, 0.06, 0.16) },
    { color: '#0B1E5B', points: [[2.1, 0.26], [2.1, 0.4], [2.3, 0.36], [2.3, 0.26]] },
  ],
  texts: [
    sideText('MILD SEVEN', 0.45, 0.42, 0.05, '#3FA3E8'),
    sideText('MILD SEVEN', -0.5, 0.42, 0.05, WHITE),
    sideText('HANJIN', 0.75, 0.56, 0.035, '#0B1E5B'),
    sideText('ELF', 1.2, 0.48, 0.06, '#0B1E5B'),
    sideText('ELF', -0.3, 0.6, 0.045, WHITE),
    sideText('RENAULT', -1.1, 0.32, 0.045, WHITE),
    sideText('8', 1.6, 0.42, 0.07, '#0B1E5B'),
    sideText('MICHELIN', -1.3, 0.2, 0.03, WHITE),
    topText('RENAULT', 1.5, 0, 0.055, '#0B1E5B'),
    topText('MILD SEVEN', 0.6, 0, 0.04, '#3FA3E8'),
    topText('8', 1.9, 0, 0.06, '#0B1E5B'),
    wingText('TELEFONICA', -1.84, 0, 0.06, '#0B1E5B'),
    wingText('MILD SEVEN', 2.3, 0.4, 0.045, WHITE, 'front'),
    wingText('MILD SEVEN', 2.3, -0.4, 0.045, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('MICHELIN', -1.82, 0.78, 0.05, WHITE), plateText('ELF', -1.82, 0.62, 0.06, WHITE)], front: [plateText('MODE', 2.24, 0.2, 0.05, '#FFD800')] },
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
  helmet: '#F4F4F4',
  parts: solidParts(BLACK, BLACK, BLACK),
  frontParts: { wing: '#F4F4F4', flap: '#F4F4F4', endplate: BLACK },
  top: [
    // the red airbox and the black rear of the engine cover with the white Honda band between them
    { color: '#E10600', points: stripe(0.05, -0.5, 0.13) },
    { color: WHITE, points: stripe(-0.5, -0.8, 0.12) },
    { color: BLACK, points: stripe(-0.8, L.tail - 0.05, 0.12) },
    { color: '#E10600', points: noseCapShape(2.15, 2.3, 0.05) },
  ],
  side: [
    // red airbox, the white Honda band and the black rear cover, the Lucky Strike roundel and red lower band
    { color: '#E10600', points: flank(AIRBOX[0], -0.5, 0.7, 0.98) },
    { color: '#C8C09A', points: flank(-0.5, -0.8, 0.6, 0.92) },
    { color: BLACK, points: [[-0.8, 0.9], [-0.8, 0.58], [-1.95, 0.42], [-1.95, 0.5], [-1.2, 0.74]] },
    { color: WHITE, points: [[-0.5, 0.68], [-0.5, 0.78], [-1.2, 0.68], [-1.2, 0.58]] },
    { color: '#E10600', points: flank(0.85, -1.9, 0.14, 0.3) },
    { color: WHITE, points: ellipse(-0.3, 0.3, 0.18, 0.18) },
    { color: '#E10600', points: ellipse(-0.3, 0.3, 0.14, 0.14) },
    { color: BLACK, points: flank(0.85, -1.9, 0.06, 0.1) },
  ],
  texts: [
    sideText('LUCKY STRIKE', 0.4, 0.22, 0.045, WHITE),
    sideText('LUCKY STRIKE', -1.1, 0.22, 0.045, WHITE),
    sideText('HONDA', -0.85, 0.68, 0.055, '#E10600'),
    sideText('LUCKY STRIKE', -0.3, 0.3, 0.035, WHITE),
    sideText('MICHELIN', 0.1, 0.52, 0.03, BLACK),
    sideText('9', 1.6, 0.4, 0.07, '#E10600'),
    topText('LUCKY STRIKE', 1.6, 0, 0.045, '#E10600'),
    topText('HONDA', -0.65, 0, 0.055, '#E10600'),
    topText('9', 2.0, 0, 0.06, '#E10600'),
    wingText('LUCKY STRIKE', -1.84, 0, 0.065, WHITE),
    wingText('HONDA', 2.3, 0.4, 0.05, '#E10600', 'front'),
    wingText('HONDA', 2.3, -0.4, 0.05, '#E10600', 'front'),
  ],
  plateTexts: { rear: [plateText('INTERCOND', -1.82, 0.84, 0.045, WHITE), plateText('LUCKY STRIKE', -1.82, 0.66, 0.045, WHITE)], front: [plateText('LUCKY STRIKE', 2.22, 0.2, 0.04, WHITE)] },
};

const JAGUAR: Livery = {
  id: 'jaguar-2004',
  name: 'Jaguar',
  era: 'gen2004',
  team: 'Jaguar Racing',
  price: 210,
  primary: '#0F5A3C',
  secondary: '#C8CCD2',
  glow: '#18B26B',
  sidepod: 'v10',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: solidParts('#0F5A3C', '#0F5A3C', '#C8CCD2'),
  frontParts: { wing: '#C8CCD2', flap: '#C8CCD2', endplate: '#C8CCD2' },
  top: [
    // silver sidepod tops and a silver band over the engine cover, a red stripe along the floor edge
    ...podBand('#C8CCD2', 0.85, -1.4, 0.3, 0.6),
    { color: '#C8CCD2', points: stripe(-0.4, -1.2, 0.08) },
    ...podBand('#D21F26', 0.85, -1.4, 0.58, 0.61),
  ],
  side: [
    // the silver sidepod flank with its red lower stripe, green nose and engine cover
    { color: '#C8CCD2', points: [[0.85, 0.16], [0.85, 0.56], [0.3, 0.6], [-0.6, 0.56], [-1.9, 0.4], [-1.9, 0.16]] },
    { color: '#D21F26', points: flank(0.85, -1.9, 0.1, 0.16) },
    { color: BLACK, points: flank(0.85, -1.9, 0.06, 0.1) },
    { color: WHITE, points: ellipse(1.75, 0.38, 0.09, 0.03) },
  ],
  texts: [
    sideText('AT&T', 0.3, 0.4, 0.06, '#0B3D91'),
    sideText('BECKS', -0.6, 0.6, 0.04, '#0F5A3C'),
    sideText('HSBC', -0.3, 0.28, 0.06, '#D21F26'),
    sideText('DUPONT', 1.75, 0.38, 0.03, '#0F5A3C'),
    sideText('MICHELIN', -1.2, 0.3, 0.03, '#0F5A3C'),
    sideText('14', 2.0, 0.34, 0.06, WHITE),
    topText('BECKS', 1.5, 0, 0.045, WHITE),
    topText('14', 1.9, 0, 0.06, WHITE),
    wingText('HSBC', -1.84, 0, 0.08, WHITE),
    wingText('UGS', 2.3, 0.4, 0.05, '#0B3D91', 'front'),
    wingText('UGS', 2.3, -0.4, 0.05, '#0B3D91', 'front'),
  ],
  plateTexts: { rear: [plateText('HSBC', -1.82, 0.78, 0.07, '#D21F26'), plateText('MICHELIN', -1.82, 0.62, 0.04, '#0F5A3C')], front: [plateText('PIONEER', 2.24, 0.2, 0.045, '#D21F26')] },
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
  helmet: '#1E88E5',
  parts: solidParts('#F2F2F2', '#F2F2F2', '#F2F2F2'),
  frontParts: { wing: '#F2F2F2', flap: '#F2F2F2', endplate: '#E10600' },
  top: [
    // the red front of the sidepods, a red nose tip, red stripes on the nose
    ...podBand('#E10600', 0.85, 0.2, 0.2, 0.6),
    { color: '#E10600', points: noseCapShape(2.1, 2.3, 0.06) },
    { color: '#E10600', points: stripe(1.2, 2.1, 0.03) },
  ],
  side: [
    // the red brush over the front of the sidepod and along the nose, red front of the cockpit surround
    { color: '#E10600', points: [[0.85, 0.16], [0.85, 0.58], [0.4, 0.6], [0.1, 0.42], [0.3, 0.16]] },
    { color: '#E10600', points: [[1.0, 0.5], [1.0, 0.62], [0.6, 0.66], [2.2, 0.4], [2.2, 0.3]] },
    { color: BLACK, points: flank(0.85, -1.9, 0.06, 0.1) },
  ],
  texts: [
    sideText('PANASONIC', -0.5, 0.3, 0.075, '#0B3D91'),
    sideText('TOYOTA', -0.75, 0.68, 0.05, '#E10600'),
    sideText('DENSO', -0.4, 0.78, 0.045, '#E10600'),
    sideText('ESSO', -0.1, 0.9, 0.03, '#E10600'),
    sideText('17', 1.7, 0.42, 0.07, '#E10600'),
    sideText('TIME', 2.05, 0.3, 0.03, BLACK),
    topText('TOYOTA', 1.5, 0, 0.055, '#E10600'),
    topText('17', 1.9, 0, 0.06, '#E10600'),
    wingText('PANASONIC', -1.84, 0, 0.06, '#0B3D91'),
    wingText('PANASONIC', 2.3, 0.4, 0.045, '#0B3D91', 'front'),
    wingText('PANASONIC', 2.3, -0.4, 0.045, '#0B3D91', 'front'),
  ],
  plateTexts: { rear: [plateText('TOYOTA', -1.82, 0.78, 0.06, '#E10600'), plateText('ESSO', -1.82, 0.62, 0.05, '#E10600')], front: [plateText('MICHELIN', 2.24, 0.2, 0.04, WHITE)] },
};

export const LIVERIES_GEN2004: readonly Livery[] = [FERRARI, MCLAREN, WILLIAMS, RENAULT, BAR, JAGUAR, TOYOTA];
