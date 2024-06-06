import { Account } from './account';

export interface AccountBasicList {
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
