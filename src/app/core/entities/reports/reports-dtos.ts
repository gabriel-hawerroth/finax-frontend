import { BalanceEvolutionGrouping } from '../../enums/balance-evolution-grouping';
import { ReleaseType } from '../../enums/release-enums';
import { ReportReleasesByInterval } from '../../enums/report-releases-by-interval';

export interface ReportReleasesByParams {
  interval: ReportReleasesByInterval;
  releaseType: ReleaseType;
  initialDate?: Date;
  finalDate?: Date;
}

export interface CategoryRec {
  name: string;
  color: string;
  icon: string;
}

export interface ReleasesByCategory {
  category: CategoryRec;
  percent: number;
  value: number;
}

export interface ReleasesByAccount {
  accountName: string;
  percent: number;
  value: number;
}

export interface ReportBalanceEvolutionParams {
  interval: ReportReleasesByInterval;
  initialDate?: Date;
  finalDate?: Date;
  accountId?: number;
  grouper: BalanceEvolutionGrouping;
}

export interface BalanceEvolutionItem {
  date: Date;
  amount: number;
}
