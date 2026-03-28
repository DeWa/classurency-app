process.env.EXPO_PUBLIC_API_BASE_URL = 'http://localhost:3000/api/v1';

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: { extra: {} },
  },
}));
