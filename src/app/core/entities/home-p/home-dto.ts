import { AccountType } from '../../enums/account-enums';
import { MonthlyRelease } from '../release/release-dto';
import { ReleasesByCategory } from '../reports/reports-dtos';

export interface HomeBalances {
  revenues: number;
  expenses: number;
}

export interface HomeAccount {
  id: number;
  name: string;
  image: string;
  balance: number;
  type: AccountType;
}

export interface HomeUpcomingRelease {
  categoryColor: string;
  categoryIcon: string;
  categoryName: string;
  isCreditCardRelease: boolean;
  description: string;
  accountName: string;
  creditCardName: string;
  date: Date;
  amount: number;
}

export interface SpendByCategoryOutput {
  spendByCategories: ReleasesByCategory[];
  startDate: Date;
  endDate: Date;
}

export interface EssentialExpenses {
  essentials: number;
  notEssentials: number;
}

export interface HomeValues {
  upcomingReleasesExpected: MonthlyRelease[];
}

export interface HomeCreditCard {
  cardId: number;
  cardName: string;
  cardImage: string;
  currentInvoiceAmount: number;
  availableLimit: number;
}
