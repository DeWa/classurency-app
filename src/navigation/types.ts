import type { TransactionResponseDto } from '../api/api';

export type TransactionsStackParamList = {
  TransactionList: undefined;
  TransactionDetail: { transaction: TransactionResponseDto };
};

export type AdminStackParamList = {
  AdminMenu: undefined;
  CreateUser: undefined;
  CreateItemProvider: undefined;
  CreateAccount: undefined;
  Mint: undefined;
};

export type ProviderItemsStackParamList = {
  ItemList: undefined;
  CreateItem: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};
