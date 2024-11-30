import { AccountType } from '../../enums/account-enums';
import { Account } from './account';

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
}

export interface AccountFormDialogData {
  primaryAccountId: number;
}

export interface AccountsListItemDTO extends Account {
  primaryAccount: Account | null;
  subAccounts: Account[];
}
