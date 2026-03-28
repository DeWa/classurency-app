import React from "react";
import { Platform, StyleSheet, Text, type TextProps } from "react-native";

import { colors } from "../theme/colors";
import { font } from "../theme/typography";

type Props = TextProps & { children: React.ReactNode };

export function CurrencyText({ style, children, ...rest }: Props) {
  return (
    <Text style={[styles.base, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: font.monoBold,
    fontSize: 18,
    color: colors.mint,
    fontWeight: Platform.OS === "android" ? "700" : undefined,
    ...Platform.select({
      ios: {
        textShadowColor: colors.mintGlow,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
      },
      android: {
        textShadowColor: colors.mintGlow,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
      },
      default: {},
    }),
  },
});
