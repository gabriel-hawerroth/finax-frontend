import { AccountBasicList } from './account';
import { MonthlyRelease } from './cash-flow';
import { Category } from './category';
import { CardBasicList, CreditCard } from './credit-card';
import { InvoicePayment } from './invoice-payment';

export interface InvoiceMonthValues {
  invoicePayments: InvoicePayment[];
  releases: MonthlyRelease[];
}

export interface InvoiceValues {
  accountsList: AccountBasicList[];
  categoriesList: Category[];
  creditCardsList: CardBasicList[];
}
