import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  HomeBalances,
  HomeUpcomingRelease,
} from '../../../../../core/entities/home-p/home-dto';
import { HomeService } from '../../../../../core/entities/home-p/home.service';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { HomeAccountsListWidget } from '../../widgets/accounts-list/home-accounts-list-widget.component';
import { HomeCreditCardsListWidget } from '../../widgets/credit-cards-list/home-credit-cards-list-widget.component';
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
    TranslateModule,
    HomeAccountsListWidget,
    HomePayableAccountsWidget,
    HomeReceivableAccountsWidget,
    HomeSpendByCategoryWidget,
    HomeCreditCardsListWidget,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  title = this._translateService.instant('home.hello', {
    username: this._utils.username.value,
  });

  theme = signal<string>(this._utils.getUserConfigs.theme);
  currency = signal<string>(this._utils.getUserConfigs.currency);

  balances = signal<HomeBalances>({
    revenues: 0,
    expenses: 0,
  });
  upcomingReleases = signal<HomeUpcomingRelease[]>([]);

  generalBalance: number = 0;

  finishedFetchPayableReceivableAccounts = signal(false);
  errorFetchingPayableReceivableAccounts = signal(false);

  constructor(
    private readonly _translateService: TranslateService,
    private readonly _homeService: HomeService,
    private readonly _utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.getValues();

    this._utils
      .getUserConfigsObservable()
      .pipe(takeUntilDestroyed())
      .subscribe((configs) => {
        this.theme.set(configs.theme);
        this.currency.set(configs.currency);
      });
  }

  getValues() {
    this._homeService
      .getRevenueExpense()
      .then((response) => this.balances.set(response));

    this._homeService
      .getUpcomingReleases()
      .then((response) => this.upcomingReleases.set(response))
      .catch(() => this.errorFetchingPayableReceivableAccounts.set(true))
      .finally(() => this.finishedFetchPayableReceivableAccounts.set(true));
  }

  getUpcomingReleases(type: 'R' | 'E'): HomeUpcomingRelease[] {
    return this._utils.filterList(this.upcomingReleases(), 'type', type);
  }
}
