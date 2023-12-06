export interface CashFlow {
  id?: number;
  accountId: number;
  amount: number;
  type: string;
  done: boolean;
  targetAccountId?: number;
  categoryId?: number;
  date: Date;
  observation: string;
}
