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

export interface ReleaseSave {
  repeat: string;
  fixedBy: string;
  installmentsBy: number;
  release: CashFlow;
}

export interface CashFlowFilters {
  userId: number;
  year: number;
  month: number;
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
}

export interface TotalsCashFlow {
  revenues: number;
  expenses: number;
  balance: number;
}
