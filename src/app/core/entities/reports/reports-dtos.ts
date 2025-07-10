import { ReleaseType } from '../../enums/release-enums';
import { ReportReleasesByInterval } from '../../enums/report-releases-by-interval';
import { Account } from '../account/account';
import { Category } from '../category/category';

export interface ReportReleasesByParams {
  interval: ReportReleasesByInterval;
  releaseType: ReleaseType;
  initialDate?: Date;
  finalDate?: Date;
}

export interface ReleasesByCategory {
  category: Category;
  percent: number;
  value: number;
}

export interface ReportReleasesByCategoryOutput {
  releasesByCategories: ReleasesByCategory[];
}

export interface ReleasesByAccount {
  account: Account;
  percent: number;
  value: number;
}

export interface ReportReleasesByAccountOutput {
  releasesByAccounts: ReleasesByAccount[];
}
