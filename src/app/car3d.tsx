import { Component, useMemo, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LIVERIES } from '../data/liveries';
import { makeStyles } from '../design/styles';
import type { CarSettings } from '../models/types';
import { Segmented } from '../ui/kit';

const IDS = LIVERIES.map((l) => l.id);

const useStyles = makeStyles((t) => ({
  safe: { flex: 1, gap: t.spacing.md },
  controls: { paddingHorizontal: t.spacing.md, gap: t.spacing.sm },
  hint: { ...t.type.caption, color: t.colors.textMuted, textAlign: 'center', paddingHorizontal: t.spacing.md },
  spacer: { flex: 1 },
  errorBox: { margin: t.spacing.md, padding: t.spacing.md, borderWidth: t.border.hairline, borderColor: t.colors.accent, maxHeight: 420 },
  errorTitle: { ...t.type.heading, color: t.colors.text, marginBottom: t.spacing.sm },
  errorText: { ...t.type.caption, color: t.colors.textMuted, marginBottom: t.spacing.sm },
}));

type Car3DViewComponent = ComponentType<{ car: CarSettings; height?: number }>;

/**
 * Loads the 3D view when this screen opens (not when the app starts), so a problem inside the 3D code on some device
 * cannot stop the rest of the app from starting. If loading fails, the real error is returned so it can be shown.
 */
function useCar3DView(): { View: Car3DViewComponent | null; error: Error | null } {
  return useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const loaded = require('../components/car3d/Car3DView') as { Car3DView?: Car3DViewComponent; default?: Car3DViewComponent };
      const view = loaded.Car3DView ?? loaded.default;
      if (!view) throw new Error(`The 3D module loaded but has no car view. It contains: ${Object.keys(loaded).join(', ') || '(nothing)'}`);
      return { View: view, error: null };
    } catch (e) {
      return { View: null, error: e instanceof Error ? e : new Error(String(e)) };
    }
  }, []);
}

/** Catches errors thrown while the 3D view draws, and prints them so we can see what went wrong on a device. */
class ErrorCatcher extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    return error ? <ErrorBox title="The 3D car stopped while drawing" error={error} /> : this.props.children;
  }
}

function ErrorBox({ title, error }: { title: string; error: Error }) {
  const styles = useStyles();
  return (
    <ScrollView style={styles.errorBox}>
      <Text style={styles.errorTitle}>{title}</Text>
      <Text selectable style={styles.errorText}>
        {error.name}: {error.message}
      </Text>
      <Text selectable style={styles.errorText}>
        {String(error.stack ?? '').slice(0, 1500)}
      </Text>
    </ScrollView>
  );
}

// Experimental: the 3D car, with a livery switch. Not linked from the main app yet.
export default function Car3DPreviewScreen() {
  const styles = useStyles();
  const [liveryId, setLiveryId] = useState(IDS[0]);
  const { View: Car3DView, error } = useCar3DView();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {error || !Car3DView ? (
        <ErrorBox title="The 3D car could not start" error={error ?? new Error('Unknown problem')} />
      ) : (
        <ErrorCatcher>
          <Car3DView car={{ liveryId, number: 1 }} height={420} />
        </ErrorCatcher>
      )}
      <Text style={styles.hint}>Drag to spin and tilt. It turns slowly when you let go.</Text>
      <View style={styles.controls}>
        <Segmented options={IDS} value={liveryId} onChange={setLiveryId} labelFor={(id) => LIVERIES.find((l) => l.id === id)?.name ?? id} />
      </View>
      <View style={styles.spacer} />
    </SafeAreaView>
  );
}
