import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import * as api from "../api/api";
import type { ListAccountItemDto } from "../api/api";
import { ApiError } from "../api/client";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { form, type } from "../theme/styles";
import { font } from "../theme/typography";

const SEARCH_DEBOUNCE_MS = 320;
const DROPDOWN_MAX_H = 220;

function formatAccountRow(a: ListAccountItemDto): string {
  const o = a.owner;
  return `${o.name} (@${o.userName}) · ${formatBalance(a.balance)}`;
}

function formatBalance(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2);
}

export type AccountIdPickerProps = {
  token: string | null;
  label: string;
  value: string;
  onChange: (accountId: string) => void;
  /** When set, only accounts owned by this user are listed. */
  ownerUserId?: string;
  /** When true, the field is read-only and search is disabled. */
  ownerType?: "user" | "provider" | "admin";
  disabled?: boolean;
  /** Overrides default search placeholder. */
  placeholder?: string;
};

function AccountIdPickerInner({
  token,
  label,
  value,
  onChange,
  ownerUserId,
  ownerType,
  disabled,
  placeholder,
}: AccountIdPickerProps) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ListAccountItemDto[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const lastPickedIdRef = useRef<string | null>(null);
  const skipNextEmptyValueSyncRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchSeq = useRef(0);

  const runSearch = useCallback(
    async (search: string | undefined) => {
      if (!token || disabled) {
        setResults([]);
        return;
      }
      const seq = ++searchSeq.current;
      setLoading(true);
      setListError(null);
      try {
        const res = await api.listAccounts(token, {
          userId: ownerUserId,
          ownerType,
          search:
            search && search.trim().length > 0 ? search.trim() : undefined,
          limit: 50,
          offset: 0,
        });
        if (searchSeq.current !== seq) return;
        setResults(res.accounts);
      } catch (e) {
        if (searchSeq.current !== seq) return;
        setResults([]);
        setListError(e instanceof ApiError ? e.message : String(e));
      } finally {
        if (searchSeq.current === seq) setLoading(false);
      }
    },
    [token, disabled, ownerUserId],
  );

  const scheduleSearch = useCallback(
    (q: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        void runSearch(q);
      }, SEARCH_DEBOUNCE_MS);
    },
    [runSearch],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (blurCloseRef.current) clearTimeout(blurCloseRef.current);
    };
  }, []);

  useEffect(() => {
    if (!value) {
      if (skipNextEmptyValueSyncRef.current) {
        skipNextEmptyValueSyncRef.current = false;
        return;
      }
      setText("");
      lastPickedIdRef.current = null;
      setResults([]);
      setOpen(false);
    }
  }, [value]);

  // External value without a list pick: show raw id (no single-account GET in API).
  useEffect(() => {
    if (!value) return;
    if (lastPickedIdRef.current === value) return;
    setText(value);
  }, [value]);

  const onChangeText = useCallback(
    (next: string) => {
      if (disabled) return;
      skipNextEmptyValueSyncRef.current = true;
      setText(next);
      lastPickedIdRef.current = null;
      onChange("");
      setOpen(true);
      scheduleSearch(next);
    },
    [disabled, onChange, scheduleSearch],
  );

  const onFocus = useCallback(() => {
    if (disabled) return;
    if (blurCloseRef.current) {
      clearTimeout(blurCloseRef.current);
      blurCloseRef.current = null;
    }
    setOpen(true);
    void runSearch(undefined);
  }, [disabled, runSearch]);

  const onBlurInput = useCallback(() => {
    blurCloseRef.current = setTimeout(() => setOpen(false), 200);
  }, []);

  const pick = useCallback(
    (item: ListAccountItemDto) => {
      if (blurCloseRef.current) {
        clearTimeout(blurCloseRef.current);
        blurCloseRef.current = null;
      }
      lastPickedIdRef.current = item.id;
      onChange(item.id);
      setText(formatAccountRow(item));
      setOpen(false);
    },
    [onChange],
  );

  const hint = useMemo(() => {
    if (listError) return listError;
    if (!token) return t("accountPicker.needAuth");
    return null;
  }, [listError, t, token]);

  const ph = placeholder ?? t("accountPicker.placeholder");

  return (
    <View style={styles.wrap}>
      <Text style={type.formLabel}>{label}</Text>
      <TextInput
        style={form.input}
        placeholderTextColor={colors.textSubtle}
        placeholder={ph}
        value={text}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlurInput}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!disabled}
      />
      {open && token && !disabled ? (
        <View style={styles.dropdown} accessibilityRole="list">
          {loading ? (
            <ActivityIndicator
              color={colors.paperWhite}
              style={styles.loaderPad}
            />
          ) : hint ? (
            <Text style={type.muted}>{hint}</Text>
          ) : results.length === 0 ? (
            <Text style={type.muted}>{t("accountPicker.noResults")}</Text>
          ) : (
            <ScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={styles.dropdownScroll}
            >
              {results.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => pick(item)}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && styles.rowPressed,
                  ]}
                >
                  <Text style={styles.rowTitle}>{formatAccountRow(item)}</Text>
                  <Text style={styles.rowMeta}>
                    {item.isLocked
                      ? t("accountPicker.locked")
                      : t("accountPicker.unlocked")}{" "}
                    · {item.id.slice(0, 8)}…
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      ) : null}
    </View>
  );
}

export const AccountIdPicker = memo(AccountIdPickerInner);

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 0,
  },
  dropdown: {
    marginTop: -4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
    backgroundColor: colors.glass,
    overflow: "hidden",
  },
  dropdownScroll: {
    maxHeight: DROPDOWN_MAX_H,
  },
  loaderPad: { padding: 16 },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowPressed: {
    backgroundColor: colors.border,
  },
  rowTitle: {
    fontFamily: font.body,
    fontSize: 16,
    color: colors.paperWhite,
  },
  rowMeta: {
    fontFamily: font.body,
    fontSize: 13,
    color: colors.textSubtle,
    marginTop: 2,
  },
});
