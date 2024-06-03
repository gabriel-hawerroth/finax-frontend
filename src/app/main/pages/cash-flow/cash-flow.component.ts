import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { AccountBasicList } from '../../../interfaces/account';
import { MonthlyFlow } from '../../../interfaces/cash-flow';
import { Category } from '../../../interfaces/category';
import { CardBasicList } from '../../../interfaces/credit-card';
import { CashFlowService } from '../../../services/cash-flow.service';
import { UserConfigsService } from '../../../services/user-configs.service';
import { ReleaseFormDialog } from '../../../shared/components/release-form-dialog/release-form-dialog.component';
import { CustomCurrencyPipe } from '../../../shared/pipes/custom-currency.pipe';
import { ReleasesMonthPipe } from '../../../shared/pipes/releases-month.pipe';
import { UtilsService } from '../../../utils/utils.service';
import { ReleasesListComponent } from './components/releases-list/releases-list.component';

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
  ],
  templateUrl: './cash-flow.component.html',
  styleUrl: './cash-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowPage implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  private _matDialog = inject(MatDialog);
  private _cashFlowService = inject(CashFlowService);
  private _userConfigsService = inject(UserConfigsService);

  private _unsubscribeAll: Subject<void> = new Subject();

  public readonly currency = this.utilsService.getUserConfigs.currency;
  private readonly currentDate: Date = new Date();

  monthlyValues = signal<MonthlyFlow>({
    releases: [],
    expectedBalance: 0,
  });

  searching: WritableSignal<boolean> = signal(false);
  selectedDate: Date = new Date(this.currentDate.setDate(15));

  accounts: AccountBasicList[] = [];
  categories: Category[] = [];
  creditCards: CardBasicList[] = [];

  viewModeCtrl: FormControl = new FormControl<string>('releases');

  totals = computed(() => {
    return this.calculateValues(this.monthlyValues());
  });

  ngOnInit(): void {
    this.getValues();

    const savedMonth = this.utilsService.getItemLocalStorage(
      'selectedMonthCashFlow'
    );

    if (savedMonth) {
      this.selectedDate = new Date(savedMonth);
    } else {
      this.utilsService.setItemLocalStorage(
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
    this._unsubscribeAll.unsubscribe();

    const configs = this.utilsService.getUserConfigs;
    configs.releasesViewMode = this.viewModeCtrl.value;
    this._userConfigsService.save(configs);

    this.utilsService.setItemLocalStorage(
      'selectedMonthCashFlow',
      this.selectedDate.toString()
    );
  }

  getReleases() {
    this.searching.set(true);

    this._cashFlowService
      .getMonthlyFlow(this.selectedDate, this.viewModeCtrl.value)
      .then((response) => {
        this.monthlyValues.set(response);
      })
      .catch(() => {
        this.utilsService.showMessage('cash-flow.error-getting-releases');
      })
      .finally(() => {
        this.searching.set(false);
      });
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
    lastValueFrom(
      this._matDialog
        .open(ReleaseFormDialog, {
          data: {
            accounts: this.accounts,
            categories: this.categories,
            creditCards: this.creditCards,
            editing: false,
            releaseType: releaseType,
            selectedDate: this.selectedDate,
          },
          panelClass: 'new-release-cash-flow-dialog',
          autoFocus: false,
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;

      this.getReleases();
    });
  }

  calculateValues(monthlyFlow: MonthlyFlow) {
    const doneReleases = this.utilsService.filterList(
      monthlyFlow.releases,
      'done',
      true
    );

    const revenues =
      this.utilsService
        .filterList(doneReleases, 'type', 'R')
        .reduce((count, item) => count + item.amount, 0) || 0;

    let expensesList = this.utilsService.filterList(doneReleases, 'type', 'E');

    expensesList.concat(
      this.utilsService.filterList(doneReleases, 'type', 'I')
    );

    const expenses =
      expensesList.reduce((count, item) => count + item.amount, 0) || 0;

    return {
      revenues,
      expenses,
      balance: revenues - expenses,
      generalBalance: this.accounts.reduce(
        (count, item) => count + item.balance,
        0
      ),
    };
  }
}
