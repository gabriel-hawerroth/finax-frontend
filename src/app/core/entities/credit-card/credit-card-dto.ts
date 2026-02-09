export interface UserCreditCard {
  id: number;
  userId: number;
  name: string;
  cardLimit: number;
  closeDay: number;
  expiresDay: number;
  image: string;
  standardPaymentAccountId: number;
  active: boolean;
  accountName: string;
  accountImage: string;
}

export interface BasicCard {
  id: number;
  name: string;
  image: string;
}

export interface CreditCardDetailsData {
  card: UserCreditCard;
}

export interface SaveCreditCardDTO {
  name: string;
  cardLimit: number;
  closeDay: number;
  expiresDay: number;
  image: string;
  standardPaymentAccountId: number;
}
