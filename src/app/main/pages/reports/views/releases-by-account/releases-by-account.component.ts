import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReleasesByAccount } from '../../../../../core/entities/reports/reports-dtos';
import { ReportsService } from '../../../../../core/entities/reports/reports.service';
import { LS_REPORT_RELEASES_BY_ACCOUNT_CONFIGS } from '../../../../../shared/utils/local-storage-contants';
import { ReleasesReportDataFactory } from '../../common/releases-report-data.factory';
import { ReleasesReportData } from '../../common/releases-report-data.interface';
import { ReleasesReportComponent } from '../../components/releases-report/releases-report.component';

@Component({
  selector: 'app-releases-by-account',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReleasesReportComponent],
  template: `
    <app-releases-report
      defaultChartType="bar"
      titleTranslationKey="reports.releases-by-account.title"
      [expensesData]="expensesData"
      [revenuesData]="revenuesData"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleasesByAccountPage {
  expensesData: ReleasesReportData<ReleasesByAccount>;
  revenuesData: ReleasesReportData<ReleasesByAccount>;

  constructor(private readonly _reportsService: ReportsService) {
    this.expensesData = ReleasesReportDataFactory.createAccountReportData(
      _reportsService,
      LS_REPORT_RELEASES_BY_ACCOUNT_CONFIGS
    );

    this.revenuesData = ReleasesReportDataFactory.createAccountReportData(
      _reportsService,
      LS_REPORT_RELEASES_BY_ACCOUNT_CONFIGS
    );
  }
}
