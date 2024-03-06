import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { UtilsService } from '../../../../../utils/utils.service';
import { CreditCardService } from '../../../../../services/credit-card.service';
import { MatCardModule } from '@angular/material/card';
import { Category } from '../../../../../interfaces/category';
import { lastValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../../../../../services/category.service';
import { CustomCurrencyPipe } from '../../../../../utils/customCurrencyPipe';
import { MatButtonModule } from '@angular/material/button';
import {
  CardBasicList,
  CreditCard,
} from '../../../../../interfaces/credit-card';
import { ActivatedRoute } from '@angular/router';
import { ReleaseFormDialogComponent } from '../../../../dialogs/release-form-dialog/release-form-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { MonthlyRelease } from '../../../../../interfaces/cash-flow';
import { ReleasesListComponent } from '../../../cash-flow/components/releases-list/releases-list.component';
import { AccountBasicList } from '../../../../../interfaces/account';
import { ReleasesMonthPipe } from '../../../../../utils/releases-month.pipe';

@Component({
  selector: 'app-credit-card-invoice',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    CustomCurrencyPipe,
    MatButtonModule,
    NgOptimizedImage,
    TranslateModule,
    ReleasesListComponent,
    ReleasesMonthPipe,
  ],
  templateUrl: './credit-card-invoice.component.html',
  styleUrl: './credit-card-invoice.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardInvoiceComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _creditCardService = inject(CreditCardService);
  private _matDialog = inject(MatDialog);
  private _categoryService = inject(CategoryService);
  private _activatedRoute = inject(ActivatedRoute);

  currency = this.utilsService.getUserConfigs.currency;

  creditCardId: number = +this._activatedRoute.snapshot.paramMap.get('id')!;
  creditCard: WritableSignal<CreditCard | null> = signal(null);
  releases: WritableSignal<MonthlyRelease[]> = signal([]);

  selectedDate: Date = new Date();
  currentYear: string = this.selectedDate.getFullYear().toString();

  searching: WritableSignal<boolean> = signal(false);

  categories: Category[] = [];
  accounts: AccountBasicList[] = [];
  creditCards: CardBasicList[] = [];

  ngOnInit(): void {
    this.getInvoiceAndReleases();
    this.getValues();
  }

  getInvoiceAndReleases() {}

  async getValues() {
    this._creditCardService
      .getById(this.creditCardId)
      .then((response) => this.creditCard.set(response));

    this._categoryService
      .getByUser()
      .then((response) => (this.categories = response));
  }

  getDateInfo(info: 'closing' | 'expiration'): string {
    let day = '';
    switch (info) {
      case 'closing':
        day = this.creditCard()?.close_day.toString().padStart(2, '0') || '00';
        break;
      case 'expiration':
        day =
          this.creditCard()?.expires_day.toString().padStart(2, '0') || '00';
        break;
    }

    const month = (this.selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const year = this.selectedDate.getFullYear();

    return `${day}/${month}/${year}`;
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

    this.getInvoiceAndReleases();
  }

  addRelease() {
    lastValueFrom(
      this._matDialog
        .open(ReleaseFormDialogComponent, {
          data: {
            accounts: [],
            categories: this.categories,
            creditCards: [this.creditCard()],
            editing: false,
            releaseType: 'E',
            selectedDate: this.selectedDate,
            creditCardId: this.creditCardId,
          },
          panelClass: 'new-release-cash-flow-dialog',
          autoFocus: false,
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;

      this.getInvoiceAndReleases();
    });
  }
}
