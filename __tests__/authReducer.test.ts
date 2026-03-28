import { authReducer, initialAuthState } from '../src/auth/authReducer';

describe('authReducer', () => {
  it('logs in', () => {
    const user = { id: '1', name: 'A', type: 'user' };
    const next = authReducer(initialAuthState, {
      type: 'LOGIN_SUCCESS',
      token: 't',
      user,
    });
    expect(next).toEqual({ status: 'authenticated', token: 't', user });
  });

  it('logs out from authenticated', () => {
    const s = authReducer(
      { status: 'authenticated', token: 't', user: { id: '1', name: 'A', type: 'user' } },
      { type: 'LOGOUT' }
    );
    expect(s).toEqual({ status: 'unauthenticated' });
  });
});
