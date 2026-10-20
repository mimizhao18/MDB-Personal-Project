import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeView } from '../components/home/HomeView';
import { useHomeData } from '../components/home/useHomeData';
import { makeStyles } from '../design/styles';

const useStyles = makeStyles(() => ({
  safe: { flex: 1 },
}));

export default function HomeScreen() {
  const styles = useStyles();
  const data = useHomeData();
  return (
    <SafeAreaView style={styles.safe}>
      <HomeView data={data} onStart={() => router.push('/create-session')} />
    </SafeAreaView>
  );
}
