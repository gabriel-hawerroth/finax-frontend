import { AccountBasicList } from './account';
import { Category } from './category';
import { CardBasicList } from './credit-card';

export interface CashFlow {
  id?: number;
  userId: number;
  description?: string;
  accountId: number;
  amount: number;
  type: string;
  done: boolean;
  targetAccountId?: number;
  categoryId: number;
  date: Date;
  time?: string;
  observation?: string;
  attachment?: File;
  attachmentName?: string;
  duplicatedReleaseId?: number;
}

export interface MonthlyFlow {
  releases: MonthlyRelease[];
  expectedBalance: number;
}

export interface MonthlyRelease {
  id: number;
  userId: number;
  description: string;
  accountId: number;
  accountName: string;
  amount: number;
  type: string;
  done: boolean;
  targetAccountId?: number;
  targetAccountName?: string;
  categoryId?: number;
  categoryName?: string;
  categoryColor?: string;
  categoryIcon?: string;
  date: Date;
  time: string;
  observation: string;
  attachmentName?: string;
  duplicatedReleaseId?: number;
  isDuplicatedRelease: boolean;
  isCreditCardRelease: boolean;
  creditCardImg: string;
}

export interface MonthlyBalance {
  revenues: number;
  expenses: number;
  generalBalance: number;
}

export interface CashFlowValues {
  accountsList: AccountBasicList[];
  categoriesList: Category[];
  creditCardsList: CardBasicList[];
}
