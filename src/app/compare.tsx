import { useState } from 'react';
import type { ReactElement } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { specFor } from '../data/cars';
import { specFacts } from '../data/cars/spec';
import type { AeroMode } from '../data/cars/spec';
import { ERAS, getEra } from '../data/eras';
import type { EraId } from '../data/eras';
import { COMPARISON_LIVERIES } from '../data/liveries';
import { makeStyles } from '../design/styles';
import { Card, SectionLabel, Segmented } from '../ui/kit';

type Angle = 'front' | 'side' | 'top' | 'rear';
type RenderCompare = (props: { era: EraId; angle: Angle; aero?: AeroMode; height: number }) => ReactElement;

const ANGLES: readonly Angle[] = ['front', 'side', 'top', 'rear'];
const ANGLE_LABELS: Record<Angle, string> = { front: '3/4 front', side: 'Side', top: 'Top', rear: 'Rear' };
const MODES: readonly AeroMode[] = ['corner', 'straight'];
const MODE_LABELS: Record<AeroMode, string> = { corner: 'Cornering', straight: 'Straights (X-mode)' };
const ERA_IDS = ERAS.map((e) => e.id);

/** Loads the 3D view the first time it is needed, and gives up quietly if this device cannot run it. */
let cached: RenderCompare | null | undefined;
function load3D(): RenderCompare | null {
  if (cached !== undefined) return cached;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const loaded = require('../components/car3d/CompareView') as { renderCompareView?: RenderCompare };
    cached = loaded.renderCompareView ?? null;
  } catch {
    cached = null;
  }
  return cached;
}

const mm = (metres: number) => Math.round(metres * 1000);

interface Row {
  label: string;
  value: string;
  /** How this car's number compares with the first car's, for the second column. */
  delta?: string;
}

/** The numbers and features of a generation's car, with the differences from `base` when it is a different one. */
function rowsFor(era: EraId, base: EraId): Row[] {
  const spec = specFor(era);
  const f = specFacts(spec, COMPARISON_LIVERIES[era].sidepod);
  const b = specFacts(specFor(base), COMPARISON_LIVERIES[base].sidepod);
  const diff = (a: number, c: number) => {
    if (era === base) return undefined;
    const d = mm(a) - mm(c);
    return `${d > 0 ? '+' : ''}${d} mm`;
  };
  return [
    { label: 'Wheelbase', value: `${mm(f.wheelbase)} mm`, delta: diff(f.wheelbase, b.wheelbase) },
    { label: 'Overall width', value: `${mm(f.width)} mm`, delta: diff(f.width, b.width) },
    { label: 'Front wing width', value: `${mm(f.frontWingWidth)} mm`, delta: diff(f.frontWingWidth, b.frontWingWidth) },
    { label: 'Front tires', value: `${mm(f.frontTire)} mm`, delta: diff(f.frontTire, b.frontTire) },
    { label: 'Rear tires', value: `${mm(f.rearTire)} mm`, delta: diff(f.rearTire, b.rearTire) },
    { label: 'Wheels', value: `${spec.wheelLook.style === 'cover' ? 'Covered' : spec.wheelLook.style === 'spokes' ? 'Spoked' : 'Gold dish'}${spec.wheelLook.grooves > 0 ? ', grooved tires' : ''}` },
    { label: 'Sidepod width', value: `${mm(f.podWidth)} mm`, delta: diff(f.podWidth, b.podWidth) },
    { label: 'Front wing', value: spec.notes.frontWing },
    { label: 'Rear wing', value: spec.notes.rearWing },
    { label: 'Beam wing', value: spec.rearWing.beam.length > 0 ? 'Yes' : 'No' },
    { label: 'Halo', value: spec.halo ? 'Yes' : 'No' },
  ];
}

function CarPanel({ era, base, angle, aero, wide }: { era: EraId; base: EraId; angle: Angle; aero: AeroMode; wide: boolean }) {
  const styles = useStyles();
  const render = load3D();
  return (
    <Card style={[styles.panel, wide && styles.panelWide]}>
      <View style={styles.view}>
        {render ? render({ era, angle, aero: era === 'gen2026' ? aero : 'corner', height: wide ? 300 : 250 }) : <Text style={styles.muted}>3D is not available on this device.</Text>}
        <Text style={styles.label}>{`${getEra(era).name} F1 Car`}</Text>
      </View>
      <View style={styles.rows}>
        {rowsFor(era, base).map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowValue}>
              {row.value}
              {row.delta ? <Text style={styles.delta}>{`  ${row.delta}`}</Text> : null}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

/** Two generations side by side: same scale, same camera, same light, neutral paint. */
export default function CompareScreen() {
  const styles = useStyles();
  // Side by side only when the screen is wide enough to give each car room (on a phone they stack).
  const [width, setWidth] = useState(0);
  const [angle, setAngle] = useState<Angle>('front');
  const [aero, setAero] = useState<AeroMode>('corner');
  const [left, setLeft] = useState<EraId>('gen2022');
  const [right, setRight] = useState<EraId>('gen2026');
  const wide = width >= 640;
  const eraLabel = (id: EraId) => getEra(id).name;

  return (
    <ScrollView contentContainerStyle={styles.content} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <SectionLabel>View</SectionLabel>
      <Segmented options={ANGLES} value={angle} onChange={setAngle} labelFor={(a) => ANGLE_LABELS[a]} />
      <SectionLabel>First car</SectionLabel>
      <Segmented options={ERA_IDS} value={left} onChange={setLeft} labelFor={eraLabel} />
      <SectionLabel>Second car</SectionLabel>
      <Segmented options={ERA_IDS} value={right} onChange={setRight} labelFor={eraLabel} />
      <SectionLabel>2026 wings</SectionLabel>
      <Segmented options={MODES} value={aero} onChange={setAero} labelFor={(m) => MODE_LABELS[m]} />
      <Text style={styles.muted}>Cornering is the high-downforce setting; on the straights the 2026 car flattens its front and rear wing flaps. Every other wing is fixed.</Text>
      <View style={[styles.panels, wide && styles.panelsWide]}>
        <CarPanel era={left} base={left} angle={angle} aero={aero} wide={wide} />
        <CarPanel era={right} base={left} angle={angle} aero={aero} wide={wide} />
      </View>
    </ScrollView>
  );
}

const useStyles = makeStyles((t) => ({
  content: { padding: t.spacing.md, gap: t.spacing.sm },
  muted: { ...t.type.caption, color: t.colors.textMuted },
  panels: { gap: t.spacing.md, marginTop: t.spacing.sm },
  panelsWide: { flexDirection: 'row' },
  panel: { gap: t.spacing.sm, padding: 0, overflow: 'hidden' },
  panelWide: { flex: 1 },
  view: { alignItems: 'center', justifyContent: 'center' },
  label: { position: 'absolute', top: t.spacing.sm, left: t.spacing.md, ...t.type.label, color: t.colors.textMuted },
  rows: { paddingHorizontal: t.spacing.md, paddingBottom: t.spacing.md, gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: t.spacing.sm },
  rowLabel: { ...t.type.caption, color: t.colors.textMuted },
  rowValue: { ...t.type.caption, color: t.colors.text, fontWeight: '600', textAlign: 'right', flexShrink: 1 },
  delta: { color: t.colors.textMuted, fontWeight: '400' },
}));
