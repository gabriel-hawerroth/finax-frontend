import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Account } from '../../../../../core/entities/account/account';
import { AccountService } from '../../../../../core/entities/account/account.service';
import { AccountChangedEvent } from '../../../../../core/enums/account-changed-event';
import { ButtonType } from '../../../../../core/enums/button-style';
import { ShowValues } from '../../../../../core/enums/show-values';
import { accountChangedEvent } from '../../../../../core/events/events';
import {
  ButtonConfig,
  ButtonPreConfig,
} from '../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { LS_SHOW_VALUES } from '../../../../../shared/utils/local-storage-contants';
import { ResponsiveService } from '../../../../../shared/utils/responsive.service';
import {
  getResponsiveFieldWidth,
  Widths,
} from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { AccountsListComponent } from '../../components/accounts-list/accounts-list.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatBottomSheetModule,
    MatCardModule,
    TranslateModule,
    DynamicButtonComponent,
    AccountsListComponent,
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBankAccountsPage implements OnInit, OnDestroy {
  readonly darkThemeEnable = this._utils.darkThemeEnable;

  private readonly _unsubscribeAll = new Subject<void>();

  situationFilter = new FormControl(true);
  situationFilterValue: boolean | 'all' = this.situationFilter.getRawValue()!;

  rows = signal<Account[]>([]);

  newBtnConfig: ButtonConfig = {
    preConfig: ButtonPreConfig.NEW,
    onClick: () => this.onNew(),
  };

  valuesViewBtnConfig: ButtonConfig = {
    type: ButtonType.ICON,
    icon: this._utils.getItemLocalStorage(LS_SHOW_VALUES) || ShowValues.OFF,
    style: {
      transform: 'scale(1.1)',
      'margin-right': '0 !important',
    },
    onClick: () => this.onChangeShowValues(),
  };

  finishedFetchingAccounts = signal(false);
  errorFetchingAccounts = signal(false);

  constructor(
    private readonly _utils: UtilsService,
    private readonly _router: Router,
    private readonly _accountService: AccountService,
    private readonly _responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {
    this.getAccounts();
    this.subscribeAccountChangedEvent();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();
  }

  getAccounts() {
    this._accountService
      .getByUser()
      .then((result: Account[]) => {
        this.rows.set(result);
      })
      .catch(() => this.errorFetchingAccounts.set(true))
      .finally(() => this.finishedFetchingAccounts.set(true));
  }

  onNew() {
    this._router.navigateByUrl('contas/nova');
  }

  private onChangeShowValues() {
    switch (this.valuesViewBtnConfig.icon) {
      case ShowValues.ON:
        this.valuesViewBtnConfig.icon = ShowValues.OFF;
        break;
      case ShowValues.OFF:
        this.valuesViewBtnConfig.icon = ShowValues.ON;
        break;
    }

    this._utils.setItemLocalStorage(
      LS_SHOW_VALUES,
      this.valuesViewBtnConfig.icon!
    );
  }

  private subscribeAccountChangedEvent() {
    accountChangedEvent
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((event) => {
        switch (event.event) {
          case AccountChangedEvent.BALANCE_UPDATED:
            this.onBalanceUpdate(event.accountsId as number, event.newBalance!);
            break;
          case AccountChangedEvent.DELETED:
            this.onDeleted(event.accountsId as number);
            break;
          case AccountChangedEvent.INACTIVATED:
            this.onInactivated(event.accountsId as number);
            break;
          case AccountChangedEvent.ACTIVATED:
            this.onActivated(event.accountsId as number[]);
            break;
        }
      });
  }

  private onBalanceUpdate(accountId: number, newBalance: number) {
    this.rows.update((rows) => {
      for (const row of rows) {
        if (row.id === accountId) {
          row.balance = newBalance;
          break;
        }
      }

      return [...rows];
    });
  }

  private onDeleted(accountId: number) {
    this.rows.update((rows) => {
      return [
        ...rows.filter(
          (row) => row.id !== accountId && row.primaryAccountId !== accountId
        ),
      ];
    });
  }

  private onInactivated(accountId: number) {
    this.rows.update((rows) => {
      rows.forEach((row) => {
        if (row.id === accountId || row.primaryAccountId === accountId)
          row.active = false;
      });

      return [...rows];
    });
  }

  private onActivated(accountsId: number[]) {
    this.rows.update((rows) => {
      rows.forEach((row) => {
        if (accountsId.includes(row.id!)) row.active = true;
      });

      return [...rows];
    });
  }

  get showValues() {
    return this.valuesViewBtnConfig.icon === ShowValues.ON;
  }

  addAccount(account: Account) {
    this.rows.update((rows) => [...rows, account]);
  }

  getResponsiveFieldWidth(
    widths: Widths,
    defaultWidth?: string,
    minWidth?: string
  ) {
    return getResponsiveFieldWidth(
      widths,
      defaultWidth,
      minWidth
    )(this._responsiveService);
  }
}
