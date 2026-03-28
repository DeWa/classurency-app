import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';

/** Font modules for `useFonts` — keys match `fontFamily` strings below */
export const fontModules = {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} as const;

/** Loaded font family names for Text / TextInput styles */
export const font = {
  body: 'Inter_400Regular',
  bodySemi: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  mono: 'SpaceMono_400Regular',
  monoBold: 'SpaceMono_700Bold',
} as const;
