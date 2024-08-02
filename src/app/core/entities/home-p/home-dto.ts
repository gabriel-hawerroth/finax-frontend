import { Category } from '../category/category';
import { MonthlyRelease } from '../release/release-dto';

export interface HomeBalances {
  revenues: number;
  expenses: number;
}

export interface HomeAccountsList {
  name: string;
  image: string;
  balance: number;
}

export interface HomeUpcomingReleases {
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
