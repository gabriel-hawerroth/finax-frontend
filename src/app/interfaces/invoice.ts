import { AccountBasicList } from './account';
import { MonthlyRelease } from './cash-flow';
import { Category } from './category';
import { CardBasicList, CreditCard } from './credit-card';
import { InvoicePayment } from './invoice-payment';

export interface Invoice {
  id: number;
  user_id: number;
  credit_card_id: number;
  month_year: string;
  payment_account_id: number;
  payment_date: Date;
}

export interface InvoiceMonthValues {
  invoice: Invoice;
  invoicePayments: InvoicePayment[];
  releases: MonthlyRelease[];
}

export interface InvoiceValues {
  creditCard: CreditCard;
  accountsList: AccountBasicList[];
  categoriesList: Category[];
  creditCardsList: CardBasicList[];
}

export interface InvoicePaymentSave {
  payment: InvoicePayment;
  attachment?: File;
}
