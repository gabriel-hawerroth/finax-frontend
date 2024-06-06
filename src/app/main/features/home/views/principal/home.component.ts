import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { MonthlyRelease } from '../../../../../core/entities/cash-flow/cash-flow-dto';
import { HomeValues } from '../../../../../core/entities/home-p/home-dto';
import { HomeService } from '../../../../../core/entities/home-p/home.service';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { HomeAccountsListWidget } from '../../widgets/accounts-list/home-accounts-list-widget.component';
import { HomePayableAccountsWidget } from '../../widgets/payable-accounts/home-payable-accounts-widget.component';
import { HomeReceivableAccountsWidget } from '../../widgets/receivable-accounts/home-receivable-accounts-widget.component';
import { HomeSpendByCategoryWidget } from '../../widgets/spend-by-category/home-spend-by-category-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    CustomCurrencyPipe,
    MatDividerModule,
    NgOptimizedImage,
    TranslateModule,
    HomeAccountsListWidget,
    HomePayableAccountsWidget,
    HomeReceivableAccountsWidget,
    HomeSpendByCategoryWidget,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit, OnDestroy {
  private readonly _unsubscribeAll = new Subject<void>();

  title = this._translateService.instant('home.hello', {
    username: this._utils.username.value,
  });

  theme = signal<string>(this._utils.getUserConfigs.theme);
  currency = signal<string>(this._utils.getUserConfigs.currency);

  homeValues = signal<HomeValues>({
    balances: {
      revenues: 0,
      expenses: 0,
    },
    accountsList: [],
    upcomingReleasesExpected: [],
  });

  generalBalance: number = 0;

  constructor(
    private readonly _translateService: TranslateService,
    private readonly _homeService: HomeService,
    private readonly _utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.getValues();

    this._utils
      .getUserConfigsObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((configs) => {
        this.theme.set(configs.theme);
        this.currency.set(configs.currency);
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();
  }

  getValues() {
    this._homeService.getHomeValues().then((response) => {
      this.homeValues.set(response);

      this.generalBalance = response.accountsList.reduce(
        (count, item) => count + item.balance,
        0
      );
    });
  }

  getUpcomingReleases(type: 'R' | 'E'): MonthlyRelease[] {
    return this._utils.filterList(
      this.homeValues().upcomingReleasesExpected,
      'type',
      type
    );
  }
}
