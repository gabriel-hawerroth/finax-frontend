import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReleaseFormDialogComponent } from './components/release-form-dialog/release-form-dialog.component';
import {
  CashFlowFilters,
  MonthlyCashFlow,
  MonthlyBalance,
} from '../../../interfaces/CashFlow';
import { CashFlowService } from '../../../services/cash-flow.service';
import { LoginService } from '../../../services/login.service';
import { CustomCurrencyPipe } from '../../../utils/customCurrencyPipe';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Category } from '../../../interfaces/Category';
import { CategoryService } from '../../../services/category.service';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { ReleaseDetailsComponent } from './components/release-details/release-details.component';
import { Account } from '../../../interfaces/Account';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    CustomCurrencyPipe,
    MatBottomSheetModule,
  ],
  templateUrl: './cash-flow.component.html',
  styleUrl: './cash-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _fb = inject(FormBuilder);
  private _matDialog = inject(MatDialog);
  private _bottomSheet = inject(MatBottomSheet);
  private _cashFlowService = inject(CashFlowService);
  private _loginService = inject(LoginService);
  private _accountService = inject(AccountService);
  private _categoryService = inject(CategoryService);

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  filterForm!: FormGroup;

  releases: BehaviorSubject<MonthlyCashFlow[]> = new BehaviorSubject<
    MonthlyCashFlow[]
  >([]);

  selectedDate: Date = new Date();

  currentYear: string = this.selectedDate.getFullYear().toString();

  searching: boolean = false;

  totals: MonthlyBalance = {
    revenues: 0,
    expenses: 0,
    balance: 0,
    generalBalance: 0,
    expectedBalance: 0,
  };

  accounts: Account[] = [];
  categories: Category[] = [];

  ngOnInit(): void {
    this.buildForm();
    this.getReleases();

    this.getValues();
  }

  buildForm() {
    this.filterForm = this._fb.group({
      account: '',
    });
  }

  getReleases() {
    this.searching = true;

    const filters: CashFlowFilters = {
      userId: this._loginService.getLoggedUserId,
      date: this.selectedDate,
    };

    this._cashFlowService
      .getMonthlyFlow(filters)
      .then((response) => {
        this.releases.next(response.releases);
        this.totals = response.totals;
      })
      .catch(() => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao obter os lançamentos'
            : 'Error getting the releases'
        );
      })
      .finally(() => {
        this.searching = false;
      });
  }

  async getValues() {
    const [accounts, categories] = await Promise.all([
      this._accountService.getByUser(),
      this._categoryService.getByUser(),
    ]);

    this.accounts = this.utilsService.filterList(accounts, 'active', true);
    this.categories = categories;
  }

  get getSelectedMonth(): string {
    return this.selectedDate.toLocaleString(this.language, { month: 'long' });
  }

  get getSelectedYear(): string {
    const selectedYear = this.selectedDate.getFullYear().toString();

    return selectedYear !== this.currentYear ? selectedYear : '';
  }

  selectMonth(direction: 'before' | 'next'): void {
    if (direction === 'before') {
      this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);
    } else {
      this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);
    }

    this.selectedDate.setDate(15);
    this.getReleases();
  }

  openDetails(cashFlow: MonthlyCashFlow) {
    lastValueFrom(
      this._bottomSheet
        .open(ReleaseDetailsComponent, {
          data: {
            cashFlow: cashFlow,
          },
          panelClass: 'release-details',
        })
        .afterDismissed()
    ).then((response) => {
      if (!response) return;

      if (response === 'edit') this.editRelease(cashFlow);
      else if (response === 'delete') this.getReleases();
    });
  }

  addRelease(releaseType: string) {
    lastValueFrom(
      this._matDialog
        .open(ReleaseFormDialogComponent, {
          data: {
            accounts: this.accounts,
            categories: this.categories,
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

  editRelease(release: MonthlyCashFlow) {
    lastValueFrom(
      this._matDialog
        .open(ReleaseFormDialogComponent, {
          data: {
            accounts: this.accounts,
            categories: this.categories,
            editing: true,
            releaseType: release.type,
            selectedDate: this.selectedDate,
            release: release,
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
