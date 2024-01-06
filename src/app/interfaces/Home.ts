import { Account } from './Account';
import { MonthlyCashFlow } from './CashFlow';

export interface HomeValues {
  generalBalance: number;
  monthlyFlow: MonthlyFlow;
  accountsList: Account[];
  upcomingReleasesExpected: MonthlyCashFlow[];
}

interface MonthlyFlow {
  revenues: number;
  expenses: number;
}
