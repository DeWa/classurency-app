import type { GetUserResponseDto } from '../api/api';

export type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; token: string; user: GetUserResponseDto };

export type AuthAction =
  | { type: 'BOOTSTRAP_START' }
  | { type: 'BOOTSTRAP_UNAUTHENTICATED' }
  | { type: 'LOGIN_SUCCESS'; token: string; user: GetUserResponseDto }
  | { type: 'LOGOUT' }
  | { type: 'USER_UPDATED'; user: GetUserResponseDto };

export const initialAuthState: AuthState = { status: 'loading' };

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'BOOTSTRAP_START':
      return { status: 'loading' };
    case 'BOOTSTRAP_UNAUTHENTICATED':
      return { status: 'unauthenticated' };
    case 'LOGIN_SUCCESS':
      return { status: 'authenticated', token: action.token, user: action.user };
    case 'LOGOUT':
      return { status: 'unauthenticated' };
    case 'USER_UPDATED':
      if (state.status !== 'authenticated') return state;
      return { ...state, user: action.user };
    default:
      return state;
  }
}
