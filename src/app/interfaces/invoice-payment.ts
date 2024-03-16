export interface InvoicePayment {
  id: number;
  invoiceId: number;
  paymentAccountId: number;
  paymentAmount: number;
  paymentDate: Date;
  paymentHour: string;
  attachment: File;
  attachmentName: string;
}
