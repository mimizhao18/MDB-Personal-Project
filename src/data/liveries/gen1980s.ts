import { BLACK, CARBON, WHITE, both, ellipse, flank, noseCapShape, plateText, podBand, sideText, stripe, topText, wingText, layout } from '../liveryHelpers';
import type { Livery } from '../liveryTypes';

// 1980s (turbo era): the most famous liveries, drawn from the photos in reference/gen1980s/liveries/. Shapes are in
// the car's own measurements (see src/data/cars/gen1980s.ts): nose 2.45, front axle 1.43, sidepods 0.7 to -1.7,
// rear axle -1.43, tail -1.85; floor 0.06, sidepod top about 0.54, cockpit rim 0.73, roll hoop 0.94.

const L = layout('gen1980s');
const solidParts = (c: string, flap = c, endplate = c) => ({ wing: c, flap, endplate, floor: CARBON });

const FERRARI: Livery = {
  id: 'ferrari-1980s',
  name: 'Ferrari',
  era: 'gen1980s',
  team: 'Scuderia Ferrari',
  price: 30,
  primary: '#D8281C',
  secondary: '#FFFFFF',
  sidepod: 'turbo',
  finish: 'gloss',
  helmet: '#F4F4F4',
  parts: { wing: CARBON, flap: CARBON, endplate: CARBON, floor: CARBON },
  top: [
    // the yellow shield on the nose, a small Agip badge, the white number on the nose
    { color: '#FFD800', points: ellipse(0.9, 0.17, 0.04, 0.05) },
    { color: WHITE, points: stripe(1.65, 1.95, 0.1) },
  ],
  side: [
    // the yellow shield on the cockpit side, the white Fiat label on the engine cover and the Agip badge on the nose
    { color: '#FFD800', points: ellipse(0.55, 0.62, 0.05, 0.065) },
    { color: WHITE, points: flank(-0.2, -0.55, 0.62, 0.7) },
    { color: '#FFD800', points: ellipse(1.1, 0.4, 0.05, 0.05) },
  ],
  texts: [
    sideText('MARLBORO', 0.75, 0.66, 0.035, WHITE),
    sideText('FIAT', -0.37, 0.66, 0.05, '#1B2F7A'),
    sideText('ENICHEM', 1.55, 0.32, 0.045, WHITE),
    sideText('28', 1.95, 0.25, 0.08, WHITE),
    sideText('MAGNETI MARELLI', 1.2, 0.22, 0.025, WHITE),
    sideText('LONGINES', -0.1, 0.4, 0.045, WHITE),
    sideText('AGIP', -0.9, 0.4, 0.06, WHITE),
    topText('AGIP', 1.3, 0, 0.06, '#FFD800'),
    topText('28', 1.8, 0, 0.09, '#D8281C'),
    wingText('GOODYEAR', -1.62, 0, 0.07, WHITE),
    wingText('GOODYEAR', 2.35, 0.5, 0.05, WHITE, 'front'),
    wingText('GOODYEAR', 2.35, -0.5, 0.05, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('GOODYEAR', -1.6, 0.86, 0.06, WHITE), plateText('AGIP', -1.6, 0.6, 0.08, '#FFD800')], front: [plateText('DIGITAL', 2.27, 0.2, 0.045, WHITE)] },
};

const MCLAREN: Livery = {
  id: 'mclaren-1980s',
  name: 'McLaren',
  era: 'gen1980s',
  team: 'Marlboro McLaren International',
  price: 60,
  primary: '#F4F4F4',
  secondary: '#FF3B1F',
  glow: '#FF3B1F',
  sidepod: 'turbo',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: solidParts('#FF3B1F', '#FF3B1F', '#FF3B1F'),
  frontParts: { wing: '#F4F4F4', flap: '#F4F4F4', endplate: '#F4F4F4' },
  top: [
    // the red cowl in front of the cockpit (a chevron pointing back), the red tail of the engine cover
    { color: '#FF3B1F', points: [[1.3, 0.1], [1.3, -0.1], [0.5, -0.25], [0.3, -0.25], [0.3, 0.25], [0.5, 0.25]] },
    { color: '#FF3B1F', points: stripe(-1.3, L.tail - 0.05, 0.2) },
    ...podBand('#FF3B1F', -1.1, -1.7, 0.2, 0.5),
  ],
  side: [
    // the red sweep from the cockpit down to the front of the sidepod, the red lower rear body with its diagonal edge
    { color: '#FF3B1F', points: [[0.5, 0.74], [1.3, 0.56], [1.3, 0.3], [0.7, 0.3], [0.3, 0.6]] },
    { color: '#FF3B1F', points: [[-1.85, 0.6], [-1.3, 0.72], [-0.3, 0.2], [-0.3, 0.06], [-1.85, 0.06]] },
    { color: '#FF3B1F', points: flank(0.7, -0.3, 0.06, 0.12) },
  ],
  texts: [
    sideText('MARLBORO', -0.1, 0.66, 0.045, '#FF3B1F'),
    sideText('SHELL', 0.15, 0.36, 0.09, BLACK),
    sideText('MARLBORO', -0.75, 0.42, 0.06, WHITE),
    sideText('HONDA', 1.7, 0.3, 0.04, BLACK),
    sideText('12', 2.0, 0.2, 0.07, '#FF3B1F'),
    sideText('TAG', -1.0, 0.34, 0.04, BLACK),
    topText('MARLBORO', -0.6, 0, 0.07, '#FF3B1F'),
    topText('HONDA', 1.7, 0, 0.055, BLACK),
    topText('12', 2.05, 0, 0.09, '#FF3B1F'),
    wingText('MARLBORO', -1.62, 0, 0.08, WHITE),
    wingText('SHELL', 2.35, 0.5, 0.07, BLACK, 'front'),
    wingText('SHELL', 2.35, -0.5, 0.07, BLACK, 'front'),
  ],
  plateTexts: { rear: [plateText('12', -1.6, 0.8, 0.12, WHITE), plateText('SHOWA', -1.6, 0.52, 0.045, WHITE)], front: [plateText('GOODYEAR', 2.28, 0.2, 0.05, BLACK)] },
};

const LOTUS: Livery = {
  id: 'lotus-1980s',
  name: 'Lotus',
  era: 'gen1980s',
  team: 'John Player Special Team Lotus',
  price: 90,
  primary: '#0E0E10',
  secondary: '#D4AF37',
  sidepod: 'turbo',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: { wing: BLACK, flap: BLACK, endplate: BLACK, floor: CARBON },
  top: [
    // gold pinstripes along the nose and over the sidepods
    { color: '#D4AF37', points: stripe(2.4, -1.85, 0.012) },
    ...podBand('#D4AF37', 0.7, -1.5, 0.36, 0.38),
    ...podBand('#D4AF37', 0.7, -1.5, 0.2, 0.215),
  ],
  side: [
    { color: '#D4AF37', points: flank(0.7, -1.7, 0.5, 0.515) },
    { color: '#D4AF37', points: flank(0.7, -1.7, 0.12, 0.135) },
    { color: '#D4AF37', points: [[2.4, 0.2], [2.4, 0.215], [0.9, 0.52], [0.9, 0.505]] },
  ],
  texts: [
    sideText('JOHN PLAYER SPECIAL', 0.0, 0.64, 0.05, '#D4AF37'),
    sideText('DE LONGHI', 0.1, 0.32, 0.075, '#D4AF37'),
    sideText('RENAULT', -0.8, 0.6, 0.045, '#D4AF37'),
    sideText('12', -0.9, 0.3, 0.09, '#D4AF37'),
    sideText('ELF', 1.6, 0.3, 0.05, '#D4AF37'),
    sideText('JPS', 2.0, 0.22, 0.05, '#D4AF37'),
    topText('JPS', 1.6, 0, 0.09, '#D4AF37'),
    topText('RENAULT', -0.8, 0, 0.055, '#D4AF37'),
    wingText('JOHN PLAYER SPECIAL', -1.62, 0, 0.05, '#D4AF37'),
    wingText('JPS', 2.35, 0.5, 0.07, '#D4AF37', 'front'),
    wingText('JPS', 2.35, -0.5, 0.07, '#D4AF37', 'front'),
  ],
  plateTexts: { rear: [plateText('ELF', -1.6, 0.76, 0.1, '#D4AF37'), plateText('GOODYEAR', -1.6, 0.56, 0.045, '#D4AF37')], front: [plateText('JPS', 2.28, 0.2, 0.07, '#D4AF37')] },
};

const WILLIAMS: Livery = {
  id: 'williams-1980s',
  name: 'Williams',
  era: 'gen1980s',
  team: 'Canon Williams Honda',
  price: 120,
  primary: '#F2F2F2',
  secondary: '#1B2F7A',
  glow: '#2F5BD6',
  sidepod: 'turbo',
  finish: 'gloss',
  helmet: '#1E3C8A',
  parts: solidParts('#F2F2F2', '#F2F2F2', '#F2F2F2'),
  frontParts: { wing: '#17171A', flap: '#17171A', endplate: '#FFD800' },
  top: [
    // white car; the navy nose, the yellow cowl around the cockpit with the ICI roundel, a navy line along the pods
    { color: '#1B2F7A', points: noseCapShape(0.9, 2.45, 0.2) },
    { color: '#FFD800', points: stripe(0.0, 0.9, 0.25) },
    { color: WHITE, points: ellipse(0.7, 0, 0.09, 0.06) },
    ...podBand('#1B2F7A', 0.7, -1.5, 0.4, 0.44),
  ],
  side: [
    // the navy nose flank, the yellow cowl, the navy band along the top of the sidepod
    { color: '#1B2F7A', points: [[0.4, 0.1], [0.4, 0.6], [2.45, 0.3], [2.45, 0.14]] },
    { color: '#FFD800', points: [[0.0, 0.5], [0.0, 0.74], [0.9, 0.7], [0.9, 0.5]] },
    { color: '#1B2F7A', points: flank(0.7, -1.7, 0.48, 0.52) },
  ],
  texts: [
    sideText('MOBIL 1', 1.75, 0.3, 0.07, WHITE),
    sideText('HONDA', 1.15, 0.36, 0.045, WHITE),
    sideText('5', 2.1, 0.22, 0.07, '#E10600'),
    sideText('TACTEL', 0.45, 0.58, 0.045, '#1B2F7A'),
    sideText('CANON', -0.5, 0.3, 0.1, '#E10600'),
    sideText('DENIM', -1.1, 0.36, 0.04, BLACK),
    sideText('CALMA', -0.3, 0.56, 0.035, '#1B2F7A'),
    topText('ICI', 0.7, 0, 0.05, '#1B2F7A'),
    topText('MOBIL 1', 1.6, 0, 0.06, WHITE),
    topText('5', 2.0, 0, 0.09, '#E10600'),
    wingText('CANON', -1.62, 0, 0.12, '#E10600'),
    wingText('CANON', 2.35, 0.5, 0.07, '#E10600', 'front'),
    wingText('CANON', 2.35, -0.5, 0.07, '#E10600', 'front'),
  ],
  plateTexts: { rear: [plateText('HONDA', -1.6, 0.8, 0.08, '#1B2F7A'), plateText('MOBIL', -1.6, 0.56, 0.06, '#E10600')], front: [plateText('TACTEL', 2.28, 0.2, 0.055, '#1B2F7A')] },
};

const BENETTON: Livery = {
  id: 'benetton-1980s',
  name: 'Benetton',
  era: 'gen1980s',
  team: 'Benetton Formula',
  price: 150,
  primary: '#2DB4A0',
  secondary: '#F2F2F2',
  glow: '#2DB4A0',
  sidepod: 'turbo',
  finish: 'gloss',
  helmet: '#F4F4F4',
  parts: solidParts(BLACK, BLACK, BLACK),
  top: [
    // the white engine cover and rear of the sidepods with the coloured brush strokes, white rear pod tops
    { color: WHITE, points: stripe(-0.1, L.tail - 0.05, 0.3) },
    ...podBand(WHITE, -0.4, -1.7, 0.2, 0.55),
    { color: '#E10600', points: [[-0.2, 0.1], [-0.9, 0.14], [-0.9, 0.1], [-0.2, 0.06]] },
    { color: '#FFD800', points: [[-0.3, 0.02], [-1.0, 0.06], [-1.0, 0.02], [-0.3, -0.02]] },
    { color: '#1F7AE0', points: [[-0.2, -0.06], [-0.9, -0.02], [-0.9, -0.06], [-0.2, -0.1]] },
    { color: '#1B9E4B', points: [[-0.3, -0.14], [-1.0, -0.1], [-1.0, -0.14], [-0.3, -0.18]] },
  ],
  side: [
    // the white rear sidepod with the Sisley lettering and the red Riello box, white engine cover with streaks
    { color: WHITE, points: [[-0.4, 0.06], [-0.4, 0.74], [-1.85, 0.6], [-1.85, 0.06]] },
    { color: '#E10600', points: flank(-0.9, -1.3, 0.14, 0.3) },
    { color: '#E10600', points: [[-0.5, 0.66], [-1.2, 0.62], [-1.2, 0.6], [-0.5, 0.63]] },
    { color: '#FFD800', points: [[-0.5, 0.6], [-1.2, 0.56], [-1.2, 0.54], [-0.5, 0.57]] },
    { color: '#1F7AE0', points: [[-0.5, 0.54], [-1.2, 0.5], [-1.2, 0.48], [-0.5, 0.51]] },
    { color: '#E10600', points: flank(1.1, 0.75, 0.3, 0.4) },
  ],
  texts: [
    sideText('BENETTON', 0.15, 0.4, 0.07, WHITE),
    sideText('SISLEY', -0.85, 0.4, 0.07, '#2DB4A0'),
    sideText('RIELLO', -1.1, 0.22, 0.05, WHITE),
    sideText('BMW M POWER', -0.9, 0.7, 0.03, BLACK),
    sideText('RIELLO', 0.92, 0.35, 0.04, WHITE),
    sideText('20', 1.9, 0.25, 0.07, WHITE),
    topText('BENETTON', 0.6, 0, 0.065, WHITE),
    topText('BMW', -0.5, 0, 0.05, BLACK),
    topText('20', 2.0, 0, 0.09, WHITE),
    wingText('BENETTON', -1.62, 0, 0.08, WHITE),
    wingText('FLYING TIGERS', 2.35, 0.5, 0.05, WHITE, 'front'),
    wingText('FLYING TIGERS', 2.35, -0.5, 0.05, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('20', -1.6, 0.8, 0.12, WHITE), plateText('PIRELLI', -1.6, 0.52, 0.05, WHITE)], front: [plateText('FLYING TIGERS', 2.28, 0.2, 0.04, WHITE)] },
};

const CAMEL: Livery = {
  id: 'lotuscamel-1980s',
  name: 'Lotus Camel',
  era: 'gen1980s',
  team: 'Camel Team Lotus Honda',
  price: 180,
  primary: '#FFC80A',
  secondary: '#0033A0',
  glow: '#FFC80A',
  sidepod: 'turbo',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: solidParts('#FFC80A', '#FFC80A', '#FFC80A'),
  top: [
    // all yellow with the blue camel on the nose and a blue number on the cowl
    { color: '#0033A0', points: ellipse(1.5, 0, 0.1, 0.06) },
  ],
  side: [
    // the blue camel beside the cockpit, the black DeLonghi box on the lower sidepod
    { color: '#0033A0', points: ellipse(0.75, 0.4, 0.08, 0.05) },
    { color: BLACK, points: flank(-0.1, -0.9, 0.14, 0.26) },
    { color: '#FFC80A', points: flank(-0.14, -0.86, 0.16, 0.24) },
  ],
  texts: [
    sideText('CAMEL', 0.1, 0.42, 0.09, '#0033A0'),
    sideText('DE LONGHI', -0.5, 0.2, 0.055, '#0033A0'),
    sideText('HONDA', -0.9, 0.42, 0.05, '#0033A0'),
    sideText('MICROMAX', 0.45, 0.6, 0.03, '#0033A0'),
    sideText('12', 1.5, 0.3, 0.07, '#0033A0'),
    sideText('CAMEL', 2.0, 0.22, 0.04, '#0033A0'),
    topText('CAMEL', 1.9, 0, 0.065, '#0033A0'),
    topText('LOTUS', 0.6, 0, 0.08, '#0033A0'),
    topText('12', 1.1, 0, 0.09, '#0033A0'),
    wingText('CAMEL', -1.62, 0, 0.12, '#0033A0'),
    wingText('CAMEL', 2.35, 0.5, 0.07, '#0033A0', 'front'),
    wingText('CAMEL', 2.35, -0.5, 0.07, '#0033A0', 'front'),
  ],
  plateTexts: { rear: [plateText('ELF', -1.6, 0.8, 0.1, '#0033A0'), plateText('12', -1.6, 0.54, 0.09, '#0033A0')], front: [plateText('CAMEL', 2.28, 0.2, 0.06, '#0033A0')] },
};

const BRABHAM: Livery = {
  id: 'brabham-1980s',
  name: 'Brabham',
  era: 'gen1980s',
  team: 'Parmalat Brabham BMW',
  price: 210,
  primary: '#1A2A6E',
  secondary: '#F2F2F2',
  glow: '#2F6BE0',
  sidepod: 'turbo',
  finish: 'gloss',
  helmet: '#FFD500',
  parts: solidParts('#F2F2F2', '#F2F2F2', '#F2F2F2'),
  frontParts: { wing: '#1A2A6E', flap: '#1A2A6E', endplate: '#1A2A6E' },
  top: [
    // the white top of the nose and chassis up to the roll hoop, a thin red line down its middle, navy everywhere else
    { color: WHITE, points: [[2.45, 0.05], [2.45, -0.05], [1.0, -0.2], [0.0, -0.25], [0.0, 0.25], [1.0, 0.2]] },
    { color: '#D21F26', points: stripe(0.0, 2.4, 0.006) },
  ],
  side: [
    // the white upper nose and cockpit sides, navy body
    { color: WHITE, points: [[2.45, 0.14], [2.45, 0.2], [1.0, 0.48], [0.0, 0.74], [0.0, 0.6], [1.0, 0.34]] },
  ],
  texts: [
    sideText('PARMALAT', -0.3, 0.4, 0.08, WHITE),
    sideText('PARMALAT', 1.3, 0.4, 0.045, '#1A2A6E'),
    sideText('5', -0.95, 0.4, 0.1, WHITE),
    sideText('BMW', -1.3, 0.56, 0.045, WHITE),
    sideText('SANTAL', 1.9, 0.26, 0.04, WHITE),
    sideText('FILA', 0.4, 0.66, 0.035, '#1A2A6E'),
    topText('PARMALAT', 0.55, 0, 0.045, '#1A2A6E'),
    topText('5', 1.3, 0, 0.08, '#1A2A6E'),
    wingText('PARMALAT', -1.62, 0, 0.09, '#1A2A6E'),
    wingText('SANTAL', 2.35, 0.5, 0.06, WHITE, 'front'),
    wingText('SANTAL', 2.35, -0.5, 0.06, WHITE, 'front'),
  ],
  plateTexts: { rear: [plateText('PARMALAT', -1.6, 0.8, 0.06, '#1A2A6E'), plateText('BMW', -1.6, 0.56, 0.07, '#1A2A6E')], front: [plateText('CASTROL', 2.28, 0.2, 0.05, WHITE)] },
};

export const LIVERIES_GEN1980S: readonly Livery[] = [FERRARI, MCLAREN, LOTUS, WILLIAMS, BENETTON, CAMEL, BRABHAM];
