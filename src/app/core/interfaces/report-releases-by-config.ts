import { ReportReleasesByInterval } from '../enums/report-releases-by-interval';

export interface ReportReleasesByConfig {
  dateInterval: ReportReleasesByInterval;
  chartType: 'pie' | 'bar';
  selectedMonth?: Date;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
