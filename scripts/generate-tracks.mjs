// Builds src/data/tracks/calendarShapes.ts: the centerlines of the 21 circuits on the 2026 calendar that are not hand-traced.
// Run with: node scripts/generate-tracks.mjs
// Source: https://github.com/bacinger/f1-circuits (MIT license), one closed GPS line per circuit, starting on the start/finish straight.
// Each line is projected flat, smoothed with a centripetal Catmull-Rom spline, turned so it is wider than tall, fitted into a 1000 unit
// wide box and resampled into POINTS points evenly spaced along the lap (point i is i / POINTS of a lap), the same shape as the
// hand-traced tracks.
import { writeFileSync } from 'node:fs';

const SOURCE = 'https://raw.githubusercontent.com/bacinger/f1-circuits/master/f1-circuits.geojson';
const OUT = new URL('../src/data/tracks/calendarShapes.ts', import.meta.url);

const POINTS = 360;
const BOX_WIDTH = 1000;
const MARGIN = 40;
const MAX_ROAD_WIDTH = 26;
const MIN_ROAD_WIDTH = 12;

// our track id -> the circuit's id in the data, and whether the data runs the lap the wrong way round
const TRACKS = {
  australia: { id: 'au-1953' },
  china: { id: 'cn-2004' },
  japan: { id: 'jp-1962' },
  bahrain: { id: 'bh-2002' },
  'saudi-arabia': { id: 'sa-2021' },
  miami: { id: 'us-2022' },
  canada: { id: 'ca-1978' },
  barcelona: { id: 'es-1991' },
  austria: { id: 'at-1969' },
  hungary: { id: 'hu-1986' },
  netherlands: { id: 'nl-1948' },
  italy: { id: 'it-1922' },
  madrid: { id: 'es-2026' },
  azerbaijan: { id: 'az-2016' },
  singapore: { id: 'sg-2008', reverse: true }, // Marina Bay is run anticlockwise
  'united-states': { id: 'us-2012' },
  mexico: { id: 'mx-1962' },
  brazil: { id: 'br-1940' },
  'las-vegas': { id: 'us-2023' },
  qatar: { id: 'qa-2004' },
  'abu-dhabi': { id: 'ae-2009' },
};

const round1 = (n) => Math.round(n * 10) / 10;
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Centripetal Catmull-Rom through the closed loop of `pts`, sampled `steps` times per segment. */
function smoothLoop(pts, steps = 24) {
  const n = pts.length;
  const out = [];
  const at = (i) => pts[((i % n) + n) % n];
  const t = (a, b) => Math.sqrt(dist(a, b)); // centripetal parameter spacing
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const t0 = 0, t1 = t0 + t(p0, p1), t2 = t1 + t(p1, p2), t3 = t2 + t(p2, p3);
    for (let s = 0; s < steps; s++) {
      const tt = t1 + ((t2 - t1) * s) / steps;
      const lerp = (a, b, ta, tb) => [a[0] + ((b[0] - a[0]) * (tt - ta)) / (tb - ta), a[1] + ((b[1] - a[1]) * (tt - ta)) / (tb - ta)];
      const a1 = lerp(p0, p1, t0, t1), a2 = lerp(p1, p2, t1, t2), a3 = lerp(p2, p3, t2, t3);
      const b1 = (() => { const k = (tt - t0) / (t2 - t0); return [a1[0] + (a2[0] - a1[0]) * k, a1[1] + (a2[1] - a1[1]) * k]; })();
      const b2 = (() => { const k = (tt - t1) / (t3 - t1); return [a2[0] + (a3[0] - a2[0]) * k, a2[1] + (a3[1] - a2[1]) * k]; })();
      const k = (tt - t1) / (t2 - t1);
      out.push([b1[0] + (b2[0] - b1[0]) * k, b1[1] + (b2[1] - b1[1]) * k]);
    }
  }
  return out;
}

/** `count` points evenly spaced along the closed polyline, the first one at its first point. */
function resample(loop, count) {
  const n = loop.length;
  const cum = [0];
  for (let i = 0; i < n; i++) cum.push(cum[i] + dist(loop[i], loop[(i + 1) % n]));
  const total = cum[n];
  const out = [];
  let seg = 0;
  for (let k = 0; k < count; k++) {
    const target = (total * k) / count;
    while (cum[seg + 1] < target) seg++;
    const f = (target - cum[seg]) / (cum[seg + 1] - cum[seg] || 1);
    const a = loop[seg], b = loop[(seg + 1) % n];
    out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
  }
  return out;
}

function build(feature, reverse) {
  let coords = feature.geometry.coordinates.slice(0, -1); // the last point repeats the first
  if (reverse) coords = [coords[0], ...coords.slice(1).reverse()];
  const lat0 = coords.reduce((s, c) => s + c[1], 0) / coords.length;
  const k = Math.cos((lat0 * Math.PI) / 180);
  // flat map: x to the east, y down the screen (south)
  let pts = coords.map((c) => [c[0] * k, -c[1]]);
  let loop = smoothLoop(pts);

  const bounds = (list) => {
    const xs = list.map((p) => p[0]), ys = list.map((p) => p[1]);
    return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
  };
  let b = bounds(loop);
  // turn a tall track a quarter turn clockwise so every track is wider than tall
  if (b.maxY - b.minY > b.maxX - b.minX) {
    loop = loop.map(([x, y]) => [-y, x]);
    b = bounds(loop);
  }
  const scale = (BOX_WIDTH - 2 * MARGIN) / (b.maxX - b.minX);
  const height = Math.round((b.maxY - b.minY) * scale + 2 * MARGIN);
  loop = loop.map(([x, y]) => [(x - b.minX) * scale + MARGIN, (y - b.minY) * scale + MARGIN]);

  const points = resample(loop, POINTS);

  // the road is drawn narrower where two strands of the track run close together
  let closest = Infinity;
  for (let i = 0; i < POINTS; i++) {
    for (let j = i + 1; j < POINTS; j++) {
      const apart = Math.min(j - i, POINTS - (j - i));
      if (apart > POINTS / 12) closest = Math.min(closest, dist(points[i], points[j]));
    }
  }
  const roadWidth = Math.max(MIN_ROAD_WIDTH, Math.min(MAX_ROAD_WIDTH, Math.floor(closest * 0.7)));

  // the start/finish line crosses the road at point 0
  const [p0, p1] = [points[0], points[2]];
  const heading = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
  const half = (roadWidth * 1.7) / 2;
  const nx = -Math.sin(heading) * half, ny = Math.cos(heading) * half;
  const startFinish = { from: { x: round1(p0[0] + nx), y: round1(p0[1] + ny) }, to: { x: round1(p0[0] - nx), y: round1(p0[1] - ny) } };

  return { viewBox: { width: BOX_WIDTH, height }, roadWidth, startFinish, points: points.map(([x, y]) => [round1(x), round1(y)]) };
}

const response = await fetch(SOURCE);
if (!response.ok) throw new Error(`Could not download ${SOURCE}: ${response.status}`);
const features = new Map((await response.json()).features.map((f) => [f.properties.id, f]));

let ts = `// Generated by scripts/generate-tracks.mjs. Do not edit by hand.
// Circuit outlines come from https://github.com/bacinger/f1-circuits (MIT license), smoothed and fitted to a ${BOX_WIDTH} unit wide box.
// Points are evenly spaced along the lap, starting at the start/finish line and running in race direction, so point i is i/${POINTS} of a lap.

export interface CalendarShape {
  viewBox: { width: number; height: number };
  /** Width of the drawn road in box units. */
  roadWidth: number;
  startFinish: { from: { x: number; y: number }; to: { x: number; y: number } };
  points: readonly (readonly [number, number])[];
}

export const CALENDAR_SHAPES: Record<string, CalendarShape> = {
`;
for (const [trackId, { id, reverse }] of Object.entries(TRACKS)) {
  const feature = features.get(id);
  if (!feature) throw new Error(`Circuit ${id} is not in the data`);
  const shape = build(feature, reverse);
  ts += `  '${trackId}': {\n    viewBox: { width: ${shape.viewBox.width}, height: ${shape.viewBox.height} },\n    roadWidth: ${shape.roadWidth},\n`;
  ts += `    startFinish: { from: { x: ${shape.startFinish.from.x}, y: ${shape.startFinish.from.y} }, to: { x: ${shape.startFinish.to.x}, y: ${shape.startFinish.to.y} } },\n`;
  ts += `    points: [${shape.points.map(([x, y]) => `[${x}, ${y}]`).join(', ')}],\n  },\n`;
  console.log(trackId.padEnd(14), `${shape.viewBox.width}x${shape.viewBox.height}`, 'road', shape.roadWidth);
}
ts += '};\n';
writeFileSync(OUT, ts);
console.log(`Wrote ${OUT.pathname}`);
