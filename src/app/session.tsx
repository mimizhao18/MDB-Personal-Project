import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TRACKS } from '../data/tracks';
import { lapsToSeconds } from '../logic/rewards';
import { formatDurationWords } from '../logic/sessionOptions';
import { colors, spacing } from '../theme';

// Placeholder: the live focus session (timer, car, pause/end) is built in step 6.
export default function SessionScreen() {
  const params = useLocalSearchParams<{ track?: string; laps?: string }>();
  const track = params.track === 'silverstone' ? TRACKS.silverstone : undefined;
  const laps = Number(params.laps);

  if (!track || !Number.isInteger(laps) || laps < 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Missing or invalid race settings.</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/create-session')}>
          <Text style={styles.buttonText}>Back to setup</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Race setup received</Text>
      <Text style={styles.detail}>Track: {track.name}</Text>
      <Text style={styles.detail}>Laps: {laps}</Text>
      <Text style={styles.detail}>Focus time: {formatDurationWords(lapsToSeconds(track, laps))}</Text>
      <Text style={styles.muted}>The live race screen is coming in step 6.</Text>
      <Pressable style={styles.button} onPress={() => router.replace('/')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md },
  text: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: spacing.sm },
  detail: { color: colors.text, fontSize: 16 },
  muted: { color: colors.textMuted, fontSize: 14, marginTop: spacing.md },
  button: { marginTop: spacing.lg, backgroundColor: colors.accent, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: 10 },
  buttonText: { color: colors.accentText, fontSize: 16, fontWeight: '700' },
});
