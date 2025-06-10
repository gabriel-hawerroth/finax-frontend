import { Subject } from 'rxjs';
import { AccountChangedEvent } from '../enums/account-changed-event';

export const accountChangedEvent = new Subject<{
  accountsId: number | number[];
  event: AccountChangedEvent;
  newBalance?: number;
}>();

export const releaseCreatedEvent = new Subject<void>();
