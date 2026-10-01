import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="history" options={{ title: 'History' }} />
        <Stack.Screen name="garage" options={{ title: 'Garage' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        {/* Swipe-back is off here because dragging the race-length slider to the right looks like a back swipe. */}
        <Stack.Screen name="create-session" options={{ title: 'New Race', gestureEnabled: false }} />
        <Stack.Screen name="summary" options={{ title: 'Race Summary', headerBackVisible: false, gestureEnabled: false }} />
        <Stack.Screen name="session" options={{ title: 'Race', headerBackVisible: false, gestureEnabled: false }} />
      </Stack>
    </>
  );
}
