import { ReleaseType } from '../../enums/release-enums';
import { BasicAccount } from '../account/account-dto';
import { Category } from '../category/category';
import { BasicCard } from '../credit-card/credit-card-dto';
import { Release } from './release';

export interface MonthlyRelease {
  id: number;
  userId: number;
  type: ReleaseType;
  description: string;
  amount: number;
  date: Date;
  time: string;
  done: boolean;
  account?: MonthlyReleaseAccount;
  card?: MonthlyReleaseCard;
  targetAccount?: MonthlyReleaseAccount;
  category?: MonthlyReleaseCategory;
  observation?: string;
  attachmentS3FileName?: string;
  attachmentName?: string;
  duplicatedReleaseId?: number;
  isDuplicatedRelease: boolean;
  isBalanceAdjustment: boolean;
}

export interface MonthlyReleaseAccount {
  id: number;
  name: string;
  addToCashFlow: boolean;
}

export interface MonthlyReleaseCard {
  id: number;
  name: string;
  image: string;
}

export interface MonthlyReleaseCategory {
  id: number;
  name: string;
  color: string;
  icon: string;
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
  release?: Release;
  isDuplicatedRelease?: boolean;
  creditCardId?: number;
  defaultAccountId?: number;
}

export interface ReleaseDetailsData {
  release: MonthlyRelease;
}

export interface ConfirmDuplicatedReleasesActionDialogData {
  action: 'edit' | 'delete';
}

export interface ReleaseFilters {
  accountIds: number[];
  creditCardIds: number[];
  categoryIds: number[];
  releaseTypes: ReleaseType | 'all';
  description: string;
  done: boolean | 'all';
}

export interface FilterReleasesDialogData {
  accounts: BasicAccount[];
  creditCards: BasicCard[];
  categories: Category[];
  filters: ReleaseFilters;
}
