// Dev only: turns the Inter font files (SIL Open Font License, shipped with @expo-google-fonts/inter) into glyph
// outlines for the livery painter, which has no browser canvas or font engine on a phone. Writes
// src/components/car3d/outlineFontData.ts. Run with `node tools/extract-font.mjs` (only needed to change the
// character set or the weights).
//
// It reads the TrueType tables directly: cmap (format 4), hmtx, loca, glyf (simple and composite glyphs) and the
// pair kerning from GPOS (lookup type 2, formats 1 and 2, including extension lookups). Outlines are written as
// SVG-style path strings in font units (y up), quadratic curves as Q.
import { readFileSync, writeFileSync } from 'node:fs';

const WEIGHTS = { 400: '400Regular/Inter_400Regular', 600: '600SemiBold/Inter_600SemiBold', 800: '800ExtraBold/Inter_800ExtraBold', 900: '900Black/Inter_900Black' };
const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&.,-\'!?/+:()@#%*"’°$€_';

function parse(buf) {
  const u16 = (o) => buf.readUInt16BE(o);
  const i16 = (o) => buf.readInt16BE(o);
  const u32 = (o) => buf.readUInt32BE(o);
  const tables = {};
  const n = u16(4);
  for (let i = 0; i < n; i++) {
    const o = 12 + i * 16;
    tables[buf.toString('ascii', o, o + 4)] = { offset: u32(o + 8), length: u32(o + 12) };
  }
  const head = tables.head.offset;
  const unitsPerEm = u16(head + 18);
  const indexToLocFormat = i16(head + 50);
  const numGlyphs = u16(tables.maxp.offset + 4);
  const hhea = tables.hhea.offset;
  const ascender = i16(hhea + 4);
  const descender = i16(hhea + 6);
  const numHMetrics = u16(hhea + 34);
  const advance = (g) => u16(tables.hmtx.offset + 4 * Math.min(g, numHMetrics - 1));

  // cmap format 4 (BMP)
  const cmap = tables.cmap.offset;
  let sub = -1;
  for (let i = 0; i < u16(cmap + 2); i++) {
    const pid = u16(cmap + 4 + i * 8);
    const eid = u16(cmap + 6 + i * 8);
    const off = u32(cmap + 8 + i * 8);
    if (u16(cmap + off) === 4 && (pid === 3 || pid === 0) && (eid === 1 || pid === 0)) sub = cmap + off;
  }
  const segX2 = u16(sub + 6);
  const ends = sub + 14;
  const starts = ends + segX2 + 2;
  const deltas = starts + segX2;
  const ranges = deltas + segX2;
  const glyphOf = (code) => {
    for (let s = 0; s < segX2 / 2; s++) {
      const end = u16(ends + s * 2);
      if (code > end) continue;
      const start = u16(starts + s * 2);
      if (code < start) return 0;
      const delta = i16(deltas + s * 2);
      const ro = u16(ranges + s * 2);
      if (ro === 0) return (code + delta) & 0xffff;
      const g = u16(ranges + s * 2 + ro + (code - start) * 2);
      return g === 0 ? 0 : (g + delta) & 0xffff;
    }
    return 0;
  };

  const loca = (g) => (indexToLocFormat === 0 ? u16(tables.loca.offset + g * 2) * 2 : u32(tables.loca.offset + g * 4));
  /** contours of glyph g as arrays of {x, y, on} */
  function contours(g, depth = 0) {
    const start = tables.glyf.offset + loca(g);
    const end = tables.glyf.offset + loca(g + 1);
    if (end <= start) return [];
    const nc = i16(start);
    if (nc < 0) {
      // composite
      const out = [];
      let p = start + 10;
      for (;;) {
        const flags = u16(p);
        const gi = u16(p + 2);
        p += 4;
        let dx;
        let dy;
        if (flags & 1) {
          dx = i16(p);
          dy = i16(p + 2);
          p += 4;
        } else {
          dx = buf.readInt8(p);
          dy = buf.readInt8(p + 1);
          p += 2;
        }
        let a = 1, b = 0, c = 0, d = 1;
        const f2 = (o) => i16(o) / 16384;
        if (flags & 8) {
          a = d = f2(p);
          p += 2;
        } else if (flags & 0x40) {
          a = f2(p);
          d = f2(p + 2);
          p += 4;
        } else if (flags & 0x80) {
          a = f2(p);
          b = f2(p + 2);
          c = f2(p + 4);
          d = f2(p + 6);
          p += 8;
        }
        for (const ct of contours(gi, depth + 1)) out.push(ct.map((pt) => ({ x: a * pt.x + c * pt.y + dx, y: b * pt.x + d * pt.y + dy, on: pt.on })));
        if (!(flags & 0x20)) break;
      }
      return out;
    }
    const endPts = [];
    for (let i = 0; i < nc; i++) endPts.push(u16(start + 10 + i * 2));
    const nPts = endPts[nc - 1] + 1;
    const insLen = u16(start + 10 + nc * 2);
    let p = start + 12 + nc * 2 + insLen;
    const flags = [];
    while (flags.length < nPts) {
      const f = buf[p++];
      flags.push(f);
      if (f & 8) {
        const r = buf[p++];
        for (let k = 0; k < r; k++) flags.push(f);
      }
    }
    const xs = [];
    let x = 0;
    for (const f of flags) {
      if (f & 2) {
        const v = buf[p++];
        x += f & 16 ? v : -v;
      } else if (!(f & 16)) {
        x += i16(p);
        p += 2;
      }
      xs.push(x);
    }
    const ys = [];
    let y = 0;
    for (const f of flags) {
      if (f & 4) {
        const v = buf[p++];
        y += f & 32 ? v : -v;
      } else if (!(f & 32)) {
        y += i16(p);
        p += 2;
      }
      ys.push(y);
    }
    const out = [];
    let s = 0;
    for (const e of endPts) {
      const ct = [];
      for (let i = s; i <= e; i++) ct.push({ x: xs[i], y: ys[i], on: (flags[i] & 1) === 1 });
      out.push(ct);
      s = e + 1;
    }
    return out;
  }

  // GPOS pair kerning
  const kern = new Map(); // "g1,g2" -> value
  if (tables.GPOS) {
    const gpos = tables.GPOS.offset;
    const lookupList = gpos + u16(gpos + 8);
    const coverage = (o) => {
      const fmt = u16(o);
      const map = new Map();
      if (fmt === 1) for (let i = 0; i < u16(o + 2); i++) map.set(u16(o + 4 + i * 2), i);
      else {
        let idx = 0;
        for (let i = 0; i < u16(o + 2); i++) {
          const r = o + 4 + i * 6;
          const s0 = u16(r);
          const e0 = u16(r + 2);
          const si = u16(r + 4);
          for (let g = s0; g <= e0; g++) map.set(g, si + g - s0);
          idx++;
        }
      }
      return map;
    };
    const classDef = (o) => {
      const fmt = u16(o);
      const map = new Map();
      if (fmt === 1) {
        const sg = u16(o + 2);
        for (let i = 0; i < u16(o + 4); i++) map.set(sg + i, u16(o + 6 + i * 2));
      } else for (let i = 0; i < u16(o + 2); i++) {
        const r = o + 4 + i * 6;
        for (let g = u16(r); g <= u16(r + 2); g++) map.set(g, u16(r + 4));
      }
      return map;
    };
    const vrSize = (vf) => {
      let s = 0;
      for (let b = 0; b < 8; b++) if (vf & (1 << b)) s += 2;
      return s;
    };
    const xAdv = (o, vf) => {
      // XAdvance is bit 2; preceding fields: XPlacement (bit0), YPlacement (bit1)
      if (!(vf & 4)) return 0;
      let off = 0;
      if (vf & 1) off += 2;
      if (vf & 2) off += 2;
      return i16(o + off);
    };
    const pairSub = (st) => {
      const fmt = u16(st);
      const cov = coverage(st + u16(st + 2));
      const vf1 = u16(st + 4);
      const vf2 = u16(st + 6);
      const s1 = vrSize(vf1);
      const s2 = vrSize(vf2);
      if (fmt === 1) {
        for (const [g1, ci] of cov) {
          const ps = st + u16(st + 10 + ci * 2);
          for (let i = 0; i < u16(ps); i++) {
            const r = ps + 2 + i * (2 + s1 + s2);
            const v = xAdv(r + 2, vf1);
            const key = `${g1},${u16(r)}`;
            if (v && !kern.has(key)) kern.set(key, v);
          }
        }
      } else if (fmt === 2) {
        const cd1 = classDef(st + u16(st + 8));
        const cd2 = classDef(st + u16(st + 10));
        const c1n = u16(st + 12);
        const c2n = u16(st + 14);
        const rec = s1 + s2;
        return { fmt, cov, cd1, cd2, c1n, c2n, st, rec, vf1 };
      }
      return null;
    };
    const classSubs = [];
    for (let i = 0; i < u16(lookupList); i++) {
      const lk = lookupList + u16(lookupList + 2 + i * 2);
      let type = u16(lk);
      for (let j = 0; j < u16(lk + 4); j++) {
        let st = lk + u16(lk + 6 + j * 2);
        let t = type;
        if (t === 9) {
          t = u16(st + 2);
          st = st + u32(st + 4);
        }
        if (t !== 2) continue;
        const r = pairSub(st);
        if (r) classSubs.push(r);
      }
    }
    kern.classLookup = (g1, g2) => {
      const k = kern.get(`${g1},${g2}`);
      if (k !== undefined) return k;
      for (const s of classSubs) {
        if (!s.cov.has(g1)) continue;
        const c1 = s.cd1.get(g1) ?? 0;
        const c2 = s.cd2.get(g2) ?? 0;
        const v = xAdv(s.st + 16 + (c1 * s.c2n + c2) * s.rec, s.vf1);
        if (v) return v;
      }
      return 0;
    };
  }
  return { unitsPerEm, ascender, descender, glyphOf, advance, contours, kern };
}

/** A contour of TrueType points as an SVG path (M, L, Q, Z). */
function contourPath(ct) {
  const n = ct.length;
  if (n === 0) return '';
  // start on an on-curve point (or the midpoint of two off-curve points)
  let startIdx = ct.findIndex((p) => p.on);
  const pts = [];
  if (startIdx < 0) {
    const a = ct[0];
    const b = ct[1];
    pts.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, on: true });
    for (let i = 1; i <= n; i++) pts.push(ct[i % n]);
  } else for (let i = 0; i <= n; i++) pts.push(ct[(startIdx + i) % n]);
  const r = (v) => Math.round(v);
  let d = `M${r(pts[0].x)} ${r(pts[0].y)}`;
  let ctrl = null;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    if (p.on) {
      d += ctrl ? `Q${r(ctrl.x)} ${r(ctrl.y)} ${r(p.x)} ${r(p.y)}` : `L${r(p.x)} ${r(p.y)}`;
      ctrl = null;
    } else {
      if (ctrl) {
        const mx = (ctrl.x + p.x) / 2;
        const my = (ctrl.y + p.y) / 2;
        d += `Q${r(ctrl.x)} ${r(ctrl.y)} ${r(mx)} ${r(my)}`;
      }
      ctrl = p;
    }
  }
  if (ctrl) d += `Q${r(ctrl.x)} ${r(ctrl.y)} ${r(pts[0].x)} ${r(pts[0].y)}`;
  return `${d}Z`;
}

const out = {};
let unitsPerEm = 0;
let capHeight = 0;
for (const [weight, file] of Object.entries(WEIGHTS)) {
  const font = parse(readFileSync(new URL(`../node_modules/@expo-google-fonts/inter/${file}.ttf`, import.meta.url)));
  unitsPerEm = font.unitsPerEm;
  const glyphs = {};
  const ids = {};
  for (const ch of CHARS) {
    const g = font.glyphOf(ch.codePointAt(0));
    if (!g) continue;
    ids[ch] = g;
    glyphs[ch] = [font.advance(g), font.contours(g).map(contourPath).join('')];
  }
  const H = font.contours(font.glyphOf(72));
  capHeight = Math.max(...H.flat().map((p) => p.y));
  // kerning between every pair of the characters (only the non-zero ones are kept)
  const kerning = {};
  if (font.kern.classLookup) {
    for (const a of CHARS) for (const b of CHARS) {
      if (!ids[a] || !ids[b]) continue;
      const v = font.kern.classLookup(ids[a], ids[b]);
      if (v) kerning[a + b] = v;
    }
  }
  out[weight] = { glyphs, kerning };
}

let ts = `// Generated by tools/extract-font.mjs from Inter (c) The Inter Project Authors, SIL Open Font License 1.1
// (https://github.com/rsms/inter). Glyph outlines in font units, y up: [advance width, SVG path]. Do not edit.

export const UNITS_PER_EM = ${unitsPerEm};
export const CAP_HEIGHT = ${capHeight};

export type FontWeightData = { glyphs: Record<string, readonly [number, string]>; kerning: Record<string, number> };

export const INTER: Record<400 | 600 | 800 | 900, FontWeightData> = ${JSON.stringify(out)};
`;
writeFileSync(new URL('../src/components/car3d/outlineFontData.ts', import.meta.url), ts);
console.log('unitsPerEm', unitsPerEm, 'capHeight', capHeight, 'bytes', ts.length);
for (const w of Object.keys(out)) console.log(w, Object.keys(out[w].glyphs).length, 'glyphs', Object.keys(out[w].kerning).length, 'kern pairs');
