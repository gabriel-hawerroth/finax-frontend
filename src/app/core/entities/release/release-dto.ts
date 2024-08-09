import { ReleaseType } from '../../enums/release-enums';
import { BasicAccount } from '../account/account-dto';
import { Category } from '../category/category';
import { BasicCard } from '../credit-card/credit-card-dto';

export interface MonthlyFlow {
  releases: MonthlyRelease[];
  expectedBalance: number;
}

export interface MonthlyRelease {
  id: number;
  userId: number;
  description: string;
  accountId: number;
  accountName: string;
  cardId: number;
  cardName: string;
  cardImg: string;
  amount: number;
  type: string;
  done: boolean;
  targetAccountId?: number;
  targetAccountName?: string;
  categoryId?: number;
  categoryName?: string;
  categoryColor?: string;
  categoryIcon?: string;
  date: Date;
  time: string;
  observation: string;
  attachment?: string;
  attachmentName?: string;
  duplicatedReleaseId?: number;
  isDuplicatedRelease: boolean;
  isBalanceAdjustment: boolean;
}

export interface MonthlyBalance {
  revenues: number;
  expenses: number;
  generalBalance: number;
}

export interface CashFlowValues {
  accountsList: BasicAccount[];
  categoriesList: Category[];
  creditCardsList: BasicCard[];
}

export interface ReleaseFormDialogData {
  accounts: BasicAccount[];
  categories: Category[];
  creditCards: BasicCard[];
  editing: boolean;
  releaseType: ReleaseType;
  selectedDate: Date;
  release?: MonthlyRelease;
  creditCardId?: number;
}

export interface ReleaseDetailsData {
  cashFlow: MonthlyRelease;
}

export interface ConfirmDuplicatedReleasesActionDialogData {
  action: 'edit' | 'delete';
}
