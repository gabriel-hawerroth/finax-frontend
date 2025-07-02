import { ReleaseType } from '../../enums/release-enums';
import { ReportReleasesByInterval } from '../../enums/report-releases-by-interval';
import { ReleasesByCategory } from '../home-p/home-dto';

export interface ReleasesByCategoryParams {
  interval: ReportReleasesByInterval;
  releaseType: ReleaseType;
  monthYear?: string;
}

export interface ReportReleasesByCategoryOutput {
  spendByCategories: ReleasesByCategory[];
}
