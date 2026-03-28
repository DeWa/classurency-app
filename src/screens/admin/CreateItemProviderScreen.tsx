import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

import * as api from '../../api/api';
import { ApiError } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { GradientButton } from '../../components/GradientButton';
import { AccountIdPicker } from '../../components/AccountIdPicker';
import { UserIdPicker } from '../../components/UserIdPicker';
import { colors } from '../../theme/colors';
import { form, layout, type } from '../../theme/styles';

export function CreateItemProviderScreen() {
  const { t } = useTranslation();
  const { state } = useAuth();
  const token = state.status === 'authenticated' ? state.token : null;
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAccountId('');
  }, [userId]);

  const submit = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      await api.createItemProvider(token, {
        name: name.trim(),
        userId: userId.trim(),
        accountId: accountId.trim(),
      });
      Alert.alert(t('createProvider.title'), 'OK');
      setName('');
      setUserId('');
      setAccountId('');
    } catch (e) {
      Alert.alert(t('settings.error'), e instanceof ApiError ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [accountId, name, t, token, userId]);

  return (
    <ScrollView contentContainerStyle={styles.pad} nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <Text style={type.formLabel}>{t('createProvider.name')}</Text>
      <TextInput style={form.input} placeholderTextColor={colors.textSubtle} value={name} onChangeText={setName} />
      <UserIdPicker
        token={token}
        label={t('createProvider.userId')}
        value={userId}
        onChange={setUserId}
      />
      <AccountIdPicker
        token={token}
        label={t('createProvider.accountId')}
        value={accountId}
        onChange={setAccountId}
        ownerUserId={userId.trim() || undefined}
        disabled={!userId.trim()}
        placeholder={userId.trim() ? undefined : t('accountPicker.selectOwnerFirst')}
      />
      <GradientButton onPress={() => void submit()} disabled={loading} loading={loading}>
        {t('createProvider.submit')}
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
