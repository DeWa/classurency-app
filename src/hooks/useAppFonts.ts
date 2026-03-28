import { useFonts } from 'expo-font';

import { fontModules } from '../theme/typography';

export function useAppFonts(): boolean {
  const [loaded] = useFonts(fontModules);
  return loaded;
}
