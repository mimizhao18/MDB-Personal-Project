// Each weight is imported from its own folder so that only the six files we use are bundled.
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono/400Regular';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono/500Medium';
import { JetBrainsMono_600SemiBold } from '@expo-google-fonts/jetbrains-mono/600SemiBold';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';

import { fonts } from './tokens';

/** Loads the app's fonts (Inter, JetBrains Mono) and the icon font. The names match `fonts` in tokens.ts. */
export function useAppFonts(): [loaded: boolean, error: Error | null] {
  return useFonts({
    [fonts.regular]: Inter_400Regular,
    [fonts.medium]: Inter_500Medium,
    [fonts.semibold]: Inter_600SemiBold,
    [fonts.mono]: JetBrainsMono_400Regular,
    [fonts.monoMedium]: JetBrainsMono_500Medium,
    [fonts.monoSemibold]: JetBrainsMono_600SemiBold,
    ...Ionicons.font,
  });
}
