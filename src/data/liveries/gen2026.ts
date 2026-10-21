import { BLACK, CARBON, WHITE, both, ellipse, flank, noseCapShape, plateText, podBand, sideText, stripe, topText, wingText, layout } from '../liveryHelpers';
import type { Livery } from '../liveryTypes';

// 2026: every team on the grid, drawn from the 2026 Chinese GP photos (reference/gen2026/liveries/). Shapes are in
// the car's own measurements (see src/data/cars/gen2026.ts): nose 2.85, front axle 1.7, sidepods 0.75 to -1.85,
// rear axle -1.7, tail -2.2; floor edge 0.06 to 0.16, sidepod top about 0.55, engine cover top 0.86.

const L = layout('gen2026');
const parts = (wing: string, flap = wing, endplate = wing, halo?: string) => ({ wing, flap, endplate, floor: CARBON, ...(halo ? { halo } : {}) });
const AIRBOX = [0.08, -1.2] as const; // along the car, where the airbox stands
const ABOX_Y = [0.6, 0.93] as const; // and how high
/** The black lower sidepod and floor edge most teams run (bare carbon). */
const lowerPod = (top = 0.2, color = BLACK) => ({ color, points: flank(L.podFront, L.podRear, 0.06, top) });
/** The upper flank of the engine cover, from the airbox back to the tail. */
const coverFlank = (color: string, y0 = 0.54) => ({ color, points: [[0.1, y0], [0.1, 0.93], [-0.5, 0.9], [-1.1, 0.8], [-2.1, 0.46], [-2.1, 0.38], [-1.1, y0]] as const });

const FERRARI: Livery = {
  id: 'ferrari-2026',
  name: 'Ferrari',
  era: 'gen2026',
  team: 'Scuderia Ferrari HP',
  price: 100,
  primary: '#D40000',
  secondary: '#FFFFFF',
  sidepod: 'compact',
  finish: 'gloss',
  helmet: '#D40000',
  parts: parts(CARBON, '#D40000', CARBON),
  frontParts: { wing: CARBON, flap: CARBON, endplate: CARBON },
  top: [
    // the white airbox and engine cover with the blue HP, black tail, the yellow shield on the nose
    { color: WHITE, points: stripe(0.1, -1.1, 0.2) },
    { color: BLACK, points: stripe(-1.7, L.tail - 0.05, 0.14) },
    { color: '#FFD200', points: ellipse(2.5, 0, 0.05, 0.035) },
  ],
  side: [
    // the white engine cover flank, black floor edge, the yellow Shell roundel
    coverFlank(WHITE, 0.6),
    lowerPod(0.2),
    { color: '#FFD200', points: ellipse(0.0, 0.33, 0.13, 0.11) },
  ],
  texts: [
    sideText('HP', -0.55, 0.74, 0.15, '#0096D6'),
    sideText('SHELL', 0.0, 0.33, 0.045, '#D40000'),
    sideText('CEVA', -0.45, 0.33, 0.07, WHITE),
    sideText('UNICREDIT', -1.3, 0.5, 0.055, WHITE),
    sideText('PUMA', 0.45, 0.48, 0.04, WHITE),
    sideText('RICHARD MILLE', 1.15, 0.42, 0.032, WHITE),
    sideText('IBM', 1.6, 0.36, 0.04, WHITE),
    sideText('UNICREDIT', 2.1, 0.3, 0.03, WHITE),
    topText('HP', -0.6, 0, 0.14, '#0096D6'),
    topText('SHELL', 1.6, 0, 0.05, WHITE),
    wingText('V-POWER', -2.15, 0, 0.06, WHITE),
    wingText('UNICREDIT', 2.65, 0.5, 0.055, WHITE, 'front'),
    wingText('UNICREDIT', 2.65, -0.5, 0.055, WHITE, 'front'),
  ],
  wingTop: [{ color: '#D40000', points: [[-2.3, -0.44], [-2.3, 0.44], [-2.34, 0.44], [-2.34, -0.44]] }],
  plateTexts: { front: [plateText('UNICREDIT', 2.6, 0.2, 0.045, WHITE)], rear: [plateText('V-POWER', -2.1, 0.78, 0.06, WHITE), plateText('PERONI', -2.1, 0.64, 0.045, WHITE)] },
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
  finish: 'gloss',
  helmet: '#E8E8E8',
  parts: parts(BLACK),
  top: [
    // black with the teal edge along the sidepods and a thin teal line down the engine cover
    { color: '#00D2BE', points: stripe(0.1, -1.2, 0.012) },
    ...both('#00D2BE', [[0.75, 0.3], [0.5, 0.5], [0.0, 0.56], [-0.6, 0.5], [-0.6, 0.45], [0.0, 0.51], [0.5, 0.44], [0.75, 0.26]]),
    ...both('#9AA0A6', [[-0.3, 0.1], [-0.6, 0.16], [-0.9, 0.1], [-0.6, 0.06]]),
  ],
  side: [
    // the teal and silver swooshes sweeping up the sidepod and along the chassis, silver stars on the engine cover
    { color: '#00D2BE', points: [[0.75, 0.2], [0.75, 0.3], [0.0, 0.4], [-1.0, 0.56], [-1.0, 0.48], [0.0, 0.32]] },
    { color: '#C8CCD0', points: [[0.75, 0.3], [0.75, 0.34], [0.0, 0.44], [-1.0, 0.6], [-1.0, 0.56], [0.0, 0.4]] },
    { color: '#00D2BE', points: [[1.5, 0.3], [1.5, 0.36], [0.8, 0.44], [0.8, 0.38]] },
    { color: '#9AA0A6', points: ellipse(-0.9, 0.72, 0.04, 0.04) },
    { color: '#9AA0A6', points: ellipse(-1.2, 0.66, 0.03, 0.03) },
    { color: '#9AA0A6', points: ellipse(-0.6, 0.8, 0.03, 0.03) },
  ],
  texts: [
    sideText('PETRONAS', -0.4, 0.26, 0.08, WHITE),
    sideText('MICROSOFT', -0.35, 0.82, 0.05, WHITE),
    sideText('TEAMVIEWER', 0.3, 0.52, 0.045, WHITE),
    sideText('SOLERA', -0.5, 0.64, 0.04, WHITE),
    sideText('AMD', 0.7, 0.6, 0.04, WHITE),
    sideText('AMG', 1.2, 0.46, 0.05, WHITE),
    sideText('IWC', 1.55, 0.33, 0.045, WHITE),
    sideText('INEOS', 2.2, 0.28, 0.035, WHITE),
    sideText('SIGNIFY', 0.55, 0.14, 0.035, WHITE),
    topText('INEOS', 1.9, 0, 0.05, WHITE),
    wingText('PETRONAS', -2.15, 0, 0.06, '#00D2BE'),
    wingText('MICROSOFT', 2.65, 0.5, 0.05, WHITE, 'front'),
    wingText('MICROSOFT', 2.65, -0.5, 0.05, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('SNAPDRAGON', -2.1, 0.8, 0.045, WHITE), plateText('CROWDSTRIKE', -2.1, 0.66, 0.04, WHITE)], front: [plateText('MICROSOFT', 2.6, 0.2, 0.04, WHITE)] },
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
  helmet: '#B5E61D',
  parts: parts('#FF8000', '#FF8000', '#FF8000'),
  frontParts: { wing: BLACK, flap: '#FF8000', endplate: BLACK },
  top: [
    // black engine cover flanks and lower body, papaya airbox top, a teal allwin patch behind the airbox
    { color: BLACK, points: stripe(-0.4, L.tail - 0.05, 0.19) },
    { color: '#1AA39A', points: stripe(-0.2, -0.5, 0.11) },
    ...podBand(BLACK, -0.7, -1.85, 0.12, 0.66),
  ],
  side: [
    // the anthracite engine cover flank with Gemini, black lower body with the diagonal cut, the papaya nose and pod top
    coverFlank('#15161A', 0.56),
    { color: '#1AA39A', points: flank(-0.1, -0.5, 0.78, 0.92) },
    { color: BLACK, points: [[0.75, 0.06], [0.75, 0.3], [-0.2, 0.3], [-1.0, 0.5], [-1.85, 0.5], [-1.85, 0.06]] },
    { color: '#FF8000', points: [[-1.2, 0.5], [-0.9, 0.5], [-1.5, 0.3], [-1.85, 0.3], [-1.85, 0.4]] },
  ],
  texts: [
    sideText('GEMINI', -0.9, 0.7, 0.07, WHITE),
    sideText('ALLWIN', -0.3, 0.85, 0.04, WHITE),
    sideText('DELL', -0.9, 0.42, 0.06, WHITE),
    sideText('CLUB AVOLTA', 0.3, 0.44, 0.03, WHITE),
    sideText('CISCO', 0.65, 0.54, 0.035, WHITE),
    sideText('RICHARD MILLE', 1.3, 0.46, 0.032, WHITE),
    sideText('DP WORLD', 1.1, 0.38, 0.035, WHITE),
    sideText('JACK DANIELS', 2.0, 0.3, 0.028, BLACK),
    sideText('WORKDAY', 2.35, 0.14, 0.03, WHITE),
    topText('MASTERCARD', 1.8, 0, 0.045, BLACK),
    wingText('DROPBOX', -2.15, 0, 0.06, BLACK),
    wingText('WORKDAY', 2.65, 0.5, 0.05, WHITE, 'front'),
    wingText('WORKDAY', 2.65, -0.5, 0.05, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('DROPBOX', -2.1, 0.76, 0.06, BLACK), plateText('GROQ', -2.1, 0.62, 0.045, BLACK)], front: [plateText('WORKDAY', 2.6, 0.2, 0.045, WHITE)] },
};

const REDBULL: Livery = {
  id: 'redbull-2026',
  name: 'Red Bull',
  era: 'gen2026',
  team: 'Oracle Red Bull Racing',
  price: 160,
  primary: '#1A1F3C',
  secondary: '#E4002B',
  glow: '#E4002B',
  sidepod: 'compact',
  finish: 'matte',
  helmet: '#FF8A00',
  parts: parts('#1A1F3C', '#1A1F3C', '#1A1F3C', '#1A1F3C'),
  top: [
    // yellow airbox top and nose tip with the red bulls
    { color: '#FFC500', points: stripe(0.1, -0.6, 0.12) },
    { color: '#FFC500', points: noseCapShape(1.6, 2.85, 0.1) },
    { color: '#E4002B', points: ellipse(2.1, 0, 0.18, 0.045) },
  ],
  side: [
    // the yellow airbox with the red bull charging across the engine cover, the yellow nose with its bull, a red floor edge
    { color: '#FFC500', points: flank(AIRBOX[0], -0.55, 0.78, ABOX_Y[1]) },
    { color: '#E4002B', points: ellipse(-0.75, 0.74, 0.32, 0.08) },
    { color: '#FFC500', points: [[1.5, 0.2], [1.5, 0.4], [2.85, 0.28], [2.85, 0.2]] },
    { color: '#E4002B', points: ellipse(2.1, 0.3, 0.25, 0.06) },
    { color: '#E4002B', points: flank(L.podFront, L.podRear, 0.06, 0.1) },
  ],
  texts: [
    sideText('ORACLE', -0.35, 0.3, 0.13, WHITE),
    sideText('RED BULL', -0.75, 0.58, 0.05, '#E4002B'),
    sideText('FORD', -1.35, 0.56, 0.05, WHITE),
    sideText('ROKT', 0.45, 0.6, 0.045, WHITE),
    sideText('CARLYLE', 1.15, 0.44, 0.035, WHITE),
    sideText('1PASSWORD', 1.0, 0.36, 0.03, WHITE),
    sideText('INDEED', 0.4, 0.14, 0.04, WHITE),
    sideText('CLEAR', -1.0, 0.14, 0.035, WHITE),
    wingText('MOBIL 1', -2.15, 0, 0.07, WHITE),
    wingText('MOBIL', 2.65, 0.5, 0.06, WHITE, 'front'),
    wingText('MOBIL', 2.65, -0.5, 0.06, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('MOBIL 1', -2.1, 0.78, 0.07, WHITE), plateText('HEINEKEN', -2.1, 0.62, 0.04, WHITE)], front: [plateText('MOBIL', 2.6, 0.2, 0.05, WHITE)] },
};

const RACINGBULLS: Livery = {
  id: 'racingbulls-2026',
  name: 'Racing Bulls',
  era: 'gen2026',
  team: 'Visa Cash App Racing Bulls F1 Team',
  price: 180,
  primary: '#EEF0F6',
  secondary: '#1F2F7A',
  sidepod: 'compact',
  finish: 'gloss',
  helmet: '#F06BAE',
  parts: parts('#14172B', '#14172B', '#14172B'),
  frontParts: { wing: '#14172B', flap: WHITE, endplate: WHITE },
  top: [
    // white body, a yellow airbox with the red bull, a navy tail, yellow nose
    { color: '#FFC500', points: stripe(0.1, -0.7, 0.13) },
    { color: '#E4002B', points: stripe(-0.3, -0.7, 0.04) },
    { color: '#1F2F7A', points: stripe(-1.1, L.tail - 0.05, 0.19) },
    { color: '#FF9A1F', points: noseCapShape(1.7, 2.85, 0.1) },
  ],
  side: [
    // yellow airbox with the red bull, the navy sweep over the rear of the engine cover and the lower pod, yellow nose
    { color: '#FFC500', points: flank(AIRBOX[0], -0.6, 0.76, ABOX_Y[1]) },
    { color: '#E4002B', points: ellipse(-0.65, 0.76, 0.28, 0.07) },
    { color: '#1F2F7A', points: [[-0.8, 0.54], [-0.4, 0.74], [-1.1, 0.8], [-2.1, 0.46], [-2.1, 0.38], [-1.3, 0.5]] },
    { color: '#1F2F7A', points: [[0.75, 0.06], [0.75, 0.2], [-0.4, 0.34], [-1.85, 0.3], [-1.85, 0.06]] },
    { color: '#FF9A1F', points: [[1.7, 0.2], [1.7, 0.38], [2.85, 0.28], [2.85, 0.2]] },
    { color: '#E4002B', points: ellipse(2.2, 0.29, 0.2, 0.05) },
  ],
  texts: [
    sideText('VISA', -0.3, 0.38, 0.13, '#1F2F7A'),
    sideText('CASH APP', 0.2, 0.52, 0.045, '#00B341'),
    sideText('HUGO', 0.65, 0.5, 0.05, '#E4002B'),
    sideText('RED BULL', -0.55, 0.6, 0.05, '#E4002B'),
    sideText('FORD', -1.3, 0.56, 0.045, WHITE),
    sideText('MOBIL 1', 0.6, 0.4, 0.035, BLACK),
    sideText('VISA', 1.6, 0.34, 0.045, '#1F2F7A'),
    sideText('CASH APP', 2.3, 0.2, 0.03, '#1F2F7A'),
    wingText('VISA', -2.15, 0, 0.08, WHITE),
    wingText('CASH APP', 2.65, 0.5, 0.05, '#1F2F7A', 'front'),
    wingText('CASH APP', 2.65, -0.5, 0.05, '#1F2F7A', 'front'),
  ],
  plateTexts: { rear: [plateText('VISA', -2.1, 0.78, 0.07, WHITE), plateText('MOBIL 1', -2.1, 0.62, 0.045, WHITE)], front: [plateText('CASH APP', 2.6, 0.2, 0.045, '#1F2F7A')] },
};

const ALPINE: Livery = {
  id: 'alpine-2026',
  name: 'Alpine',
  era: 'gen2026',
  team: 'BWT Alpine F1 Team',
  price: 200,
  primary: '#1446B0',
  secondary: '#F06BAE',
  glow: '#F06BAE',
  sidepod: 'compact',
  finish: 'gloss',
  helmet: '#5CD3F0',
  parts: parts(BLACK, BLACK, '#F06BAE', '#F06BAE'),
  frontParts: { wing: BLACK, flap: BLACK, endplate: '#F06BAE' },
  top: [
    // pink airbox and a pink stripe down the engine cover; pink nose tip
    { color: '#F06BAE', points: stripe(0.1, -0.4, 0.12) },
    { color: '#F06BAE', points: stripe(-0.4, -1.4, 0.03) },
    { color: '#F06BAE', points: noseCapShape(2.55, 2.85, 0.07) },
  ],
  side: [
    // the pink BWT panel on the lower sidepod, pink airbox, black floor edge, pink flash on the rear of the cover
    lowerPod(0.14),
    { color: '#F06BAE', points: [[0.5, 0.14], [0.5, 0.38], [-0.3, 0.4], [-1.2, 0.3], [-1.2, 0.14]] },
    { color: '#F06BAE', points: flank(AIRBOX[0], -0.4, 0.8, ABOX_Y[1]) },
    { color: '#F06BAE', points: [[-1.1, 0.56], [-1.4, 0.56], [-1.9, 0.42], [-1.6, 0.42]] },
    { color: '#F06BAE', points: [[2.55, 0.2], [2.85, 0.2], [2.85, 0.3], [2.55, 0.3]] },
  ],
  texts: [
    sideText('BWT', -0.3, 0.27, 0.15, '#1446B0'),
    sideText('ENI', -0.6, 0.72, 0.08, WHITE),
    sideText('MSC', 0.25, 0.46, 0.055, WHITE),
    sideText('MERCADO LIBRE', -0.2, 0.6, 0.03, WHITE),
    sideText('AVATURE', 0.4, 0.58, 0.03, WHITE),
    sideText('DELPHI', -0.5, 0.11, 0.035, WHITE),
    sideText('ALPINE', 1.5, 0.38, 0.045, WHITE),
    sideText('BWT', 2.2, 0.28, 0.035, '#F06BAE'),
    topText('BWT', 1.8, 0, 0.055, '#F06BAE'),
    wingText('ALPINE', -2.15, 0, 0.07, WHITE),
    wingText('BWT', 2.65, 0.5, 0.06, '#F06BAE', 'front'),
    wingText('BWT', 2.65, -0.5, 0.06, '#F06BAE', 'front'),
  ],
  plateTexts: { rear: [plateText('ENI', -2.1, 0.78, 0.09, BLACK), plateText('MSC', -2.1, 0.62, 0.05, WHITE)], front: [plateText('BWT', 2.6, 0.2, 0.06, '#1446B0')] },
};

const ASTONMARTIN: Livery = {
  id: 'astonmartin-2026',
  name: 'Aston Martin',
  era: 'gen2026',
  team: 'Aston Martin Aramco F1 Team',
  price: 220,
  primary: '#0A7A66',
  secondary: '#C9E200',
  sidepod: 'compact',
  finish: 'gloss',
  helmet: '#0A7A66',
  parts: parts('#0A7A66', '#0A7A66', '#0A7A66', '#0A7A66'),
  top: [
    { color: '#C9E200', points: stripe(-0.6, -1.4, 0.02) },
    ...podBand('#C9E200', 0.7, -0.6, 0.3, 0.33),
  ],
  side: [
    // black floor edge, the lime arc over the aramco lettering on the lower sidepod, lime on the engine cover ridge
    lowerPod(0.12),
    { color: '#C9E200', points: [[0.4, 0.42], [0.0, 0.46], [-0.6, 0.44], [-0.6, 0.41], [0.0, 0.43], [0.4, 0.39]] },
    { color: '#C9E200', points: [[0.75, 0.13], [0.75, 0.17], [-0.6, 0.22], [-1.85, 0.42], [-1.85, 0.38], [-0.6, 0.18]] },
    { color: '#C9E200', points: ellipse(1.4, 0.35, 0.08, 0.03) },
  ],
  texts: [
    sideText('ARAMCO', -0.3, 0.28, 0.1, WHITE),
    sideText('MAADEN', -0.6, 0.72, 0.06, WHITE),
    sideText('COREWEAVE', -0.25, 0.84, 0.035, WHITE),
    sideText('COHERE', -0.1, 0.6, 0.045, WHITE),
    sideText('HONDA', -1.25, 0.6, 0.05, WHITE),
    sideText('VALVOLINE', -1.0, 0.5, 0.035, WHITE),
    sideText('BOSS', 0.5, 0.5, 0.04, WHITE),
    sideText('PEPPERSTONE', 1.0, 0.44, 0.03, WHITE),
    sideText('COGNIZANT', 0.3, 0.1, 0.04, WHITE),
    sideText('ASTON MARTIN', 1.4, 0.35, 0.024, '#0A7A66'),
    sideText('NEXGEN', 2.15, 0.3, 0.03, WHITE),
    topText('ARAMCO', 1.9, 0, 0.05, '#C9E200'),
    wingText('ARAMCO', -2.15, 0, 0.08, '#7FD8E8'),
    wingText('ARAMCO', 2.65, 0.5, 0.07, WHITE, 'front'),
    wingText('ARAMCO', 2.65, -0.5, 0.07, WHITE, 'front'),
  ],
  wingTop: [{ color: '#C9E200', points: [[-2.3, -0.44], [-2.3, 0.44], [-2.33, 0.44], [-2.33, -0.44]] }],
  plateTexts: { rear: [plateText('ARM', -2.1, 0.78, 0.07, WHITE), plateText('SERVICENOW', -2.1, 0.62, 0.04, WHITE)], front: [plateText('GLENFIDDICH', 2.6, 0.2, 0.038, WHITE)] },
};

const WILLIAMS: Livery = {
  id: 'williams-2026',
  name: 'Williams',
  era: 'gen2026',
  team: 'Atlassian Williams Racing',
  price: 240,
  primary: '#1A8FE0',
  secondary: '#FFFFFF',
  sidepod: 'compact',
  finish: 'gloss',
  helmet: '#2A6BF0',
  parts: parts(BLACK, BLACK, '#0B2B6A'),
  frontParts: { wing: BLACK, flap: BLACK, endplate: BLACK },
  top: [
    // black engine cover top behind the airbox, a white lower pod panel showing at the edges, black tail
    { color: '#15161A', points: stripe(-0.3, L.tail - 0.05, 0.17) },
    ...podBand(WHITE, 0.5, -0.7, 0.58, 0.64),
  ],
  side: [
    // black floor edge, the white lower sidepod panel with the navy Komatsu, black upper engine cover
    lowerPod(0.1),
    { color: WHITE, points: [[0.5, 0.1], [0.5, 0.3], [-0.4, 0.3], [-1.2, 0.22], [-1.2, 0.1]] },
    { color: '#15161A', points: [[-0.3, 0.6], [-0.3, 0.9], [-1.1, 0.8], [-2.1, 0.46], [-2.1, 0.4], [-1.1, 0.56]] },
    { color: '#C8742A', points: flank(-0.1, -0.4, 0.78, 0.9) },
  ],
  texts: [
    sideText('ATLASSIAN', -0.55, 0.62, 0.075, WHITE),
    sideText('KOMATSU', -0.3, 0.2, 0.075, '#0B2B6A'),
    sideText('BARCLAYS', -0.1, 0.4, 0.045, WHITE),
    sideText('KRAKEN', 0.3, 0.56, 0.035, WHITE),
    sideText('DURACELL', -0.25, 0.84, 0.035, BLACK),
    sideText('STEPHENS', 1.0, 0.38, 0.045, WHITE),
    sideText('BRILLIO', 0.75, 0.5, 0.035, WHITE),
    sideText('GULF', -1.25, 0.32, 0.045, '#E4002B'),
    sideText('KEEPER', 0.6, 0.12, 0.035, WHITE),
    sideText('BW SCORES', 2.2, 0.26, 0.03, WHITE),
    topText('ATLASSIAN', 1.8, 0, 0.045, WHITE),
    wingText('KOMATSU', -2.15, 0, 0.07, WHITE),
    wingText('BW SCORES', 2.65, 0.5, 0.05, WHITE, 'front'),
    wingText('BW SCORES', 2.65, -0.5, 0.05, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('KOMATSU', -2.1, 0.78, 0.06, WHITE), plateText('ESTRELLA GALICIA', -2.1, 0.62, 0.035, WHITE)], front: [plateText('BW SCORES', 2.6, 0.2, 0.04, WHITE)] },
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
  helmet: '#E10600',
  parts: parts('#F2F2F2', '#F2F2F2', '#F2F2F2', WHITE),
  frontParts: { wing: '#F2F2F2', flap: '#E10600', endplate: '#F2F2F2' },
  top: [
    // red airbox, the GR mark on the engine cover, black tail, red nose stripe
    { color: '#E10600', points: stripe(0.1, -0.5, 0.12) },
    { color: BLACK, points: stripe(-1.6, L.tail - 0.05, 0.14) },
    { color: '#E10600', points: stripe(1.9, 2.85, 0.025) },
    ...podBand('#E10600', 0.7, -0.6, 0.4, 0.46),
  ],
  side: [
    // black floor edge, red band along the lower pod, red airbox, a red stripe along the lower nose
    lowerPod(0.14),
    { color: '#E10600', points: flank(L.podFront, -0.9, 0.3, 0.36) },
    { color: '#E10600', points: flank(AIRBOX[0], -0.5, 0.76, ABOX_Y[1]) },
    { color: '#E10600', points: [[1.0, 0.26], [1.0, 0.32], [2.85, 0.22], [2.85, 0.18]] },
    { color: BLACK, points: flank(0.4, -0.4, 0.14, 0.18) },
  ],
  texts: [
    sideText('HAAS', -0.3, 0.24, 0.12, BLACK),
    sideText('GR', -0.75, 0.74, 0.13, '#E10600'),
    sideText('RUCKUS', -0.3, 0.84, 0.035, WHITE),
    sideText('FIX', 0.5, 0.48, 0.045, BLACK),
    sideText('ORION180', 0.95, 0.44, 0.032, BLACK),
    sideText('MPHASIS', 2.1, 0.3, 0.03, '#E10600'),
    sideText('UCHICAGO', 1.6, 0.36, 0.028, BLACK),
    topText('GR', 1.7, 0, 0.07, '#E10600'),
    wingText('HAAS', -2.15, 0, 0.08, BLACK),
    wingText('MPHASIS', 2.65, 0.5, 0.05, '#E10600', 'front'),
    wingText('MPHASIS', 2.65, -0.5, 0.05, '#E10600', 'front'),
  ],
  plateTexts: { rear: [plateText('TGR', -2.1, 0.78, 0.09, BLACK), plateText('HAAS', -2.1, 0.62, 0.05, '#E10600')], front: [plateText('HAAS TOOLING', 2.6, 0.2, 0.035, '#E10600')] },
};

const AUDI: Livery = {
  id: 'audi-2026',
  name: 'Audi',
  era: 'gen2026',
  team: 'Audi Revolut F1 Team',
  price: 280,
  primary: '#6E7278',
  secondary: '#E5383B',
  glow: '#E5383B',
  sidepod: 'compact',
  finish: 'matte',
  helmet: '#E5383B',
  parts: parts(BLACK, BLACK, BLACK),
  frontParts: { wing: '#6E7278', flap: BLACK, endplate: '#6E7278' },
  top: [
    // the black engine cover top with the four rings, a red patch at the back of the sidepods
    { color: '#15161A', points: stripe(-0.1, -1.4, 0.16) },
    ...podBand('#E5383B', -0.8, -1.7, 0.16, 0.5),
    { color: '#E5383B', points: ellipse(0.05, 0, 0.09, 0.09) },
  ],
  side: [
    // the red ring around the airbox mouth, black engine cover flank, the red rear of the sidepod with Revolut
    { color: '#15161A', points: flank(-0.1, -1.4, 0.62, ABOX_Y[1]) },
    { color: '#E5383B', points: ellipse(0.05, 0.78, 0.07, 0.11) },
    { color: '#6E7278', points: ellipse(0.05, 0.78, 0.05, 0.085) },
    { color: '#E5383B', points: [[-0.9, 0.12], [-0.6, 0.46], [-1.0, 0.5], [-1.85, 0.4], [-1.85, 0.12]] },
  ],
  texts: [
    sideText('REVOLUT', -0.7, 0.3, 0.075, WHITE),
    sideText('AUDI', -0.55, 0.74, 0.055, WHITE),
    sideText('BP', -0.9, 0.84, 0.045, '#5BB55A'),
    sideText('GILLETTE', 0.6, 0.62, 0.03, WHITE),
    sideText('VISIT QATAR', 1.2, 0.38, 0.03, WHITE),
    sideText('NINJA ONE', 0.4, 0.14, 0.032, WHITE),
    sideText('R', 1.9, 0.3, 0.06, WHITE),
    sideText('OOOO', 2.3, 0.22, 0.03, '#E5383B'),
    topText('OOOO', 2.3, 0, 0.04, '#E5383B'),
    wingText('REVOLUT', -2.15, 0, 0.065, WHITE),
    wingText('VISIT QATAR', 2.65, 0.5, 0.045, WHITE, 'front'),
    wingText('VISIT QATAR', 2.65, -0.5, 0.045, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('AUDI', -2.1, 0.78, 0.08, WHITE), plateText('REVOLUT', -2.1, 0.62, 0.045, WHITE)], front: [plateText('VISIT QATAR', 2.6, 0.2, 0.035, WHITE)] },
};

const CADILLAC: Livery = {
  id: 'cadillac-2026',
  name: 'Cadillac',
  era: 'gen2026',
  team: 'Cadillac Formula 1 Team',
  price: 300,
  primary: '#E9EAEC',
  secondary: '#111114',
  glow: '#C8102E',
  sidepod: 'compact',
  finish: 'gloss',
  helmet: '#F4F4F4',
  parts: parts('#F2F2F2', '#F2F2F2', '#F2F2F2', WHITE),
  frontParts: { wing: BLACK, flap: '#F2F2F2', endplate: '#F2F2F2' },
  top: [
    // black tail and black engine cover top behind the white airbox, black lower body showing at the pod edges
    { color: BLACK, points: stripe(-0.5, L.tail - 0.05, 0.16) },
    { color: BLACK, points: noseCapShape(1.4, 2.85, 0.14) },
    ...podBand(BLACK, 0.75, -1.85, 0.5, 0.66),
  ],
  side: [
    // black nose and chassis, black lower sidepod, white upper body with the grey chequer fading on the engine cover
    { color: BLACK, points: [[0.75, 0.06], [0.75, 0.6], [1.6, 0.52], [2.85, 0.3], [2.85, 0.14], [1.2, 0.1]] },
    lowerPod(0.22),
    { color: '#9A9DA3', points: flank(-0.9, -1.3, 0.56, 0.7) },
    { color: '#9A9DA3', points: flank(-1.3, -1.7, 0.44, 0.56) },
    { color: BLACK, points: flank(-1.1, -1.5, 0.3, 0.44) },
  ],
  texts: [
    sideText('TWG', -0.5, 0.38, 0.14, BLACK),
    sideText('JIM BEAM', 0.2, 0.14, 0.04, WHITE),
    sideText('CADILLAC', 1.2, 0.42, 0.05, WHITE),
    sideText('CORE SCIENTIFIC', -0.2, 0.64, 0.03, BLACK),
    sideText('CORE SCIENTIFIC', 2.0, 0.26, 0.026, WHITE),
    topText('CADILLAC', -0.6, 0, 0.05, BLACK),
    wingText('IFS', -2.15, 0, 0.08, BLACK),
    wingText('CADILLAC', 2.65, 0.5, 0.05, BLACK, 'front'),
    wingText('CADILLAC', 2.65, -0.5, 0.05, BLACK, 'front'),
  ],
  plateTexts: { rear: [plateText('IFS', -2.1, 0.78, 0.09, BLACK)], front: [plateText('CADILLAC', 2.6, 0.2, 0.04, BLACK)] },
};

export const LIVERIES_GEN2026: readonly Livery[] = [FERRARI, MERCEDES, MCLAREN, REDBULL, RACINGBULLS, ALPINE, ASTONMARTIN, WILLIAMS, HAAS, AUDI, CADILLAC];
