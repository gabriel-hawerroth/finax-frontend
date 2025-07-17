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
import { debounceTime } from 'rxjs';
import { ReportReleasesByParams } from '../../../../core/entities/reports/reports-dtos';
import { ReportsService } from '../../../../core/entities/reports/reports.service';
import { ButtonType } from '../../../../core/enums/button-style';
import { ReleaseType } from '../../../../core/enums/release-enums';
import { ReportReleasesByInterval } from '../../../../core/enums/report-releases-by-interval';
import { ButtonConfig } from '../../../../core/interfaces/button-config';
import { ReportReleasesByConfig } from '../../../../core/interfaces/report-releases-by-config';
import { UtilsService } from '../../../../shared/utils/utils.service';
import { ReleasesReportData } from './releases-report-data.interface';

@Directive()
export abstract class AbstractReleasesReportComponent
  implements OnInit, OnDestroy
{
  protected _utils = inject(UtilsService);
  protected _reportsService = inject(ReportsService);

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

  readonly dateInterval = new FormControl<ReportReleasesByInterval>(
    ReportReleasesByInterval.MONTHLY
  );

  showChangeMonthButtons = signal(false);
  showCustomDatePicker = signal(false);

  readonly range = new FormGroup({
    start: new FormControl<Date>(moment().startOf('month').toDate()),
    end: new FormControl<Date>(moment().endOf('month').toDate()),
  });

  readonly chartTypeControl = new FormControl<'pie' | 'bar'>('pie');

  ngOnInit(): void {
    this.setSavedConfigs();
    this.setCenterButtons();

    this.range.valueChanges
      .pipe(debounceTime(200))
      .subscribe(() => this.onChangeDateRange());

    this.getChartsData();
  }

  ngOnDestroy(): void {
    this.saveConfigs();
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

  onChangeDateInterval(newInterval?: ReportReleasesByInterval): void {
    if (!newInterval) return;
    this.dateInterval.setValue(newInterval);

    this.showChangeMonthButtons.set(
      newInterval === ReportReleasesByInterval.MONTHLY
    );
    this.showCustomDatePicker.set(
      newInterval === ReportReleasesByInterval.CUSTOM
    );

    if (
      newInterval === ReportReleasesByInterval.CUSTOM &&
      !this.range.value.start &&
      !this.range.value.end
    )
      this.setDefaultRange();

    this.getChartsData(newInterval);
  }

  getChartsData(newInterval?: ReportReleasesByInterval): void {
    if (this.searchingExpenses() || this.searchingRevenues()) return;

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

    // Set date parameters based on interval type
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
    this.expensesData()
      .fetchReleases(expenseParams)
      .catch(() => this.errorFetchingExpenses.set(true))
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

  getIntervalEnum(
    interval: 'LAST_30_DAYS' | 'MONTHLY' | 'CUSTOM'
  ): ReportReleasesByInterval {
    return ReportReleasesByInterval[interval];
  }

  onChangeDateRange(): void {
    if (
      this.dateInterval.getRawValue() !== ReportReleasesByInterval.CUSTOM ||
      !this.range.value.start ||
      !this.range.value.end ||
      this.range.value.start > this.range.value.end
    )
      return;

    this.getChartsData(ReportReleasesByInterval.CUSTOM);
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
