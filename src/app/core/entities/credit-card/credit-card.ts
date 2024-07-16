export interface CreditCard {
  id: number;
  userId: number;
  name: string;
  cardLimit: number;
  closeDay: number;
  expiresDay: number;
  image: string;
  standardPaymentAccountId: number;
  active: boolean;
}
