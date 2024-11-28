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
import { EditBalanceDialogData } from '../../../../../core/entities/account/account-dto';
import { AccountService } from '../../../../../core/entities/account/account.service';
import { ButtonType } from '../../../../../core/enums/button-style';
import { ExclusionProcess } from '../../../../../core/enums/exclusion-process';
import {
  accountBalanceUpdatedEvent,
  accountDeletedEvent,
} from '../../../../../core/events/events';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import {
  cloudFireCdnImgsLink,
  HIDE_VALUE,
} from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { EditBalanceDialog } from '../../components/edit-balance-dialog/edit-balance-dialog.component';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    CommonModule,
    CustomCurrencyPipe,
    NgOptimizedImage,
    TranslateModule,
    ButtonsComponent,
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

  account: Account = inject(MAT_BOTTOM_SHEET_DATA).account;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _bottomSheetRef: MatBottomSheetRef,
    private readonly _dialog: MatDialog,
    private readonly _router: Router,
    private readonly _accountService: AccountService
  ) {}

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

      accountBalanceUpdatedEvent.next({
        accountId: this.account.id!,
        newBalance: result,
      });

      this._bottomSheetRef.dismiss();
    });
  }

  deleteAccount() {
    this._utils
      .showConfirmDialog('my-accounts.confirm-delete')
      .then((response) => {
        if (!response) return;

        this._accountService
          .deleteById(this.account.id!)
          .then((response) => {
            switch (response) {
              case ExclusionProcess.DELETED:
                this._utils.showMessage(
                  'my-accounts.deleted-successfully',
                  4000
                );
                break;
              case ExclusionProcess.INACTIVATED:
                this._utils.showMessage(
                  'my-accounts.linked-account-inactivated',
                  5000
                );
                break;
            }

            accountDeletedEvent.next({
              accountId: this.account.id!,
            });

            this._bottomSheetRef.dismiss();
          })
          .catch(() => this._utils.showMessage('my-accounts.error-deleting'));
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
