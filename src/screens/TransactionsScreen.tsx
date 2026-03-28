import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import * as api from "../api/api";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { CurrencyText } from "../components/CurrencyText";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { font } from "../theme/typography";
import { layout, list } from "../theme/styles";
import type { TransactionsStackParamList } from "../navigation/types";

type Nav = NativeStackNavigationProp<
  TransactionsStackParamList,
  "TransactionList"
>;

export function TransactionsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const { state } = useAuth();
  const token = state.status === "authenticated" ? state.token : null;
  const accounts =
    state.status === "authenticated" ? (state.user.accounts ?? []) : [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [items, setItems] = useState<api.TransactionResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountPickerOpen, setAccountPickerOpen] = useState(false);

  const selectedAccount = useMemo(() => {
    if (accounts.length === 0) return undefined;
    return accounts[Math.min(selectedIndex, accounts.length - 1)];
  }, [accounts, selectedIndex]);

  const selectedAccountId = selectedAccount?.id;

  useEffect(() => {
    if (selectedIndex >= accounts.length) {
      setSelectedIndex(0);
    }
  }, [accounts.length, selectedIndex]);

  const load = useCallback(async () => {
    if (!token || !selectedAccountId) return;
    setLoading(true);
    setError(null);
    try {
      const loaded = await api.listAccountTransactions(
        token,
        selectedAccountId,
        100,
      );
      setItems(loaded);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [token, selectedAccountId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!token) return null;

  if (accounts.length === 0) {
    return (
      <View style={layout.center}>
        <Text style={styles.hint}>{t("transactions.noAccount")}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={layout.center}>
        <ActivityIndicator color={colors.mint} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={layout.center}>
        <Text style={styles.err}>{error}</Text>
        <Pressable onPress={() => void load()} style={styles.retry}>
          <Text style={styles.retryText}>{t("common.retry")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      {accounts.length > 1 ? (
        <>
          <Pressable
            testID="accountPicker"
            onPress={() => setAccountPickerOpen(true)}
            style={styles.dropdownTrigger}
            accessibilityRole="button"
            accessibilityLabel={t("transactions.chooseAccount")}
          >
            <View style={styles.dropdownTriggerInner}>
              <Text style={styles.dropdownLabel}>
                {t("transactions.account")}
              </Text>
              <Text
                style={styles.dropdownValue}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {selectedAccount ? `${selectedAccount.id.slice(0, 8)}…` : ""}
              </Text>
              <CurrencyText style={styles.dropdownBal}>
                {selectedAccount?.balance ?? 0}
              </CurrencyText>
              <Text style={styles.dropdownChevron}>▾</Text>
            </View>
          </Pressable>
          <Modal
            visible={accountPickerOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setAccountPickerOpen(false)}
          >
            <View style={styles.modalRoot}>
              <Pressable
                style={styles.modalBackdrop}
                onPress={() => setAccountPickerOpen(false)}
                accessibilityLabel={t("common.cancel")}
              />
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>
                  {t("transactions.chooseAccount")}
                </Text>
                <ScrollView
                  style={styles.modalScroll}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                  {accounts.map((a, i) => (
                    <Pressable
                      key={a.id}
                      onPress={() => {
                        setSelectedIndex(i);
                        setAccountPickerOpen(false);
                      }}
                      style={[
                        styles.modalRow,
                        i === selectedIndex && styles.modalRowSelected,
                      ]}
                    >
                      <View style={styles.modalRowText}>
                        <Text
                          style={styles.modalRowId}
                          numberOfLines={1}
                          ellipsizeMode="middle"
                        >
                          {a.id}
                        </Text>
                        <CurrencyText style={styles.modalRowBal}>
                          {a.balance}
                        </CurrencyText>
                      </View>
                      {i === selectedIndex ? (
                        <Text style={styles.modalCheck}>✓</Text>
                      ) : null}
                    </Pressable>
                  ))}
                </ScrollView>
                <Pressable
                  onPress={() => setAccountPickerOpen(false)}
                  style={styles.modalCancelBtn}
                  accessibilityRole="button"
                >
                  <Text style={styles.modalCancelText}>
                    {t("common.cancel")}
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </>
      ) : null}

      {selectedAccount ? (
        <View style={styles.accountDetails}>
          <Text style={styles.detailLabel}>{t("transactions.accountId")}</Text>
          <Text
            style={styles.detailId}
            numberOfLines={1}
            ellipsizeMode="middle"
            selectable
          >
            {selectedAccount.id}
          </Text>
          <Text style={[styles.detailLabel, styles.detailLabelSpaced]}>
            {t("transactions.balance")}
          </Text>
          <CurrencyText style={styles.detailBalance}>
            {selectedAccount.balance}
          </CurrencyText>
          {selectedAccount.isLocked ? (
            <Text style={styles.detailLocked}>{t("transactions.locked")}</Text>
          ) : null}
        </View>
      ) : null}

      <FlatList
        testID="transactionList"
        data={items}
        keyExtractor={(x) => String(x.id)}
        ListEmptyComponent={
          <Text style={list.empty}>{t("transactions.empty")}</Text>
        }
        contentContainerStyle={list.container}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              navigation.navigate("TransactionDetail", { transaction: item })
            }
          >
            <View style={styles.rowLeft}>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.date}>{item.createdAt}</Text>
            </View>
            <CurrencyText style={styles.amount}>{item.amount}</CurrencyText>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  dropdownTrigger: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: radius.control,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownTriggerInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 8,
  },
  dropdownLabel: {
    fontFamily: font.bodySemi,
    fontSize: 14,
    color: colors.paperWhite,
  },
  dropdownValue: {
    flex: 1,
    fontFamily: font.mono,
    fontSize: 13,
    color: colors.textSubtle,
  },
  dropdownBal: {
    fontSize: 15,
  },
  dropdownChevron: {
    fontSize: 14,
    color: colors.textMuted,
    marginLeft: 4,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  modalCard: {
    zIndex: 1,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    maxHeight: "70%",
  },
  modalTitle: {
    fontFamily: font.bodySemi,
    fontSize: 17,
    color: colors.paperWhite,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalScroll: {
    maxHeight: 320,
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  modalRowSelected: {
    backgroundColor: colors.glass,
  },
  modalRowText: {
    flex: 1,
    marginRight: 8,
  },
  modalRowId: {
    fontFamily: font.mono,
    fontSize: 12,
    color: colors.textSubtle,
  },
  modalRowBal: {
    fontSize: 15,
    marginTop: 4,
  },
  modalCheck: {
    fontSize: 18,
    color: colors.mint,
  },
  modalCancelBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    marginTop: 4,
  },
  modalCancelText: {
    fontFamily: font.bodySemi,
    fontSize: 16,
    color: colors.textMuted,
  },
  accountDetails: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: radius.card,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailLabel: {
    fontFamily: font.bodySemi,
    fontSize: 12,
    color: colors.textSubtle,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  detailLabelSpaced: {
    marginTop: 12,
  },
  detailId: {
    fontFamily: font.mono,
    fontSize: 14,
    color: colors.paperWhite,
    marginTop: 6,
  },
  detailBalance: {
    fontSize: 22,
    marginTop: 6,
  },
  detailLocked: {
    fontFamily: font.bodySemi,
    fontSize: 13,
    color: colors.vendingAmber,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: colors.glass,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowLeft: { flex: 1, marginRight: 12 },
  type: {
    fontFamily: font.bodySemi,
    fontSize: 16,
    color: colors.paperWhite,
  },
  date: {
    fontFamily: font.mono,
    fontSize: 12,
    color: colors.textSubtle,
    marginTop: 4,
  },
  amount: { fontSize: 17 },
  hint: {
    fontFamily: font.body,
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  err: {
    fontFamily: font.body,
    color: colors.error,
    marginBottom: 16,
    textAlign: "center",
  },
  retry: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.electricIndigo,
    borderRadius: radius.control,
  },
  retryText: {
    fontFamily: font.bodySemi,
    color: colors.onIndigo,
    fontSize: 16,
  },
});
