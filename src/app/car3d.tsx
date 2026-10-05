import { Component, Suspense, lazy, useState } from 'react';
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LIVERIES } from '../data/liveries';
import { makeStyles } from '../design/styles';
import { Segmented } from '../ui/kit';

// The 3D code is only loaded when this screen opens (not when the app starts), so a problem in it on some device
// cannot stop the rest of the app from starting. If it fails, the error is shown below instead of crashing.
const Car3DView = lazy(() => import('../components/car3d/Car3DView').then((m) => ({ default: m.Car3DView })));

const IDS = LIVERIES.map((l) => l.id);

const useStyles = makeStyles((t) => ({
  safe: { flex: 1, gap: t.spacing.md },
  controls: { paddingHorizontal: t.spacing.md, gap: t.spacing.sm },
  hint: { ...t.type.caption, color: t.colors.textMuted, textAlign: 'center', paddingHorizontal: t.spacing.md },
  spacer: { flex: 1 },
  stage: { height: 420, alignItems: 'center', justifyContent: 'center', backgroundColor: t.colors.background },
  errorBox: { margin: t.spacing.md, padding: t.spacing.md, borderWidth: t.border.hairline, borderColor: t.colors.accent, gap: t.spacing.sm },
  errorTitle: { ...t.type.heading, color: t.colors.text },
  errorText: { ...t.type.caption, color: t.colors.textMuted },
}));

/** Catches errors from the 3D view and prints them, so we can see what went wrong on a device. */
class ErrorCatcher extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return <ErrorBox error={error} />;
  }
}

function ErrorBox({ error }: { error: Error }) {
  const styles = useStyles();
  return (
    <ScrollView style={styles.errorBox}>
      <Text style={styles.errorTitle}>The 3D car could not start</Text>
      <Text style={styles.errorText}>{error.message}</Text>
      <Text style={styles.errorText}>{String(error.stack ?? '').slice(0, 1200)}</Text>
    </ScrollView>
  );
}

// Experimental: the 3D car, with a livery switch. Not linked from the main app yet.
export default function Car3DPreviewScreen() {
  const styles = useStyles();
  const [liveryId, setLiveryId] = useState(IDS[0]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ErrorCatcher>
        <Suspense
          fallback={
            <View style={styles.stage}>
              <Text style={styles.hint}>Loading 3D…</Text>
            </View>
          }
        >
          <Car3DView car={{ liveryId, number: 1 }} height={420} />
        </Suspense>
      </ErrorCatcher>
      <Text style={styles.hint}>Drag to spin and tilt. It turns slowly when you let go.</Text>
      <View style={styles.controls}>
        <Segmented options={IDS} value={liveryId} onChange={setLiveryId} labelFor={(id) => LIVERIES.find((l) => l.id === id)?.name ?? id} />
      </View>
      <View style={styles.spacer} />
    </SafeAreaView>
  );
}
