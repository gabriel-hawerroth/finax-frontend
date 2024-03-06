export interface Invoice {
  id: number;
  user_id: number;
  credit_card_id: number;
  month_year: string;
  payment_account_id: number;
  payment_date: Date;
}
