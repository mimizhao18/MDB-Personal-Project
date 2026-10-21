import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { Car3DView, renderNow } from '../../components/car3d/Car3DView';
import { paintLivery } from '../../components/car3d/liveryRaster';
import type { EraId } from '../../data/eras';
import { ERAS } from '../../data/eras';
import { LIVERIES, getLivery } from '../../data/liveries';
import { makeStyles } from '../../design/styles';

/** The five fixed camera angles, each with how close the camera goes (below 1 is closer). x runs along the car, so yaw 0 looks at the nose. */
const VIEWS = [
  { id: 'three-quarter', label: 'Three-quarter', yaw: 0.75, pitch: 0.2, zoom: 1 },
  { id: 'side', label: 'Side', yaw: Math.PI / 2, pitch: 0.02, zoom: 1 },
  { id: 'front', label: 'Front', yaw: 0, pitch: 0.06, zoom: 0.62 },
  { id: 'rear', label: 'Rear', yaw: Math.PI, pitch: 0.06, zoom: 0.62 },
  { id: 'top', label: 'Top', yaw: Math.PI / 2, pitch: 1.5, zoom: 1 }, // nose to the right, so lettering along the car reads left to right
] as const;
type ViewId = (typeof VIEWS)[number]['id'];
const viewById = (id: string | undefined) => VIEWS.find((v) => v.id === id) ?? VIEWS[0];

/** The angles a livery is judged from on the contact sheet. */
const SHEET_VIEWS: readonly ViewId[] = ['three-quarter', 'side', 'top'];
const SHEET_TILE = { width: 520, height: 320 };
const SETTLE_MS = 1100; // time for a freshly built car and its textures to be drawn before its canvas is read

/** Where captured pictures go: the dev sink server (tools/shot-sink.mjs) saves them under docs/car-realism/. */
const SINK = 'http://127.0.0.1:8787/save';
/** Pictures are saved as JPEG (a fraction of the size of PNG, and the car has no hard pixel edges to keep). */
const toDataUrl = (canvas: HTMLCanvasElement) => canvas.toDataURL('image/jpeg', 0.9);

const TILE_HEIGHT = 260;
const WIDE = 760; // from this window width on, two views sit side by side

const useStyles = makeStyles((t) => ({
  content: { padding: t.spacing.screen, gap: t.spacing.md, paddingBottom: t.spacing.xxl },
  intro: { ...t.typography.caption, color: t.colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.sm },
  tile: { overflow: 'hidden', borderWidth: t.border.hairline, borderColor: t.colors.border, backgroundColor: t.colors.surface },
  label: { ...t.typography.microLabel, color: t.colors.textMuted, position: 'absolute', top: t.spacing.xs, left: t.spacing.sm, zIndex: 1 },
  sheetRow: { width: '100%' },
  sheetImage: { width: '100%', backgroundColor: t.colors.surface },
}));

// ---- capture helpers (web only: they read the WebGL canvases and post PNGs to the sink) ----

const onWeb = () => typeof document !== 'undefined';

/** The WebGL canvases inside the tiles whose test id starts with `prefix`, in page order, with the rest of the id. */
async function tileCanvases(prefix: string): Promise<{ id: string; canvas: HTMLCanvasElement }[]> {
  if (!onWeb()) return [];
  // A hidden browser pane gets no layout passes, so the views never learn their size: a resize event makes them
  // measure themselves. Then draw a fresh frame into every view (twice: the paint textures upload, then the picture).
  window.dispatchEvent(new Event('resize'));
  await new Promise((r) => setTimeout(r, 300));
  for (let pass = 0; pass < 2; pass++) for (const draw of renderNow) draw();
  return Array.from(document.querySelectorAll<HTMLElement>(`[data-testid^="${prefix}"]`)).flatMap((el) => {
    const canvas = el.querySelector('canvas');
    const id = el.dataset.testid?.slice(prefix.length) ?? '';
    return canvas ? [{ id, canvas }] : [];
  });
}

async function post(name: string, dataUrl: string): Promise<void> {
  const r = await fetch(SINK, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name, dataUrl }) });
  if (!r.ok) throw new Error(`sink refused ${name}: ${await r.text()}`);
}

interface Cell {
  label: string;
  dataUrl: string;
  width: number;
  height: number;
}

/** Lays the pictures out in a grid, `columns` across, each with its label under it. Returns a JPEG data URL. */
async function compose(cells: readonly Cell[], columns: number): Promise<string> {
  const cellW = Math.max(...cells.map((c) => c.width));
  const cellH = Math.max(...cells.map((c) => c.height));
  const caption = 26;
  const rows = Math.ceil(cells.length / columns);
  const sheet = document.createElement('canvas');
  sheet.width = columns * cellW;
  sheet.height = rows * (cellH + caption);
  const ctx = sheet.getContext('2d')!;
  ctx.fillStyle = '#0e0e10';
  ctx.fillRect(0, 0, sheet.width, sheet.height);
  await Promise.all(
    cells.map(
      (cell, i) =>
        new Promise<void>((done) => {
          const img = new window.Image();
          img.onload = () => {
            const x = (i % columns) * cellW;
            const y = Math.floor(i / columns) * (cellH + caption);
            ctx.drawImage(img, x, y, cell.width, cell.height);
            ctx.fillStyle = '#d0d0d4';
            ctx.font = '15px sans-serif';
            ctx.fillText(cell.label, x + 8, y + cellH + 18);
            done();
          };
          img.onerror = () => done();
          img.src = cell.dataUrl;
        }),
    ),
  );
  return toDataUrl(sheet);
}

const snap = (id: string, canvas: HTMLCanvasElement): Cell => ({ label: id, dataUrl: toDataUrl(canvas), width: canvas.width, height: canvas.height });

/**
 * Saves every tile on the page: each as `<name>/<tile id>.jpg` and all of them together as `<name>.jpg`.
 * Called from the browser console as `__shoot('before/gen2022-ferrari')` while the sink server runs.
 */
async function shoot(name: string, columns = 2): Promise<string[]> {
  const cells = (await tileCanvases('car-view-')).map(({ id, canvas }) => snap(id, canvas));
  if (cells.length === 0) throw new Error('no tiles on the page');
  for (const cell of cells) await post(`${name}/${cell.label}`, cell.dataUrl);
  await post(name, await compose(cells, columns));
  return cells.map((c) => c.label);
}

type Params = { livery?: string; liveries?: string; view?: string; views?: string; shoot?: string; queue?: string; tile?: string; zoom?: string; sheet?: string; save?: string; yaw?: string; pitch?: string; bench?: string };

/** The liveries a contact sheet covers: one generation's, or all of them. */
function sheetLiveries(sheet: string) {
  return LIVERIES.filter((l) => sheet === 'all' || l.era === sheet);
}

/**
 * Dev only: cars from fixed angles, for checking the models and liveries against reference photos.
 *   ?livery=<id>                    one car from five angles (default ferrari-2022)
 *   &view=side|front|rear|top|three-quarter   just that angle, big
 *   &views=side,top,three-quarter    those angles, each big, one under the other
 *   &shoot=<folder>&queue=b,c       saves the tiles as <folder>/<livery>, then moves on to the next livery in the queue
 *   &tile=<px>                       the height of each tile
 *   &zoom=<factor>                   camera distance, below 1 is closer (multiplies each angle's own zoom)
 *   &yaw=<radians>&pitch=<radians>   with &view=, any camera angle (yaw 0 looks at the nose, pi/2 at the right side)
 *   ?liveries=a,b,c,d&view=side      several liveries side by side on the same model, one angle each
 *   ?sheet=gen2022|all&save=<name>   a contact sheet of every livery of a generation (three angles each);
 *                                    with `save`, it is posted to the sink server (tools/shot-sink.mjs) as <name>.jpg
 *   ?bench=1                         paints every livery's pictures (no cache) and lists the time each took
 * In the browser console, `__shoot('<name>')` saves the tiles on the page the same way.
 */
export default function CarViewsScreen() {
  const styles = useStyles();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<Params>();
  const sheet = params.sheet;

  useEffect(() => {
    if (onWeb()) (window as unknown as { __shoot?: typeof shoot }).__shoot = shoot;
  }, []);

  // unattended review: shoot this livery, then load the next one in the queue
  useEffect(() => {
    if (!params.shoot || !onWeb()) return;
    const timer = setTimeout(async () => {
      await shoot(`${params.shoot}/${params.livery ?? 'ferrari-2022'}`, 1);
      const [next, ...rest] = (params.queue ?? '').split(',').filter(Boolean);
      if (!next) return;
      const url = new URL(window.location.href);
      url.searchParams.set('livery', next);
      url.searchParams.set('queue', rest.join(','));
      window.location.replace(url.toString());
    }, SETTLE_MS * 3);
    return () => clearTimeout(timer);
  }, [params.shoot, params.livery, params.queue]);

  if (params.bench) return <BenchScreen />;
  if (sheet) return <SheetScreen era={sheet} save={params.save} zoom={params.zoom ? Number(params.zoom) : 0.8} />;

  const columns = width >= WIDE ? 2 : 1;
  const only = params.view;
  const tileHeight = params.tile ? Number(params.tile) : only || params.views ? Math.round(Math.min(width, 1400) * 0.55) : TILE_HEIGHT;
  const zoom = params.zoom ? Number(params.zoom) : 1;

  // several liveries on the same model, from one angle: the paint layer is generic if they all look right
  if (params.liveries) {
    const ids = params.liveries.split(',').filter(Boolean);
    const view = viewById(only);
    const tileWidth = columns === 1 ? '100%' : '49.5%';
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          {ids.length} liveries, {view.label.toLowerCase()} view, one model.
        </Text>
        <View style={styles.grid}>
          {ids.map((id) => (
            <View key={id} style={[styles.tile, { width: tileWidth, height: tileHeight }]} testID={`car-view-${id}`}>
              <Text style={styles.label}>{getLivery(id).name.toUpperCase()}</Text>
              <Car3DView car={{ liveryId: id, number: 16 }} height={tileHeight} autoSpin={false} zoom={view.zoom * zoom} fixedView={{ yaw: view.yaw, pitch: view.pitch }} capture />
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  const liveryId = params.livery ?? 'ferrari-2022';
  // ?view=side shows just that angle, big, for a close comparison with a photo; ?yaw= and ?pitch= move that camera
  const several = params.views?.split(',').filter(Boolean);
  const shown = VIEWS.filter((v) => (several ? several.includes(v.id) : !only || v.id === only)).map((v) => (only && (params.yaw || params.pitch) ? { ...v, yaw: params.yaw ? Number(params.yaw) : v.yaw, pitch: params.pitch ? Number(params.pitch) : v.pitch } : v));
  const tileWidth = only || several ? '100%' : columns === 1 ? '100%' : '49.5%';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        {liveryId}. Fixed cameras, no spinning. ?livery=id, ?view=side|front|rear|top|three-quarter, ?liveries=a,b,c, ?sheet=gen2022|all. Console: __shoot(&apos;name&apos;).
      </Text>
      <View style={styles.grid}>
        {shown.map((view) => (
          <View key={view.id} style={[styles.tile, { width: tileWidth, height: tileHeight }]} testID={`car-view-${view.id}`}>
            <Text style={styles.label}>{view.label.toUpperCase()}</Text>
            <Car3DView car={{ liveryId, number: 16 }} height={tileHeight} autoSpin={false} zoom={(only || several ? view.zoom * 0.84 : view.zoom) * zoom} fixedView={{ yaw: view.yaw, pitch: view.pitch }} capture />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

/**
 * The contact sheet: renders the liveries of a generation one after another on a small stage (three angles), keeps a
 * picture of each, and shows them all in a column. With `save`, the whole sheet is also posted to the sink server.
 */
function SheetScreen({ era, save, zoom }: { era: string; save?: string; zoom: number }) {
  const styles = useStyles();
  const liveries = sheetLiveries(era);
  const [index, setIndex] = useState(0);
  const [rows, setRows] = useState<Cell[]>([]);
  const [status, setStatus] = useState('rendering');
  const current = liveries[index];

  useEffect(() => {
    if (!current || !onWeb()) return;
    const timer = setTimeout(async () => {
      const cells = (await tileCanvases('sheet-')).map(({ id, canvas }) => snap(id, canvas));
      if (cells.length === 0) return;
      const row: Cell = { label: `${current.id}  (${current.team})`, dataUrl: await compose(cells, cells.length), width: cells.reduce((w, c) => w + c.width, 0), height: cells[0].height + 26 };
      setRows((r) => [...r, row]);
      setIndex((i) => i + 1);
    }, SETTLE_MS);
    return () => clearTimeout(timer);
  }, [current]);

  useEffect(() => {
    if (current || rows.length === 0 || !onWeb()) return;
    (async () => {
      if (save) {
        try {
          await post(save, await compose(rows, 1));
          setStatus(`saved ${save}.jpg`);
        } catch (e) {
          setStatus(`not saved: ${(e as Error).message}`);
        }
      } else setStatus('done');
    })();
  }, [current, rows, save]);

  const eraName = ERAS.find((e) => e.id === (era as EraId))?.name ?? era;
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        Contact sheet, {eraName}: {rows.length} / {liveries.length} liveries. {current ? `Rendering ${current.id}` : status}.
      </Text>
      {current && (
        <View style={styles.grid}>
          {SHEET_VIEWS.map((id) => {
            const view = viewById(id);
            return (
              <View key={id} style={[styles.tile, SHEET_TILE]} testID={`sheet-${id}`}>
                <Text style={styles.label}>{`${current.name} ${view.label}`.toUpperCase()}</Text>
                <Car3DView car={{ liveryId: current.id, number: 16 }} height={SHEET_TILE.height} autoSpin={false} zoom={view.zoom * zoom} fixedView={{ yaw: view.yaw, pitch: view.pitch }} capture />
              </View>
            );
          })}
        </View>
      )}
      {rows.map((row) => (
        <View key={row.label} style={styles.sheetRow} testID="sheet-row">
          <Text style={styles.intro}>{row.label}</Text>
          <Image source={{ uri: row.dataUrl }} style={[styles.sheetImage, { aspectRatio: row.width / row.height }]} resizeMode="contain" />
        </View>
      ))}
    </ScrollView>
  );
}

/** Times the painting of every livery's pictures (the CPU part of building a car), one after another, uncached. */
function BenchScreen() {
  const styles = useStyles();
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      const out: string[] = [];
      paintLivery(LIVERIES[0]); // warm up the code paths first
      let total = 0;
      for (const l of LIVERIES) {
        const t0 = performance.now();
        paintLivery(l);
        const ms = performance.now() - t0;
        total += ms;
        out.push(`${l.id} ${ms.toFixed(0)} ms`);
      }
      out.unshift(`average ${(total / LIVERIES.length).toFixed(0)} ms, max ${Math.max(...out.map((o) => Number(o.split(' ')[1]))).toFixed(0)} ms`);
      setLines(out);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.intro}>{lines.length ? 'Paint time per livery:' : 'Painting every livery...'}</Text>
      {lines.map((l) => (
        <Text key={l} style={styles.intro} testID="bench-line">
          {l}
        </Text>
      ))}
    </ScrollView>
  );
}
