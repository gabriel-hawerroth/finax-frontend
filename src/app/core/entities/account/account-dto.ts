import { Account } from './account';

export interface BasicAccount {
  id: number;
  name: string;
  image: string;
  balance: number;
}

export interface EditBalanceDialogData {
  account: Account;
}

export interface BankAccountDetailsData {
  account: Account;
}
