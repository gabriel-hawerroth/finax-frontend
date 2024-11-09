import { Category } from '../category/category';
import { MonthlyRelease } from '../release/release-dto';

export interface HomeBalances {
  revenues: number;
  expenses: number;
}

export interface HomeAccount {
  name: string;
  image: string;
  balance: number;
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
  spendByCategories: SpendByCategory[];
  startDate: Date;
  endDate: Date;
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
