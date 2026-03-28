import { apiJson, ApiError } from '../src/api/client';

describe('apiJson', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('parses JSON on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ ok: true }),
    });

    const data = await apiJson<{ ok: boolean }>('/x');
    expect(data).toEqual({ ok: true });
  });

  it('throws ApiError on HTTP error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => JSON.stringify({ message: 'bad' }),
    });

    await expect(apiJson('/x')).rejects.toThrow(ApiError);
  });
});
