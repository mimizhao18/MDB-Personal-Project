// Run with: npm run check (after check-rules.ts)
// @ts-nocheck (plain Node script; the app's tsconfig does not know about Node or .ts import suffixes)
// Rule checks for the livery painter: path parsing and flattening, fill rules, decals and lettering on both sides of
// the car, the logo library, and the original liveries still painting pixel for pixel as before.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { flatten, parsePath, transformSegs } from '../src/components/car3d/path.ts';
import { fillRings, solid } from '../src/components/car3d/raster.ts';
import { SIDE_H, SIDE_W, paintLivery, paintPlate } from '../src/components/car3d/liveryRaster.ts';
import { layoutText } from '../src/components/car3d/outlineFont.ts';
import { PAINT_BOX } from '../src/data/cars/spec.ts';
import { specFor } from '../src/data/cars/index.ts';
import { LIVERIES } from '../src/data/liveries.ts';
import { LOGOS, getLogo, isLogoText } from '../src/data/logos/index.ts';
import { LEGACY_LIVERIES } from './fixtures/legacy/index.ts';

const close = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps;

// ---- path parsing ----
{
  const abs = parsePath('M0 0 H10 V10 H0 Z');
  assert.deepEqual(abs.map((s) => s.k), ['M', 'L', 'L', 'L', 'Z']);
  const rel = parsePath('m0 0 h10 v10 h-10 z');
  assert.deepEqual(rel.map((s) => s.p ?? null), abs.map((s) => s.p ?? null)); // relative commands land on the same points
  // implicit repeats: extra pairs after M are lines, numbers without separators
  assert.deepEqual(parsePath('M1,2 3,4-5-6').map((s) => s.p), [[1, 2], [3, 4], [-5, -6]]);
  // S reflects the previous control point, T the previous quadratic one
  const s = parsePath('M0 0 C0 10 10 10 10 0 S20 -10 20 0');
  assert.deepEqual(s[2].c1, [10, -10]);
  const t = parsePath('M0 0 Q5 10 10 0 T20 0');
  assert.deepEqual(t[2].c, [15, -10]);
  // arcs: flags written together ("01"), the end point exact, a half circle bulging the right way
  const arc = parsePath('M0 0 A5 5 0 01 10 0');
  const last = arc[arc.length - 1];
  assert.deepEqual(last.p, [10, 0]);
  const pts = flatten(arc, 0.01)[0];
  for (const [x, y] of pts) assert.ok(close(Math.hypot(x - 5, y), 5, 0.02), 'an arc stays on its circle');
  assert.ok(pts.some(([, y]) => y < -4.9), 'sweep 1 from (0,0) to (10,0) bulges to -y');
  assert.ok(flatten(parsePath('M0 0 a5 5 0 0 0 10 0'), 0.01)[0].some(([, y]) => y > 4.9), 'sweep 0 bulges to +y');
  // a full circle from two arcs flattens to a closed ring within the tolerance (plus the cubic arc fit, 0.03%)
  const circle = flatten(parsePath('M-50 0 A50 50 0 1 0 50 0 A50 50 0 1 0 -50 0Z'), 0.1)[0];
  assert.equal(circle.closed, true);
  for (const [x, y] of circle) assert.ok(close(Math.hypot(x, y), 50, 0.03));
  // the ring's sides are close enough that the chord error stays under the tolerance
  for (let i = 1; i < circle.length; i++) {
    const [ax, ay] = circle[i - 1];
    const [bx, by] = circle[i];
    const mid = Math.hypot((ax + bx) / 2, (ay + by) / 2);
    assert.ok(50 - mid <= 0.1 + 0.03, 'flattening keeps within tolerance');
  }
  // an open path stays open (outlines need to know)
  assert.equal(flatten(parsePath('M0 0 L10 0 L10 10'))[0].closed, false);
  assert.throws(() => parsePath('L0 0 Q1'), 'bad paths are refused');
}

// ---- fill rules: a hole is a hole ----
{
  const pic = () => ({ data: new Uint8Array(40 * 40 * 4), width: 40, height: 40 });
  const at = (p, x, y) => p.data[(y * 40 + x) * 4];
  // outer square clockwise, inner square counter-clockwise: non-zero leaves the inside empty
  const p1 = pic();
  fillRings(p1, flatten(parsePath('M5 5 H35 V35 H5 Z M15 15 V25 H25 V15 Z')), solid('#FF0000'));
  assert.equal(at(p1, 20, 20), 0, 'the hole is empty');
  assert.equal(at(p1, 8, 20), 255, 'the ring around it is filled');
  // the same way round twice: non-zero fills the middle, even-odd makes it a hole
  const twice = flatten(parsePath('M5 5 H35 V35 H5 Z M15 15 H25 V25 H15 Z'));
  const p2 = pic();
  fillRings(p2, twice, solid('#FF0000'));
  assert.equal(at(p2, 20, 20), 255);
  const p3 = pic();
  fillRings(p3, twice, solid('#FF0000'), 'evenodd');
  assert.equal(at(p3, 20, 20), 0);
  // a glyph with a counter: the inside of an O stays the background color
  const o = layoutText('O', { weight: 800 });
  const p4 = pic();
  fillRings(p4, flatten(transformSegs(o.segs, [30, 0, 0, -30, 5, 35])), solid('#FF0000'));
  assert.equal(at(p4, 5 + Math.round((o.width * 30) / 2), 20), 0, 'the counter of an O is open');
  assert.ok(at(p4, 7, 20) > 200, 'its side is filled');
}

// ---- decals and lettering read correctly from both sides ----
{
  const { xMin, xMax, yMax } = PAINT_BOX;
  const col = (x) => Math.round(((x - xMin) / (xMax - xMin)) * SIDE_W);
  const row = (y) => Math.round((y / yMax) * SIDE_H);
  const px = (p, x, y) => p.data[(row(y) * SIDE_W + col(x)) * 4 + 1]; // the green channel
  // a test logo: only its left half is filled (green), so a mirror image is easy to spot
  const half = { id: 'test-half', name: 'test', size: [100, 50], slots: { main: '#00FF00' }, shapes: [{ d: 'M0 0 H50 V50 H0 Z', fill: 'main' }] };
  const lookup = (id) => (id === 'test-half' ? half : undefined);
  const base = { ...LIVERIES[0], primary: '#000000', top: [], side: [], texts: [], decals: [{ view: 'side', logo: 'test-half', x: 0, y: 0.5, width: 0.4 }] };
  const p = paintLivery(base, lookup);
  assert.ok(px(p.side, -0.1, 0.5) > 200 && px(p.side, 0.1, 0.5) < 50, 'right side: the logo as drawn (filled half toward the tail, the reader\'s left)');
  assert.ok(px(p.sideLeft, 0.1, 0.5) > 200 && px(p.sideLeft, -0.1, 0.5) < 50, 'left side: the mirror image, which reads the same way from that side');
  const same = paintLivery({ ...base, decals: [{ ...base.decals[0], farSide: 'same' }] }, lookup);
  assert.ok(px(same.sideLeft, -0.1, 0.5) > 200, "farSide 'same' keeps the pixels");
  const mirrored = paintLivery({ ...base, decals: [{ ...base.decals[0], mirror: true }] }, lookup);
  assert.ok(px(mirrored.side, 0.1, 0.5) > 200 && px(mirrored.side, -0.1, 0.5) < 50, 'mirror flips the logo itself');
  // a color slot recolors it
  const recolored = paintLivery({ ...base, decals: [{ ...base.decals[0], colors: { main: '#0000FF' } }] }, lookup);
  assert.ok(px(recolored.side, -0.1, 0.5) < 50 && recolored.side.data[(row(0.5) * SIDE_W + col(-0.1)) * 4 + 2] > 200);
  // lettering in the typeface: the stem of an L is on the reader's left on both sides of the car
  const l = paintLivery({ ...base, decals: [], texts: [{ view: 'side', text: 'L', x: 0, y: 0.5, height: 0.3, color: '#00FF00', font: 'sans', align: 'center' }] }, lookup);
  const stemRight = px(l.side, -0.07, 0.55) > 200 && px(l.side, 0.06, 0.55) < 50;
  const stemLeft = px(l.sideLeft, 0.07, 0.55) > 200 && px(l.sideLeft, -0.06, 0.55) < 50;
  assert.ok(stemRight && stemLeft, 'an L reads as an L from both sides');
  // outlined, slanted, condensed and multi-line text all draw
  const rich = paintLivery({ ...base, decals: [], texts: [{ view: 'side', text: 'AB\nCD', x: 0, y: 0.5, height: 0.1, color: '#00FF00', font: 'sans', align: 'center', slant: 12, condense: 0.8, outline: { color: '#0000FF', width: 0.01 } }, { view: 'side', text: 'XY', x: -1, y: 0.5, height: 0.1, color: '#00FF00', slant: 10, outline: { color: '#0000FF', width: 0.01 } }] }, lookup);
  let green = 0;
  let blue = 0;
  for (let i = 0; i < rich.side.data.length; i += 4) {
    if (rich.side.data[i + 1] > 200) green++;
    if (rich.side.data[i + 2] > 200) blue++;
  }
  assert.ok(green > 500 && blue > 200, 'rich lettering paints letters and outlines');
  // the end plates take decals too, mirrored on the far plate
  const outline = specFor('gen2022').rearWing.endplate;
  const plateDecal = [{ view: 'side', logo: 'test-half', x: -2.2, y: 0.7, width: 0.1 }];
  const greenAt = (pl, x) => pl.data[(Math.round((0.7 - pl.y0) * 420) * pl.width + Math.round((x - pl.x0) * 420)) * 4 + 1];
  const near = paintPlate(outline, '#000000', [], plateDecal, false, lookup);
  const far = paintPlate(outline, '#000000', [], plateDecal, true, lookup);
  assert.ok(greenAt(near, -2.225) > 200 && greenAt(near, -2.175) < 50 && greenAt(far, -2.175) > 200 && greenAt(far, -2.225) < 50, 'plate decals mirror on the far plate');
}

// ---- the original liveries still paint exactly as before ----
{
  const hashes = JSON.parse(readFileSync(new URL('./fixtures/legacy-hashes.json', import.meta.url), 'utf8'));
  const h = (data) => createHash('sha1').update(data).digest('hex').slice(0, 16);
  // every one of them would take seconds; the check covers one per generation, the pixel font and the full set on request
  const ids = process.env.CHECK_ALL_LIVERIES ? Object.keys(hashes) : ['ferrari-1980s', 'williams-2004', 'williams-2014', 'redbull-2022', 'haas-2026', 'legacy-pixel'];
  for (const id of ids) {
    const l = LEGACY_LIVERIES.find((x) => x.id === id);
    const p = paintLivery(l);
    const spec = specFor(l.era);
    const got = [h(p.top.data), h(p.side.data), h(p.sideLeft.data)];
    for (const kind of ['front', 'rear']) {
      const texts = l.plateTexts?.[kind];
      if (!texts) continue;
      const ol = kind === 'front' ? spec.frontWing.endplate : spec.rearWing.endplate;
      for (const mirror of [false, true]) got.push(h(paintPlate(ol, (kind === 'front' ? l.frontParts ?? l.parts : l.parts).endplate, texts, [], mirror).data));
    }
    assert.deepEqual(got, hashes[id], `${id} paints exactly as before the vector engine`);
  }
}

// ---- the logo library and the liveries' decals ----
{
  const ids = new Set();
  for (const logo of LOGOS) {
    assert.ok(!ids.has(logo.id), `logo id ${logo.id} is unique`);
    ids.add(logo.id);
    assert.ok(logo.size[0] > 0 && logo.size[1] > 0 && logo.shapes.length > 0, `${logo.id} has a size and shapes`);
    for (const s of logo.shapes) {
      const colors = isLogoText(s) ? [s.fill, s.outline?.color] : [s.fill, s.stroke?.color, ...(s.gradient?.stops.map((g) => g[1]) ?? [])];
      for (const c of colors.filter(Boolean)) assert.ok(c.startsWith('#') ? /^#[0-9A-Fa-f]{6}$/.test(c) : c in logo.slots, `${logo.id}: color ${c} is a hex color or one of its slots`);
      if (!isLogoText(s)) parsePath(s.d); // throws on a bad path
    }
  }
  for (const livery of LIVERIES) {
    for (const d of [...(livery.decals ?? []), ...(livery.plateDecals?.front ?? []), ...(livery.plateDecals?.rear ?? [])]) {
      const logo = getLogo(d.logo);
      assert.ok(logo, `${livery.id}: decal logo "${d.logo}" is in the library`);
      assert.ok(d.width || d.height, `${livery.id}: decal ${d.logo} has a size`);
      for (const slot of Object.keys(d.colors ?? {})) assert.ok(slot in logo.slots, `${livery.id}: ${d.logo} has a color slot "${slot}"`);
    }
    for (const layer of [...livery.top, ...livery.side, ...(livery.wingTop ?? [])]) {
      assert.ok(layer.points || layer.path, `${livery.id}: every shape has points or a path`);
      assert.ok(layer.color || layer.gradient || layer.stroke, `${livery.id}: every shape is filled or outlined`);
      if (layer.path) parsePath(layer.path);
    }
  }
}

console.log('all paint checks passed');
