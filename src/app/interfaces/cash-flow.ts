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
  totals: MonthlyBalance;
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
}

export interface MonthlyBalance {
  revenues: number;
  expenses: number;
  balance: number;
  generalBalance: number;
  expectedBalance: number;
}
