export interface InvoicePayment {
  id?: number;
  credit_card_id: number;
  month_year: string;
  payment_account_id: number;
  payment_amount: number;
  payment_date: Date;
  payment_hour?: string;
  attachment?: File;
  attachment_name?: string;
}
