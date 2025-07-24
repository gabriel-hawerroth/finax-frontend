import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { ChartModule } from 'primeng/chart';
import { combineLatest, debounceTime, Subject, takeUntil } from 'rxjs';
import { BasicAccount } from '../../../../../core/entities/account/account-dto';
import { AccountService } from '../../../../../core/entities/account/account.service';
import {
  BalanceEvolutionItem,
  ReportBalanceEvolutionParams,
} from '../../../../../core/entities/reports/reports-dtos';
import { ReportsService } from '../../../../../core/entities/reports/reports.service';
import { BalanceEvolutionGrouping } from '../../../../../core/enums/balance-evolution-grouping';
import { ButtonType } from '../../../../../core/enums/button-style';
import { ReportReleasesByInterval } from '../../../../../core/enums/report-releases-by-interval';
import { ButtonConfig } from '../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { ReleasesMonthPipe } from '../../../../../shared/pipes/releases-month.pipe';
import { ResponsiveService } from '../../../../../shared/services/responsive.service';
import {
  cloudFireCdnImgsLink,
  getDefaultAccountImage,
} from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-balance-evolution',
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgOptimizedImage,
    DynamicButtonComponent,
    ReleasesMonthPipe,
    MatDatepickerModule,
    MatRadioModule,
    ChartModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './balance-evolution.component.html',
  styleUrl: './balance-evolution.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceEvolutionPage implements OnInit, OnDestroy {
  readonly getDefaultAccountImage = getDefaultAccountImage;
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  filtersForm: FormGroup;
  groupingControl: FormControl<BalanceEvolutionGrouping>;

  accounts: BasicAccount[] = [];
  selectedAccount: BasicAccount | null = null;

  chartData: WritableSignal<any>;
  options: any;

  // UI state signals
  searching = signal(false);
  errorFetching = signal(false);
  completedInitialFetch = signal(false);

  dateIntervalCardHeight = signal('9rem');

  dateInterval = signal(ReportReleasesByInterval.MONTHLY);

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
  selectedDate = new Date(new Date().setDate(15));

  theme = signal(this._utils.getUserConfigs.theme);
  currency = signal(this._utils.getUserConfigs.currency);

  private readonly ngUnsubscribe = new Subject<void>();

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _accountService: AccountService,
    private readonly _utils: UtilsService,
    private readonly _responsiveService: ResponsiveService,
    private readonly _reportsService: ReportsService,
    private readonly _translate: TranslateService
  ) {
    this.filtersForm = this._fb.group({
      account: [{ value: 'all', disabled: true }],
      dateInterval: [ReportReleasesByInterval.MONTHLY],
      rangeStart: [null],
      rangeEnd: [null],
    });

    this.groupingControl = _fb.control<BalanceEvolutionGrouping>(
      BalanceEvolutionGrouping.DAILY,
      { nonNullable: true }
    );

    this.chartData = signal({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [40, 40, 40, 40, 40, 40, 60],
          fill: true,
          borderColor: '#B0BEC5',
          tension: 0.4,
        },
      ],
    });

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: '#000',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#757575',
          },
          grid: {
            color: '#BDBDBD',
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: '#757575',
          },
          grid: {
            color: '#BDBDBD',
            drawBorder: false,
          },
        },
      },
    };
  }

  ngOnInit(): void {
    this.getValues();
    this.setCenterButtons();
    this.setDateIntervalCardHeight();

    this.subscribeValueChanges();

    this.getChartData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getValues() {
    this._accountService
      .getBasicList(true)
      .then((response) => {
        this.accounts = response;
        this.filtersForm.get('account')!.enable();
      })
      .catch(() =>
        this._utils.showMessage('credit-cards.error-getting-accounts')
      );
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

  private setCenterButtons(): void {
    switch (this.dateInterval()) {
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

  private subscribeValueChanges() {
    const rangeStartChanges =
      this.filtersForm.controls['rangeStart'].valueChanges;

    const rangeEndChanges = this.filtersForm.controls['rangeEnd'].valueChanges;

    combineLatest([rangeStartChanges, rangeEndChanges])
      .pipe(debounceTime(200), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.onChangeDateRange());

    this.filtersForm.controls['account'].valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((account: number | 'all') => {
        if (account === 'all') {
          this.selectedAccount = null;
          return;
        }

        this.selectedAccount =
          this.accounts.find((acc) => acc.id === account) || null;

        this.onChangeDateRange();
      });

    const filtersFormChanges = this.filtersForm.valueChanges;
    const groupingControlChanges = this.groupingControl.valueChanges;

    combineLatest([filtersFormChanges, groupingControlChanges])
      .pipe(debounceTime(200), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.getChartData());
  }

  changeMonth(direction: 'before' | 'next'): void {
    const unitTime =
      this.filtersForm.controls['dateInterval'].getRawValue() ===
      ReportReleasesByInterval.MONTHLY
        ? 'month'
        : 'year';

    this.selectedDate = moment(this.selectedDate)
      [direction === 'before' ? 'subtract' : 'add'](1, unitTime)
      .toDate();

    this.getChartData();
  }

  private onChangeDateRange(): void {
    const range = {
      start: this.filtersForm.controls['rangeStart'].value,
      end: this.filtersForm.controls['rangeEnd'].value,
    };

    if (
      this.dateInterval() !== ReportReleasesByInterval.CUSTOM ||
      !range.start ||
      !range.end ||
      range.start > range.end
    )
      return;

    this.getChartData();
  }

  private getChartData(): void {
    if (this.searching()) return;

    if (this.dateInterval() === ReportReleasesByInterval.CUSTOM) {
      const range = {
        start: this.filtersForm.controls['rangeStart'].value,
        end: this.filtersForm.controls['rangeEnd'].value,
      };

      if (!range.start || !range.end || range.start > range.end) {
        this._utils.showMessage('reports.invalid-date-range');
        return;
      }
    }

    const params: ReportBalanceEvolutionParams = {
      interval: this.dateInterval(),
      accountId: this.selectedAccount?.id || undefined,
      grouper: this.groupingControl.value,
    };

    this.setDateParameters(params);

    this.searching.set(true);
    this._reportsService
      .getBalanceEvolution(params)
      .then((response) => this.mapChartData(response))
      .catch(() => this.errorFetching.set(true))
      .finally(() => {
        this.searching.set(false);
        this.completedInitialFetch.set(true);
      });
  }

  private mapChartData(data: BalanceEvolutionItem[]): void {
    this.chartData.update((prevData) => ({
      ...prevData,
      labels: data.map((item) => moment(item.date).format('DD/MM/YYYY')),
      datasets: [
        {
          ...prevData.datasets[0],
          label:
            this.selectedAccount?.name ||
            this._translate.instant('reports.balance-evolution.all-accounts'),
          data: data.map((item) => item.amount),
        },
      ],
    }));

    this.options.scales!.x.ticks!.callback = (value: string) => {
      return moment(value, 'DD/MM/YYYY').format('DD/MM');
    };
  }

  public onChangeDateInterval(interval: ReportReleasesByInterval): void {
    if (!interval) return;

    this.dateInterval.set(interval);

    switch (interval) {
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
      interval === ReportReleasesByInterval.CUSTOM &&
      !this.filtersForm.controls['rangeStart'].value &&
      !this.filtersForm.controls['rangeEnd'].value
    )
      this.setDefaultRange();

    this.getChartData();
  }

  private setDateParameters(params: ReportBalanceEvolutionParams): void {
    switch (this.dateInterval()) {
      case ReportReleasesByInterval.MONTHLY:
        const initialDate = moment(this.selectedDate).startOf('month').toDate();
        const finalDate = moment(this.selectedDate).endOf('month').toDate();
        params.initialDate = initialDate;
        params.finalDate = finalDate;
        break;
      case ReportReleasesByInterval.YEARLY:
        const year = this.selectedDate.getFullYear();
        const initialYearDate = new Date(year, 0, 1);
        const finalYearDate = new Date(year, 11, 31);
        params.initialDate = initialYearDate;
        params.finalDate = finalYearDate;
        break;
      case ReportReleasesByInterval.CUSTOM:
        params.initialDate = this.filtersForm.controls['rangeStart'].value!;
        params.finalDate = this.filtersForm.controls['rangeEnd'].value!;
        break;
    }
  }

  private setDefaultRange(): void {
    const defaultRange = this.getDefaultRange();

    this.filtersForm.controls['rangeStart'].patchValue(defaultRange.start);
    this.filtersForm.controls['rangeEnd'].patchValue(defaultRange.end);
  }

  private getDefaultRange(): { start: Date; end: Date } {
    return {
      start: moment().startOf('month').toDate(),
      end: moment().endOf('month').toDate(),
    };
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

  getGroupingEnum(
    grouping: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'BY_RELEASE'
  ): BalanceEvolutionGrouping {
    return BalanceEvolutionGrouping[grouping];
  }
}
