import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '../auth/AuthContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { colors } from '../theme/colors';
import { navigationTheme } from '../theme/navigationTheme';
import type { AuthStackParamList } from './types';
import { MainTabs } from './MainTabs';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function Gate() {
  const { state } = useAuth();

  if (state.status === 'loading') {
    return (
      <View style={styles.center} testID="bootstrapLoading">
        <ActivityIndicator size="large" color={colors.mint} />
      </View>
    );
  }

  if (state.status === 'unauthenticated') {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      </AuthStack.Navigator>
    );
  }

  return <MainTabs />;
}

export function RootNavigator() {
  return (
    <ErrorBoundary>
      <NavigationContainer theme={navigationTheme}>
        <Gate />
      </NavigationContainer>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.deepScholastic,
  },
});
