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
  creditCard: CreditCard;
  accountsList: AccountBasicList[];
  categoriesList: Category[];
  creditCardsList: CardBasicList[];
}
