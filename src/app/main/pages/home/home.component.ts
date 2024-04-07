import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';
import { MatCardModule } from '@angular/material/card';
import { HomeService } from '../../../services/home.service';
import { MatDividerModule } from '@angular/material/divider';
import { HomeValues } from '../../../interfaces/home';
import { TranslateModule } from '@ngx-translate/core';
import { MonthlyRelease } from '../../../interfaces/cash-flow';
import { Subject, takeUntil } from 'rxjs';
import { HomeAccountsListWidget } from './components/home-accounts-list-widget/home-accounts-list-widget.component';
import { HomePayableAccountsWidget } from './components/home-payable-accounts-widget/home-payable-accounts-widget.component';
import { HomeReceivableAccountsWidget } from './components/home-receivable-accounts-widget/home-receivable-accounts-widget.component';
import { HomeSpendByCategoryWidget } from './components/home-spend-by-category-widget/home-spend-by-category-widget.component';
import { CustomCurrencyPipe } from '../../../shared/pipes/custom-currency.pipe';

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
export class HomeComponent implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  private _homeService = inject(HomeService);

  private readonly _unsubscribeAll: Subject<void> = new Subject();

  theme: WritableSignal<string> = signal(
    this.utilsService.getUserConfigs.theme
  );
  currency: string = this.utilsService.getUserConfigs.currency;

  homeValues = signal<HomeValues>({
    balances: {
      revenues: 0,
      expenses: 0,
    },
    accountsList: [],
    upcomingReleasesExpected: [],
  });

  generalBalance: number = 0;

  ngOnInit(): void {
    this.getValues();

    this.utilsService
      .subscribeUserConfigs()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((configs) => {
        this.theme.set(configs.theme);
      });
  }

  ngOnDestroy(): void {
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
    return this.utilsService.filterList(
      this.homeValues().upcomingReleasesExpected,
      'type',
      type
    );
  }
}
