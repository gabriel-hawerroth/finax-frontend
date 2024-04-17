import { AccountBasicList } from './account';
import { MonthlyRelease } from './cash-flow';
import { Category } from './category';
import { CardBasicList } from './credit-card';
import { InvoicePaymentPerson } from './invoice-payment';

export interface InvoiceMonthValues {
  invoicePayments: InvoicePaymentPerson[];
  releases: MonthlyRelease[];
}

export interface InvoiceValues {
  accountsList: AccountBasicList[];
  categoriesList: Category[];
  creditCardsList: CardBasicList[];
}
