import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { BasicAccount } from '../../../../../core/entities/account/account-dto';
import { Category } from '../../../../../core/entities/category/category';
import { BasicCard } from '../../../../../core/entities/credit-card/credit-card-dto';
import {
  FilterReleasesDialogData,
  MonthlyFlow,
  MonthlyRelease,
  ReleaseFilters,
  ReleaseFormDialogData,
} from '../../../../../core/entities/release/release-dto';
import { ReleaseService } from '../../../../../core/entities/release/release.service';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { ReleasesMonthPipe } from '../../../../../shared/pipes/releases-month.pipe';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import {
  CashFlowBalancesComponent,
  CashFlowBalancesComponentData,
} from '../../components/cash-flow-balances/cash-flow-balances.component';
import { FilterReleasesDialog } from '../../components/filter-releases-dialog/filter-releases-dialog.component';
import { ReleasesListComponent } from '../../components/releases-list/releases-list.component';

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatBottomSheetModule,
    TranslateModule,
    MatButtonToggleModule,
    ReleasesListComponent,
    ReleasesMonthPipe,
    MatDialogModule,
    CashFlowBalancesComponent,
    MatBadgeModule,
    ButtonsComponent,
  ],
  templateUrl: './cash-flow.component.html',
  styleUrl: './cash-flow.component.scss',
})
export class CashFlowPage implements OnInit, OnDestroy {
  private readonly _unsubscribeAll = new Subject<void>();

  currency = this.utils.getUserConfigs.currency;

  currentDate: Date = new Date();

  monthlyValues = signal<MonthlyFlow>({
    releases: [],
    expectedBalance: 0,
  });

  allMonthlyReleases: MonthlyRelease[] = [];

  searching = signal<boolean>(false);
  selectedDate = new Date(this.currentDate.setDate(15));

  accounts: BasicAccount[] = [];
  categories: Category[] = [];
  creditCards: BasicCard[] = [];

  balances = computed(() => this.calculateValues());

  appliedFilters = signal<ReleaseFilters>({
    accountIds: [],
    creditCardIds: [],
    categoryIds: [],
    releaseTypes: 'all',
    description: '',
    done: 'all',
  });
  totalAppliedFilters = signal(0);

  errorFetchingReleases = signal(false);

  constructor(
    public readonly utils: UtilsService,
    private readonly _cashFlowService: ReleaseService,
    private readonly _matDialog: MatDialog
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
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();

    this.utils.setItemLocalStorage(
      'selectedMonthCashFlow',
      this.selectedDate.toString()
    );
  }

  getReleases() {
    this.searching.set(true);

    this._cashFlowService
      .getMonthlyFlow(this.selectedDate)
      .then((response) => {
        this.monthlyValues.set(response);
        this.allMonthlyReleases = response.releases;
        this.applyFilters();
      })
      .catch(() => this.errorFetchingReleases.set(true))
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

  calculateValues(): CashFlowBalancesComponentData {
    const monthlyFlow = this.monthlyValues();

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

    const expectedBalance = this.allRevenuesAmount - this.allExpensesAmount;

    return <CashFlowBalancesComponentData>{
      revenues,
      expenses,
      balance: revenues - expenses,
      expectedBalance,
    };
  }

  get allRevenuesAmount(): number {
    const amounts = this.monthlyValues()
      .releases.filter((release) => release.type === 'R')
      .map((item) => item.amount);

    if (amounts.length === 0) return 0;

    return amounts.reduce((count, amount) => count + amount) || 0;
  }

  get allExpensesAmount(): number {
    const amounts = this.monthlyValues()
      .releases.filter((release) => release.type === 'E')
      .map((item) => item.amount);

    if (amounts.length === 0) return 0;

    return amounts.reduce((count, amount) => count + amount) || 0;
  }

  openFilterDialog() {
    this._matDialog
      .open(FilterReleasesDialog, {
        data: <FilterReleasesDialogData>{
          accounts: this.accounts,
          creditCards: this.creditCards,
          categories: this.categories,
          filters: this.appliedFilters(),
        },
        panelClass: 'filter-releases-dialog',
        width: '42vw',
        minWidth: '42vw',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((response: ReleaseFilters | undefined) => {
        if (!response) return;

        this.appliedFilters.set(response);
        this.applyFilters();
      });
  }

  applyFilters() {
    this.totalAppliedFilters.set(
      Object.values(this.appliedFilters()).filter(
        (item) =>
          item &&
          item != 'all' &&
          (typeof item === 'boolean' ? true : item.length > 0)
      ).length
    );

    this.monthlyValues.update((values) => {
      let releases = this.allMonthlyReleases;

      if (this.appliedFilters().accountIds?.length) {
        releases = releases.filter(
          (item) =>
            this.appliedFilters().accountIds.includes(item.accountId) ||
            (item.targetAccountId
              ? this.appliedFilters().accountIds.includes(item.targetAccountId!)
              : false)
        );
      }

      if (this.appliedFilters().creditCardIds?.length) {
        const cardReleases = this.utils.filterList(
          this.allMonthlyReleases,
          'cardId',
          this.appliedFilters().creditCardIds
        );

        if (releases.length === this.allMonthlyReleases.length) {
          releases = cardReleases;
        } else {
          releases = releases.concat(cardReleases);
        }
      }

      if (this.appliedFilters().categoryIds?.length) {
        releases = this.utils.filterList(
          releases,
          'categoryId',
          this.appliedFilters().categoryIds
        );
      }

      if (this.appliedFilters().releaseTypes !== 'all') {
        releases = this.utils.filterList(
          releases,
          'type',
          this.appliedFilters().releaseTypes
        );
      }

      if (this.appliedFilters().description) {
        releases = this.utils.filterList(
          releases,
          ['description', 'categoryName'],
          this.appliedFilters().description
        );
      }

      if (this.appliedFilters().done !== 'all') {
        releases = this.utils.filterList(
          releases,
          'done',
          this.appliedFilters().done
        );
      }

      values.releases = releases;
      return values;
    });
  }
}
