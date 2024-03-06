import { Invoice } from './Invoice';
import { MonthlyRelease } from './cash-flow';

export interface CreditCard {
  id: number;
  user_id: number;
  name: string;
  card_limit: number;
  close_day: number;
  expires_day: number;
  image: string;
  standard_payment_account_id: number;
  active: boolean;
}

export interface UserCreditCards {
  id: number;
  user_id: number;
  name: string;
  card_limit: number;
  close_day: number;
  expires_day: number;
  image: string;
  standard_payment_account_id: number;
  active: boolean;
  account_name: string;
  account_image: string;
}

export interface CardBasicList {
  id: number;
  name: string;
  image: string;
}

export interface InvoiceAndReleases {
  invoice: Invoice;
  releases: MonthlyRelease;
}
