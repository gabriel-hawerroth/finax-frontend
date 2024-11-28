import { Subject } from 'rxjs';

export const accountBalanceUpdatedEvent = new Subject<{
  accountId: number;
  newBalance: number;
}>();

export const accountDeletedEvent = new Subject<{
  accountId: number;
}>();
