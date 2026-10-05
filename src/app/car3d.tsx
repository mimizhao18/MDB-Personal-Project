import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Car3DView } from '../components/car3d/Car3DView';
import { LIVERIES } from '../data/liveries';
import { makeStyles } from '../design/styles';
import { Segmented } from '../ui/kit';

const IDS = LIVERIES.map((l) => l.id);

const useStyles = makeStyles((t) => ({
  safe: { flex: 1, gap: t.spacing.md },
  controls: { paddingHorizontal: t.spacing.md, gap: t.spacing.sm },
  hint: { ...t.type.caption, color: t.colors.textMuted, textAlign: 'center', paddingHorizontal: t.spacing.md },
  spacer: { flex: 1 },
}));

// Experimental: the 3D car, with a livery switch. Not linked from the main app yet.
export default function Car3DPreviewScreen() {
  const styles = useStyles();
  const [liveryId, setLiveryId] = useState(IDS[0]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Car3DView car={{ liveryId, number: 1 }} height={420} />
      <Text style={styles.hint}>Drag to spin and tilt. It turns slowly when you let go.</Text>
      <View style={styles.controls}>
        <Segmented options={IDS} value={liveryId} onChange={setLiveryId} labelFor={(id) => LIVERIES.find((l) => l.id === id)?.name ?? id} />
      </View>
      <View style={styles.spacer} />
    </SafeAreaView>
  );
}
