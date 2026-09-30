import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme';

// Placeholder: the real Home Screen (car, stats, settings) comes in step 8.
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Pressable style={styles.button} onPress={() => router.push('/create-session')}>
        <Text style={styles.buttonText}>Start Race</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  title: { color: colors.text, fontSize: 24 },
  button: { backgroundColor: colors.accent, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: 10 },
  buttonText: { color: colors.accentText, fontSize: 18, fontWeight: '700' },
});
