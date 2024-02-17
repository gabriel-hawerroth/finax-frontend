import { Account } from './Account';
import { MonthlyCashFlow } from './CashFlow';

export interface HomeValues {
  balances: HomeBalances;
  accountsList: Account[];
  upcomingReleasesExpected: MonthlyCashFlow[];
}

interface HomeBalances {
  revenues: number;
  expenses: number;
}
