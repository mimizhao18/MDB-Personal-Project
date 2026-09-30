import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { resetAllData } from '../storage/reset';
import { colors, spacing } from '../theme';

// Kept minimal for now; sound, notifications and similar options can live here later.
export default function SettingsScreen() {
  const confirmReset = () => {
    Alert.alert(
      'Reset all data?',
      'This deletes every saved race and resets your XP, credits, streak and car. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset everything',
          style: 'destructive',
          onPress: () => {
            resetAllData().then(
              () => router.back(),
              () => Alert.alert('Could not reset', 'Something went wrong. Please try again.'),
            );
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Data</Text>
      <Pressable style={styles.dangerButton} onPress={confirmReset}>
        <Text style={styles.dangerText}>Reset all data</Text>
      </Pressable>
      <Text style={styles.muted}>Your races and progress are saved only on this phone.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, gap: spacing.md },
  heading: { color: colors.text, fontSize: 20, fontWeight: '700' },
  muted: { color: colors.textMuted, fontSize: 14 },
  dangerButton: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.accent, borderRadius: 10, paddingVertical: spacing.md, alignItems: 'center' },
  dangerText: { color: colors.accent, fontSize: 16, fontWeight: '700' },
});
