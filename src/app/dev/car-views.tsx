import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { Car3DView } from '../../components/car3d/Car3DView';
import { makeStyles } from '../../design/styles';

/** The five fixed camera angles, each with how close the camera goes (below 1 is closer). x runs along the car, so yaw 0 looks at the nose. */
const VIEWS = [
  { id: 'three-quarter', label: 'Three-quarter', yaw: 0.75, pitch: 0.2, zoom: 1 },
  { id: 'side', label: 'Side', yaw: Math.PI / 2, pitch: 0.02, zoom: 1 },
  { id: 'front', label: 'Front', yaw: 0, pitch: 0.06, zoom: 0.62 },
  { id: 'rear', label: 'Rear', yaw: Math.PI, pitch: 0.06, zoom: 0.62 },
  { id: 'top', label: 'Top', yaw: -Math.PI / 2, pitch: 1.5, zoom: 1 },
] as const;

const TILE_HEIGHT = 260;
const WIDE = 760; // from this window width on, two views sit side by side

const useStyles = makeStyles((t) => ({
  content: { padding: t.spacing.screen, gap: t.spacing.md, paddingBottom: t.spacing.xxl },
  intro: { ...t.typography.caption, color: t.colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.sm },
  tile: { overflow: 'hidden', borderWidth: t.border.hairline, borderColor: t.colors.border, backgroundColor: t.colors.surface },
  label: { ...t.typography.microLabel, color: t.colors.textMuted, position: 'absolute', top: t.spacing.xs, left: t.spacing.sm, zIndex: 1 },
}));

/**
 * Dev only: one car from five fixed angles at once, for checking its shape against reference photos.
 * Pick the livery with `?livery=<id>` (default ferrari-2022).
 */
export default function CarViewsScreen() {
  const styles = useStyles();
  const { width } = useWindowDimensions();
  const { livery } = useLocalSearchParams<{ livery?: string }>();
  const liveryId = livery ?? 'ferrari-2022';
  const columns = width >= WIDE ? 2 : 1;
  const tileWidth = columns === 1 ? '100%' : '49.5%';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.intro}>{liveryId}. Fixed cameras, no spinning. Change the car with ?livery=id.</Text>
      <View style={styles.grid}>
        {VIEWS.map((view) => (
          <View key={view.id} style={[styles.tile, { width: tileWidth, height: TILE_HEIGHT }]} testID={`car-view-${view.id}`}>
            <Text style={styles.label}>{view.label.toUpperCase()}</Text>
            <Car3DView car={{ liveryId, number: 16 }} height={TILE_HEIGHT} autoSpin={false} zoom={view.zoom} fixedView={{ yaw: view.yaw, pitch: view.pitch }} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
