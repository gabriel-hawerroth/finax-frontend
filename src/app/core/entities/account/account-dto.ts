import { AccountType } from '../../enums/account-enums';
import { Account } from './account';

export interface GetAccountById {
  account: Account;
  primaryAccount: Account | null;
}

export interface BasicAccount {
  id: number;
  name: string;
  image: string;
  balance: number;
  type: AccountType;
}

export interface EditBalanceDialogData {
  account: Account;
}

export interface BankAccountDetailsData {
  account: Account;
  primaryAccount: Account | null;
  subAccounts?: Account[];
}

export interface AccountFormDialogData {
  primaryAccount: Account;
}

export interface AccountsListItemDTO extends Account {
  primaryAccount: Account | null;
  subAccounts: Account[];
}

export interface SubAccountsActivateDialogData {
  subAccounts: Account[];
}

export type AccountConfigs = {
  key: keyof Account;
  label: string;
  show: boolean;
  tooltip?: string;
};

export interface SaveAccountDTO {
  name: string;
  balance: number;
  investments: boolean;
  addOverallBalance: boolean;
  image?: string;
  accountNumber?: string;
  agency?: number;
  code?: number;
  type?: AccountType;
  grouper: boolean;
  addToCashFlow: boolean;
  primaryAccountId?: number;
}
