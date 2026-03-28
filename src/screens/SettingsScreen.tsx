import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import * as api from "../api/api";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { GradientButton } from "../components/GradientButton";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { font } from "../theme/typography";
import { form, layout, type } from "../theme/styles";

const ROLES: api.UpdateUserRequestDto["type"][] = ["user", "provider", "admin"];

export function SettingsScreen() {
  const { t } = useTranslation();
  const { state, logout, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [typeIndex, setTypeIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.status !== "authenticated") return;
    setName(state.user.name);
    const idx = ROLES.indexOf(
      state.user.type as api.UpdateUserRequestDto["type"],
    );
    setTypeIndex(idx >= 0 ? idx : 0);
  }, [state]);

  const save = useCallback(async () => {
    if (state.status !== "authenticated") return;
    const role = ROLES[typeIndex] ?? "user";
    setLoading(true);
    try {
      await api.updateUser(state.token, state.user.id, {
        name: name.trim(),
        password,
        type: role,
      });
      await refreshUser();
      Alert.alert(t("settings.saved"));
    } catch (e) {
      Alert.alert(
        t("settings.error"),
        e instanceof ApiError ? e.message : String(e),
      );
    } finally {
      setLoading(false);
    }
  }, [name, password, refreshUser, state, t, typeIndex]);

  if (state.status !== "authenticated") return null;

  return (
    <ScrollView contentContainerStyle={styles.pad} testID="settingsScreen">
      <Text style={type.formLabel}>{t("settings.name")}</Text>
      <TextInput
        style={form.input}
        placeholderTextColor={colors.textSubtle}
        value={name}
        onChangeText={setName}
      />
      <Text style={type.formLabel}>{t("settings.password")}</Text>
      <TextInput
        style={form.input}
        placeholderTextColor={colors.textSubtle}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Required to save (API)"
      />
      <GradientButton
        style={styles.primaryBtn}
        onPress={() => void save()}
        disabled={loading}
        loading={loading}
      >
        {t("settings.save")}
      </GradientButton>
      <Pressable
        style={styles.secondary}
        onPress={() => void logout()}
        testID="logoutButton"
      >
        <Text style={styles.secondaryText}>{t("common.logout")}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: {
    ...layout.screenPad,
    flexGrow: 1,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  chipOn: {
    backgroundColor: colors.electricIndigo,
    borderColor: colors.electricIndigoLight,
  },
  chipText: {
    fontFamily: font.body,
    fontSize: 14,
    color: colors.textMuted,
    textTransform: "capitalize",
  },
  chipTextOn: {
    fontFamily: font.bodySemi,
    fontSize: 14,
    color: colors.onIndigo,
    textTransform: "capitalize",
  },
  primaryBtn: { marginTop: 8 },
  secondary: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  secondaryText: {
    fontFamily: font.bodySemi,
    fontSize: 16,
    color: colors.error,
  },
});
