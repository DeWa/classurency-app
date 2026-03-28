import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

import * as api from '../api/api';
import { ApiError } from '../api/client';

import { authReducer, initialAuthState, type AuthState } from './authReducer';
import { clearStoredToken, getStoredToken, setStoredToken } from './tokenStorage';

type AuthContextValue = {
  state: AuthState;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const bootstrap = useCallback(async () => {
    dispatch({ type: 'BOOTSTRAP_START' });
    const token = await getStoredToken();
    if (!token) {
      dispatch({ type: 'BOOTSTRAP_UNAUTHENTICATED' });
      return;
    }
    try {
      const user = await api.getCurrentUser(token, true);
      dispatch({ type: 'LOGIN_SUCCESS', token, user });
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        await clearStoredToken();
      }
      dispatch({ type: 'BOOTSTRAP_UNAUTHENTICATED' });
    }
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (userName: string, password: string) => {
    const { token } = await api.login({ userName, password });
    await setStoredToken(token);
    const user = await api.getCurrentUser(token, true);
    dispatch({ type: 'LOGIN_SUCCESS', token, user });
  }, []);

  const logout = useCallback(async () => {
    await clearStoredToken();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const refreshUser = useCallback(async () => {
    if (state.status !== 'authenticated') return;
    const user = await api.getCurrentUser(state.token, true);
    dispatch({ type: 'USER_UPDATED', user });
  }, [state]);

  const value = useMemo<AuthContextValue>(
    () => ({
      state,
      login,
      logout,
      refreshUser,
    }),
    [state, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
