import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ApiError } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { GradientButton } from '../../components/GradientButton';
import { colors } from '../../theme/colors';
import { form, layout, type } from '../../theme/styles';
import { font } from '../../theme/typography';

export function LoginScreen() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await login(userName.trim(), password);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t('login.error');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [login, password, t, userName]);

  return (
    <KeyboardAvoidingView
      testID="loginScreen"
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.hero}>
        <Text style={styles.brandMark}>Classurency</Text>
        <Text style={styles.tagline}>{t('login.title')}</Text>
      </View>
      <TextInput
        testID="loginUsername"
        style={form.input}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={t('login.userName')}
        placeholderTextColor={colors.textSubtle}
        value={userName}
        onChangeText={setUserName}
      />
      <View style={styles.passwordField}>
        <TextInput
          testID="loginPassword"
          style={styles.passwordInput}
          placeholder={t('login.password')}
          placeholderTextColor={colors.textSubtle}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          testID="loginPasswordToggle"
          accessibilityRole="button"
          accessibilityLabel={
            passwordVisible ? t('login.hidePassword') : t('login.showPassword')
          }
          onPress={() => setPasswordVisible((v) => !v)}
          style={({ pressed }) => [styles.passwordToggle, pressed && styles.passwordTogglePressed]}
          hitSlop={8}
        >
          <Text style={styles.passwordToggleText}>
            {passwordVisible ? t('login.hidePassword') : t('login.showPassword')}
          </Text>
        </Pressable>
      </View>
      {error ? <Text style={type.error}>{error}</Text> : null}
      <GradientButton
        testID="loginSubmit"
        onPress={() => void onSubmit()}
        disabled={loading}
        loading={loading}
      >
        {t('login.submit')}
      </GradientButton>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.screenPad,
    flexGrow: 1,
    justifyContent: 'center',
  },
  hero: { marginBottom: 28 },
  brandMark: {
    fontFamily: font.bodyBold,
    fontSize: 28,
    letterSpacing: 0.5,
    color: colors.paperWhite,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: font.body,
    fontSize: 16,
    color: colors.textMuted,
  },
  passwordField: {
    ...form.input,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 0,
  },
  passwordInput: {
    flex: 1,
    fontFamily: font.body,
    fontSize: 16,
    color: colors.paperWhite,
    paddingVertical: 14,
    paddingRight: 8,
    minWidth: 0,
  },
  passwordToggle: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  passwordTogglePressed: {
    opacity: 0.7,
  },
  passwordToggleText: {
    fontFamily: font.bodySemi,
    fontSize: 14,
    color: colors.textMuted,
  },
});
