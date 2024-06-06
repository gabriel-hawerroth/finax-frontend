import { AccountBasicList } from '../account/account-dto';
import { MonthlyRelease } from '../cash-flow/cash-flow-dto';
import { Category } from '../category/category';
import { CardBasicList } from '../credit-card/credit-card-dto';
import { InvoicePaymentPerson } from './invoice-payment-dto';

export interface InvoiceMonthValues {
  invoicePayments: InvoicePaymentPerson[];
  releases: MonthlyRelease[];
  previousBalance: number;
}

export interface InvoiceValues {
  accountsList: AccountBasicList[];
  categoriesList: Category[];
  creditCardsList: CardBasicList[];
}

export interface CreditCardInvoiceValues {
  close: Date;
  expire: Date;
  value: number;
}
