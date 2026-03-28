import { DarkTheme, type Theme } from '@react-navigation/native';

import { colors } from './colors';

/** React Navigation theme aligned with Deep Scholastic + Electric Indigo */
export const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.electricIndigo,
    background: colors.deepScholastic,
    card: colors.card,
    text: colors.paperWhite,
    border: colors.border,
    notification: colors.mint,
  },
};
