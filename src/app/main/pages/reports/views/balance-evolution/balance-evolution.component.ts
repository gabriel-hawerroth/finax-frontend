import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { BasicAccount } from '../../../../../core/entities/account/account-dto';
import { AccountService } from '../../../../../core/entities/account/account.service';
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
  ],
  templateUrl: './balance-evolution.component.html',
  styleUrl: './balance-evolution.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceEvolutionPage implements OnInit, OnDestroy {
  readonly getDefaultAccountImage = getDefaultAccountImage;
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  filtersForm: FormGroup;

  accounts: BasicAccount[] = [];
  selectedAccount: BasicAccount | null = null;

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
  selectedDate = moment().day(15).toDate();

  theme = signal(this._utils.getUserConfigs.theme);
  currency = signal(this._utils.getUserConfigs.currency);

  private readonly ngUnsubscribe = new Subject<void>();

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _accountService: AccountService,
    private readonly _utils: UtilsService,
    private readonly _responsiveService: ResponsiveService
  ) {
    this.filtersForm = this._fb.group({
      accounts: [{ value: null, disabled: true }],
      dateInterval: [null],
      range: [null],
    });
  }

  ngOnInit(): void {
    this.getValues();
    this.setDateIntervalCardHeight();

    this.subscribeValueChanges();
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
        this.filtersForm.get('accounts')!.enable();
      })
      .catch(() =>
        this._utils.showMessage('credit-cards.error-getting-accounts')
      );
  }

  private subscribeValueChanges() {
    this.filtersForm.controls['range'].valueChanges
      .pipe(debounceTime(200), takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.onChangeDateRange());
  }

  changeMonth(direction: 'before' | 'next'): void {
    const unitTime =
      this.filtersForm.controls['dateInterval'].getRawValue() ===
      ReportReleasesByInterval.MONTHLY
        ? 'month'
        : 'year';

    this.selectedDate = moment(this.selectedDate)
      [direction === 'before' ? 'subtract' : 'add'](1, unitTime)
      .day(15)
      .toDate();

    this.getChartData();
  }

  private onChangeDateRange(): void {
    const range = this.filtersForm.controls['range'].value;

    if (
      this.dateInterval() !== ReportReleasesByInterval.CUSTOM ||
      !range.start ||
      !range.end ||
      range.start > range.end
    )
      return;

    this.getChartData();
  }

  private getChartData(): void {}

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
      !this.filtersForm.controls['range'].value.start &&
      !this.filtersForm.controls['range'].value.end
    )
      this.setDefaultRange();

    this.getChartData();
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

  private setDefaultRange(): void {
    this.filtersForm.controls['range'].patchValue(this.getDefaultRange());
  }

  protected getDefaultRange(): { start: Date; end: Date } {
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
}
