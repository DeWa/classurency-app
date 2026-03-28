import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, StyleSheet, Text, TextInput } from "react-native";

import * as api from "../../api/api";
import { ApiError } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { AccountIdPicker } from "../../components/AccountIdPicker";
import { GradientButton } from "../../components/GradientButton";
import { colors } from "../../theme/colors";
import { form, layout, type } from "../../theme/styles";

export function MintScreen() {
  const { t } = useTranslation();
  const { state } = useAuth();
  const token = state.status === "authenticated" ? state.token : null;
  const [adminUserAccountId, setAdminUserAccountId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const user = state.status === "authenticated" ? state.user : null;

  const submit = useCallback(async () => {
    if (!token) return;
    const n = Number(amount);
    if (Number.isNaN(n) || n <= 0) {
      Alert.alert(t("settings.error"), "Invalid amount");
      return;
    }
    setLoading(true);
    try {
      const res = await api.mint(token, {
        adminUserAccountId: adminUserAccountId.trim(),
        accountId: accountId.trim(),
        amount: n,
        description: description.trim() || undefined,
      });
      Alert.alert(
        t("mint.title"),
        t("mint.balanceAfter", { balance: res.balance }),
      );
    } catch (e) {
      Alert.alert(
        t("settings.error"),
        e instanceof ApiError ? e.message : String(e),
      );
    } finally {
      setLoading(false);
    }
  }, [accountId, adminUserAccountId, amount, description, t, token]);

  return (
    <ScrollView
      contentContainerStyle={styles.pad}
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
    >
      <AccountIdPicker
        token={token}
        label={t("mint.adminUserAccountId")}
        value={adminUserAccountId}
        onChange={setAdminUserAccountId}
        ownerUserId={user?.id}
      />
      <AccountIdPicker
        token={token}
        label={t("mint.accountId")}
        value={accountId}
        onChange={setAccountId}
      />
      <Text style={type.formLabel}>{t("mint.amount")}</Text>
      <TextInput
        style={form.input}
        placeholderTextColor={colors.textSubtle}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />
      <Text style={type.formLabel}>{t("mint.description")}</Text>
      <TextInput
        style={form.input}
        placeholderTextColor={colors.textSubtle}
        value={description}
        onChangeText={setDescription}
      />
      <GradientButton
        onPress={() => void submit()}
        disabled={loading}
        loading={loading}
      >
        {t("mint.submit")}
      </GradientButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: {
    ...layout.screenPad,
    flexGrow: 1,
  },
});
