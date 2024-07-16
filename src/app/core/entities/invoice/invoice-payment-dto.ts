import { AccountBasicList } from '../account/account-dto';

export interface InvoicePaymentPerson {
  id: number;
  creditCardId: number;
  monthYear: string;
  paymentAccountId: number;
  paymentAccountName: string;
  paymentAccountImage: string;
  paymentAmount: number;
  paymentDate: Date;
  paymentHour: string;
  attachmentName?: string;
}

export interface InvoicePaymentDialogData {
  accounts: AccountBasicList[];
  creditCardId: number;
  defaultPaymmentAccount: number;
  defaultPaymentAmount: number;
  monthYear: string;
  payment?: InvoicePaymentPerson;
  expireDate: Date;
}
