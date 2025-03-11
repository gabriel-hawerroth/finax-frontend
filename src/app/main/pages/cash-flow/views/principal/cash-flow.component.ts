import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  signal,
} from '@angular/core';
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
  MonthlyRelease,
  ReleaseFilters,
  ReleaseFormDialogData,
} from '../../../../../core/entities/release/release-dto';
import { ReleaseService } from '../../../../../core/entities/release/release.service';
import {
  ReleaseType,
  toReleaseType,
} from '../../../../../core/enums/release-enums';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { ReleasesMonthPipe } from '../../../../../shared/pipes/releases-month.pipe';
import { ResponsiveService } from '../../../../../shared/utils/responsive.service';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import {
  CashFlowBalancesComponent,
  CashFlowBalancesComponentData,
} from '../../components/cash-flow-balances/cash-flow-balances.component';
import { FilterReleasesDialog } from '../../components/filter-releases-dialog/filter-releases-dialog.component';
import { ReleasesListComponent } from '../../components/releases-list/releases-list.component';

@Component({
  selector: 'app-cash-flow',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowPage implements OnInit, OnDestroy {
  private readonly _unsubscribeAll = new Subject<void>();

  readonly currency = this._utils.getUserConfigs.currency;

  currentDate: Date = new Date();

  monthlyReleases = signal<MonthlyRelease[]>([]);
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
    private readonly _utils: UtilsService,
    private readonly _cashFlowService: ReleaseService,
    private readonly _matDialog: MatDialog,
    private readonly _responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {
    this.getValues();

    const savedMonth = this._utils.getItemLocalStorage('selectedMonthCashFlow');

    if (savedMonth) {
      this.selectedDate = new Date(savedMonth);
    } else {
      this._utils.setItemLocalStorage(
        'selectedMonthCashFlow',
        this.selectedDate.toString()
      );
    }

    this.getReleases();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();

    this._utils.setItemLocalStorage(
      'selectedMonthCashFlow',
      this.selectedDate.toString()
    );
  }

  getReleases() {
    this.searching.set(true);

    this._cashFlowService
      .getMonthlyReleases(this.selectedDate)
      .then((response) => {
        this.errorFetchingReleases.set(false);
        this.monthlyReleases.set(response);
        this.allMonthlyReleases = response;
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
    const type = toReleaseType(releaseType);

    this._utils
      .openReleaseFormDialog(<ReleaseFormDialogData>{
        accounts: this.accounts,
        categories: this.categories,
        creditCards: this.creditCards,
        editing: false,
        releaseType: releaseType,
        selectedDate: this.selectedDate,
        defaultAccountId: this.getDefaultAccountCardId(type),
      })
      .then((response) => {
        if (!response) return;

        this.getReleases();
      });
  }

  calculateValues(): CashFlowBalancesComponentData {
    const doneReleases: MonthlyRelease[] = this._utils.filterList(
      this.monthlyReleases(),
      'done',
      true
    );

    const revenues = this.getAmountByReleaseType(
      doneReleases,
      ReleaseType.REVENUE
    );

    const expenses = this.getAmountByReleaseType(
      doneReleases,
      ReleaseType.EXPENSE
    );

    const expectedBalance = this.allRevenuesAmount - this.allExpensesAmount;

    return <CashFlowBalancesComponentData>{
      revenues,
      expenses,
      balance: revenues - expenses,
      expectedBalance,
    };
  }

  private getAmountByReleaseType(
    releases: MonthlyRelease[],
    type: ReleaseType
  ): number {
    return (
      releases
        .filter(
          (item) =>
            item.type === type &&
            (item.account ? item.account.addToCashFlow : true)
        )
        .reduce((count, item) => count + item.amount, 0) || 0
    );
  }

  get allRevenuesAmount(): number {
    return this.getAmountByReleaseType(
      this.monthlyReleases(),
      ReleaseType.REVENUE
    );
  }

  get allExpensesAmount(): number {
    return this.getAmountByReleaseType(
      this.monthlyReleases(),
      ReleaseType.EXPENSE
    );
  }

  openFilterDialog() {
    const width = this._responsiveService.smallWidth()
      ? '100vw'
      : this._responsiveService.mediumWidth()
      ? '60vw'
      : '42vw';

    this._matDialog
      .open(FilterReleasesDialog, {
        data: <FilterReleasesDialogData>{
          accounts: this.accounts,
          creditCards: this.creditCards,
          categories: this.categories,
          filters: this.appliedFilters(),
        },
        panelClass: 'filter-releases-dialog',
        width: width,
        minWidth: width,
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

    this.monthlyReleases.update((values) => {
      let releases = this.allMonthlyReleases;

      if (this.appliedFilters().accountIds?.length) {
        releases = releases.filter((item) => {
          if (!item.account && !item.targetAccount) return false;

          return (
            this.appliedFilters().accountIds.includes(item.account!.id) ||
            (item.targetAccount
              ? this.appliedFilters().accountIds.includes(item.targetAccount.id)
              : false)
          );
        });
      }

      if (this.appliedFilters().creditCardIds?.length) {
        const cardReleases = this.allMonthlyReleases.filter((item) =>
          item.card?.id
            ? this.appliedFilters().creditCardIds.includes(item.card.id)
            : false
        );

        if (releases.length === this.allMonthlyReleases.length)
          releases = cardReleases;
        else releases = releases.concat(cardReleases);
      }

      if (this.appliedFilters().categoryIds?.length) {
        releases = releases.filter((item) =>
          item.category
            ? this.appliedFilters().categoryIds.includes(item.category.id)
            : false
        );
      }

      if (this.appliedFilters().releaseTypes !== 'all') {
        releases = releases.filter((item) =>
          this.appliedFilters().releaseTypes.includes(item.type)
        );
      }

      if (this.appliedFilters().description) {
        releases = releases.filter((item) => {
          const filterValue = this._utils.removeAccents(
            this.appliedFilters().description.toLowerCase()
          );

          return (
            this._utils
              .removeAccents(item.description.toLowerCase())
              .includes(filterValue) ||
            (item.category &&
              this._utils
                .removeAccents(item.category.name.toLowerCase())
                .includes(filterValue))
          );
        });
      }

      if (this.appliedFilters().done !== 'all') {
        releases = releases.filter(
          (item) => item.done === this.appliedFilters().done
        );
      }

      return [...releases];
    });
  }

  getDefaultAccountCardId(relaseType: ReleaseType): number | undefined {
    let accountId = undefined;
    if (this.appliedFilters().accountIds.length === 1) {
      accountId = this.appliedFilters().accountIds[0];
    }

    let cardId = undefined;
    if (this.appliedFilters().creditCardIds.length === 1) {
      cardId = this.appliedFilters().creditCardIds[0];
    }

    if (accountId && cardId) return undefined;

    if (relaseType == ReleaseType.EXPENSE) return accountId || cardId;

    return accountId;
  }
}
