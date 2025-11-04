import { Subject } from 'rxjs';
import {
  AccountChangedEvent,
  CreditCardChangedEvent,
} from '../enums/entity-changed-events';

export const accountChangedEvent = new Subject<{
  accountsId: number | number[];
  event: AccountChangedEvent;
  newBalance?: number;
}>();

export const releaseCreatedEvent = new Subject<void>();

export const onLogoutEvent = new Subject<{
  showMessage: boolean;
  redirectToPublicPage?: boolean;
}>();

export const creditCardChangedEvent = new Subject<{
  creditCardId: number;
  event: CreditCardChangedEvent;
}>();
