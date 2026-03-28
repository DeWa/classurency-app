import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '../../components/GradientButton';
import { colors } from '../../theme/colors';
import { font } from '../../theme/typography';
import { layout, type } from '../../theme/styles';
import type { AdminStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AdminStackParamList, 'AdminMenu'>;

export function AdminMenuScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();

  return (
    <ScrollView contentContainerStyle={styles.box} testID="adminMenu">
      <Text style={type.headline}>{t('admin.menu')}</Text>
      <Text style={styles.intro}>
        Create accounts, mint currency, and manage your campus from one place.
      </Text>
      <View style={styles.actions}>
        <GradientButton
          onPress={() => navigation.navigate('CreateUser')}
          testID="adminCreateUser"
        >
          {t('admin.createUser')}
        </GradientButton>
        <GradientButton onPress={() => navigation.navigate('CreateItemProvider')}>
          {t('admin.createProvider')}
        </GradientButton>
        <GradientButton onPress={() => navigation.navigate('CreateAccount')}>
          {t('admin.createAccount')}
        </GradientButton>
        <GradientButton onPress={() => navigation.navigate('Mint')}>{t('admin.mint')}</GradientButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  box: {
    ...layout.screenPad,
    flexGrow: 1,
  },
  intro: {
    fontFamily: font.body,
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 24,
    lineHeight: 22,
  },
  actions: { gap: 12 },
});
