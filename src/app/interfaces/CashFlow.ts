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

export interface CashFlowFilters {
  userId: number;
  date: Date;
}

export interface MonthlyFlow {
  releases: MonthlyCashFlow[];
  totals: MonthlyBalance;
}

export interface MonthlyCashFlow {
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
  attachment?: any;
  attachmentName?: string;
  duplicatedReleaseId?: number;
  isDuplicatedRelease: boolean;
}

export interface MonthlyBalance {
  revenues: number;
  expenses: number;
  balance: number;
  generalBalance: number;
  expectedBalance: number;
}
