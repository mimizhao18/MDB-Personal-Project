import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

import { paintLogo } from '../../components/car3d/liveryRaster';
import { LOGOS } from '../../data/logos';
import type { Logo } from '../../data/logos';
import { makeStyles } from '../../design/styles';

const LIGHT = '#EDEDED';
const DARK = '#17171A';
const SINK = 'http://127.0.0.1:8787/save';

const useStyles = makeStyles((t) => ({
  content: { padding: t.spacing.screen, gap: t.spacing.md, paddingBottom: t.spacing.xxl },
  intro: { ...t.typography.caption, color: t.colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.sm },
  card: { gap: 2 },
  name: { ...t.typography.microLabel, color: t.colors.text },
}));

const onWeb = () => typeof document !== 'undefined';

/** The logo painted by the livery painter (not the browser), as a PNG data URL for display. Web only. */
function logoImage(logo: Logo, width: number, height: number, background: string): string {
  const pic = paintLogo(logo, width, height, background);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(new ImageData(new Uint8ClampedArray(pic.data), width, height), 0, 0);
  return canvas.toDataURL('image/png');
}

/** Lays the cards out as one sheet (name, light tile, dark tile) and posts it to the sink as a JPEG. */
async function saveSheet(name: string, logos: readonly Logo[], w: number, h: number, columns: number): Promise<string> {
  const cellW = w * 2 + 12;
  const cellH = h + 24;
  const rows = Math.ceil(logos.length / columns);
  const sheet = document.createElement('canvas');
  sheet.width = columns * cellW;
  sheet.height = rows * cellH;
  const ctx = sheet.getContext('2d')!;
  ctx.fillStyle = '#0e0e10';
  ctx.fillRect(0, 0, sheet.width, sheet.height);
  logos.forEach((logo, i) => {
    const x = (i % columns) * cellW;
    const y = Math.floor(i / columns) * cellH;
    for (const [k, bg] of [LIGHT, DARK].entries()) {
      const pic = paintLogo(logo, w, h, bg);
      ctx.putImageData(new ImageData(new Uint8ClampedArray(pic.data), w, h), x + k * (w + 4), y);
    }
    ctx.fillStyle = '#d0d0d4';
    ctx.font = '13px sans-serif';
    ctx.fillText(`${logo.name}  (${logo.id})`, x + 4, y + h + 16);
  });
  const r = await fetch(SINK, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name, dataUrl: sheet.toDataURL('image/jpeg', 0.9) }) });
  return r.ok ? `saved ${name}.jpg` : `not saved: ${await r.text()}`;
}

/**
 * Dev only: every logo of the library, painted by the livery painter on a light and a dark background.
 *   ?only=shell,petronas      just these logos
 *   &size=<px>                the height of each tile (default 120)
 *   &save=<name>              also post the whole page as one sheet to tools/shot-sink.mjs
 *   &cols=<n>                 columns on the saved sheet
 */
export default function LogosScreen() {
  const styles = useStyles();
  const params = useLocalSearchParams<{ only?: string; size?: string; save?: string; cols?: string }>();
  const h = params.size ? Number(params.size) : 120;
  const w = Math.round(h * 2.2);
  const logos = useMemo(() => {
    const only = params.only?.split(',').filter(Boolean);
    return only ? LOGOS.filter((l) => only.includes(l.id)) : LOGOS;
  }, [params.only]);
  const [images, setImages] = useState<Record<string, [string, string]>>({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!onWeb()) return;
    const timer = setTimeout(async () => {
      const out: Record<string, [string, string]> = {};
      for (const logo of logos) out[logo.id] = [logoImage(logo, w, h, LIGHT), logoImage(logo, w, h, DARK)];
      setImages(out);
      if (params.save) setStatus(await saveSheet(params.save, logos, w, h, Number(params.cols ?? 4)));
    }, 200);
    return () => clearTimeout(timer);
  }, [logos, w, h, params.save, params.cols]);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        {logos.length} logos, painted by the livery painter. ?only=a,b &size= &save= &cols= {status}
      </Text>
      <View style={styles.grid}>
        {logos.map((logo) => (
          <View key={logo.id} style={styles.card} testID={`logo-${logo.id}`}>
            <Text style={styles.name}>
              {logo.name} ({logo.id})
            </Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {images[logo.id]?.map((uri, i) => <Image key={i} source={{ uri }} style={{ width: w, height: h }} />)}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
