import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  computed,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  addDays,
  addMonths,
  format,
  isBefore,
  isValid,
  parse,
  setDate,
  toDate,
} from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { BasicAccount } from '../../../../../core/entities/account/account-dto';
import { Category } from '../../../../../core/entities/category/category';
import { CreditCard } from '../../../../../core/entities/credit-card/credit-card';
import { BasicCard } from '../../../../../core/entities/credit-card/credit-card-dto';
import { CreditCardService } from '../../../../../core/entities/credit-card/credit-card.service';
import {
  CreditCardInvoiceValues,
  InvoiceMonthValues,
} from '../../../../../core/entities/invoice/invoice-dto';
import {
  InvoicePaymentDialogData,
  InvoicePaymentPerson,
} from '../../../../../core/entities/invoice/invoice-payment-dto';
import { InvoiceService } from '../../../../../core/entities/invoice/invoice.service';
import { ReleaseFormDialogData } from '../../../../../core/entities/release/release-dto';
import { ButtonType } from '../../../../../core/enums/button-style';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { ReleasesMonthPipe } from '../../../../../shared/pipes/releases-month.pipe';
import { ResponsiveService } from '../../../../../shared/utils/responsive.service';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { ReleasesListComponent } from '../../../cash-flow/components/releases-list/releases-list.component';
import {
  InvoicePaymentsCardDialog,
  InvoicePaymentsCardDialogData,
} from '../../components/payments-card-dialog/payments-card-dialog.component';
import { InvoicePaymentsCardComponent } from '../../components/payments-card/invoice-payments-card.component';
import { InvoicePaymentDialog } from '../payment-dialog/invoice-payment-dialog.component';

@Component({
  selector: 'app-credit-card-invoice',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    CustomCurrencyPipe,
    NgOptimizedImage,
    TranslateModule,
    ReleasesListComponent,
    ReleasesMonthPipe,
    RouterModule,
    InvoicePaymentsCardComponent,
    ButtonsComponent,
  ],
  templateUrl: './credit-card-invoice.component.html',
  styleUrl: './credit-card-invoice.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardInvoicePage implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly currency = this._utils.getUserConfigs.currency;
  readonly darkThemeEnabled = this._utils.darkThemeEnable;
  readonly smallWidth = this._responsiveService.smallWidth;

  creditCardId: number = +this._activatedRoute.snapshot.paramMap.get('id')!;
  creditCard = signal<CreditCard | null>(null);

  monthValues = signal<InvoiceMonthValues>({
    payments: [],
    releases: [],
    amount: 0,
  });

  selectedDate = signal(addMonths(setDate(new Date(), 15), 1));
  currentYear: string = this.selectedDate().getFullYear().toString();

  searching = signal(false);

  accounts: BasicAccount[] = [];
  categories: Category[] = [];
  creditCards: BasicCard[] = [];

  invoiceValues!: Signal<CreditCardInvoiceValues>;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _matDialog: MatDialog,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _invoiceService: InvoiceService,
    private readonly _creditCardService: CreditCardService,
    private readonly _responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {
    this.getValues();
    this.invoiceValues = this.getComputedInvoiceValues;

    this._creditCardService.getById(this.creditCardId).then((response) => {
      this.creditCard.set(response);
      this.getMonthValues();
    });
  }

  get getComputedInvoiceValues(): Signal<CreditCardInvoiceValues> {
    return computed(() => {
      const close = this.parseDateWithFallback(this.getCloseDtString);
      let expire = this.parseDateWithFallback(this.getExpireDtString);

      if (isBefore(expire, close)) {
        expire = addMonths(expire, 1);
      }

      return {
        close,
        expire,
        value: this.monthValues().amount,
      };
    });
  }

  getMonthValues() {
    const monthYear = format(this.selectedDate(), 'MM/yyyy');

    this._invoiceService
      .getMonthValues(this.creditCardId, monthYear)
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
    this._utils
      .openReleaseFormDialog(<ReleaseFormDialogData>{
        accounts: [],
        categories: this.categories,
        creditCards: [this.creditCard()],
        editing: false,
        releaseType: 'E',
        selectedDate: this.selectedDate(),
        creditCardId: this.creditCardId,
      })
      .then((response) => {
        if (!response) return;

        this.getMonthValues();
      });
  }

  payInvoice(invoicePayment?: InvoicePaymentPerson) {
    lastValueFrom(
      this._matDialog
        .open(InvoicePaymentDialog, {
          panelClass: 'invoice-payment-dialog',
          autoFocus: false,
          data: <InvoicePaymentDialogData>{
            accounts: this.accounts,
            creditCardId: this.creditCardId,
            defaultPaymmentAccount: this.creditCard()!.standardPaymentAccountId,
            defaultPaymentAmount:
              this.invoiceValues().value -
              this.monthValues().payments.reduce(
                (amount, item) => (amount += item.paymentAmount),
                0
              ),
            monthYear: format(this.selectedDate(), 'MM/yyyy'),
            payment: invoicePayment,
            expireDate: this.invoiceValues().expire,
            invoiceValue: this.invoiceValues().value,
            invoicePayments: this.monthValues().payments,
          },
        })
        .afterClosed()
    ).then((response) => {
      if (response === true) {
        this.getMonthValues();
      }
    });
  }

  seePayments() {
    lastValueFrom(
      this._matDialog
        .open(InvoicePaymentsCardDialog, {
          data: <InvoicePaymentsCardDialogData>{
            payments: this.monthValues().payments,
            invoiceValue: this.invoiceValues().value,
            fullyPaid: this.fullyPaid(),
            editPayment: this.payInvoice,
            updateValues: this.getMonthValues,
          },
          autoFocus: false,
          width: '95vw',
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;
      this.payInvoice(response);
    });
  }

  parseDateWithFallback(stringDt: string): Date {
    const date = parse(stringDt, 'yyyy-MM-dd', new Date());

    if (!isValid(date)) {
      const dtParts = stringDt.split('-');

      return addDays(
        toDate(`${dtParts[0]}-${this.formatDay(Number(dtParts[1]) + 1)}-01`),
        1
      );
    }

    return date;
  }

  get getFirstDtInvoice(): Date {
    let close = this.getCloseDtString.split('-');

    if (this.selectedDate().getMonth() === 0) {
      close[1] = '12';
    } else {
      close[1] = this.formatDay(Number(close[1]) - 1);
    }

    return addDays(this.parseDateWithFallback(close.join('-')), 1);
  }

  get getCloseDtString(): string {
    return `${this.selectedDate().getFullYear()}-${this.formatDay(
      this.selectedDate().getMonth() + 1
    )}-${this.formatDay(this.creditCard()?.closeDay)}`;
  }

  get getExpireDtString(): string {
    return `${this.selectedDate().getFullYear()}-${this.formatDay(
      this.selectedDate().getMonth() + 1
    )}-${this.formatDay(this.creditCard()?.expiresDay)}`;
  }

  formatDay(day: number | undefined): string {
    return (day || 1).toString().padStart(2, '0');
  }

  get iconBtnStyle() {
    return ButtonType.ICON;
  }

  fullyPaid = computed(() => {
    const paymentsAmount = this.monthValues().payments.reduce(
      (count, item) => (count += item.paymentAmount),
      0
    );

    return paymentsAmount >= this.invoiceValues().value;
  });
}
