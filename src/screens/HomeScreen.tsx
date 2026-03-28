import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../auth/AuthContext";
import { CurrencyText } from "../components/CurrencyText";
import { colors } from "../theme/colors";
import { font } from "../theme/typography";
import { layout, type } from "../theme/styles";
import { radius } from "../theme/radius";

export function HomeScreen() {
  const { t } = useTranslation();
  const { state } = useAuth();
  const user = state.status === "authenticated" ? state.user : null;

  const roleLabel = useMemo(() => {
    if (!user) return "";
    return user.type;
  }, [user]);

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.pad} testID="homeScreen">
      <Text style={type.title}>{t("home.welcome", { name: user.name })}</Text>
      <View style={styles.rolePill}>
        <Text style={styles.roleText}>
          {t("home.role", { role: roleLabel })}
        </Text>
      </View>

      {user.type === "provider" && !user.providerId ? (
        <Text style={styles.warning}>{t("home.providerNoId")}</Text>
      ) : null}

      {user.accounts && user.accounts.length > 0 ? (
        <>
          <Text style={type.section}>{t("home.balances")}</Text>
          {user.accounts.map((a) => (
            <View key={a.id} style={styles.balanceCard}>
              <Text style={styles.accountId} numberOfLines={1}>
                {a.id.slice(0, 8)}…
              </Text>
              <CurrencyText style={styles.balanceAmount}>
                {a.balance}
              </CurrencyText>
            </View>
          ))}
        </>
      ) : user.type === "user" ||
        user.type === "provider" ||
        user.type === "admin" ? (
        <Text style={type.muted}>{t("home.noAccounts")}</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: {
    ...layout.screenPad,
    flexGrow: 1,
  },
  rolePill: {
    alignSelf: "flex-start",
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.chip,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  roleText: {
    fontFamily: font.body,
    fontSize: 13,
    color: colors.electricIndigo,
    textTransform: "capitalize",
  },
  warning: {
    fontFamily: font.body,
    fontSize: 15,
    color: colors.vendingAmber,
    marginTop: 8,
  },
  balanceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.glass,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  accountId: {
    fontFamily: font.mono,
    fontSize: 14,
    color: colors.textMuted,
    flex: 1,
    marginRight: 12,
  },
  balanceAmount: {
    fontSize: 20,
  },
});
