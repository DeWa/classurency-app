import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import * as api from '../../api/api';
import { ApiError } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { GradientButton } from '../../components/GradientButton';
import { UserIdPicker } from '../../components/UserIdPicker';
import { layout } from '../../theme/styles';

export function CreateAccountScreen() {
  const { t } = useTranslation();
  const { state } = useAuth();
  const token = state.status === 'authenticated' ? state.token : null;
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      await api.createAccount(token, { userId: userId.trim() });
      Alert.alert(t('createAccount.title'), t('createAccount.success'));
      setUserId('');
    } catch (e) {
      Alert.alert(t('settings.error'), e instanceof ApiError ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [t, token, userId]);

  return (
    <ScrollView contentContainerStyle={styles.pad} nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <UserIdPicker
        token={token}
        label={t('createAccount.userId')}
        value={userId}
        onChange={setUserId}
      />
      <GradientButton onPress={() => void submit()} disabled={loading} loading={loading}>
        {t('createAccount.submit')}
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
