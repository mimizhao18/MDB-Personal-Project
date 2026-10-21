// Sponsors whose logo is mostly their name: lettering in the Inter weight, width and slant closest to the real
// typeface, in its colors, sometimes with a small mark. Ordered by generation of first use.

import { measure, text, wordmark } from './draw';
import type { Logo } from './types';

const W = '#FFFFFF';

export const WORDMARK_LOGOS: readonly Logo[] = [
  // ---- 2022 Ferrari ----
  wordmark('vistajet', 'VistaJet', 'VISTAJET', W, { weight: 600, tracking: 4 }),
  wordmark('skf', 'SKF', 'SKF', W, { weight: 900, slant: 14, condense: 1.15 }),
  {
    id: 'ngk',
    name: 'NGK Spark Plugs',
    size: [measure('NGK', { weight: 900, slant: 12 }), 130],
    slots: { main: W },
    shapes: [text('NGK', 0, 100, 100, 'main', { weight: 900, slant: 12 }), text('SPARK PLUGS', measure('NGK', { weight: 900 }) / 2, 128, 20, 'main', { weight: 600, align: 'center', tracking: 3 })],
  },
  wordmark('brembo', 'Brembo', 'brembo', W, { weight: 800 }),
  wordmark('velas', 'Velas', 'VELAS', W, { weight: 600, tracking: 18 }),
  wordmark('mahle', 'Mahle', 'MAHLE', W, { weight: 900, condense: 1.05 }),
  {
    id: 'richard-mille',
    name: 'Richard Mille',
    size: [measure('RICHARD MILLE', { weight: 400, tracking: 8 }), 100],
    slots: { main: W },
    shapes: [text('RICHARD MILLE', 0, 100, 100, 'main', { weight: 400, tracking: 8 })],
  },
];

