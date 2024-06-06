import { Account } from '../account/account';
import { MonthlyRelease } from '../cash-flow/cash-flow-dto';
import { Category } from '../category/category';

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
