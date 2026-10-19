import { useState } from 'react';
import type { ReactElement } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { specFor } from '../data/cars';
import { specFacts } from '../data/cars/spec';
import type { AeroMode } from '../data/cars/spec';
import type { EraId } from '../data/eras';
import { makeStyles } from '../design/styles';
import { Card, SectionLabel, Segmented } from '../ui/kit';

type Angle = 'front' | 'side' | 'top' | 'rear';
type RenderCompare = (props: { era: EraId; angle: Angle; aero?: AeroMode; height: number }) => ReactElement;

const ANGLES: readonly Angle[] = ['front', 'side', 'top', 'rear'];
const ANGLE_LABELS: Record<Angle, string> = { front: '3/4 front', side: 'Side', top: 'Top', rear: 'Rear' };
const MODES: readonly AeroMode[] = ['corner', 'straight'];
const MODE_LABELS: Record<AeroMode, string> = { corner: 'Cornering', straight: 'Straights (X-mode)' };

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
  /** How the 2026 number compares with the 2022 one, for the 2026 column. */
  delta?: string;
}

function rowsFor(era: EraId): Row[] {
  const is26 = era === 'gen2026';
  const f22 = specFacts(specFor('gen2022'), 'downwash');
  const f = is26 ? specFacts(specFor('gen2026'), 'compact') : f22;
  const spec = specFor(era);
  const diff = (a: number, b: number) => (is26 ? `${mm(a - b) > 0 ? '+' : ''}${mm(a - b)} mm` : undefined);
  return [
    { label: 'Wheelbase', value: `${mm(f.wheelbase)} mm`, delta: diff(f.wheelbase, f22.wheelbase) },
    { label: 'Overall width', value: `${mm(f.width)} mm`, delta: diff(f.width, f22.width) },
    { label: 'Front wing width', value: `${mm(f.frontWingWidth)} mm`, delta: diff(f.frontWingWidth, f22.frontWingWidth) },
    { label: 'Front tires', value: `${mm(f.frontTire)} mm`, delta: diff(f.frontTire, f22.frontTire) },
    { label: 'Rear tires', value: `${mm(f.rearTire)} mm`, delta: diff(f.rearTire, f22.rearTire) },
    { label: 'Sidepod width', value: `${mm(f.podWidth)} mm`, delta: diff(f.podWidth, f22.podWidth) },
    { label: 'Front wing', value: is26 ? '2 elements, active flap' : '4 elements, fixed' },
    { label: 'Rear wing', value: is26 ? 'Active, no DRS flap' : 'Fixed, DRS flap' },
    { label: 'Beam wing', value: spec.rearWing.beam.length > 0 ? 'Yes' : 'No' },
  ];
}

function CarPanel({ era, angle, aero, wide }: { era: EraId; angle: Angle; aero: AeroMode; wide: boolean }) {
  const styles = useStyles();
  const render = load3D();
  const label = era === 'gen2026' ? '2026 F1 Car' : '2022 F1 Car';
  return (
    <Card style={[styles.panel, wide && styles.panelWide]}>
      <View style={styles.view}>
        {render ? render({ era, angle, aero: era === 'gen2026' ? aero : 'corner', height: wide ? 300 : 250 }) : <Text style={styles.muted}>3D is not available on this device.</Text>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.rows}>
        {rowsFor(era).map((row) => (
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

/** The 2022 and 2026 cars side by side: same scale, same camera, same light, neutral paint. */
export default function CompareScreen() {
  const styles = useStyles();
  // Side by side only when the screen is wide enough to give each car room (on a phone they stack).
  const [width, setWidth] = useState(0);
  const [angle, setAngle] = useState<Angle>('front');
  const [aero, setAero] = useState<AeroMode>('corner');
  const wide = width >= 640;

  return (
    <ScrollView contentContainerStyle={styles.content} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <SectionLabel>View</SectionLabel>
      <Segmented options={ANGLES} value={angle} onChange={setAngle} labelFor={(a) => ANGLE_LABELS[a]} />
      <SectionLabel>2026 wings</SectionLabel>
      <Segmented options={MODES} value={aero} onChange={setAero} labelFor={(m) => MODE_LABELS[m]} />
      <Text style={styles.muted}>Cornering is the high-downforce setting; on the straights the 2026 car flattens its front and rear wing flaps. The 2022 wings are fixed.</Text>
      <View style={[styles.panels, wide && styles.panelsWide]}>
        <CarPanel era="gen2022" angle={angle} aero={aero} wide={wide} />
        <CarPanel era="gen2026" angle={angle} aero={aero} wide={wide} />
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
