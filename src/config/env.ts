import Constants from 'expo-constants';

function readExtra(): string | undefined {
  const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
  return extra?.apiBaseUrl;
}

/** Base URL including `/api/v1`, no trailing slash. */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, '');
  }
  const fromExtra = readExtra();
  if (fromExtra && fromExtra.length > 0) {
    return fromExtra.replace(/\/$/, '');
  }
  return 'http://localhost:3000/api/v1';
}
