import { Account } from './account';
import { MonthlyRelease } from './cash-flow';

export interface HomeValues {
  balances: HomeBalances;
  accountsList: Account[];
  upcomingReleasesExpected: MonthlyRelease[];
}

interface HomeBalances {
  revenues: number;
  expenses: number;
}
