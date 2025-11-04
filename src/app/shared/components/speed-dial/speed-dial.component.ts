import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ReleaseFormDialogData } from '../../../core/entities/release/release-dto';
import {
  AccountChangedEvent,
  CreditCardChangedEvent,
} from '../../../core/enums/entity-changed-events';
import { ReleaseType } from '../../../core/enums/release-enums';
import {
  accountChangedEvent,
  creditCardChangedEvent,
  releaseCreatedEvent,
} from '../../../core/events/events';
import { SpeedDialService } from '../../services/speed-dial.service';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-speed-dial',
  imports: [RouterModule, TranslateModule],
  templateUrl: './speed-dial.component.html',
  styleUrl: './speed-dial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeedDialComponent implements OnInit, OnDestroy {
  isOpen = signal(false);

  private readonly _unsubscribeAll = new Subject<void>();

  constructor(
    private readonly _speedDialService: SpeedDialService,
    private readonly _utils: UtilsService
  ) {}

  ngOnInit(): void {
    accountChangedEvent
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((event) => {
        if (
          event.event === AccountChangedEvent.DELETED ||
          event.event === AccountChangedEvent.INACTIVATED
        ) {
          const accountId =
            event.accountsId instanceof Array
              ? event.accountsId[0]
              : event.accountsId;

          this._speedDialService.onDeleteAccount(accountId);
        }
      });

    creditCardChangedEvent
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((event) => {
        if (
          event.event === CreditCardChangedEvent.DELETED ||
          event.event === CreditCardChangedEvent.INACTIVATED
        )
          this._speedDialService.onDeleteCreditCard(event.creditCardId);
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  toggle() {
    this.isOpen.set(!this.isOpen());
  }

  options = [
    {
      color: '#00ff88',
      icon: 'trending_up',
      label: 'generic.revenue',
      onClick: () => this.addRelease(ReleaseType.REVENUE),
    },
    {
      id: 'center',
      color: '#44aaff',
      icon: 'south_west',
      label: 'generic.transfer',
      onClick: () => this.addRelease(ReleaseType.TRANSFER),
    },
    {
      color: '#ff4455',
      icon: 'trending_down',
      label: 'generic.expense',
      onClick: () => this.addRelease(ReleaseType.EXPENSE),
    },
  ];

  addRelease(releaseType: ReleaseType) {
    this.isOpen.set(false);

    this._utils
      .openReleaseFormDialog(<ReleaseFormDialogData>{
        accounts: this._speedDialService.accounts,
        categories: this._speedDialService.categories,
        creditCards: this._speedDialService.creditCards,
        editing: false,
        releaseType: releaseType,
        selectedDate: new Date(),
      })
      .then((response) => {
        if (!response) return;
        releaseCreatedEvent.next();
      });
  }

  capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
