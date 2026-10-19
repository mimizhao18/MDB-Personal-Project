import { BLACK, CARBON, WHITE, both, ellipse, flank, noseCapShape, podBand, sideText, stripe, topText, layout } from '../liveryHelpers';
import type { Livery } from '../liveryTypes';

// 2026: every team on the grid. Shapes are in the car's own measurements (see src/data/cars/gen2026.ts).

const L = layout('gen2026');
const mid = L.podMid;
const solidParts = (c: string, flap = c, endplate = c) => ({ wing: c, flap, endplate, floor: CARBON });
const carbonParts = { wing: CARBON, flap: CARBON, endplate: CARBON, floor: CARBON };

const FERRARI: Livery = {
  id: 'ferrari-2026',
  name: 'Ferrari',
  era: 'gen2026',
  team: 'Scuderia Ferrari HP',
  price: 100,
  primary: '#DC0000',
  secondary: '#FFFFFF',
  sidepod: 'compact',
  finish: 'gloss',
  parts: carbonParts,
  top: [
    // white airbox and top of the engine cover, black tail, white nose cap
    { color: WHITE, points: stripe(0.1, -1.0, 0.16) },
    { color: BLACK, points: stripe(-1.35, L.tail - 0.05, 0.17) },
    { color: WHITE, points: noseCapShape(2.45, 2.85, 0.08) },
  ],
  side: [
    // the white airbox side, and the black lower sidepod
    { color: WHITE, points: flank(0.08, -0.9, 0.74, 1.12) },
    { color: BLACK, points: flank(L.podFront, L.podRear, 0.06, 0.2) },
    { color: '#FFD800', points: ellipse(0.3, mid + 0.02, 0.15, 0.1) },
  ],
  texts: [
    sideText('HP', -0.4, 0.92, 0.17, '#0096D6'),
    sideText('SHELL', 0.3, mid + 0.02, 0.05, '#DC0000'),
    sideText('UNICREDIT', -0.7, mid + 0.1, 0.075, WHITE),
    sideText('CEVA', -1.35, 0.46, 0.05, WHITE),
    sideText('PUMA', 0.45, mid + 0.16, 0.05, WHITE),
    topText('HP', -0.45, 0, 0.14, '#0096D6'),
    topText('ZYN', 2.0, 0, 0.06, WHITE),
  ],
};

const MERCEDES: Livery = {
  id: 'mercedes-2026',
  name: 'Mercedes',
  era: 'gen2026',
  team: 'Mercedes-AMG Petronas',
  price: 120,
  primary: '#BFC3C9',
  secondary: '#00D2BE',
  glow: '#00D2BE',
  sidepod: 'compact',
  finish: 'gloss',
  parts: solidParts(BLACK),
  top: [
    // black engine cover tail and nose, a teal stripe and a teal nose tip
    { color: BLACK, points: stripe(-0.8, L.tail - 0.05, 0.17) },
    { color: '#00D2BE', points: noseCapShape(2.5, 2.85, 0.08) },
    { color: '#00D2BE', points: stripe(-0.1, -0.8, 0.02) },
  ],
  side: [{ color: BLACK, points: flank(L.podFront, L.podRear, 0.06, 0.18) }, { color: '#00D2BE', points: flank(L.podFront, -1.8, 0.18, 0.2) }],
  texts: [
    sideText('PETRONAS', -0.35, mid + 0.06, 0.11, '#007F73'),
    sideText('INEOS', 0.4, mid + 0.1, 0.06, BLACK),
    sideText('UBS', -1.3, 0.55, 0.06, BLACK),
    sideText('TIBCO', -1.2, 0.34, 0.045, '#00D2BE'),
    topText('PETRONAS', 1.85, 0, 0.06, BLACK),
  ],
};

const MCLAREN: Livery = {
  id: 'mclaren-2026',
  name: 'McLaren',
  era: 'gen2026',
  team: 'McLaren Mastercard F1 Team',
  price: 140,
  primary: '#FF8000',
  secondary: '#47C7FC',
  sidepod: 'compact',
  finish: 'gloss',
  parts: solidParts('#FF8000', BLACK, '#FF8000'),
  top: [
    { color: BLACK, points: stripe(-1.2, L.tail - 0.05, 0.17) },
    { color: '#47C7FC', points: stripe(-0.6, -1.2, 0.07) },
    { color: '#47C7FC', points: noseCapShape(2.5, 2.85, 0.08) },
    ...podBand('#47C7FC', -0.4, -1.5, 0.16, 0.36),
  ],
  side: [{ color: '#47C7FC', points: flank(L.podFront, L.podRear, 0.06, 0.24) }],
  texts: [
    sideText('MASTERCARD', -0.45, mid + 0.16, 0.08, WHITE),
    sideText('GOOGLE', 0.3, mid + 0.14, 0.07, WHITE),
    sideText('GULF', -1.3, 0.5, 0.06, '#0B1F5C'),
    sideText('MCLAREN', -0.7, 0.15, 0.04, '#0B1F5C'),
    topText('MCLAREN', 1.9, 0, 0.065, BLACK),
  ],
};

const REDBULL: Livery = {
  id: 'redbull-2026',
  name: 'Red Bull',
  era: 'gen2026',
  team: 'Oracle Red Bull Racing',
  price: 160,
  primary: '#1C2B5E',
  secondary: '#E4002B',
  glow: '#E4002B',
  sidepod: 'compact',
  finish: 'matte',
  parts: solidParts('#1C2B5E', '#E4002B', '#1C2B5E'),
  top: [
    { color: '#FFD100', points: noseCapShape(2.5, 2.85, 0.07) },
    ...both('#E4002B', [[0.8, 0.28], [0.62, 0.46], [0.25, 0.55], [-0.3, 0.55], [-0.8, 0.44], [-0.3, 0.4], [0.25, 0.42], [0.62, 0.34]]),
    { color: '#E4002B', points: stripe(-0.9, L.tail - 0.05, 0.04) },
  ],
  side: [{ color: '#E4002B', points: flank(L.podFront, L.podRear, 0.15, 0.2) }],
  texts: [
    sideText('FORD', -0.35, mid + 0.04, 0.12, WHITE),
    sideText('ORACLE', -1.3, 0.52, 0.06, WHITE),
    sideText('BYBIT', 0.35, mid + 0.1, 0.06, '#FFD100'),
    sideText('RED BULL', -1.25, 0.34, 0.045, '#E4002B'),
    topText('RED BULL', 1.9, 0, 0.06, '#FFD100'),
  ],
};

const RACINGBULLS: Livery = {
  id: 'racingbulls-2026',
  name: 'Racing Bulls',
  era: 'gen2026',
  team: 'Visa Cash App Racing Bulls F1 Team',
  price: 180,
  primary: '#F2F2F2',
  secondary: '#1E3FA8',
  sidepod: 'compact',
  finish: 'gloss',
  parts: solidParts('#F2F2F2', '#1E3FA8', '#1E3FA8'),
  top: [
    { color: '#1E3FA8', points: noseCapShape(2.45, 2.85, 0.09) },
    { color: '#1E3FA8', points: stripe(-0.7, L.tail - 0.05, 0.12) },
    ...both('#E10600', [[0.7, 0.3], [0.4, 0.5], [-0.2, 0.52], [-0.2, 0.46], [0.4, 0.44], [0.7, 0.26]]),
  ],
  side: [{ color: '#1E3FA8', points: flank(L.podFront, L.podRear, 0.06, 0.16) }],
  texts: [
    sideText('VISA', -0.3, mid + 0.12, 0.12, '#1E3FA8'),
    sideText('CASH APP', 0.35, mid + 0.14, 0.055, '#1E3FA8'),
    sideText('RACING BULLS', -1.1, mid + 0.02, 0.05, '#E10600'),
    sideText('HONDA', -1.35, 0.5, 0.045, '#1E3FA8'),
    topText('VISA', 1.95, 0, 0.07, WHITE),
  ],
};

const ALPINE: Livery = {
  id: 'alpine-2026',
  name: 'Alpine',
  era: 'gen2026',
  team: 'BWT Alpine F1 Team',
  price: 200,
  primary: '#0A5ADB',
  secondary: '#FF69C8',
  glow: '#FF69C8',
  sidepod: 'compact',
  finish: 'gloss',
  parts: solidParts('#0A5ADB', WHITE, '#0A5ADB'),
  top: [
    { color: '#FF69C8', points: stripe(-0.7, L.tail - 0.05, 0.14) },
    { color: WHITE, points: noseCapShape(2.45, 2.85, 0.09) },
    ...both('#FF69C8', [[0.75, 0.28], [0.5, 0.5], [-0.1, 0.52], [-0.1, 0.45], [0.5, 0.43], [0.75, 0.24]]),
  ],
  side: [{ color: WHITE, points: flank(L.podFront, L.podRear, 0.06, 0.13) }],
  texts: [
    sideText('ALPINE', -0.35, mid + 0.1, 0.13, WHITE),
    sideText('BWT', -1.25, 0.5, 0.075, WHITE),
    sideText('CASTROL', 0.35, mid + 0.12, 0.05, WHITE),
    sideText('MERCEDES', -1.1, 0.33, 0.04, WHITE),
    topText('ALPINE', 1.95, 0, 0.06, WHITE),
  ],
};

const ASTONMARTIN: Livery = {
  id: 'astonmartin-2026',
  name: 'Aston Martin',
  era: 'gen2026',
  team: 'Aston Martin Aramco F1 Team',
  price: 220,
  primary: '#00665E',
  secondary: '#CFE600',
  sidepod: 'compact',
  finish: 'gloss',
  parts: solidParts('#00665E', '#CFE600', '#00665E'),
  top: [
    { color: '#CFE600', points: noseCapShape(2.5, 2.85, 0.09) },
    { color: '#CFE600', points: stripe(-0.7, L.tail - 0.05, 0.03) },
    ...podBand('#CFE600', 0.8, -1.2, 0.3, 0.34),
  ],
  side: [{ color: '#CFE600', points: flank(L.podFront, L.podRear, 0.07, 0.11) }],
  texts: [
    sideText('ARAMCO', -0.4, mid + 0.08, 0.11, WHITE),
    sideText('HONDA', -1.3, 0.5, 0.06, '#CFE600'),
    sideText('ASTON MARTIN', 0.2, mid + 0.16, 0.045, '#CFE600'),
    topText('ARAMCO', 1.95, 0, 0.06, '#CFE600'),
  ],
};

const WILLIAMS: Livery = {
  id: 'williams-2026',
  name: 'Williams',
  era: 'gen2026',
  team: 'Atlassian Williams Racing',
  price: 240,
  primary: '#0B2B6A',
  secondary: '#00A3E0',
  sidepod: 'compact',
  finish: 'gloss',
  parts: solidParts('#0B2B6A', '#00A3E0', '#0B2B6A'),
  top: [
    { color: '#00A3E0', points: noseCapShape(2.45, 2.85, 0.09) },
    { color: WHITE, points: stripe(-0.7, L.tail - 0.05, 0.06) },
    ...both('#00A3E0', [[0.8, 0.26], [0.5, 0.5], [0.0, 0.54], [0.0, 0.47], [0.5, 0.43], [0.8, 0.2]]),
  ],
  side: [{ color: '#00A3E0', points: flank(L.podFront, L.podRear, 0.06, 0.13) }],
  texts: [
    sideText('ATLASSIAN', -0.4, mid + 0.1, 0.095, WHITE),
    sideText('WILLIAMS', -1.25, 0.5, 0.055, '#00A3E0'),
    sideText('MERCEDES', 0.35, mid + 0.14, 0.045, WHITE),
    topText('WILLIAMS', 1.95, 0, 0.06, WHITE),
  ],
};

const HAAS: Livery = {
  id: 'haas-2026',
  name: 'Haas',
  era: 'gen2026',
  team: 'TGR Haas F1 Team',
  price: 260,
  primary: '#EDEDED',
  secondary: '#E10600',
  sidepod: 'compact',
  finish: 'gloss',
  parts: solidParts('#EDEDED', '#E10600', BLACK),
  top: [
    { color: '#E10600', points: noseCapShape(2.45, 2.85, 0.1) },
    { color: BLACK, points: stripe(-0.9, L.tail - 0.05, 0.17) },
    ...podBand('#E10600', 0.7, -0.9, 0.42, 0.5),
  ],
  side: [{ color: BLACK, points: flank(L.podFront, L.podRear, 0.06, 0.18) }, { color: '#E10600', points: flank(L.podFront, L.podRear, 0.18, 0.23) }],
  texts: [
    sideText('TGR', -0.35, mid + 0.14, 0.14, '#E10600'),
    sideText('TOYOTA', 0.35, mid + 0.16, 0.055, '#1B1B1B'),
    sideText('MONEYGRAM', -1.2, 0.5, 0.045, '#1B1B1B'),
    topText('HAAS', 1.95, 0, 0.07, WHITE),
  ],
};

const AUDI: Livery = {
  id: 'audi-2026',
  name: 'Audi',
  era: 'gen2026',
  team: 'Audi Revolut F1 Team',
  price: 280,
  primary: '#B5B8BD',
  secondary: '#F50537',
  glow: '#F50537',
  sidepod: 'compact',
  finish: 'matte',
  parts: solidParts(BLACK, '#F50537', BLACK),
  top: [
    { color: BLACK, points: stripe(-0.5, L.tail - 0.05, 0.17) },
    { color: '#F50537', points: noseCapShape(2.55, 2.85, 0.07) },
    ...podBand(BLACK, 0.7, -1.0, 0.3, 0.5),
  ],
  side: [{ color: BLACK, points: flank(L.podFront, L.podRear, 0.06, 0.2) }, { color: '#F50537', points: flank(L.podFront, L.podRear, 0.2, 0.225) }],
  texts: [
    sideText('AUDI', -0.4, mid + 0.14, 0.15, BLACK),
    sideText('REVOLUT', -1.3, 0.5, 0.055, WHITE),
    sideText('CASTROL', 0.35, mid + 0.16, 0.05, BLACK),
    topText('AUDI', 1.95, 0, 0.08, BLACK),
  ],
};

const CADILLAC: Livery = {
  id: 'cadillac-2026',
  name: 'Cadillac',
  era: 'gen2026',
  team: 'Cadillac Formula 1 Team',
  price: 300,
  primary: '#0B0B0D',
  secondary: '#C8102E',
  glow: '#C8102E',
  sidepod: 'compact',
  finish: 'matte',
  parts: solidParts(BLACK, '#C8102E', BLACK),
  top: [
    { color: WHITE, points: noseCapShape(2.45, 2.85, 0.09) },
    { color: '#C8102E', points: stripe(-0.5, L.tail - 0.05, 0.03) },
    ...podBand(WHITE, 0.7, -0.4, 0.44, 0.48),
  ],
  side: [{ color: WHITE, points: flank(L.podFront, L.podRear, 0.06, 0.09) }, { color: '#C8102E', points: flank(L.podFront, L.podRear, 0.09, 0.115) }],
  texts: [
    sideText('CADILLAC', -0.35, mid + 0.1, 0.11, WHITE),
    sideText('TWG', 0.35, mid + 0.16, 0.06, '#C8102E'),
    sideText('GM', -1.3, 0.5, 0.08, WHITE),
    topText('CADILLAC', 1.9, 0, 0.06, WHITE),
  ],
};

export const LIVERIES_GEN2026: readonly Livery[] = [FERRARI, MERCEDES, MCLAREN, REDBULL, RACINGBULLS, ALPINE, ASTONMARTIN, WILLIAMS, HAAS, AUDI, CADILLAC];
