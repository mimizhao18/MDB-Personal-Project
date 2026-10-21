// Dev only: a tiny local server that saves pictures (PNG or JPEG) posted by the /dev/car-views page (its "capture" mode) into
// docs/car-realism/ (or the docs folder named by SHOT_SINK_DIR, e.g. `SHOT_SINK_DIR=livery-detail`). Run with
// `node tools/shot-sink.mjs` while the web preview is open; it listens on port 8787.
// It only writes files whose names are plain (letters, digits, dashes, underscores and slashes) under that folder.
import { createServer } from 'node:http';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const DIR = process.env.SHOT_SINK_DIR ?? 'car-realism';
if (!/^[A-Za-z0-9_-]+$/.test(DIR)) throw new Error('SHOT_SINK_DIR must be a plain folder name under docs/');
const ROOT = resolve(process.cwd(), 'docs', DIR);
const PORT = Number(process.env.SHOT_SINK_PORT ?? 8787);

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return void res.writeHead(204).end();
  if (req.method !== 'POST' || req.url !== '/save') return void res.writeHead(404).end('not found');
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    try {
      const { name, dataUrl } = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      if (typeof name !== 'string' || !/^[A-Za-z0-9_\-/]+$/.test(name) || name.includes('..')) throw new Error('bad name');
      const m = /^data:image\/(png|jpeg);base64,(.+)$/.exec(String(dataUrl));
      if (!m) throw new Error('not a png or jpeg data url');
      const file = join(ROOT, `${name}.${m[1] === 'jpeg' ? 'jpg' : 'png'}`);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, Buffer.from(m[2], 'base64'));
      console.log('saved', file);
      res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ ok: true, file }));
    } catch (e) {
      console.error('rejected', e.message);
      res.writeHead(400).end(String(e.message));
    }
  });
});

server.listen(PORT, '127.0.0.1', () => console.log(`shot sink: saving PNGs under ${ROOT} on http://127.0.0.1:${PORT}/save`));
