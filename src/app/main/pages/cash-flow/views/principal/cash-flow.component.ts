import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { BasicAccount } from '../../../../../core/entities/account/account-dto';
import { Category } from '../../../../../core/entities/category/category';
import { BasicCard } from '../../../../../core/entities/credit-card/credit-card-dto';
import {
  MonthlyFlow,
  ReleaseFormDialogData,
} from '../../../../../core/entities/release/release-dto';
import { ReleaseService } from '../../../../../core/entities/release/release.service';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { ReleasesMonthPipe } from '../../../../../shared/pipes/releases-month.pipe';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { ReleasesListComponent } from '../../components/releases-list/releases-list.component';
import { CashFlowBalancesComponent } from '../../components/cash-flow-balances/cash-flow-balances.component';

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    CustomCurrencyPipe,
    MatBottomSheetModule,
    TranslateModule,
    MatButtonToggleModule,
    ReleasesListComponent,
    ReleasesMonthPipe,
    MatDialogModule,
    CashFlowBalancesComponent,
  ],
  templateUrl: './cash-flow.component.html',
  styleUrl: './cash-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowPage implements OnInit, OnDestroy {
  private readonly _unsubscribeAll = new Subject<void>();

  currency = this.utils.getUserConfigs.currency;

  currentDate: Date = new Date();

  monthlyValues = signal<MonthlyFlow>({
    releases: [],
    expectedBalance: 0,
  });

  searching = signal<boolean>(false);
  selectedDate = new Date(this.currentDate.setDate(15));

  accounts: BasicAccount[] = [];
  categories: Category[] = [];
  creditCards: BasicCard[] = [];

  viewModeCtrl: FormControl = new FormControl<string>('RELEASES');

  totals = computed(() => this.calculateValues(this.monthlyValues()));

  constructor(
    public readonly utils: UtilsService,
    private readonly _cashFlowService: ReleaseService
  ) {}

  ngOnInit(): void {
    this.getValues();

    const savedMonth = this.utils.getItemLocalStorage('selectedMonthCashFlow');

    if (savedMonth) {
      this.selectedDate = new Date(savedMonth);
    } else {
      this.utils.setItemLocalStorage(
        'selectedMonthCashFlow',
        this.selectedDate.toString()
      );
    }

    this.getReleases();

    this.viewModeCtrl.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.getReleases();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();

    // const configs = this.utils.getUserConfigs;
    // configs.releasesViewMode = this.viewModeCtrl.value;
    // this._userConfigsService.save(configs);

    this.utils.setItemLocalStorage(
      'selectedMonthCashFlow',
      this.selectedDate.toString()
    );
  }

  getReleases() {
    this.searching.set(true);

    this._cashFlowService
      .getMonthlyFlow(this.selectedDate)
      .then((response) => this.monthlyValues.set(response))
      .catch(() => this.utils.showMessage('cash-flow.error-getting-releases'))
      .finally(() => this.searching.set(false));
  }

  getValues() {
    this._cashFlowService.getValues().then((response) => {
      this.accounts = response.accountsList;
      this.categories = response.categoriesList;
      this.creditCards = response.creditCardsList;
    });
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

    this.getReleases();
  }

  addRelease(releaseType: 'E' | 'R' | 'T') {
    this.utils
      .openReleaseFormDialog(<ReleaseFormDialogData>{
        accounts: this.accounts,
        categories: this.categories,
        creditCards: this.creditCards,
        editing: false,
        releaseType: releaseType,
        selectedDate: this.selectedDate,
      })
      .then((response) => {
        if (!response) return;

        this.getReleases();
      });
  }

  calculateValues(monthlyFlow: MonthlyFlow) {
    const doneReleases = this.utils.filterList(
      monthlyFlow.releases,
      'done',
      true
    );

    const revenues =
      this.utils
        .filterList(doneReleases, 'type', 'R')
        .reduce((count, item) => count + item.amount, 0) || 0;

    let expensesList = this.utils.filterList(doneReleases, 'type', 'E');

    expensesList.concat(this.utils.filterList(doneReleases, 'type', 'I'));

    const expenses =
      expensesList.reduce((count, item) => count + item.amount, 0) || 0;

    const expectedBalance =
      monthlyFlow.releases
        .map((item) => item.amount)
        .reduce((count, amount) => count + amount) || 0;

    return {
      revenues,
      expenses,
      balance: revenues - expenses,
      expectedBalance,
      generalBalance: this.accounts.reduce(
        (count, item) => count + item.balance,
        0
      ),
    };
  }
}
