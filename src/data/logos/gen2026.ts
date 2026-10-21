// Sponsors and marks first drawn for the 2026 cars (Chinese GP photos). Simplified vector versions drawn from photos.

import { circle, ellipse, measure, poly, rrect, text, wordmark } from './draw';
import type { Logo } from './types';

const W = '#FFFFFF';

/** HP: the blue disc with the slanted white hp. */
const HP: Logo = {
  id: 'hp',
  name: 'HP',
  size: [100, 100],
  slots: { disc: '#0096D6', main: W },
  shapes: [
    { d: circle(50, 50, 49), fill: 'disc' },
    // h and p as slanted strokes running past the circle's middle, the way the HP mark is drawn
    { d: poly([[30, 20], [39, 20], [30, 80], [21, 80]]) + poly([[34, 48], [52, 44], [48, 80], [40, 80], [43, 54], [33, 56]]), fill: 'main' },
    { d: poly([[58, 44], [67, 44], [58, 96], [49, 96]]) + 'M64 44C80 42 86 52 83 62C80 72 70 80 58 78L60 70C68 71 74 66 75 60C76 54 72 50 63 52Z', fill: 'main' },
  ],
};

/** UniCredit: the red ring mark and the name. */
function unicredit(): Logo {
  const w = measure('UniCredit', { weight: 800 });
  return {
    id: 'unicredit',
    name: 'UniCredit',
    size: [w + 120, 100],
    slots: { main: W, mark: '#E2001A', inner: W },
    shapes: [
      { d: circle(48, 50, 46), fill: 'mark' },
      { d: 'M28 30H40V58C40 66 44 70 48 70C52 70 56 66 56 58V30H68V58C68 74 60 82 48 82C36 82 28 74 28 58Z', fill: 'inner' },
      text('UniCredit', 116, 100, 100, 'main', { weight: 800 }),
    ],
  };
}

/** PUMA with the leaping cat. */
function puma(): Logo {
  const w = measure('PUMA', { weight: 900, condense: 1.05 });
  return {
    id: 'puma',
    name: 'Puma',
    size: [w + 150, 100],
    slots: { main: W },
    shapes: [
      text('PUMA', 0, 100, 100, 'main', { weight: 900, condense: 1.05 }),
      { d: `M${w + 6} 96C${w + 30} 70 ${w + 50} 50 ${w + 64} 44C${w + 80} 36 ${w + 96} 22 ${w + 112} 10C${w + 124} 2 ${w + 140} 4 ${w + 146} 14C${w + 138} 12 ${w + 130} 16 ${w + 126} 22C${w + 120} 34 ${w + 108} 46 ${w + 96} 54C${w + 104} 62 ${w + 108} 76 ${w + 104} 96L${w + 94} 94C${w + 96} 80 ${w + 92} 68 ${w + 82} 62C${w + 66} 66 ${w + 44} 80 ${w + 18} 100Z`, fill: 'main' },
    ],
  };
}

/** IBM: the striped capitals (horizontal stripes cut in the body color when a livery gives one). */
function ibm(): Logo {
  const w = measure('IBM', { weight: 900, condense: 1.25 });
  const cuts = [12, 24, 36, 48, 60, 72, 84].map((y) => rrect(-4, y, w + 8, 5)).join('');
  return {
    id: 'ibm',
    name: 'IBM',
    size: [w, 100],
    slots: { main: W, cut: '#D40000' },
    shapes: [text('IBM', 0, 100, 100, 'main', { weight: 900, condense: 1.25 }), { d: cuts, fill: 'cut', when: 'cut' }],
  };
}

/** The Mercedes W17's flight of silver stars, fading out toward the tail. */
const STARFIELD: Logo = {
  id: 'mercedes-stars',
  name: 'Mercedes (star fade)',
  size: [300, 100],
  slots: { main: '#9AA0A6' },
  shapes: [
    {
      d: Array.from({ length: 22 }, (_, i) => {
        const x = 10 + (i % 11) * 27 + (i >= 11 ? 13 : 0);
        const y = i >= 11 ? 70 : 30;
        const r = 13 * (1 - (i % 11) / 13);
        const pts: [number, number][] = [];
        for (let k = 0; k < 6; k++) {
          const a = (Math.PI / 2) + (k * Math.PI) / 3;
          const rr = k % 2 === 0 ? r : r * 0.22;
          pts.push([x + rr * Math.cos(a), y - rr * Math.sin(a)]);
        }
        return poly(pts);
      }).join(''),
      fill: 'main',
    },
  ],
};

/** Gemini: the name with its four-pointed sparkle before it. */
function gemini(): Logo {
  const w = measure('Gemini', { weight: 600 });
  return {
    id: 'gemini',
    name: 'Google Gemini',
    size: [w + 110, 100],
    slots: { main: W, spark: '#4C8DF6' },
    shapes: [
      { d: 'M46 0C50 30 62 44 92 50C62 56 50 70 46 100C42 70 30 56 0 50C30 44 42 30 46 0Z', fill: 'spark' },
      text('Gemini', 108, 100, 100, 'main', { weight: 600 }),
    ],
  };
}

/** Dropbox: the open box of four diamonds and the name. */
function dropbox(): Logo {
  const w = measure('Dropbox', { weight: 800 });
  const dia = (cx: number, cy: number) => poly([[cx, cy - 18], [cx + 24, cy - 2], [cx, cy + 14], [cx - 24, cy - 2]]);
  return {
    id: 'dropbox',
    name: 'Dropbox',
    size: [w + 120, 100],
    slots: { main: '#1E1E1E', mark: '#1E1E1E' },
    shapes: [{ d: dia(28, 26) + dia(76, 26) + dia(28, 58) + dia(76, 58) + dia(52, 86), fill: 'mark' }, text('Dropbox', 116, 92, 82, 'main', { weight: 800 })],
  };
}

/** Ford: the name in script in the blue oval with its silver edge. */
const FORD: Logo = {
  id: 'ford',
  name: 'Ford',
  size: [200, 90],
  slots: { oval: '#133A7C', edge: '#C8CCD2', main: W },
  shapes: [{ d: ellipse(100, 45, 99, 44), fill: 'edge' }, { d: ellipse(100, 45, 92, 38), fill: 'oval' }, text('Ford', 100, 64, 44, 'main', { weight: 800, align: 'center', slant: 12 })],
};

/** Visa: the blue italic capitals. */
const VISA = wordmark('visa', 'Visa', 'VISA', '#1A1F71', { weight: 900, slant: 14, condense: 1.05 });

/** Cash App: the green square with its $ and the name. */
function cashapp(): Logo {
  const w = measure('Cash App', { weight: 800 });
  return {
    id: 'cash-app',
    name: 'Cash App',
    size: [w + 120, 100],
    slots: { main: '#1A1F71', box: '#00D632', sign: W },
    shapes: [{ d: rrect(0, 0, 100, 100, 24), fill: 'box' }, text('$', 50, 82, 64, 'sign', { weight: 900, align: 'center' }), text('Cash App', 120, 92, 82, 'main', { weight: 800 })],
  };
}

/** eni: the yellow six-legged dog breathing fire, beside the name. */
function eni(): Logo {
  const w = measure('eni', { weight: 900 });
  return {
    id: 'eni',
    name: 'Eni',
    size: [w + 140, 110],
    slots: { main: W, box: '#FFD100', dog: '#1E1E1E', fire: '#E2001A' },
    shapes: [
      text('eni', 0, 100, 100, 'main', { weight: 900 }),
      { d: rrect(w + 20, 0, 120, 110, 6), fill: 'box' },
      { d: `M${w + 40} 70L${w + 60} 50L${w + 100} 50L${w + 112} 36L${w + 122} 40L${w + 116} 56L${w + 112} 78L${w + 104} 78L${w + 102} 62L${w + 92} 62L${w + 92} 90L${w + 84} 90L${w + 84} 64L${w + 74} 64L${w + 72} 90L${w + 64} 90L${w + 64} 64L${w + 56} 64L${w + 50} 90L${w + 42} 90Z`, fill: 'dog' },
      { d: `M${w + 122} 40L${w + 136} 30L${w + 132} 44L${w + 138} 50L${w + 124} 50Z`, fill: 'fire' },
    ],
  };
}

/** MSC: the cruise line's crest letters. */
const MSC = wordmark('msc', 'MSC', 'MSC', W, { weight: 900, tracking: 6 });

/** Atlassian: the blue sail and the name. */
function atlassian(): Logo {
  const w = measure('ATLASSIAN', { weight: 800, tracking: 4 });
  return {
    id: 'atlassian',
    name: 'Atlassian',
    size: [w + 110, 100],
    slots: { main: W, mark: W },
    shapes: [
      { d: 'M30 46C36 44 40 46 44 54L62 96L56 100H6C2 100 0 96 2 92L22 50C24 48 26 46 30 46Z M48 2C52 0 56 2 58 6L96 92C98 96 96 100 90 100H72C70 100 68 98 66 96L44 46C38 32 40 16 48 2Z', fill: 'mark' },
      text('ATLASSIAN', 110, 100, 100, 'main', { weight: 800, tracking: 4 }),
    ],
  };
}

/** Komatsu: navy capitals with the apostrophe-like mark (white letters in a navy box on the rear wing). */
const KOMATSU = wordmark('komatsu', 'Komatsu', "KOMATSU", '#0B2B6A', { weight: 900, condense: 1.1, slant: 6 });

/** Barclays: the eagle and the name. */
function barclays(): Logo {
  const w = measure('BARCLAYS', { weight: 600, tracking: 4 });
  return {
    id: 'barclays',
    name: 'Barclays',
    size: [w + 110, 100],
    slots: { main: W, mark: W },
    shapes: [
      { d: 'M50 10L62 30L90 22L72 46L96 56L68 60L72 92L50 70L28 92L32 60L4 56L28 46L10 22L38 30Z', fill: 'mark' },
      text('BARCLAYS', 110, 100, 100, 'main', { weight: 600, tracking: 4 }),
    ],
  };
}

/** Gazoo Racing's GR: big black letters with a red slash (Toyota). */
function gr(): Logo {
  return {
    id: 'gr',
    name: 'Toyota Gazoo Racing (GR)',
    size: [220, 100],
    slots: { main: '#111111', slash: '#E10600' },
    shapes: [
      text('GR', 0, 100, 100, 'main', { weight: 900, condense: 1.25, slant: 6 }),
      { d: poly([[96, 100], [128, 0], [146, 0], [114, 100]]), fill: 'slash' },
    ],
  };
}

/** The four rings of Audi. */
const AUDI_RINGS: Logo = {
  id: 'audi-rings',
  name: 'Audi (four rings)',
  size: [280, 100],
  slots: { main: '#E5383B' },
  shapes: [{ d: [50, 110, 170, 230].map((x) => circle(x, 50, 47) + circle(x, 50, 38, true)).join(''), fill: 'main' }],
};

/** Revolut: the name, and its R mark on its own. */
const REVOLUT = wordmark('revolut', 'Revolut', 'Revolut', '#111111', { weight: 800 });
const REVOLUT_R: Logo = {
  id: 'revolut-r',
  name: 'Revolut (R)',
  size: [80, 100],
  slots: { main: W },
  shapes: [{ d: 'M0 0H48C68 0 80 12 80 30C80 44 72 54 58 58L80 100H62L42 60H18V100H0Z M18 16V44H46C56 44 62 38 62 30C62 22 56 16 46 16Z', fill: 'main', rule: 'evenodd' }],
};

/** bp: the green and yellow helios sunflower and the letters. */
function bp(): Logo {
  return {
    id: 'bp',
    name: 'bp',
    size: [230, 100],
    slots: { main: '#007F00', petal: '#99CC00', core: '#FFE600' },
    shapes: [
      { d: Array.from({ length: 12 }, (_, k) => {
          const a = (k * Math.PI) / 6;
          const c = [50 + 30 * Math.cos(a), 50 + 30 * Math.sin(a)] as const;
          return circle(c[0], c[1], 16);
        }).join(''), fill: 'petal' },
      { d: circle(50, 50, 22), fill: 'core' },
      text('bp', 110, 92, 92, 'main', { weight: 800 }),
    ],
  };
}

/** TWG: the big black capitals of TWG Global. */
const TWG = wordmark('twg', 'TWG Global', 'TWG', '#111111', { weight: 900, condense: 1.15, slant: 4 });

/** Cadillac: the 2026 crest (a shield of colored squares in a frame) beside the name. */
function cadillac(): Logo {
  const w = measure('CADILLAC', { weight: 600, tracking: 10 });
  const sq = (x: number, y: number) => rrect(x, y, 14, 14);
  return {
    id: 'cadillac',
    name: 'Cadillac',
    size: [w + 110, 110],
    slots: { main: W, frame: W, a: '#111111' },
    shapes: [
      { d: 'M6 2H86L80 96L46 108L12 96Z M14 10L19 90L46 99L73 90L78 10Z', fill: 'frame', rule: 'evenodd' },
      { d: sq(22, 18) + sq(52, 18) + sq(37, 33) + sq(22, 48) + sq(52, 48) + sq(37, 63), fill: 'a' },
      text('CADILLAC', 108, 100, 100, 'main', { weight: 600, tracking: 10 }),
    ],
  };
}

/** IFS: the software firm's heavy letters. */
const IFS = wordmark('ifs', 'IFS', 'IFS', '#111111', { weight: 900, condense: 1.1 });

export const LOGOS_2026: readonly Logo[] = [
  HP,
  unicredit(),
  puma(),
  ibm(),
  STARFIELD,
  gemini(),
  dropbox(),
  FORD,
  VISA,
  cashapp(),
  eni(),
  MSC,
  atlassian(),
  KOMATSU,
  barclays(),
  gr(),
  AUDI_RINGS,
  REVOLUT,
  REVOLUT_R,
  bp(),
  TWG,
  cadillac(),
  IFS,
  // lettering-only sponsors
  wordmark('solera', 'Solera', 'SOLERA', W, { weight: 800, tracking: 6 }),
  wordmark('amg', 'AMG', 'AMG', W, { weight: 900, slant: 12, condense: 1.1 }),
  wordmark('signify', 'Signify', 'Signify', W, { weight: 600 }),
  wordmark('allwin', 'Allwin', 'all win', W, { weight: 800 }),
  wordmark('dell-tech', 'Dell Technologies', 'DELL Technologies', W, { weight: 600 }),
  wordmark('cisco', 'Cisco', 'CISCO', W, { weight: 600, tracking: 6 }),
  wordmark('dp-world', 'DP World', 'DP WORLD', W, { weight: 800 }),
  wordmark('etihad', 'Etihad', 'ETIHAD', W, { weight: 400, tracking: 14, condense: 1.2 }),
  wordmark('workday', 'Workday', 'workday', W, { weight: 800 }),
  wordmark('club-avolta', 'Club Avolta', 'CLUB AVOLTA', W, { weight: 600, tracking: 4 }),
  wordmark('jack-daniels', "Jack Daniel's", "JACK DANIEL'S", W, { weight: 800, tracking: 4 }),
  wordmark('rokt', 'Rokt', 'ROKT', W, { weight: 900 }),
  wordmark('carlyle', 'Carlyle', 'CARLYLE', W, { weight: 600, tracking: 10 }),
  wordmark('1password', '1Password', '1Password', W, { weight: 800 }),
  wordmark('att', 'AT&T', 'AT&T', W, { weight: 800 }),
  wordmark('indeed', 'Indeed', 'indeed', W, { weight: 800 }),
  wordmark('clear', 'Clear', 'CLEAR', W, { weight: 800 }),
  wordmark('heineken', 'Heineken', 'Heineken', W, { weight: 800 }),
  wordmark('hugo', 'Hugo', 'HUGO', '#E2001A', { weight: 900, tracking: 8 }),
  wordmark('mercado-libre', 'Mercado Libre', 'mercado libre', W, { weight: 800 }),
  wordmark('avature', 'Avature', 'Avature', W, { weight: 600 }),
  wordmark('delphi', 'Delphi', 'DELPHI', W, { weight: 800 }),
  wordmark('maaden', "Ma'aden", 'MAADEN', W, { weight: 900, tracking: 6 }),
  wordmark('coreweave', 'CoreWeave', 'CoreWeave', W, { weight: 800 }),
  wordmark('cohere', 'Cohere', 'cohere', W, { weight: 600 }),
  wordmark('honda', 'Honda (name)', 'HONDA', W, { weight: 900, tracking: 4 }),
  wordmark('valvoline', 'Valvoline', 'Valvoline', W, { weight: 800, slant: 8 }),
  wordmark('pepperstone', 'Pepperstone', 'pepperstone', W, { weight: 600 }),
  wordmark('nexgen', 'NexGen', 'NEXGEN', W, { weight: 800 }),
  wordmark('glenfiddich', 'Glenfiddich', 'GLENFIDDICH', W, { weight: 600, tracking: 4 }),
  wordmark('arm', 'Arm', 'arm', W, { weight: 900 }),
  wordmark('servicenow', 'ServiceNow', 'servicenow', W, { weight: 800 }),
  wordmark('kraken', 'Kraken', 'kraken', W, { weight: 800 }),
  wordmark('stephens', 'Stephens', 'Stephens', W, { weight: 600 }),
  wordmark('brillio', 'Brillio', 'brillio', W, { weight: 800 }),
  wordmark('keeper', 'Keeper', 'KEEPER', W, { weight: 800, tracking: 6 }),
  wordmark('bw-scores', 'BW Scores', 'bw SCORES', W, { weight: 800 }),
  wordmark('estrella-galicia', 'Estrella Galicia', 'ESTRELLA GALICIA', W, { weight: 800 }),
  wordmark('claude', 'Claude', 'Claude', W, { weight: 600 }),
  wordmark('ruckus', 'Ruckus', 'RUCKUS', W, { weight: 900 }),
  wordmark('fix', 'Fix', 'FIX', W, { weight: 900 }),
  wordmark('orion180', 'Orion180', 'ORION180', W, { weight: 800 }),
  wordmark('mphasis', 'Mphasis', 'Mphasis', W, { weight: 800 }),
  wordmark('uchicago', 'UChicago', 'UCHICAGO', W, { weight: 800 }),
  wordmark('gillette', 'Gillette', 'Gillette', W, { weight: 800, slant: 10 }),
  wordmark('visit-qatar', 'Visit Qatar', 'VISIT QATAR', W, { weight: 600, tracking: 6 }),
  wordmark('ninjaone', 'NinjaOne', 'NinjaOne', W, { weight: 800 }),
  wordmark('qatar-airways', 'Qatar Airways', 'QATAR', W, { weight: 800, tracking: 10 }),
  wordmark('jim-beam', 'Jim Beam', 'JIM BEAM', W, { weight: 900, tracking: 4 }),
  wordmark('core-scientific', 'Core Scientific', 'CORE SCIENTIFIC', W, { weight: 800, tracking: 4 }),
];
