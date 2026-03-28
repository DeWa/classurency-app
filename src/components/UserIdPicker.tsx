import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import * as api from '../api/api';
import type { ListUserItemDto } from '../api/api';
import { ApiError } from '../api/client';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { form, type } from '../theme/styles';
import { font } from '../theme/typography';

const SEARCH_DEBOUNCE_MS = 320;
const DROPDOWN_MAX_H = 220;

function formatListUser(u: ListUserItemDto): string {
  return `${u.name} (@${u.userName})`;
}

export type UserIdPickerProps = {
  token: string | null;
  label: string;
  value: string;
  onChange: (userId: string) => void;
  /** Limit list/search to this user type (optional). */
  userType?: 'user' | 'provider' | 'admin';
};

function UserIdPickerInner({ token, label, value, onChange, userType }: UserIdPickerProps) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ListUserItemDto[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const lastPickedIdRef = useRef<string | null>(null);
  /** When user types after a selection, parent `value` is cleared on purpose — do not wipe `text`. */
  const skipNextEmptyValueSyncRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchSeq = useRef(0);

  const runSearch = useCallback(
    async (search: string | undefined) => {
      if (!token) {
        setResults([]);
        return;
      }
      const seq = ++searchSeq.current;
      setLoading(true);
      setListError(null);
      try {
        const res = await api.listUsers(token, {
          search: search && search.trim().length > 0 ? search.trim() : undefined,
          type: userType,
          limit: 50,
          offset: 0,
        });
        if (searchSeq.current !== seq) return;
        setResults(res.users);
      } catch (e) {
        if (searchSeq.current !== seq) return;
        setResults([]);
        setListError(e instanceof ApiError ? e.message : String(e));
      } finally {
        if (searchSeq.current === seq) setLoading(false);
      }
    },
    [token, userType]
  );

  const scheduleSearch = useCallback(
    (q: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        void runSearch(q);
      }, SEARCH_DEBOUNCE_MS);
    },
    [runSearch]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (blurCloseRef.current) clearTimeout(blurCloseRef.current);
    };
  }, []);

  // Parent cleared value → reset field (e.g. after submit), but not when clearing for search typing.
  useEffect(() => {
    if (!value) {
      if (skipNextEmptyValueSyncRef.current) {
        skipNextEmptyValueSyncRef.current = false;
        return;
      }
      setText('');
      lastPickedIdRef.current = null;
      setResults([]);
      setOpen(false);
    }
  }, [value]);

  // External or initial value: load label when we did not just pick from the list.
  useEffect(() => {
    if (!token || !value) return;
    if (lastPickedIdRef.current === value) return;
    let cancelled = false;
    (async () => {
      try {
        const u = await api.getUser(token, value);
        if (cancelled) return;
        setText(`${u.name} (${u.type})`);
      } catch {
        if (!cancelled) setText(value);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, value]);

  const onChangeText = useCallback(
    (next: string) => {
      skipNextEmptyValueSyncRef.current = true;
      setText(next);
      lastPickedIdRef.current = null;
      onChange('');
      setOpen(true);
      scheduleSearch(next);
    },
    [onChange, scheduleSearch]
  );

  const onFocus = useCallback(() => {
    if (blurCloseRef.current) {
      clearTimeout(blurCloseRef.current);
      blurCloseRef.current = null;
    }
    setOpen(true);
    // Avoid sending the formatted label (e.g. "Name (@user)") as the search string.
    void runSearch(undefined);
  }, [runSearch]);

  const onBlurInput = useCallback(() => {
    blurCloseRef.current = setTimeout(() => setOpen(false), 200);
  }, []);

  const pick = useCallback(
    (item: ListUserItemDto) => {
      if (blurCloseRef.current) {
        clearTimeout(blurCloseRef.current);
        blurCloseRef.current = null;
      }
      lastPickedIdRef.current = item.id;
      onChange(item.id);
      setText(formatListUser(item));
      setOpen(false);
    },
    [onChange]
  );

  const hint = useMemo(() => {
    if (listError) return listError;
    if (!token) return t('userPicker.needAuth');
    return null;
  }, [listError, t, token]);

  return (
    <View style={styles.wrap}>
      <Text style={type.formLabel}>{label}</Text>
      <TextInput
        style={form.input}
        placeholderTextColor={colors.textSubtle}
        placeholder={t('userPicker.placeholder')}
        value={text}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlurInput}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {open && token ? (
        <View style={styles.dropdown} accessibilityRole="list">
          {loading ? (
            <ActivityIndicator color={colors.paperWhite} style={styles.loaderPad} />
          ) : hint ? (
            <Text style={type.muted}>{hint}</Text>
          ) : results.length === 0 ? (
            <Text style={type.muted}>{t('userPicker.noResults')}</Text>
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
                  style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                >
                  <Text style={styles.rowTitle}>{formatListUser(item)}</Text>
                  <Text style={styles.rowMeta}>{item.type}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      ) : null}
    </View>
  );
}

export const UserIdPicker = memo(UserIdPickerInner);

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
    overflow: 'hidden',
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
