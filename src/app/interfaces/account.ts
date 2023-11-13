export interface Account {
  id?: number;
  userId: number;
  accountName: string;
  balance: number;
  investments: boolean;
  addOverallBalance: boolean;
  active: boolean;
  archived: boolean;
}
