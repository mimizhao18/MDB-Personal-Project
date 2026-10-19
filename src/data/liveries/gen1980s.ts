import { BLACK, CARBON, WHITE, ellipse, flank, noseCapShape, plateText, podBand, sideText, stripe, topText, wingText, layout } from '../liveryHelpers';
import type { Livery } from '../liveryTypes';

// 1980s (turbo era): the most famous liveries. Shapes are in the car's own measurements (see src/data/cars/gen1980s.ts).

const L = layout('gen1980s');
const mid = L.podMid;
const solidParts = (c: string, flap = c, endplate = c) => ({ wing: c, flap, endplate, floor: CARBON });

const FERRARI: Livery = {
  id: 'ferrari-1980s',
  name: 'Ferrari',
  era: 'gen1980s',
  team: 'Scuderia Ferrari',
  price: 30,
  primary: '#D40000',
  secondary: '#FFFFFF',
  sidepod: 'turbo',
  finish: 'gloss',
  parts: { wing: CARBON, flap: CARBON, endplate: CARBON, floor: CARBON },
  top: [
    { color: WHITE, points: stripe(1.4, 2.45, 0.03) },
    { color: '#FFD800', points: noseCapShape(2.2, 2.45, 0.05) },
  ],
  side: [
    // the yellow Ferrari shield on the nose, the white Marlboro and light-blue Fiat labels, the yellow Agip label
    { color: '#FFD800', points: ellipse(1.15, 0.45, 0.07, 0.085) },
    { color: WHITE, points: flank(0.95, 0.4, 0.58, 0.67) },
    { color: '#58A6E8', points: flank(0.3, -0.25, 0.6, 0.69) },
    { color: '#FFD800', points: flank(-0.95, -1.35, 0.2, 0.42) },
  ],
  texts: [
    topText('AGIP', 1.75, 0, 0.06, '#FFD800'),
    sideText('MARLBORO', 0.68, 0.625, 0.05, '#D40000'),
    sideText('FIAT', 0.03, 0.645, 0.06, WHITE),
    sideText('LONGINES', 0.1, mid - 0.04, 0.06, WHITE),
    sideText('AGIP', -1.15, 0.31, 0.07, BLACK),
    sideText('MARELLI', -0.7, mid + 0.02, 0.05, WHITE),
  ],
  plateTexts: { rear: [plateText('MARLBORO', -1.62, 0.8, 0.08, WHITE)], front: [plateText('GOODYEAR', 2.27, 0.25, 0.05, WHITE)] },
};

const MCLAREN: Livery = {
  id: 'mclaren-1980s',
  name: 'McLaren',
  era: 'gen1980s',
  team: 'Marlboro McLaren International',
  price: 60,
  primary: '#F2F2F2',
  secondary: '#E10600',
  glow: '#E10600',
  sidepod: 'turbo',
  finish: 'gloss',
  parts: solidParts('#E10600', '#F2F2F2', '#E10600'),
  frontParts: { wing: '#F2F2F2', flap: '#F2F2F2', endplate: '#F2F2F2' },
  top: [
    // the red cowl in front of the cockpit and the red of the rear body
    { color: '#E10600', points: stripe(0.5, 1.3, 0.23) },
    { color: '#E10600', points: stripe(-1.4, -1.85, 0.2) },
    ...podBand('#E10600', -1.1, -1.7, 0.2, 0.5),
  ],
  side: [
    // the red wedge ahead of the cockpit and the red lower rear body with its diagonal edge, as on the MP4/4
    { color: '#E10600', points: [[0.44, 0.72], [1.12, 0.66], [1.12, 0.54], [0.44, 0.6]] },
    { color: '#E10600', points: [[-1.75, 0.62], [-1.3, 0.72], [-0.28, 0.22], [-0.28, 0.06], [-1.75, 0.06]] },
  ],
  texts: [
    topText('HONDA', 1.0, 0, 0.07, WHITE),
    sideText('MARLBORO', -0.35, mid + 0.14, 0.09, '#E10600'),
    sideText('SHELL', 0.3, mid + 0.04, 0.07, '#E10600'),
    sideText('TAG', -1.2, mid + 0.02, 0.07, '#1B1B1B'),
    topText('11', 1.65, 0, 0.12, '#E10600'),
    wingText('MARLBORO', -1.62, 0, 0.08, WHITE),
  ],
  plateTexts: { rear: [plateText('HONDA', -1.62, 0.8, 0.1, WHITE)], front: [plateText('GOODYEAR', 2.27, 0.25, 0.05, BLACK)] },
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
  parts: { wing: BLACK, flap: BLACK, endplate: '#D4AF37', floor: CARBON },
  top: [
    { color: '#D4AF37', points: stripe(2.0, 2.5, 0.07) },
    { color: '#D4AF37', points: stripe(2.4, -1.85, 0.012) },
    ...podBand('#D4AF37', 0.6, -1.2, 0.34, 0.37),
  ],
  side: [{ color: '#D4AF37', points: flank(0.7, -1.75, 0.24, 0.26) }],
  texts: [
    sideText('JOHN PLAYER SPECIAL', -0.45, mid + 0.14, 0.06, '#D4AF37'),
    sideText('LOTUS', 0.3, mid + 0.02, 0.08, '#D4AF37'),
    topText('JPS', 1.7, 0, 0.09, '#D4AF37'),
    wingText('JPS', -1.62, 0, 0.1, '#D4AF37'),
  ],
  plateTexts: { rear: [plateText('LOTUS', -1.62, 0.8, 0.1, BLACK)] },
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
  parts: solidParts('#F2F2F2', '#F2F2F2', '#F2F2F2'),
  frontParts: { wing: '#17171A', flap: '#17171A', endplate: '#FFD800' },
  top: [
    // white car, a navy nose, the yellow Tactel cowl around the cockpit
    { color: '#1B2F7A', points: noseCapShape(1.0, 2.45, 0.17) },
    { color: '#1B2F7A', points: stripe(0.8, 1.3, 0.2) },
    { color: '#FFD800', points: stripe(0.3, 1.0, 0.2) },
    { color: '#1B2F7A', points: stripe(0.8, -0.7, 0.03) },
  ],
  side: [
    { color: '#1B2F7A', points: [[0.5, 0.1], [0.5, 0.58], [2.1, 0.42], [2.1, 0.16]] },
    { color: '#FFD800', points: [[0.25, 0.45], [0.25, 0.72], [1.0, 0.64], [1.0, 0.45]] },
  ],
  texts: [
    sideText('MOBIL 1', 1.55, 0.3, 0.07, WHITE),
    sideText('HONDA', 1.0, 0.25, 0.05, WHITE),
    sideText('TACTEL', 0.65, 0.56, 0.05, '#1B2F7A'),
    sideText('CANON', -0.5, mid + 0.14, 0.1, '#E10600'),
    sideText('CALMA', -0.1, mid + 0.02, 0.04, '#1B2F7A'),
    topText('CANON', 1.9, 0, 0.06, WHITE),
    wingText('CANON', -1.62, 0, 0.13, '#E10600'),
  ],
  plateTexts: { rear: [plateText('HONDA', -1.62, 0.8, 0.1, '#1B2F7A')], front: [plateText('TACTEL', 2.27, 0.25, 0.06, '#1B2F7A')] },
};

const BENETTON: Livery = {
  id: 'benetton-1980s',
  name: 'Benetton',
  era: 'gen1980s',
  team: 'Benetton Formula',
  price: 150,
  primary: '#1F4FB3',
  secondary: '#F2F2F2',
  glow: '#2F6BE0',
  sidepod: 'turbo',
  finish: 'gloss',
  parts: solidParts('#1F4FB3', '#F2F2F2', '#1F4FB3'),
  top: [
    { color: '#F2F2F2', points: noseCapShape(2.0, 2.45, 0.1) },
    { color: '#E10600', points: stripe(1.2, 1.5, 0.2) },
    { color: '#1B9E4B', points: stripe(1.5, 1.8, 0.2) },
    { color: '#FFD800', points: stripe(1.8, 2.0, 0.18) },
    ...podBand('#F2F2F2', 0.6, -0.8, 0.2, 0.34),
  ],
  side: [{ color: '#F2F2F2', points: flank(0.7, -1.75, 0.12, 0.2) }],
  texts: [
    sideText('BENETTON', -0.35, mid + 0.18, 0.1, '#1F4FB3'),
    sideText('BMW', 0.35, mid + 0.14, 0.08, WHITE),
    sideText('SKY', -1.3, 0.6, 0.06, WHITE),
    topText('BENETTON', 1.0, 0, 0.07, WHITE),
    wingText('BENETTON', -1.62, 0, 0.08, WHITE),
  ],
  plateTexts: { rear: [plateText('BMW', -1.62, 0.8, 0.1, WHITE)] },
};

const CAMEL: Livery = {
  id: 'lotuscamel-1980s',
  name: 'Lotus Camel',
  era: 'gen1980s',
  team: 'Camel Team Lotus Honda',
  price: 180,
  primary: '#FFD500',
  secondary: '#0033A0',
  glow: '#FFD500',
  sidepod: 'turbo',
  finish: 'gloss',
  parts: solidParts('#FFD500', '#FFD500', '#FFD500'),
  top: [
    // all yellow with blue lettering and the blue camel on the nose
    { color: '#0033A0', points: ellipse(1.6, 0, 0.12, 0.08) },
  ],
  side: [
    { color: '#0033A0', points: ellipse(0.15, 0.78, 0.07, 0.06) },
    { color: '#0033A0', points: [[0.2, 0.2], [0.2, 0.23], [-1.5, 0.23], [-1.5, 0.2]] },
  ],
  texts: [
    topText('LOTUS', 2.0, 0, 0.09, '#0033A0'),
    topText('ELF', 1.3, 0, 0.07, '#0033A0'),
    topText('LOTUS', 0.4, 0.0, 0.1, '#0033A0'),
    sideText('LOTUS', -0.15, mid + 0.14, 0.13, '#0033A0'),
    sideText('HONDA', 0.55, mid + 0.14, 0.07, '#0033A0'),
    sideText('CAMEL', -1.1, 0.6, 0.06, '#0033A0'),
    wingText('LOTUS', -1.62, 0, 0.13, '#0033A0'),
  ],
  plateTexts: { rear: [plateText('12', -1.62, 0.8, 0.14, '#0033A0')], front: [plateText('LOTUS', 2.28, 0.2, 0.06, '#0033A0')] },
};

const BRABHAM: Livery = {
  id: 'brabham-1980s',
  name: 'Brabham',
  era: 'gen1980s',
  team: 'Parmalat Brabham BMW',
  price: 210,
  primary: '#F2F2F2',
  secondary: '#1A2A6E',
  glow: '#2F6BE0',
  sidepod: 'turbo',
  finish: 'gloss',
  parts: solidParts('#1A2A6E', '#F2F2F2', '#1A2A6E'),
  top: [
    { color: '#1A2A6E', points: noseCapShape(1.9, 2.45, 0.11) },
    { color: '#1A2A6E', points: stripe(0.4, -1.85, 0.1) },
    ...podBand('#1A2A6E', 0.6, -1.4, 0.2, 0.46),
  ],
  side: [{ color: '#1A2A6E', points: flank(0.7, -1.75, 0.06, 0.2) }],
  texts: [
    sideText('PARMALAT', -0.4, mid + 0.14, 0.09, WHITE),
    sideText('BMW', 0.35, mid + 0.12, 0.09, '#1A2A6E'),
    sideText('BRABHAM', -1.3, 0.62, 0.06, '#1A2A6E'),
    topText('PARMALAT', 1.5, 0, 0.06, '#1A2A6E'),
    wingText('OLIVETTI', -1.62, 0, 0.09, WHITE),
  ],
  plateTexts: { rear: [plateText('BMW', -1.62, 0.8, 0.1, WHITE)], front: [plateText('PIRELLI', 2.27, 0.25, 0.05, WHITE)] },
};

export const LIVERIES_GEN1980S: readonly Livery[] = [FERRARI, MCLAREN, LOTUS, WILLIAMS, BENETTON, CAMEL, BRABHAM];
