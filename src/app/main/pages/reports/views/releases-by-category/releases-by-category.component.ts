import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReleasesByCategory } from '../../../../../core/entities/reports/reports-dtos';
import { ReportsService } from '../../../../../core/entities/reports/reports.service';
import { LS_REPORT_RELEASES_BY_CATEGORY_CONFIGS } from '../../../../../shared/utils/local-storage-contants';
import { ReleasesReportDataFactory } from '../../components/common/releases-report-data.factory';
import { ReleasesReportData } from '../../components/common/releases-report-data.interface';
import { ReleasesReportComponent } from '../../components/releases-report/releases-report.component';

@Component({
  selector: 'app-releases-by-category',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReleasesReportComponent],
  template: `
    <app-releases-report
      titleTranslationKey="reports.releases-by-category.title"
      [expensesData]="expensesData"
      [revenuesData]="revenuesData"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleasesByCategoryComponent {
  expensesData: ReleasesReportData<ReleasesByCategory>;
  revenuesData: ReleasesReportData<ReleasesByCategory>;

  constructor(private readonly _reportsService: ReportsService) {
    this.expensesData = ReleasesReportDataFactory.createCategoryReportData(
      _reportsService,
      LS_REPORT_RELEASES_BY_CATEGORY_CONFIGS
    );

    this.revenuesData = ReleasesReportDataFactory.createCategoryReportData(
      _reportsService,
      LS_REPORT_RELEASES_BY_CATEGORY_CONFIGS
    );
  }
}
