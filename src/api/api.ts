import type { components } from '../types/api.generated';

import { apiJson } from './client';

export type LoginDto = components['schemas']['LoginDto'];
export type LoginResponseDto = components['schemas']['LoginResponseDto'];
export type GetUserResponseDto = components['schemas']['GetUserResponseDto'];
export type ListUserItemDto = components['schemas']['ListUserItemDto'];
export type ListUsersResponseDto = components['schemas']['ListUsersResponseDto'];
export type CreateUserDto = components['schemas']['CreateUserDto'];
export type CreateUserResponseDto = components['schemas']['CreateUserResponseDto'];
export type UpdateUserRequestDto = components['schemas']['UpdateUserRequestDto'];
export type UpdateUserResponseDto = components['schemas']['UpdateUserResponseDto'];
export type CreateAccountDto = components['schemas']['CreateAccountDto'];
export type CreateAccountResponseDto = components['schemas']['CreateAccountResponseDto'];
export type ListAccountItemDto = components['schemas']['ListAccountItemDto'];
export type ListAccountsResponseDto = components['schemas']['ListAccountsResponseDto'];
export type CreateItemProviderDto = components['schemas']['CreateItemProviderDto'];
export type ItemProviderResponseDto = components['schemas']['ItemProviderResponseDto'];
export type CreateProviderItemDto = components['schemas']['CreateProviderItemDto'];
export type ItemResponseDto = components['schemas']['ItemResponseDto'];
export type MintDto = components['schemas']['MintDto'];
export type MintResponseDto = components['schemas']['MintResponseDto'];
export type TransactionResponseDto = components['schemas']['TransactionResponseDto'];
export type RequestTokenDto = components['schemas']['RequestTokenDto'];
export type RequestTokenResponseDto = components['schemas']['RequestTokenResponseDto'];
export type TransferDto = components['schemas']['TransferDto'];
export type PurchaseItemDto = components['schemas']['PurchaseItemDto'];
export type PurchaseItemResponseDto = components['schemas']['PurchaseItemResponseDto'];

/** @deprecated Use ItemResponseDto — kept for existing imports */
export type Item = ItemResponseDto;
/** @deprecated Use ItemProviderResponseDto — kept for existing imports */
export type ItemProvider = ItemProviderResponseDto;

export async function login(body: LoginDto): Promise<LoginResponseDto> {
  return apiJson<LoginResponseDto>('/auth/login', { method: 'POST', body });
}

export async function getCurrentUser(
  token: string,
  includeAccounts?: boolean
): Promise<GetUserResponseDto> {
  return apiJson<GetUserResponseDto>('/users/me', {
    token,
    query: includeAccounts !== undefined ? { includeAccounts } : undefined,
  });
}

export async function getUser(
  token: string,
  id: string,
  includeAccounts?: boolean
): Promise<GetUserResponseDto> {
  return apiJson<GetUserResponseDto>(`/users/${id}`, {
    token,
    query: includeAccounts !== undefined ? { includeAccounts } : undefined,
  });
}

export type ListUsersParams = {
  type?: 'user' | 'provider' | 'admin';
  search?: string;
  limit?: number;
  offset?: number;
};

export async function listUsers(token: string, params?: ListUsersParams): Promise<ListUsersResponseDto> {
  return apiJson<ListUsersResponseDto>('/users', {
    token,
    query: params,
  });
}

export async function createUser(token: string, body: CreateUserDto): Promise<CreateUserResponseDto> {
  return apiJson<CreateUserResponseDto>('/users', { method: 'POST', body, token });
}

export async function updateUser(
  token: string,
  id: string,
  body: UpdateUserRequestDto
): Promise<UpdateUserResponseDto> {
  return apiJson<UpdateUserResponseDto>(`/users/${id}`, { method: 'PATCH', body, token });
}

export async function createAccount(
  token: string,
  body: CreateAccountDto
): Promise<CreateAccountResponseDto> {
  return apiJson<CreateAccountResponseDto>('/accounts', { method: 'POST', body, token });
}

export type ListAccountsParams = {
  userId?: string;
  ownerType?: 'user' | 'provider' | 'admin';
  isLocked?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
};

export async function listAccounts(
  token: string,
  params?: ListAccountsParams
): Promise<ListAccountsResponseDto> {
  return apiJson<ListAccountsResponseDto>('/accounts', { token, query: params });
}

export async function createItemProvider(
  token: string,
  body: CreateItemProviderDto
): Promise<ItemProviderResponseDto> {
  return apiJson<ItemProviderResponseDto>('/item-providers', { method: 'POST', body, token });
}

export async function listProviderItems(token: string, providerId: string): Promise<ItemResponseDto[]> {
  return apiJson<ItemResponseDto[]>(`/item-providers/${providerId}/items`, { token });
}

export async function createProviderItem(
  token: string,
  providerId: string,
  body: CreateProviderItemDto
): Promise<ItemResponseDto> {
  return apiJson<ItemResponseDto>(`/item-providers/${providerId}/items`, { method: 'POST', body, token });
}

export async function getProviderItem(
  token: string,
  providerId: string,
  itemId: string
): Promise<ItemResponseDto> {
  return apiJson<ItemResponseDto>(`/item-providers/${providerId}/items/${itemId}`, { token });
}

export async function mint(token: string, body: MintDto): Promise<MintResponseDto> {
  return apiJson<MintResponseDto>('/admin/mint', { method: 'POST', body, token });
}

export async function listAccountTransactions(
  token: string,
  accountId: string,
  limit?: number
): Promise<TransactionResponseDto[]> {
  return apiJson<TransactionResponseDto[]>(`/accounts/${accountId}/transactions`, {
    token,
    query: limit !== undefined ? { limit } : undefined,
  });
}

export async function transfer(
  token: string,
  body: TransferDto
): Promise<TransactionResponseDto> {
  return apiJson<TransactionResponseDto>('/transactions/transfer', { method: 'POST', body, token });
}

export async function purchaseItem(
  token: string,
  body: PurchaseItemDto
): Promise<PurchaseItemResponseDto> {
  return apiJson<PurchaseItemResponseDto>('/transactions/purchase-item', {
    method: 'POST',
    body,
    token,
  });
}

export async function requestApiToken(
  token: string,
  body: RequestTokenDto
): Promise<RequestTokenResponseDto> {
  return apiJson<RequestTokenResponseDto>('/tokens', { method: 'POST', body, token });
}
