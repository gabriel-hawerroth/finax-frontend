export interface Account {
  id?: number;
  userId: number;
  name: string;
  balance: number;
  investments: boolean;
  addOverallBalance: boolean;
  active: boolean;
  archived: boolean;
  image: string;
  accountNumber: string;
  agency: number;
  code: number;
  type: string;
}
