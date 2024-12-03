import { AccountType } from '../../enums/account-enums';

export interface Account {
  id?: number;
  userId: number;
  name: string;
  balance: number;
  investments: boolean;
  addOverallBalance: boolean;
  active: boolean;
  archived: boolean;
  image?: string;
  accountNumber?: string;
  agency?: number;
  code?: number;
  type?: AccountType;
  grouper: boolean;
  addToCashFlow: boolean;
  primaryAccountId?: number;
}
