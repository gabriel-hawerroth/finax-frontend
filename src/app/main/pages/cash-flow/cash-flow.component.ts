import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MonthlyBalance, MonthlyRelease } from '../../../interfaces/cash-flow';
import { CashFlowService } from '../../../services/cash-flow.service';
import { CustomCurrencyPipe } from '../../../utils/customCurrencyPipe';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { CategoryService } from '../../../services/category.service';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { AccountBasicList } from '../../../interfaces/account';
import { AccountService } from '../../../services/account.service';
import { ReleaseFormDialogComponent } from '../../dialogs/release-form-dialog/release-form-dialog.component';
import { CreditCardService } from '../../../services/credit-card.service';
import { CardBasicList } from '../../../interfaces/credit-card';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Category } from '../../../interfaces/category';
import { UserConfigsService } from '../../../services/user-configs.service';
import { ReleasesListComponent } from './components/releases-list/releases-list.component';
import { ReleasesMonthPipe } from '../../../utils/releases-month.pipe';

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
export class CashFlowComponent implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  private _matDialog = inject(MatDialog);
  private _cashFlowService = inject(CashFlowService);
  private _accountService = inject(AccountService);
  private _categoryService = inject(CategoryService);
  private _creditCardService = inject(CreditCardService);
  private _userConfigsService = inject(UserConfigsService);

  private readonly _unsubscribeAll: Subject<void> = new Subject();

  private readonly currentDate: Date = new Date();

  currency = this.utilsService.getUserConfigs.currency;

  releases: WritableSignal<MonthlyRelease[]> = signal([]);
  searching: WritableSignal<boolean> = signal(false);

  selectedDate: Date = new Date(this.currentDate.setDate(15));

  totals: MonthlyBalance = {
    revenues: 0,
    expenses: 0,
    balance: 0,
    generalBalance: 0,
    expectedBalance: 0,
  };

  accounts: AccountBasicList[] = [];
  categories: Category[] = [];
  creditCards: CardBasicList[] = [];

  viewModeCtrl: FormControl = new FormControl<string>(
    this.utilsService.getUserConfigs.releasesViewMode
  );

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
        this.releases.set(response.releases);
        this.totals = response.totals;
      })
      .catch(() => {
        this.utilsService.showMessage('cash-flow.error-getting-releases');
      })
      .finally(() => {
        this.searching.set(false);
      });
  }

  async getValues() {
    [this.accounts, this.categories, this.creditCards] = await Promise.all([
      this._accountService.getBasicList(),
      this._categoryService.getByUser(),
      this._creditCardService.getBasicList(),
    ]);
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
        .open(ReleaseFormDialogComponent, {
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
}
