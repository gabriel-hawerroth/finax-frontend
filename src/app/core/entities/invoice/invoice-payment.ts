export interface InvoicePayment {
  id?: number;
  creditCardId: number;
  monthYear: string;
  paymentAccountId: number;
  paymentAmount: number;
  paymentDate: Date;
  paymentHour?: string;
  attachment?: File;
  attachmentName?: string;
}
