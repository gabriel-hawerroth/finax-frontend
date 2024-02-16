import { Account } from './Account';
import { MonthlyCashFlow } from './CashFlow';

export interface HomeValues {
  balances: HomeBalances;
  accountsList: Account[];
  upcomingReleasesExpected: MonthlyCashFlow[];
}

interface HomeBalances {
  generalBalance: number;
  revenues: number;
  expenses: number;
}
