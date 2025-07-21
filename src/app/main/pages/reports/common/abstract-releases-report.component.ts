import {
  Directive,
  inject,
  InputSignal,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ReportReleasesByParams } from '../../../../core/entities/reports/reports-dtos';
import { ReportsService } from '../../../../core/entities/reports/reports.service';
import { ButtonType } from '../../../../core/enums/button-style';
import { ReleaseType } from '../../../../core/enums/release-enums';
import { ReportReleasesByInterval } from '../../../../core/enums/report-releases-by-interval';
import { ButtonConfig } from '../../../../core/interfaces/button-config';
import { ReportReleasesByConfig } from '../../../../core/interfaces/report-releases-by-config';
import { ResponsiveService } from '../../../../shared/services/responsive.service';
import { UtilsService } from '../../../../shared/utils/utils.service';
import { ReleasesReportData } from './releases-report-data.interface';

@Directive()
export abstract class AbstractReleasesReportComponent
  implements OnInit, OnDestroy
{
  protected _utils = inject(UtilsService);
  protected _reportsService = inject(ReportsService);
  protected _responsiveService = inject(ResponsiveService);

  // Abstract input signals that must be implemented by child components
  abstract expensesData: InputSignal<ReleasesReportData<any>>;
  abstract revenuesData: InputSignal<ReleasesReportData<any>>;
  abstract defaultChartType: InputSignal<'pie' | 'bar'>;

  // UI state signals
  searchingExpenses = signal(false);
  errorFetchingExpenses = signal(false);
  completedInitialFetchExpenses = signal(false);

  searchingRevenues = signal(false);
  errorFetchingRevenues = signal(false);
  completedInitialFetchRevenues = signal(false);

  dateIntervalCardHeight = signal('9rem');

  showChangeMonthButtons = signal(false);
  showCustomDatePicker = signal(false);

  // Navigation buttons
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

  // Date and display settings
  selectedDate = moment().day(15).toDate();

  theme = signal(this._utils.getUserConfigs.theme);
  currency = signal(this._utils.getUserConfigs.currency);

  // Form controls
  readonly dateInterval = new FormControl<ReportReleasesByInterval>(
    ReportReleasesByInterval.MONTHLY
  );
  readonly dateInterval$ = signal(
    this.dateInterval.getRawValue() || ReportReleasesByInterval.MONTHLY
  );

  readonly range = new FormGroup({
    start: new FormControl<Date>(moment().startOf('month').toDate()),
    end: new FormControl<Date>(moment().endOf('month').toDate()),
  });

  readonly chartTypeControl = new FormControl<'pie' | 'bar'>('pie');

  private readonly ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.setSavedConfigs();
    this.setCenterButtons();
    this.setDateIntervalCardHeight();

    this.subscribeValueChanges();

    this.getChartsData();
  }

  ngOnDestroy(): void {
    this.saveConfigs();

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private subscribeValueChanges() {
    this.range.valueChanges
      .pipe(debounceTime(200), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.onChangeDateRange());
  }

  protected saveConfigs(): void {
    const dateInterval = this.dateInterval.getRawValue()!;
    const defaultRange = this.getDefaultRange();

    const configs: ReportReleasesByConfig = {
      dateInterval: dateInterval,
      chartType: this.chartTypeControl.getRawValue()!,
      selectedMonth:
        dateInterval === ReportReleasesByInterval.MONTHLY
          ? this.selectedDate
          : undefined,
      dateRange:
        dateInterval === ReportReleasesByInterval.CUSTOM
          ? {
              start: this.range.value.start || defaultRange.start,
              end: this.range.value.end || defaultRange.end,
            }
          : undefined,
    };

    // Save configs for both expense and revenue data
    this._utils.setItemLocalStorage(
      this.expensesData().localStorageKey,
      JSON.stringify(configs)
    );
  }

  protected setSavedConfigs(): void {
    const savedConfigs = this._utils.getItemLocalStorage(
      this.expensesData().localStorageKey
    );
    if (!savedConfigs) {
      this.chartTypeControl.setValue(this.defaultChartType());
      return;
    }

    const configs: ReportReleasesByConfig = JSON.parse(savedConfigs);
    this.dateInterval.setValue(configs.dateInterval);
    this.chartTypeControl.setValue(configs.chartType);

    if (configs.selectedMonth) {
      this.selectedDate = new Date(configs.selectedMonth);
    } else if (configs.dateRange) {
      this.range.patchValue(configs.dateRange);
    }
  }

  protected setCenterButtons(): void {
    switch (this.dateInterval.getRawValue()) {
      case ReportReleasesByInterval.MONTHLY:
      case ReportReleasesByInterval.YEARLY:
        this.showChangeMonthButtons.set(true);
        this.showCustomDatePicker.set(false);
        break;
      case ReportReleasesByInterval.CUSTOM:
        this.showChangeMonthButtons.set(false);
        this.showCustomDatePicker.set(true);
        break;
    }
  }

  changeMonth(direction: 'before' | 'next'): void {
    const unitTime =
      this.dateInterval$() === ReportReleasesByInterval.MONTHLY
        ? 'month'
        : 'year';

    this.selectedDate = moment(this.selectedDate)
      [direction === 'before' ? 'subtract' : 'add'](1, unitTime)
      .day(15)
      .toDate();

    this.getChartsData();
  }

  onChangeDateInterval(newInterval?: ReportReleasesByInterval): void {
    if (!newInterval) return;

    this.dateInterval$.set(newInterval);

    switch (newInterval) {
      case ReportReleasesByInterval.MONTHLY:
      case ReportReleasesByInterval.YEARLY:
        this.showChangeMonthButtons.set(true);
        this.showCustomDatePicker.set(false);
        break;
      case ReportReleasesByInterval.CUSTOM:
        this.showChangeMonthButtons.set(false);
        this.showCustomDatePicker.set(true);
        break;
      default:
        this.showChangeMonthButtons.set(false);
        this.showCustomDatePicker.set(false);
        break;
    }

    this.setDateIntervalCardHeight();

    if (
      newInterval === ReportReleasesByInterval.CUSTOM &&
      !this.range.value.start &&
      !this.range.value.end
    )
      this.setDefaultRange();

    this.getChartsData();
  }

  private setDateIntervalCardHeight(): void {
    if (!this._responsiveService.isMobileView()) return;

    this.dateIntervalCardHeight.set(
      this.showCustomDatePicker()
        ? '15rem'
        : this.showChangeMonthButtons()
        ? '15rem'
        : '8rem'
    );
  }

  getChartsData(): void {
    if (this.searchingExpenses() || this.searchingRevenues()) return;

    if (
      this.dateInterval$() === ReportReleasesByInterval.CUSTOM &&
      (!this.range.value.start || !this.range.value.end)
    ) {
      this.range.setErrors({
        required: true,
      });
      this.range.updateValueAndValidity();
      return;
    }

    const expenseParams: ReportReleasesByParams = {
      interval: this.dateInterval$(),
      releaseType: ReleaseType.EXPENSE,
    };

    const revenueParams: ReportReleasesByParams = {
      interval: this.dateInterval$(),
      releaseType: ReleaseType.REVENUE,
    };

    this.setDateParameters(expenseParams, revenueParams);

    this.searchingExpenses.set(true);
    this.expensesData()
      .fetchReleases(expenseParams)
      .catch((error) => {
        console.error('Error fetching expenses:', error);
        this.errorFetchingExpenses.set(true);
      })
      .finally(() => {
        this.searchingExpenses.set(false);
        this.completedInitialFetchExpenses.set(true);
      });

    this.searchingRevenues.set(true);
    this.revenuesData()
      .fetchReleases(revenueParams)
      .catch(() => this.errorFetchingRevenues.set(true))
      .finally(() => {
        this.searchingRevenues.set(false);
        this.completedInitialFetchRevenues.set(true);
      });
  }

  private setDateParameters(
    expenseParams: ReportReleasesByParams,
    revenueParams: ReportReleasesByParams
  ): void {
    switch (this.dateInterval$()) {
      case ReportReleasesByInterval.MONTHLY:
        const initialDate = moment(this.selectedDate).startOf('month').toDate();
        const finalDate = moment(this.selectedDate).endOf('month').toDate();
        expenseParams.initialDate = initialDate;
        expenseParams.finalDate = finalDate;
        revenueParams.initialDate = initialDate;
        revenueParams.finalDate = finalDate;
        break;
      case ReportReleasesByInterval.YEARLY:
        const year = this.selectedDate.getFullYear();
        const initialYearDate = new Date(year, 0, 1);
        const finalYearDate = new Date(year, 11, 31);
        expenseParams.initialDate = initialYearDate;
        expenseParams.finalDate = finalYearDate;
        revenueParams.initialDate = initialYearDate;
        revenueParams.finalDate = finalYearDate;
        break;
      case ReportReleasesByInterval.CUSTOM:
        expenseParams.initialDate = this.range.value.start!;
        expenseParams.finalDate = this.range.value.end!;
        revenueParams.initialDate = this.range.value.start!;
        revenueParams.finalDate = this.range.value.end!;
        break;
    }
  }

  getIntervalEnum(
    interval:
      | 'LAST_30_DAYS'
      | 'LAST_12_MONTHS'
      | 'MONTHLY'
      | 'YEARLY'
      | 'CUSTOM'
  ): ReportReleasesByInterval {
    return ReportReleasesByInterval[interval];
  }

  private onChangeDateRange(): void {
    if (
      this.dateInterval.getRawValue() !== ReportReleasesByInterval.CUSTOM ||
      !this.range.value.start ||
      !this.range.value.end ||
      this.range.value.start > this.range.value.end
    )
      return;

    this.getChartsData();
  }

  protected setDefaultRange(): void {
    this.range.patchValue(this.getDefaultRange());
  }

  protected getDefaultRange(): { start: Date; end: Date } {
    return {
      start: moment().startOf('month').toDate(),
      end: moment().endOf('month').toDate(),
    };
  }
}
