import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import * as api from '../../api/api';
import { ApiError } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { GradientButton } from '../../components/GradientButton';
import { colors } from '../../theme/colors';
import { form, layout, type } from '../../theme/styles';

export function CreateItemScreen() {
  const { t } = useTranslation();
  const { state } = useAuth();
  const token = state.status === 'authenticated' ? state.token : null;
  const providerId = state.status === 'authenticated' ? state.user.providerId : undefined;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async () => {
    if (!token || !providerId) return;
    const v = Number(value);
    if (Number.isNaN(v)) {
      Alert.alert(t('settings.error'), 'Invalid price');
      return;
    }
    const body: api.CreateProviderItemDto = {
      name: name.trim(),
      description: description.trim(),
      value: v,
    };
    const stock = amount.trim();
    if (stock.length > 0) {
      const a = Number(stock);
      if (!Number.isNaN(a)) {
        body.amount = a;
      }
    }
    setLoading(true);
    try {
      await api.createProviderItem(token, providerId, body);
      Alert.alert(t('items.title'), 'OK');
      setName('');
      setDescription('');
      setValue('');
      setAmount('');
    } catch (e) {
      Alert.alert(t('settings.error'), e instanceof ApiError ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [description, name, providerId, t, token, value, amount]);

  if (!providerId) {
    return (
      <View style={layout.center}>
        <Text style={type.muted}>{t('items.noProvider')}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Text style={type.formLabel}>{t('items.name')}</Text>
      <TextInput style={form.input} placeholderTextColor={colors.textSubtle} value={name} onChangeText={setName} />
      <Text style={type.formLabel}>{t('items.description')}</Text>
      <TextInput
        style={form.input}
        placeholderTextColor={colors.textSubtle}
        value={description}
        onChangeText={setDescription}
      />
      <Text style={type.formLabel}>{t('items.value')}</Text>
      <TextInput
        style={form.input}
        placeholderTextColor={colors.textSubtle}
        value={value}
        onChangeText={setValue}
        keyboardType="decimal-pad"
      />
      <Text style={type.formLabel}>{t('items.stock')}</Text>
      <TextInput
        style={form.input}
        placeholderTextColor={colors.textSubtle}
        value={amount}
        onChangeText={setAmount}
        keyboardType="number-pad"
      />
      <GradientButton onPress={() => void submit()} disabled={loading} loading={loading}>
        {t('items.create')}
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
