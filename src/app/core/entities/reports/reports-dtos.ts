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
