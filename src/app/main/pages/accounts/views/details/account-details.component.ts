import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Account } from '../../../../../core/entities/account/account';
import {
  BankAccountDetailsData,
  EditBalanceDialogData,
  SubAccountsActivateDialogData,
} from '../../../../../core/entities/account/account-dto';
import { AccountService } from '../../../../../core/entities/account/account.service';
import { AccountChangedEvent } from '../../../../../core/enums/account-changed-event';
import { ButtonType } from '../../../../../core/enums/button-style';
import { accountChangedEvent } from '../../../../../core/events/events';
import { ButtonConfig } from '../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import {
  cloudFireCdnImgsLink,
  HIDE_VALUE,
} from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { EditBalanceDialog } from '../../components/edit-balance-dialog/edit-balance-dialog.component';
import { SubAccountsActivateDialog } from '../../components/sub-accounts-activate-dialog/sub-accounts-activate-dialog.component';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    CommonModule,
    CustomCurrencyPipe,
    NgOptimizedImage,
    TranslateModule,
    DynamicButtonComponent,
  ],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountDetailsComponent {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly darkThemeEnabled = this._utils.darkThemeEnable;
  readonly showValues = this._utils.showValues;
  readonly hideValue = HIDE_VALUE;

  readonly currency = this._utils.getUserConfigs.currency;

  account: Account;
  primaryAccount: Account | null;
  readonly subAccounts?: Account[];
  readonly hasSubAccounts: boolean;
  readonly isSubAccount: boolean;

  seeReleasesBtnConfig: ButtonConfig = {
    icon: 'sort',
    label: 'my-accounts.see-releases',
    contentStyle: {
      'font-size': '1rem',
    },
  };

  editBtnConfig: ButtonConfig = {
    icon: 'edit',
    label: 'actions.edit',
    contentStyle: {
      'font-size': '1rem',
    },
    onClick: () => this.edit(),
  };

  changeSituationBtnConfig: ButtonConfig;

  deleteBtnConfig: ButtonConfig = {
    label: 'actions.exclude',
    style: {},
    contentStyle: {
      color: 'red',
    },
    onClick: () => this.onDelete(),
  };

  constructor(
    private readonly _utils: UtilsService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _bottomSheetRef: MatBottomSheetRef,
    private readonly _dialog: MatDialog,
    private readonly _router: Router,
    private readonly _accountService: AccountService
  ) {
    const data: BankAccountDetailsData = inject(MAT_BOTTOM_SHEET_DATA);
    this.account = data.account;
    this.primaryAccount = data.primaryAccount;
    this.subAccounts = data.subAccounts;
    this.hasSubAccounts = Boolean(this.subAccounts?.length);
    this.isSubAccount = Boolean(this.primaryAccount);

    this.changeSituationBtnConfig = {
      label: this.account.active ? 'generic.inactivate' : 'generic.activate',
      contentStyle: {
        color: 'gray',
      },
      onClick: () =>
        this.account.active ? this.onInactivate() : this.onActivate(),
    };
  }

  edit() {
    this._bottomSheetRef.dismiss();
    this._router.navigateByUrl(`contas/${this.account.id}`);
  }

  adjustBalance() {
    lastValueFrom(
      this._dialog
        .open(EditBalanceDialog, {
          data: <EditBalanceDialogData>{
            account: this.account,
          },
          panelClass: 'edit-balance-dialog',
          autoFocus: false,
        })
        .afterClosed()
    ).then((result: any) => {
      if (!result) return;

      this.account.balance = result;
      this._changeDetectorRef.detectChanges();

      accountChangedEvent.next({
        accountsId: this.account.id!,
        event: AccountChangedEvent.BALANCE_UPDATED,
        newBalance: result,
      });

      this._bottomSheetRef.dismiss();
    });
  }

  onDelete() {
    const confirmMessage = this.hasSubAccounts
      ? 'my-accounts.primary-with-sub-accounts-confirm-action'
      : 'my-accounts.confirm-action';

    const action = this.hasSubAccounts
      ? 'record-events.exclusion'
      : 'actions.exclude';

    this._utils
      .showConfirmDialog(confirmMessage, { action })
      .then((response) => {
        if (!response) return;
        this.deleteAccount();
      });
  }

  private deleteAccount() {
    this._accountService
      .deleteById(this.account.id!)
      .then(() => {
        this._utils.showMessage('my-accounts.deleted-successfully', 4000);

        accountChangedEvent.next({
          accountsId: this.account.id!,
          event: AccountChangedEvent.DELETED,
        });

        this._bottomSheetRef.dismiss();
      })
      .catch(() => {
        if (this.account.active) {
          this._utils
            .showConfirmDialog(
              'my-accounts.error-excluding-linked-registers-inactivate'
            )
            .then((response) => {
              if (!response) return;
              this.inactiveAccount();
            });
        } else {
          this._utils.showMessage(
            'my-accounts.error-excluding-linked-registers',
            4000
          );
        }
      });
  }

  onInactivate() {
    const confirmMessage = this.hasSubAccounts
      ? 'my-accounts.primary-with-sub-accounts-confirm-action'
      : 'my-accounts.confirm-action';

    const action = this.hasSubAccounts
      ? 'record-events.inactivation'
      : 'generic.inactivate';

    this._utils
      .showConfirmDialog(confirmMessage, { action })
      .then((response) => {
        if (!response) return;
        this.inactiveAccount();
      });
  }

  private inactiveAccount() {
    this._accountService.inactivateAccount(this.account.id!).then(() => {
      this._utils.showParamitezedMessages(
        'my-accounts.action-success',
        { action: 'record-events.inactivated-f' },
        4000
      );

      accountChangedEvent.next({
        accountsId: this.account.id!,
        event: AccountChangedEvent.INACTIVATED,
      });

      this._bottomSheetRef.dismiss();
    });
  }

  onActivate() {
    if (this.hasSubAccounts) {
      lastValueFrom(
        this._dialog
          .open(SubAccountsActivateDialog, {
            data: <SubAccountsActivateDialogData>{
              subAccounts: this.subAccounts,
            },
            autoFocus: false,
          })
          .afterClosed()
      ).then((response) => {
        if (!response) return;
        this.activeAccount(response);
      });
    } else if (this.primaryAccount && !this.primaryAccount.active) {
      this._utils
        .showConfirmDialog(
          'my-accounts.confirm-sub-account-activate-with-principal'
        )
        .then((response) => {
          if (!response) return;
          this.activeAccount([this.primaryAccount!.id!]);
        });
    } else {
      this._utils
        .showConfirmDialog('my-accounts.confirm-action', {
          action: 'generic.activate',
        })
        .then((response) => {
          if (!response) return;
          this.activeAccount();
        });
    }
  }

  private activeAccount(accountsId: number[] = []) {
    this._accountService
      .activateAccount(this.account.id!, accountsId || [])
      .then(() => {
        this._utils.showParamitezedMessages(
          'my-accounts.action-success',
          { action: 'record-events.activated-f' },
          4000
        );

        accountChangedEvent.next({
          accountsId: [this.account.id!, ...accountsId],
          event: AccountChangedEvent.ACTIVATED,
        });

        this._bottomSheetRef.dismiss();
      });
  }

  get getAccountType(): string {
    let type = 'my-accounts.account-types.';
    type += this.account.type?.toString().toLowerCase();
    return type;
  }

  get getBtnStyle() {
    return ButtonType.STROKED;
  }

  get getEditBtnStyle() {
    return ButtonType.BASIC;
  }
}
