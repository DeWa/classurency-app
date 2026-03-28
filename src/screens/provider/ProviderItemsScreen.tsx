import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as api from '../../api/api';
import { ApiError } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { font } from '../../theme/typography';
import { layout, list } from '../../theme/styles';
import type { ProviderItemsStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<ProviderItemsStackParamList, 'ItemList'>;

export function ProviderItemsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const { state } = useAuth();
  const token = state.status === 'authenticated' ? state.token : null;
  const providerId = state.status === 'authenticated' ? state.user.providerId : undefined;
  const [items, setItems] = useState<api.Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token || !providerId) return;
    setLoading(true);
    setError(null);
    try {
      const loaded = await api.listProviderItems(token, providerId);
      setItems(loaded);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, [providerId, token]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!token) return null;

  if (!providerId) {
    return (
      <View style={layout.center} testID="providerNoProvider">
        <Text style={list.empty}>{t('items.noProvider')}</Text>
      </View>
    );
  }

  if (loading && items.length === 0) {
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
          <Text style={styles.retryText}>{t('common.retry')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <FlatList
        testID="providerItemList"
        data={items}
        keyExtractor={(_, i) => String(i)}
        ListEmptyComponent={<Text style={list.empty}>{t('items.empty')}</Text>}
        contentContainerStyle={list.container}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.itemText}>{formatItem(item, index)}</Text>
          </View>
        )}
      />
      <Pressable
        style={styles.fabWrap}
        onPress={() => navigation.navigate('CreateItem')}
        testID="addItemButton"
      >
        <LinearGradient
          colors={[colors.electricIndigo, colors.electricIndigoLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fab}
        >
          <Text style={styles.fabText}>{t('items.add')}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

function formatItem(item: api.Item, index: number): string {
  const raw = item as Record<string, unknown>;
  const keys = Object.keys(raw);
  if (keys.length === 0) return `Item ${index + 1}`;
  return JSON.stringify(item);
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.deepScholastic },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: colors.glass,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemText: {
    fontFamily: font.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  err: {
    fontFamily: font.body,
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
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
  fabWrap: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    borderRadius: radius.fab,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  fab: {
    paddingVertical: 14,
    paddingHorizontal: 22,
  },
  fabText: {
    fontFamily: font.bodySemi,
    color: colors.onIndigo,
    fontSize: 15,
  },
});
