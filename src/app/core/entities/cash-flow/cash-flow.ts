export interface CashFlow {
  id?: number;
  userId: number;
  description?: string;
  accountId: number;
  amount: number;
  type: string;
  done: boolean;
  targetAccountId?: number;
  categoryId: number;
  date: Date;
  time?: string;
  observation?: string;
  attachment?: File;
  attachmentName?: string;
  duplicatedReleaseId?: number;
  repeat?: string;
  fixedBy?: string;
  credit_card_id?: number;
}
