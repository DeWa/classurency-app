import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../auth/AuthContext";
import { CurrencyText } from "../components/CurrencyText";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { font } from "../theme/typography";
import { layout } from "../theme/styles";
import type { TransactionsStackParamList } from "../navigation/types";

type R = RouteProp<TransactionsStackParamList, "TransactionDetail">;

export function TransactionDetailScreen() {
  const { t } = useTranslation();
  const { params } = useRoute<R>();
  const { state } = useAuth();
  const token = state.status === "authenticated" ? state.token : null;
  const tx = params.transaction;

  if (!token) return null;

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <View style={styles.card}>
        <Text style={[styles.label, styles.labelFirst]}>
          {t("transactions.type")}
        </Text>
        <Text style={styles.val}>{tx.type}</Text>
        <Text style={styles.label}>{t("transactions.amount")}</Text>
        <CurrencyText style={styles.amount}>{tx.amount}</CurrencyText>
        <Text style={styles.label}>{t("transactions.date")}</Text>
        <Text style={styles.valMono}>{tx.createdAt}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: {
    ...layout.screenPad,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.glass,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  label: {
    fontFamily: font.body,
    fontSize: 13,
    color: colors.textSubtle,
    marginTop: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  labelFirst: { marginTop: 0 },
  val: {
    fontFamily: font.bodySemi,
    fontSize: 18,
    color: colors.paperWhite,
    marginTop: 4,
  },
  valMono: {
    fontFamily: font.mono,
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 4,
  },
  amount: {
    fontSize: 28,
    marginTop: 6,
  },
});
