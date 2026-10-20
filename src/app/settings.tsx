import { router } from 'expo-router';
import { View } from 'react-native';

import { ListRow, SectionLabel } from '../components/ui';
import { makeStyles } from '../design/styles';
import { loadDemoData } from '../storage/demo';
import { resetAllData } from '../storage/reset';
import { showAlert } from '../ui/alert';

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
      <View style={styles.section}>
        <SectionLabel>Cars</SectionLabel>
        <ListRow title="Compare generations" subtitle="Any two generations side by side, at the same scale and angle." onPress={() => router.push('/compare')} last />
      </View>

      <View style={styles.section}>
        <SectionLabel>Data</SectionLabel>
        <ListRow title="Reset all data" subtitle="Your races and progress are saved only on this phone." destructive chevron={false} onPress={confirmReset} last />
      </View>

      {__DEV__ && (
        <View style={styles.section}>
          <SectionLabel>Development only</SectionLabel>
          <View>
            <ListRow title="Load demo data" subtitle="A week of example races, a 5-day streak and credits to spend. Reset all data clears it." chevron={false} onPress={confirmDemo} />
            <ListRow title="Design system" subtitle="Every color, text style and shared component on one page." onPress={() => router.push('/dev/design-system')} last />
          </View>
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: { flex: 1, padding: t.spacing.screen, gap: t.spacing.xl },
  section: { gap: t.spacing.xs },
}));
