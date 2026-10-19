import { BLACK, CARBON, WHITE, both, checker, ellipse, flank, noseCapShape, plateText, podBand, sideText, stripe, topText, wingText, layout } from '../liveryHelpers';
import type { Livery } from '../liveryTypes';

// 2026: every team on the grid, drawn from photos of the real cars. Shapes are in the car's own measurements
// (see src/data/cars/gen2026.ts).

const L = layout('gen2026');
const mid = L.podMid;
const parts = (wing: string, flap = wing, endplate = wing) => ({ wing, flap, endplate, floor: CARBON });
const AIRBOX = [0.08, -0.95] as const; // along the car, where the airbox stands
const ABOX_Y = [0.74, 1.12] as const; // and how high

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
  parts: parts(CARBON),
  top: [
    // white airbox and top of the engine cover, black tail, white nose cap
    { color: WHITE, points: stripe(0.1, -1.0, 0.16) },
    { color: BLACK, points: stripe(-1.35, L.tail - 0.05, 0.17) },
    { color: WHITE, points: noseCapShape(2.45, 2.85, 0.08) },
  ],
  side: [
    // the white airbox side, the black lower sidepod and the yellow Shell scallop
    { color: WHITE, points: flank(AIRBOX[0], AIRBOX[1], ABOX_Y[0], ABOX_Y[1]) },
    { color: BLACK, points: flank(L.podFront, L.podRear, 0.06, 0.2) },
    { color: '#FFD800', points: ellipse(0.3, mid + 0.02, 0.15, 0.1) },
  ],
  texts: [
    sideText('HP', -0.4, 0.92, 0.17, '#0096D6'),
    sideText('SHELL', 0.3, mid + 0.02, 0.05, '#DC0000'),
    sideText('UNICREDIT', -0.7, mid + 0.1, 0.075, WHITE),
    sideText('CEVA', -1.35, 0.46, 0.05, WHITE),
    sideText('PUMA', 0.45, mid + 0.16, 0.05, WHITE),
    sideText('IBM', -1.1, 0.34, 0.05, WHITE),
    topText('HP', -0.45, 0, 0.14, '#0096D6'),
    topText('ZYN', 2.0, 0, 0.06, WHITE),
    wingText('SHELL V-POWER', -2.17, 0, 0.07, WHITE),
  ],
  plateTexts: { rear: [plateText('V-POWER', -2.2, 0.72, 0.07, WHITE)] },
};

const MERCEDES: Livery = {
  id: 'mercedes-2026',
  name: 'Mercedes',
  era: 'gen2026',
  team: 'Mercedes-AMG Petronas',
  price: 120,
  primary: '#0C0E11',
  secondary: '#00D2BE',
  glow: '#00D2BE',
  sidepod: 'compact',
  finish: 'matte',
  parts: parts(BLACK),
  top: [
    // grey nose with a teal stripe, a teal swoosh over the sidepods
    { color: '#9AA0A6', points: noseCapShape(1.4, 2.85, 0.13) },
    { color: '#00D2BE', points: stripe(1.4, 2.85, 0.02) },
    { color: '#00D2BE', points: stripe(0.15, -1.2, 0.015) },
    ...both('#00D2BE', [[0.85, 0.3], [0.5, 0.5], [0.0, 0.54], [-0.5, 0.5], [-0.5, 0.45], [0.0, 0.49], [0.5, 0.44], [0.85, 0.26]]),
  ],
  side: [
    { color: '#00D2BE', points: [[0.8, 0.14], [0.8, 0.24], [0.0, 0.34], [-0.95, 0.52], [-0.95, 0.44], [0.0, 0.26]] },
    { color: '#C8CCD0', points: [[0.8, 0.24], [0.8, 0.28], [0.0, 0.38], [-0.95, 0.56], [-0.95, 0.52], [0.0, 0.34]] },
  ],
  texts: [
    sideText('PETRONAS', -0.25, 0.17, 0.1, WHITE),
    sideText('MICROSOFT', -0.4, 0.95, 0.05, WHITE),
    sideText('TEAMVIEWER', 0.1, 0.55, 0.05, WHITE),
    sideText('SOLERA', -1.1, 0.7, 0.045, WHITE),
    sideText('AMD', -0.3, 0.8, 0.05, WHITE),
    topText('INEOS', 2.0, 0, 0.06, BLACK),
    topText('+ + + + + +', -0.45, 0.0, 0.05, '#9AA0A6'),
    wingText('PETRONAS', -2.17, 0, 0.07, '#00D2BE'),
  ],
  plateTexts: { rear: [plateText('SNAPDRAGON', -2.2, 0.8, 0.055, WHITE), plateText('CROWDSTRIKE', -2.2, 0.66, 0.045, WHITE)], front: [plateText('MICROSOFT', 2.3, 0.2, 0.05, WHITE)] },
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
  parts: parts(BLACK, BLACK, '#FF8000'),
  top: [
    // black airbox and engine cover, papaya nose, a little blue
    { color: BLACK, points: stripe(0.1, L.tail - 0.05, 0.17) },
    { color: '#47C7FC', points: stripe(0.5, 1.4, 0.02) },
    ...podBand(BLACK, -0.9, -1.8, 0.14, 0.36),
  ],
  side: [
    { color: BLACK, points: flank(AIRBOX[0], -1.2, ABOX_Y[0], ABOX_Y[1]) },
    { color: BLACK, points: flank(-0.6, L.podRear, 0.06, 0.4) },
    { color: '#47C7FC', points: flank(L.podFront, -0.6, 0.06, 0.1) },
  ],
  texts: [
    sideText('GEMINI', -0.4, 0.92, 0.06, WHITE),
    sideText('VUSE', -0.25, mid + 0.14, 0.085, WHITE),
    sideText('ZERO', 0.0, mid + 0.02, 0.06, '#FF8000'),
    sideText('ALLWYN', 0.5, mid + 0.14, 0.045, WHITE),
    sideText('RICHARD MILLE', -1.0, 0.56, 0.04, WHITE),
    sideText('MASTERCARD', -1.2, 0.3, 0.04, WHITE),
    wingText('MCLAREN', -2.17, 0, 0.07, '#FF8000'),
  ],
  // the rear wing flap is checkered papaya and black
  wingTop: checker('#FF8000', -2.4, -2.1, -0.42, 0.42, 0.06),
  plateTexts: { rear: [plateText('DROPBOX', -2.2, 0.72, 0.08, WHITE)], front: [plateText('GEMINI', 2.3, 0.2, 0.05, WHITE)] },
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
  parts: parts('#1C2B5E', '#1C2B5E', '#1C2B5E'),
  top: [
    // yellow airbox top, yellow nose tip, red accents
    { color: '#FFC400', points: stripe(0.1, -0.7, 0.13) },
    { color: '#FFC400', points: noseCapShape(2.5, 2.85, 0.07) },
    ...podBand('#E4002B', 0.8, 0.3, 0.3, 0.34),
  ],
  side: [
    { color: '#FFC400', points: flank(AIRBOX[0], -0.7, 0.96, ABOX_Y[1]) },
    { color: '#FF7A00', points: ellipse(-0.35, 0.9, 0.25, 0.1) },
    { color: '#E4002B', points: flank(L.podFront, L.podRear, 0.06, 0.1) },
  ],
  texts: [
    sideText('RED BULL', -0.35, 0.9, 0.06, '#E4002B'),
    sideText('ORACLE', -0.35, mid + 0.04, 0.14, WHITE),
    sideText('FORD', 0.55, mid + 0.18, 0.06, WHITE),
    sideText('ROKT', 0.45, 0.52, 0.045, WHITE),
    sideText('CLEAR', -1.2, 0.3, 0.04, WHITE),
    wingText('ORACLE', -2.17, 0, 0.09, WHITE),
  ],
  plateTexts: { rear: [plateText('MOBIL 1', -2.2, 0.72, 0.08, WHITE)], front: [plateText('ORACLE', 2.3, 0.2, 0.05, WHITE)] },
};

const RACINGBULLS: Livery = {
  id: 'racingbulls-2026',
  name: 'Racing Bulls',
  era: 'gen2026',
  team: 'Visa Cash App Racing Bulls F1 Team',
  price: 180,
  primary: '#1F2F7A',
  secondary: '#F2F2F2',
  sidepod: 'compact',
  finish: 'gloss',
  parts: parts('#1F2F7A', WHITE, '#1F2F7A'),
  top: [
    // white front half, orange nose tip, yellow airbox
    { color: WHITE, points: stripe(0.35, 2.5, 0.19) },
    { color: '#FF9A1F', points: noseCapShape(2.45, 2.85, 0.09) },
    { color: '#FFC400', points: stripe(0.1, -0.7, 0.13) },
    ...podBand(WHITE, 0.85, 0.1, 0.17, 0.5),
  ],
  side: [
    { color: '#FFC400', points: flank(AIRBOX[0], -0.7, 0.96, ABOX_Y[1]) },
    { color: '#FF7A00', points: ellipse(-0.35, 0.9, 0.25, 0.1) },
    { color: WHITE, points: flank(L.podFront, -0.55, 0.06, 0.36) },
  ],
  texts: [
    sideText('VISA', -0.1, 0.2, 0.13, '#1F2F7A'),
    sideText('CASH APP', 0.45, mid + 0.14, 0.05, '#00B341'),
    sideText('HUGO', 0.3, mid + 0.02, 0.05, BLACK),
    sideText('RED BULL', -0.35, 0.9, 0.055, '#E4002B'),
    sideText('FORD', -1.2, 0.4, 0.05, WHITE),
    wingText('VISA', -2.17, 0, 0.09, WHITE),
  ],
  plateTexts: { rear: [plateText('VISA', -2.2, 0.72, 0.08, WHITE)] },
};

const ALPINE: Livery = {
  id: 'alpine-2026',
  name: 'Alpine',
  era: 'gen2026',
  team: 'BWT Alpine F1 Team',
  price: 200,
  primary: '#1C3A9A',
  secondary: '#F06BAE',
  glow: '#F06BAE',
  sidepod: 'compact',
  finish: 'gloss',
  parts: parts('#12206A', '#F06BAE', '#12206A'),
  top: [
    // pink front half of the car, around the cockpit and halo, and a pink stripe on the engine cover
    { color: '#F06BAE', points: stripe(0.0, 2.85, 0.14) },
    { color: '#F06BAE', points: stripe(0.0, 1.0, 0.24) },
    { color: '#F06BAE', points: stripe(-0.9, L.tail - 0.05, 0.03) },
  ],
  side: [{ color: '#F06BAE', points: flank(L.podFront, 0.0, 0.3, 0.34) }],
  texts: [
    sideText('BWT', -0.35, mid - 0.02, 0.17, '#F06BAE'),
    sideText('MSC', 0.25, mid + 0.18, 0.07, WHITE),
    sideText('ENI', -0.35, 0.93, 0.07, WHITE),
    sideText('DELPHI', -0.9, 0.2, 0.04, WHITE),
    sideText('ALPINE', -1.2, 0.5, 0.05, WHITE),
    wingText('BWT', -2.17, 0, 0.09, WHITE),
  ],
  plateTexts: { rear: [plateText('ENI', -2.2, 0.72, 0.1, WHITE)] },
};

const ASTONMARTIN: Livery = {
  id: 'astonmartin-2026',
  name: 'Aston Martin',
  era: 'gen2026',
  team: 'Aston Martin Aramco F1 Team',
  price: 220,
  primary: '#0F7A66',
  secondary: '#C9E200',
  sidepod: 'compact',
  finish: 'gloss',
  parts: parts('#0A4D40', '#7FD8E8', '#0A4D40'),
  top: [
    { color: '#C9E200', points: noseCapShape(2.5, 2.85, 0.09) },
    { color: '#C9E200', points: stripe(-0.7, L.tail - 0.05, 0.025) },
    ...podBand('#C9E200', 0.8, -0.6, 0.3, 0.34),
  ],
  side: [{ color: '#C9E200', points: flank(L.podFront, L.podRear, 0.07, 0.11) }],
  texts: [
    sideText('ARAMCO', -0.4, mid + 0.04, 0.12, WHITE),
    sideText('HONDA', -1.3, 0.5, 0.06, WHITE),
    sideText('NEXGEN', 0.35, mid + 0.16, 0.045, WHITE),
    sideText('XEROX', 0.0, mid + 0.17, 0.045, WHITE),
    topText('ARAMCO', 2.0, 0, 0.06, '#C9E200'),
    wingText('ARAMCO', -2.17, 0, 0.1, WHITE),
    wingText('ARAMCO', 2.65, 0.45, 0.08, WHITE, 'front'),
    wingText('ARAMCO', 2.65, -0.45, 0.08, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('COINBASE', -2.2, 0.72, 0.07, WHITE)] },
};

const WILLIAMS: Livery = {
  id: 'williams-2026',
  name: 'Williams',
  era: 'gen2026',
  team: 'Atlassian Williams Racing',
  price: 240,
  primary: '#2AA3EA',
  secondary: '#FFFFFF',
  sidepod: 'compact',
  finish: 'gloss',
  parts: parts(BLACK, BLACK, '#0B2B6A'),
  top: [
    { color: WHITE, points: noseCapShape(2.3, 2.85, 0.1) },
    { color: BLACK, points: stripe(-1.2, L.tail - 0.05, 0.17) },
    ...podBand(WHITE, 0.6, -0.3, 0.17, 0.4),
  ],
  side: [
    { color: BLACK, points: flank(L.podFront, L.podRear, 0.06, 0.12) },
    // the white lower panel with the dark blue Komatsu lettering
    { color: WHITE, points: flank(0.5, -0.6, 0.12, 0.28) },
  ],
  texts: [
    sideText('ATLASSIAN', -0.3, 0.92, 0.065, WHITE),
    sideText('KOMATSU', -0.05, 0.2, 0.08, '#0B2B6A'),
    sideText('BARCLAYS', 0.2, 0.36, 0.05, WHITE),
    sideText('KRAKEN', -1.0, 0.45, 0.045, WHITE),
    sideText('GULF', -1.25, 0.3, 0.05, '#E4002B'),
    wingText('WILLIAMS', -2.17, 0, 0.08, WHITE),
  ],
  plateTexts: { rear: [plateText('KOMATSU', -2.2, 0.72, 0.065, WHITE)] },
};

const HAAS: Livery = {
  id: 'haas-2026',
  name: 'Haas',
  era: 'gen2026',
  team: 'TGR Haas F1 Team',
  price: 260,
  primary: '#F2F2F2',
  secondary: '#E10600',
  sidepod: 'compact',
  finish: 'gloss',
  parts: parts(BLACK, '#E10600', BLACK),
  top: [
    { color: '#E10600', points: noseCapShape(2.4, 2.85, 0.1) },
    { color: BLACK, points: stripe(-0.9, L.tail - 0.05, 0.17) },
    ...podBand('#E10600', 0.8, -0.4, 0.4, 0.46),
  ],
  side: [
    { color: BLACK, points: flank(L.podFront, L.podRear, 0.06, 0.16) },
    { color: '#E10600', points: flank(L.podFront, -0.6, 0.34, 0.37) },
  ],
  texts: [
    sideText('HAAS', -0.3, 0.24, 0.13, BLACK),
    sideText('GR', -0.35, 0.92, 0.14, '#E10600'),
    sideText('FIX', 0.55, mid + 0.14, 0.05, BLACK),
    sideText('MPHASIS', 0.4, mid + 0.02, 0.04, WHITE),
    topText('GR', 1.9, 0, 0.08, WHITE),
    wingText('HAAS', -2.17, 0, 0.08, WHITE),
  ],
  plateTexts: { rear: [plateText('TGR', -2.2, 0.72, 0.1, WHITE)] },
};

const AUDI: Livery = {
  id: 'audi-2026',
  name: 'Audi',
  era: 'gen2026',
  team: 'Audi Revolut F1 Team',
  price: 280,
  primary: '#5E6168',
  secondary: '#E5383B',
  glow: '#E5383B',
  sidepod: 'compact',
  finish: 'matte',
  parts: parts(BLACK, '#E5383B', BLACK),
  top: [
    // the red-orange airbox, a red patch on the back of the sidepods and the engine cover
    { color: '#EE4B2B', points: stripe(0.1, -0.7, 0.13) },
    ...podBand('#E5383B', -0.5, -1.7, 0.2, 0.5),
    { color: '#E5383B', points: stripe(-1.2, L.tail - 0.05, 0.1) },
  ],
  side: [
    { color: '#EE4B2B', points: flank(AIRBOX[0], -0.7, 0.9, ABOX_Y[1]) },
    { color: '#E5383B', points: flank(-0.7, L.podRear, 0.1, 0.48) },
  ],
  texts: [
    sideText('AUDI', -0.4, 0.97, 0.07, WHITE),
    sideText('REVOLUT', -0.2, mid + 0.06, 0.08, WHITE),
    sideText('CASTROL', 0.4, mid + 0.14, 0.045, WHITE),
    sideText('SPOTIFY', -1.2, 0.3, 0.04, WHITE),
    wingText('REVOLUT', -2.17, 0, 0.08, WHITE),
  ],
  plateTexts: { rear: [plateText('AUDI', -2.2, 0.72, 0.09, WHITE)] },
};

const CADILLAC: Livery = {
  id: 'cadillac-2026',
  name: 'Cadillac',
  era: 'gen2026',
  team: 'Cadillac Formula 1 Team',
  price: 300,
  primary: '#E9EAEC',
  secondary: '#C8102E',
  glow: '#C8102E',
  sidepod: 'compact',
  finish: 'gloss',
  parts: parts(BLACK, BLACK, '#111114'),
  top: [
    { color: BLACK, points: stripe(-1.0, L.tail - 0.05, 0.17) },
    { color: BLACK, points: noseCapShape(2.5, 2.85, 0.08) },
    ...podBand(BLACK, 0.8, -0.4, 0.14, 0.2),
  ],
  side: [
    { color: BLACK, points: flank(L.podFront, L.podRear, 0.06, 0.2) },
    { color: BLACK, points: flank(-0.6, L.podRear, 0.2, 0.5) },
  ],
  texts: [
    sideText('TWG', -0.2, mid + 0.14, 0.2, BLACK),
    sideText('JIM BEAM', 0.0, 0.13, 0.045, WHITE),
    sideText('CADILLAC', 0.5, mid + 0.2, 0.045, BLACK),
    topText('CADILLAC', 1.9, 0, 0.06, BLACK),
    wingText('IFS', -2.17, 0, 0.09, WHITE),
  ],
  plateTexts: { rear: [plateText('IFS', -2.2, 0.72, 0.1, WHITE)] },
};

export const LIVERIES_GEN2026: readonly Livery[] = [FERRARI, MERCEDES, MCLAREN, REDBULL, RACINGBULLS, ALPINE, ASTONMARTIN, WILLIAMS, HAAS, AUDI, CADILLAC];
