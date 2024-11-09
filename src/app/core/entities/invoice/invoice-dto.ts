import { BasicAccount } from '../account/account-dto';
import { Category } from '../category/category';
import { BasicCard } from '../credit-card/credit-card-dto';
import { MonthlyRelease } from '../release/release-dto';
import { InvoicePaymentPerson } from './invoice-payment-dto';

export interface InvoiceMonthValues {
  payments: InvoicePaymentPerson[];
  releases: MonthlyRelease[];
  amount: number;
}

export interface InvoiceValues {
  accountsList: BasicAccount[];
  categoriesList: Category[];
  creditCardsList: BasicCard[];
}

export interface CreditCardInvoiceValues {
  close: Date;
  expire: Date;
  value: number;
}
