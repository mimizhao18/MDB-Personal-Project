import { DarkTheme, Stack, ThemeProvider, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';

import { colors } from '../theme';
import { TAB_PATHS, TabBar } from '../ui/TabBar';

// The navigator paints its own background behind every screen, so it needs the app's dark colors too (visible on web).
const appTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.background, card: colors.background, text: colors.text, border: colors.border },
};

// Home, Garage, History and Settings are the tabs: top-level screens, so no back button on them.
const topLevel = { headerBackVisible: false, headerLeft: () => null };

export default function RootLayout() {
  const pathname = usePathname();

  return (
    <ThemeProvider value={appTheme}>
      <View style={styles.page}>
        <View style={styles.app}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.text,
              headerTitleStyle: { fontWeight: '700', fontSize: 17 },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
            <Stack.Screen name="history" options={{ title: 'History', ...topLevel }} />
            <Stack.Screen name="garage" options={{ title: 'Garage', ...topLevel }} />
            <Stack.Screen name="settings" options={{ title: 'Settings', ...topLevel }} />
            <Stack.Screen name="car3d" options={{ title: '3D car (experimental)' }} />
            {/* Swipe-back is off here because dragging the race-length slider to the right looks like a back swipe. */}
            <Stack.Screen name="create-session" options={{ title: 'New Race', gestureEnabled: false }} />
            <Stack.Screen name="summary" options={{ title: 'Race Summary', headerBackVisible: false, headerLeft: () => null, gestureEnabled: false }} />
            <Stack.Screen name="session" options={{ title: 'Race', headerBackVisible: false, headerLeft: () => null, gestureEnabled: false }} />
          </Stack>
          {TAB_PATHS.includes(pathname) && <TabBar />}
        </View>
      </View>
    </ThemeProvider>
  );
}

// In a web browser the app is shown as a phone-sized column in the middle of the page.
const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', backgroundColor: Platform.OS === 'web' ? '#050505' : colors.background },
  app: { flex: 1, width: '100%', maxWidth: Platform.OS === 'web' ? 460 : undefined, backgroundColor: colors.background },
});
