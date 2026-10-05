import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { makeStyles } from '../design/styles';
import { loadDemoData } from '../storage/demo';
import { resetAllData } from '../storage/reset';
import { showAlert } from '../ui/alert';
import { Button, SectionLabel } from '../ui/kit';

/** Back to the previous screen, or Home if the page was opened directly (for example after a browser refresh). */
function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

// Kept minimal for now; sound, notifications and similar options can live here later.
export default function SettingsScreen() {
  const styles = useStyles();
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
      <SectionLabel>Data</SectionLabel>
      <Button label="Reset all data" variant="secondary" onPress={confirmReset} />
      <Text style={styles.muted}>Your races and progress are saved only on this phone.</Text>

      {__DEV__ && (
        <>
          <SectionLabel>Demo (development only)</SectionLabel>
          <Button label="Load demo data" variant="secondary" onPress={confirmDemo} />
          <Text style={styles.muted}>Fills the app with a week of example races, a 5-day streak and credits to spend. Use Reset all data to clear it.</Text>
        </>
      )}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: { flex: 1, padding: t.spacing.md, gap: t.spacing.md },
  muted: { ...t.type.caption, color: t.colors.textMuted },
}));
