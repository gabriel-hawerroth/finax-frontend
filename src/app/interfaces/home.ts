import { Account } from './account';
import { MonthlyRelease } from './cash-flow';
import { Category } from './category';

export interface HomeValues {
  balances: HomeBalances;
  accountsList: Account[];
  upcomingReleasesExpected: MonthlyRelease[];
}

interface HomeBalances {
  revenues: number;
  expenses: number;
}

export interface SpendByCategory {
  category: Category;
  percent: number;
  value: number;
}

export interface EssentialExpenses {
  essentials: number;
  notEssentials: number;
}
