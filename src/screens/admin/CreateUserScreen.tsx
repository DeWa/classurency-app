import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

import * as api from '../../api/api';
import { ApiError } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { GradientButton } from '../../components/GradientButton';
import { colors } from '../../theme/colors';
import { form, layout, type } from '../../theme/styles';

export function CreateUserScreen() {
  const { t } = useTranslation();
  const { state } = useAuth();
  const token = state.status === 'authenticated' ? state.token : null;
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.createUser(token, { name: name.trim(), userName: userName.trim() });
      Alert.alert(t('createUser.title'), t('createUser.success', { password: res.password }));
      setName('');
      setUserName('');
    } catch (e) {
      Alert.alert(t('settings.error'), e instanceof ApiError ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [name, t, token, userName]);

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Text style={type.formLabel}>{t('createUser.name')}</Text>
      <TextInput
        style={form.input}
        placeholderTextColor={colors.textSubtle}
        value={name}
        onChangeText={setName}
      />
      <Text style={type.formLabel}>{t('createUser.userName')}</Text>
      <TextInput
        style={form.input}
        placeholderTextColor={colors.textSubtle}
        value={userName}
        onChangeText={setUserName}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <GradientButton onPress={() => void submit()} disabled={loading} loading={loading}>
        {t('createUser.submit')}
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
