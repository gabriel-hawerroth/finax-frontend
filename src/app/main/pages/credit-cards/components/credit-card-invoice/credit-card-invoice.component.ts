import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  addDays,
  addMonths,
  endOfDay,
  format,
  isBefore,
  isValid,
  parse,
  startOfDay,
  toDate,
} from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { AccountBasicList } from '../../../../../interfaces/account';
import { Category } from '../../../../../interfaces/category';
import {
  CardBasicList,
  CreditCard,
} from '../../../../../interfaces/credit-card';
import { InvoiceMonthValues } from '../../../../../interfaces/invoice';
import { InvoiceService } from '../../../../../services/invoice.service';
import { ReleaseFormDialogComponent } from '../../../../../shared/components/release-form-dialog/release-form-dialog.component';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { ReleasesMonthPipe } from '../../../../../shared/pipes/releases-month.pipe';
import { UtilsService } from '../../../../../utils/utils.service';
import { ReleasesListComponent } from '../../../cash-flow/components/releases-list/releases-list.component';
import { InvoicePaymentDialogComponent } from '../invoice-payment-dialog/invoice-payment-dialog.component';
import { CreditCardService } from '../../../../../services/credit-card.service';

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
  private _matDialog = inject(MatDialog);
  private _activatedRoute = inject(ActivatedRoute);
  private _invoiceService = inject(InvoiceService);
  private _creditCardService = inject(CreditCardService);

  currency = this.utilsService.getUserConfigs.currency;

  creditCardId: number = +this._activatedRoute.snapshot.paramMap.get('id')!;
  creditCard = signal<CreditCard | null>(null);

  monthValues = signal<InvoiceMonthValues>({
    invoicePayments: [],
    releases: [],
  });

  selectedDate = signal(new Date(new Date().setDate(15)));
  currentYear: string = this.selectedDate().getFullYear().toString();

  searching = signal(false);

  accounts: AccountBasicList[] = [];
  categories: Category[] = [];
  creditCards: CardBasicList[] = [];

  invoiceValues = computed(() => {
    const creditCard = this.creditCard();

    const closeDay = this.formatDay(creditCard?.close_day);
    const expireDay = this.formatDay(creditCard?.expires_day);
    const month = this.formatDay(this.selectedDate().getMonth() + 1);
    const year = this.selectedDate().getFullYear();

    const close = this.validityDate(`${year}-${month}-${closeDay}`);
    let expire = this.validityDate(`${year}-${month}-${expireDay}`);

    if (isBefore(expire, close)) {
      expire = addMonths(expire, 1);
    }

    const value: number = this.utilsService
      .filterList(this.monthValues().releases, 'done', true)
      .reduce((count, item) => count + item.amount, 0);

    return {
      close: close.toLocaleDateString(),
      expire: expire.toLocaleDateString(),
      value,
    };
  });

  ngOnInit(): void {
    this.getValues();

    this._creditCardService.getById(this.creditCardId).then((response) => {
      this.creditCard.set(response);
      this.getMonthValues();
    });
  }

  getMonthValues() {
    const monthYear = format(this.selectedDate(), 'MM/yyyy');

    const lastDt = endOfDay(
      addDays(
        new Date(this.invoiceValues().close.split('/').reverse().join('-')),
        1
      )
    );

    let firstDt = addMonths(lastDt, -1);

    if (
      this.selectedDate().getMonth() !== 0 &&
      this.selectedDate().getMonth() !== firstDt.getMonth()
    ) {
      firstDt = addDays(firstDt, 2);
    } else if (this.selectedDate().getMonth() === 0) {
      firstDt = addDays(firstDt, 1);
    }

    firstDt = startOfDay(firstDt);

    this._invoiceService
      .getMonthValues(this.creditCardId, monthYear, firstDt, lastDt)
      .then((response) => this.monthValues.set(response));
  }

  getValues() {
    this._invoiceService.getValues().then((response) => {
      this.accounts = response.accountsList;
      this.categories = response.categoriesList;
      this.creditCards = response.creditCardsList;
    });
  }

  changeMonth(direction: 'before' | 'next') {
    this.selectedDate.update((value) => {
      return addMonths(value, direction === 'before' ? -1 : 1);
    });

    this.getMonthValues();
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
            selectedDate: this.selectedDate(),
            creditCardId: this.creditCardId,
          },
          panelClass: 'new-release-cash-flow-dialog',
          autoFocus: false,
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;

      this.getMonthValues();
    });
  }

  payInvoice() {
    this._matDialog.open(InvoicePaymentDialogComponent, {
      panelClass: 'invoice-payment-dialog',
      autoFocus: false,
      data: {
        accounts: this.accounts,
        creditCardId: this.creditCardId,
        defaultPaymmentAccount: this.creditCard()!.standard_payment_account_id,
        defaultPaymentAmount:
          this.invoiceValues().value -
          this.monthValues().invoicePayments.reduce(
            (amount, item) => (amount += item.payment_amount),
            0
          ),
        monthYear: format(this.selectedDate(), 'MM/yyyy'),
      },
    });
  }

  validityDate(stringDt: string): Date {
    const date = parse(stringDt, 'yyyy-MM-dd', new Date());
    const dtParts = stringDt.split('-');

    if (!isValid(date)) {
      return addDays(
        toDate(`${dtParts[0]}-${this.formatDay(Number(dtParts[1]) + 1)}-01`),
        1
      );
    }

    return date;
  }

  formatDay(day: number | undefined): string {
    return (day || 1).toString().padStart(2, '0');
  }
}
