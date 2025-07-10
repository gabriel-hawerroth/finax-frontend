import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ChartData } from 'chart.js';
import moment from 'moment';
import { debounceTime } from 'rxjs';
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
import {
  LS_DATE_INTERVAL_REPORT_RELEASES_BY_CATEGORY,
  LS_DATE_RANGE_REPORT_RELEASES_BY_CATEGORY,
  LS_LAST_MONTH_REPORT_RELEASES_BY_CATEGORY,
} from '../../../../../shared/utils/local-storage-contants';
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
    MatCardModule,
  ],
  templateUrl: './releases-by-category.component.html',
  styleUrl: './releases-by-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleasesByCategoryComponent implements OnInit, OnDestroy {
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

  selectedDate = moment().day(15).toDate();

  theme = signal(this._utils.getUserConfigs.theme);
  currency = signal(this._utils.getUserConfigs.currency);

  spendsByCategory = signal<ReleasesByCategory[]>([]);
  spendsByCategoryChartData!: ChartData;

  revenuesByCategory = signal<ReleasesByCategory[]>([]);
  revenuesByCategoryChartData!: ChartData;

  readonly dateInterval = new FormControl<ReportReleasesByInterval>(
    (this._utils.getItemLocalStorage(
      LS_DATE_INTERVAL_REPORT_RELEASES_BY_CATEGORY
    ) as ReportReleasesByInterval) || ReportReleasesByInterval.MONTHLY
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
    this.range.valueChanges
      .pipe(debounceTime(200))
      .subscribe(() => this.onChangeDateRange());

    switch (this.dateInterval.getRawValue()) {
      case ReportReleasesByInterval.MONTHLY:
        this.showChangeMonthButtons.set(true);
        this.showCustomDatePicker.set(false);

        const savedMonth = this._utils.getItemLocalStorage(
          LS_LAST_MONTH_REPORT_RELEASES_BY_CATEGORY
        );
        if (savedMonth) this.selectedDate = new Date(savedMonth);
        else if (new Date().getDay() <= 5) this.changeMonth('before');
        break;
      case ReportReleasesByInterval.CUSTOM:
        this.showChangeMonthButtons.set(false);
        this.showCustomDatePicker.set(true);

        const savedRange = this._utils.getItemLocalStorage(
          LS_DATE_RANGE_REPORT_RELEASES_BY_CATEGORY
        );
        if (savedRange) this.range.patchValue(JSON.parse(savedRange));
        else this.setDefaultRange();
        break;
    }

    this.getChartsData();
  }

  ngOnDestroy(): void {
    this._utils.setItemLocalStorage(
      LS_DATE_INTERVAL_REPORT_RELEASES_BY_CATEGORY,
      this.dateInterval.getRawValue()!.toString()
    );

    switch (this.dateInterval.getRawValue()) {
      case ReportReleasesByInterval.MONTHLY:
        this._utils.setItemLocalStorage(
          LS_LAST_MONTH_REPORT_RELEASES_BY_CATEGORY,
          this.selectedDate.toDateString()
        );
        this._utils.removeItemLocalStorage(
          LS_DATE_RANGE_REPORT_RELEASES_BY_CATEGORY
        );
        break;
      case ReportReleasesByInterval.CUSTOM:
        this._utils.setItemLocalStorage(
          LS_DATE_RANGE_REPORT_RELEASES_BY_CATEGORY,
          JSON.stringify(this.range.getRawValue())
        );
        this._utils.removeItemLocalStorage(
          LS_LAST_MONTH_REPORT_RELEASES_BY_CATEGORY
        );
        break;
    }
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

    if (!this.range.value.start && !this.range.value.end)
      this.setDefaultRange();

    this.getChartsData(newInterval);
  }

  getChartsData(newInterval?: ReportReleasesByInterval) {
    const dateInterval = newInterval || this.dateInterval.getRawValue();
    if (!dateInterval) return;

    if (
      dateInterval === ReportReleasesByInterval.CUSTOM &&
      (!this.range.value.start || !this.range.value.end)
    ) {
      this.range.setErrors({
        required: true,
      });
      this.range.updateValueAndValidity();
      return;
    }

    const expenseParams: ReportReleasesByParams = {
      interval: dateInterval,
      releaseType: ReleaseType.EXPENSE,
    };

    const revenueParams: ReportReleasesByParams = {
      interval: dateInterval,
      releaseType: ReleaseType.REVENUE,
    };

    switch (dateInterval) {
      case ReportReleasesByInterval.MONTHLY:
        const initialDate = moment(this.selectedDate).startOf('month').toDate();
        const finalDate = moment(this.selectedDate).endOf('month').toDate();
        expenseParams.initialDate = initialDate;
        expenseParams.finalDate = finalDate;
        revenueParams.initialDate = initialDate;
        revenueParams.finalDate = finalDate;
        break;
      case ReportReleasesByInterval.CUSTOM:
        expenseParams.initialDate = this.range.value.start!;
        expenseParams.finalDate = this.range.value.end!;
        revenueParams.initialDate = this.range.value.start!;
        revenueParams.finalDate = this.range.value.end!;
        break;
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

  onChangeDateRange() {
    if (
      !this.range.value.start ||
      !this.range.value.end ||
      this.range.value.start > this.range.value.end
    )
      return;

    this.getChartsData(ReportReleasesByInterval.CUSTOM);
  }

  private setDefaultRange() {
    this.range.patchValue({
      start: moment().startOf('month').toDate(),
      end: moment().endOf('month').toDate(),
    });
  }
}
