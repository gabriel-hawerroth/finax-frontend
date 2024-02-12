import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { UtilsService } from '../../../../../utils/utils.service';
import { CreditCardService } from '../../../../../services/credit-card.service';
import { MatCardModule } from '@angular/material/card';
import { Account } from '../../../../../interfaces/Account';
import { Category } from '../../../../../interfaces/Category';
import { lastValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '../../../../../services/account.service';
import { CategoryService } from '../../../../../services/category.service';
import { CustomCurrencyPipe } from '../../../../../utils/customCurrencyPipe';
import { MatButtonModule } from '@angular/material/button';
import { CreditCard } from '../../../../../interfaces/CreditCard';
import { ActivatedRoute } from '@angular/router';
import { ReleaseFormDialogComponent } from '../../../../dialogs/release-form-dialog/release-form-dialog.component';

@Component({
  selector: 'app-credit-card-invoice',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    CustomCurrencyPipe,
    MatButtonModule,
    NgOptimizedImage,
  ],
  templateUrl: './credit-card-invoice.component.html',
  styleUrl: './credit-card-invoice.component.scss',
})
export class CreditCardInvoiceComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _creditCardService = inject(CreditCardService);
  private _matDialog = inject(MatDialog);
  private _accountService = inject(AccountService);
  private _categoryService = inject(CategoryService);
  private _activatedRoute = inject(ActivatedRoute);

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  creditCardId: number = +this._activatedRoute.snapshot.paramMap.get('id')!;
  creditCard: CreditCard | null = null;
  releases: any[] = [];

  selectedDate: Date = new Date();
  currentYear: string = this.selectedDate.getFullYear().toString();

  searching: boolean = false;

  accounts: Account[] = [];
  categories: Category[] = [];

  ngOnInit(): void {
    this.getReleases();
    this.getValues();
  }

  getReleases() {}

  async getValues() {
    const [creditCard, accounts, categories] = await Promise.all([
      this._creditCardService.getById(this.creditCardId),
      this._accountService.getByUser(),
      this._categoryService.getByUser(),
    ]);

    this.creditCard = creditCard;
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

  getDateTest(info: 'closing' | 'expiration'): string {
    let dt: Date = this.selectedDate;
    switch (info) {
      case 'closing':
        dt = new Date(dt.setDate(this.creditCard?.close_day || 1));
        break;
      case 'expiration':
        dt = new Date(dt.setDate(this.creditCard?.expires_day || 1));
        break;
    }

    return dt.toLocaleDateString();
  }

  getDateInfo(info: 'closing' | 'expiration'): string {
    let day = '';
    switch (info) {
      case 'closing':
        day = this.creditCard?.close_day.toString().padStart(2, '0') || '00';
        break;
      case 'expiration':
        day = this.creditCard?.expires_day.toString().padStart(2, '0') || '00';
        break;
    }

    const month = (this.selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const year = this.selectedDate.getFullYear();

    return `${day}/${month}/${year}`;
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

  addRelease() {
    lastValueFrom(
      this._matDialog
        .open(ReleaseFormDialogComponent, {
          data: {
            accounts: this.accounts,
            categories: this.categories,
            editing: false,
            releaseType: 'E',
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
