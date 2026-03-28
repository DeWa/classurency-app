import { getApiBaseUrl } from '../config/env';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
  query?: Record<string, string | boolean | number | undefined>;
};

function buildUrl(path: string, query?: ApiRequestOptions['query']): string {
  const base = getApiBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${base}${p}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function apiJson<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, query } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json: unknown = undefined;
  if (text.length > 0) {
    try {
      json = JSON.parse(text) as unknown;
    } catch {
      throw new ApiError(`Invalid JSON (${res.status})`, res.status, text);
    }
  }

  if (!res.ok) {
    const msg =
      typeof json === 'object' && json !== null && 'message' in json
        ? String((json as { message: unknown }).message)
        : res.statusText;
    throw new ApiError(msg || `HTTP ${res.status}`, res.status, json);
  }

  return json as T;
}
