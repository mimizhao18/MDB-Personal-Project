import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { loadDemoData } from '../storage/demo';
import { resetAllData } from '../storage/reset';
import { showAlert } from '../ui/alert';
import { colors, spacing } from '../theme';

/** Back to the previous screen, or Home if the page was opened directly (for example after a browser refresh). */
function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

// Kept minimal for now; sound, notifications and similar options can live here later.
export default function SettingsScreen() {
  const confirmReset = () => {
    showAlert(
      'Reset all data?',
      'This deletes every saved race and resets your XP, credits, streak and car. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset everything',
          style: 'destructive',
          onPress: () => {
            resetAllData().then(
              () => goBack(),
              () => showAlert('Could not reset', 'Something went wrong. Please try again.'),
            );
          },
        },
      ],
    );
  };

  const confirmDemo = () => {
    showAlert('Load demo data?', 'This replaces all your current data with example races, XP, credits and a streak.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Load demo data',
        onPress: () => {
          loadDemoData().then(
            () => goBack(),
            () => showAlert('Could not load demo data', 'Something went wrong. Please try again.'),
          );
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Data</Text>
      <Pressable style={styles.dangerButton} onPress={confirmReset}>
        <Text style={styles.dangerText}>Reset all data</Text>
      </Pressable>
      <Text style={styles.muted}>Your races and progress are saved only on this phone.</Text>

      {__DEV__ && (
        <>
          <Text style={styles.heading}>Demo (development only)</Text>
          <Pressable style={styles.demoButton} onPress={confirmDemo}>
            <Text style={styles.demoText}>Load demo data</Text>
          </Pressable>
          <Text style={styles.muted}>Fills the app with a week of example races, a 5-day streak and credits to spend. Use Reset all data to clear it.</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, gap: spacing.md },
  heading: { color: colors.text, fontSize: 20, fontWeight: '700' },
  muted: { color: colors.textMuted, fontSize: 14 },
  dangerButton: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.accent, borderRadius: 10, paddingVertical: spacing.md, alignItems: 'center' },
  demoButton: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.surfaceBorder, borderRadius: 10, paddingVertical: spacing.md, alignItems: 'center' },
  demoText: { color: colors.text, fontSize: 16, fontWeight: '700' },
  dangerText: { color: colors.accent, fontSize: 16, fontWeight: '700' },
});
