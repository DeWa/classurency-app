import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors } from "../theme/colors";
import { font } from "../theme/typography";
import { radius } from "../theme/radius";

type Props = {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

export function GradientButton({
  onPress,
  disabled,
  loading,
  children,
  testID,
  style,
}: Props) {
  const dim = disabled || loading;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={dim}
      style={({ pressed }) => [
        styles.wrap,
        dim && styles.dim,
        pressed && !dim && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={[colors.electricIndigo, colors.electricIndigoLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.grad}
      >
        {loading ? (
          <ActivityIndicator color={colors.onIndigo} />
        ) : typeof children === "string" ? (
          <Text style={styles.text}>{children}</Text>
        ) : (
          children
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.card,
    overflow: "hidden",
  },
  grad: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  text: {
    fontFamily: font.bodySemi,
    fontSize: 16,
    color: colors.onIndigo,
  },
  dim: { opacity: 0.55 },
  pressed: { transform: [{ scale: 0.98 }] },
});
