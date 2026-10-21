// Fuel and oil companies: Shell, Petronas, Mobil, Esso, Elf, Total, Agip, Castrol, Aramco, BP...

import type { P } from './draw';
import { poly, text } from './draw';
import type { Logo, LogoShape } from './types';

// ---- Shell: the pecten (the 1999 scallop), yellow with red grooves and a red outline ----

const SHELL_C: P = [50, 47];
const SHELL_R = 44;
const SHELL_FROM = 207; // the fan's top edge runs from this angle round to its mirror (degrees, y up)
const SHELL_LOBES = 7;
const at = (deg: number, r: number): P => [SHELL_C[0] + r * Math.cos((deg * Math.PI) / 180), SHELL_C[1] - r * Math.sin((deg * Math.PI) / 180)];
const shellNotch = (k: number) => SHELL_FROM - ((2 * SHELL_FROM - 180) * k) / SHELL_LOBES;

/** The outline of the pecten: the scalloped fan, the ears where it meets the hinge, and the flared base. */
function shellOutline(): string {
  const f = (n: number) => Math.round(n * 100) / 100;
  const pt = ([x, y]: P) => `${f(x)} ${f(y)}`;
  let d = `M${pt([31, 96])}L${pt([28, 82])}L${pt([19, 82])}L${pt(at(SHELL_FROM, SHELL_R - 1))}`;
  for (let k = 0; k < SHELL_LOBES; k++) {
    const a0 = shellNotch(k);
    const a1 = shellNotch(k + 1);
    const mid = (a0 + a1) / 2;
    const end = k === SHELL_LOBES - 1 ? at(a1, SHELL_R - 1) : at(a1, SHELL_R - 4);
    // each lobe bulges out a little past the circle: two quadratic halves through its tip
    const tip = at(mid, SHELL_R + 2.5);
    d += `Q${pt(at(a0 + (mid - a0) * 0.35, SHELL_R + 2.5))} ${pt(tip)}Q${pt(at(a1 - (a1 - mid) * 0.35, SHELL_R + 2.5))} ${pt(end)}`;
  }
  d += `L${pt([81, 82])}L${pt([72, 82])}L${pt([69, 96])}Z`;
  return d;
}

/** The red grooves between the lobes: wedges from the notches in the edge, narrowing toward the hinge. */
function shellGrooves(): string {
  const focus: P = [50, 104];
  let d = '';
  for (let k = 1; k < SHELL_LOBES; k++) {
    const a = shellNotch(k);
    const outer = at(a, SHELL_R - 2);
    // the groove's sides, toward the focus point below the hinge
    const dir = [focus[0] - outer[0], focus[1] - outer[1]];
    const len = Math.hypot(dir[0], dir[1]);
    const n = [-dir[1] / len, dir[0] / len];
    const w = 2.3;
    const tEnd = (79 - outer[1]) / dir[1]; // stop at the hinge line
    const endPt: P = [outer[0] + dir[0] * tEnd, outer[1] + dir[1] * tEnd];
    d += poly([
      [outer[0] + n[0] * w, outer[1] + n[1] * w],
      [endPt[0] + n[0] * 0.35, endPt[1] + n[1] * 0.35],
      [endPt[0] - n[0] * 0.35, endPt[1] - n[1] * 0.35],
      [outer[0] - n[0] * w, outer[1] - n[1] * w],
    ]);
  }
  return d;
}

const SHELL_PATH = shellOutline();

const shellShapes = (): LogoShape[] => [
  // the keyline round the outside, only when a livery asks for one (white on the 2022 Ferrari)
  { d: SHELL_PATH, fill: 'key', stroke: { color: 'key', width: 13 }, when: 'key' },
  { d: SHELL_PATH, fill: 'yellow', stroke: { color: 'red', width: 6 } },
  { d: shellGrooves(), fill: 'red' },
  // the line where the fan meets the hinge
  { d: poly([[20, 79], [80, 79], [79.4, 83.5], [20.6, 83.5]]), fill: 'red' },
];

export const SHELL: Logo = {
  id: 'shell',
  name: 'Shell (pecten)',
  size: [100, 100],
  slots: { yellow: '#FBCE07', red: '#DD1D21', key: '#FFFFFF' },
  shapes: shellShapes(),
};

/** "V-Power" with a small pecten before it, as on the Ferrari rear wings. */
export const SHELL_VPOWER: Logo = {
  id: 'shell-vpower',
  name: 'Shell V-Power',
  size: [520, 100],
  slots: { yellow: '#FBCE07', red: '#DD1D21', key: '#FFFFFF', main: '#FFFFFF' },
  shapes: [
    ...shellShapes(),
    text('V-Power', 120, 86, 72, 'main', { weight: 800, slant: 0 }),
  ],
};

export const FUEL_LOGOS: readonly Logo[] = [SHELL, SHELL_VPOWER];
