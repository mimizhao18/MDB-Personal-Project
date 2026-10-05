import { DarkTheme, Stack, ThemeProvider, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';

import { DesignLab } from '../design/DesignLab';
import { DesignProvider, useDesign } from '../design/DesignProvider';
import { colors } from '../theme';
import { TAB_PATHS, TabBar } from '../ui/TabBar';

// The navigator paints its own background behind every screen, so it needs the app's dark colors too (visible on web).
const appTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.background, card: colors.background, text: colors.text, border: colors.border },
};

export default function RootLayout() {
  return (
    <DesignProvider>
      <Shell />
    </DesignProvider>
  );
}

function Shell() {
  const { settings } = useDesign();
  const pathname = usePathname();
  const tabs = settings.nav === 'tabs';
  const showTabBar = tabs && TAB_PATHS.includes(pathname);
  // With the tab bar, Garage, History and Settings are top-level screens, so they get no back button.
  const topLevel = tabs ? { headerBackVisible: false, headerLeft: () => null } : {};

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
            {/* The header is hidden, but the title is still what back buttons on other screens show. */}
            <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
            <Stack.Screen name="history" options={{ title: 'History', ...topLevel }} />
            <Stack.Screen name="garage" options={{ title: 'Garage', ...topLevel }} />
            <Stack.Screen name="settings" options={{ title: 'Settings', ...topLevel }} />
            {/* Swipe-back is off here because dragging the race-length slider to the right looks like a back swipe. */}
            <Stack.Screen name="create-session" options={{ title: 'New Race', gestureEnabled: false }} />
            <Stack.Screen name="summary" options={{ title: 'Race Summary', headerBackVisible: false, headerLeft: () => null, gestureEnabled: false }} />
            <Stack.Screen name="session" options={{ title: 'Race', headerBackVisible: false, headerLeft: () => null, gestureEnabled: false }} />
          </Stack>
          {showTabBar && <TabBar />}
          <DesignLab />
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
