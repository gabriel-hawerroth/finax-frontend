import { Subject } from 'rxjs';

export const accountBalanceUpdatedEvent = new Subject<{
  accountId: number;
  newBalance: number;
}>();
