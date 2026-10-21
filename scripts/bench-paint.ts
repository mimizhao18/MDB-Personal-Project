// Run with: node --experimental-strip-types --no-warnings --import ./scripts/register-ts-resolve.mjs scripts/bench-paint.ts [id ...]
// @ts-nocheck
// Times the painting of livery pictures (the CPU part of building a car) in Node: a few rounds, the best time each.
import { paintLivery } from '../src/components/car3d/liveryRaster.ts';
import { LIVERIES } from '../src/data/liveries.ts';
import { LEGACY_LIVERIES } from './fixtures/legacy/index.ts';

const ids = process.argv.slice(2);
const pick = (list) => (ids.length ? list.filter((l) => ids.includes(l.id)) : list);
function time(list) {
  const out = {};
  for (const l of list) {
    let best = Infinity;
    for (let r = 0; r < 3; r++) {
      const t0 = performance.now();
      paintLivery(l);
      best = Math.min(best, performance.now() - t0);
    }
    out[l.id] = best;
  }
  return out;
}
paintLivery(LIVERIES[0]);
const now = time(pick(LIVERIES));
const before = time(pick(LEGACY_LIVERIES.filter((l) => l.id !== 'legacy-pixel')));
let a = 0, b = 0;
for (const id of Object.keys(now)) {
  a += now[id];
  b += before[id] ?? 0;
  console.log(`${id.padEnd(18)} before ${before[id]?.toFixed(0).padStart(4)} ms   now ${now[id].toFixed(0).padStart(4)} ms`);
}
const n = Object.keys(now).length;
console.log(`average: before ${(b / n).toFixed(0)} ms, now ${(a / n).toFixed(0)} ms (${(a / b).toFixed(2)}x)`);
