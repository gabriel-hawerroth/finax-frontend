import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ChartData } from 'chart.js';
import moment from 'moment';
import {
  ReleasesByCategory,
  ReportReleasesByParams,
} from '../../../../../core/entities/reports/reports-dtos';
import { ReportsService } from '../../../../../core/entities/reports/reports.service';
import { ButtonType } from '../../../../../core/enums/button-style';
import { ReleaseType } from '../../../../../core/enums/release-enums';
import { ReportReleasesByInterval } from '../../../../../core/enums/report-releases-by-interval';
import { ButtonConfig } from '../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { ReleasesMonthPipe } from '../../../../../shared/pipes/releases-month.pipe';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { ReleasesByCardComponent } from '../../components/releases-by-card/releases-by-card.component';

@Component({
  selector: 'app-releases-by-category',
  imports: [
    CommonModule,
    TranslateModule,
    DynamicButtonComponent,
    ReleasesByCardComponent,
    ReleasesMonthPipe,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatDatepickerModule,
  ],
  templateUrl: './releases-by-category.component.html',
  styleUrl: './releases-by-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleasesByCategoryComponent implements OnInit {
  searchingExpenses = signal(false);
  errorFetchingExpenses = signal(false);
  completedInitialFetchExpenses = signal(false);

  searchingRevenues = signal(false);
  errorFetchingRevenues = signal(false);
  completedInitialFetchRevenues = signal(false);

  navigateBackBtnConfig: ButtonConfig = {
    icon: 'chevron_left',
    type: ButtonType.ICON,
    disabled: false,
    onClick: () => this.changeMonth('before'),
  };

  navigateNextBtnConfig: ButtonConfig = {
    icon: 'chevron_right',
    type: ButtonType.ICON,
    disabled: false,
    onClick: () => this.changeMonth('next'),
  };

  private currentDate = new Date();
  selectedDate = new Date(this.currentDate.setDate(15));

  theme = signal(this._utils.getUserConfigs.theme);
  currency = signal(this._utils.getUserConfigs.currency);

  spendsByCategory = signal<ReleasesByCategory[]>([]);
  spendsByCategoryChartData!: ChartData;

  revenuesByCategory = signal<ReleasesByCategory[]>([]);
  revenuesByCategoryChartData!: ChartData;

  readonly dateInterval = new FormControl<ReportReleasesByInterval>(
    ReportReleasesByInterval.MONTHLY
  );

  showChangeMonthButtons = signal(
    this.dateInterval.value === ReportReleasesByInterval.MONTHLY
  );

  showCustomDatePicker = signal(
    this.dateInterval.value === ReportReleasesByInterval.CUSTOM
  );

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private readonly _utils: UtilsService,
    private readonly _reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    if (this.currentDate.getDay() <= 5) this.changeMonth('before');
    else this.getChartsData();
  }

  changeMonth(direction: 'before' | 'next') {
    this.selectedDate = new Date(
      this.selectedDate.setMonth(
        direction === 'before'
          ? this.selectedDate.getMonth() - 1
          : this.selectedDate.getMonth() + 1
      )
    );
    this.selectedDate.setDate(15);

    this.getChartsData();
  }

  onChangeDateInterval(newInterval?: ReportReleasesByInterval) {
    if (!newInterval) return;
    this.dateInterval.setValue(newInterval);

    this.showChangeMonthButtons.set(
      newInterval === ReportReleasesByInterval.MONTHLY
    );
    this.showCustomDatePicker.set(
      newInterval === ReportReleasesByInterval.CUSTOM
    );

    this.getChartsData(newInterval);
  }

  getChartsData(newInterval?: ReportReleasesByInterval) {
    const dateInterval = newInterval || this.dateInterval.getRawValue();
    if (!dateInterval) return;

    const expenseParams: ReportReleasesByParams = {
      interval: dateInterval,
      releaseType: ReleaseType.EXPENSE,
    };

    const revenueParams: ReportReleasesByParams = {
      interval: dateInterval,
      releaseType: ReleaseType.REVENUE,
    };

    if (dateInterval === ReportReleasesByInterval.MONTHLY) {
      const monthYear = moment(this.selectedDate).format('YYYY-MM');
      expenseParams.monthYear = monthYear;
      revenueParams.monthYear = monthYear;
    }

    this.searchingExpenses.set(true);
    this._reportsService
      .getReleasesByCategory(expenseParams)
      .then((response) => {
        this.spendsByCategory.set(response.releasesByCategories);
        this.spendsByCategoryChartData = this.getChartData(
          this.spendsByCategory()
        );
        this.errorFetchingExpenses.set(false);
      })
      .catch(() => this.errorFetchingExpenses.set(true))
      .finally(() => {
        this.searchingExpenses.set(false);
        this.completedInitialFetchExpenses.set(true);
      });

    this.searchingRevenues.set(true);
    this._reportsService
      .getReleasesByCategory(revenueParams)
      .then((response) => {
        this.revenuesByCategory.set(response.releasesByCategories);
        this.revenuesByCategoryChartData = this.getChartData(
          this.revenuesByCategory()
        );
        this.errorFetchingRevenues.set(false);
      })
      .catch(() => this.errorFetchingRevenues.set(true))
      .finally(() => {
        this.searchingRevenues.set(false);
        this.completedInitialFetchRevenues.set(true);
      });
  }

  private getChartData(list: ReleasesByCategory[]) {
    return {
      datasets: [
        {
          data: list.map((exp) => exp.value),
          backgroundColor: list.map((exp) => exp.category.color),
          borderColor: this.theme() === 'dark' ? '#dededeea' : '#fff',
        },
      ],
      labels: list.map((exp) => exp.category.name),
    };
  }

  getIntervalEnum(interval: 'LAST_30_DAYS' | 'MONTHLY' | 'CUSTOM') {
    return ReportReleasesByInterval[interval];
  }
}
