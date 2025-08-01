import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Account } from '../../../../../core/entities/account/account';
import {
  AccountFormDialogData,
  BankAccountDetailsData,
} from '../../../../../core/entities/account/account-dto';
import {
  ButtonConfig,
  ButtonPreConfig,
} from '../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { ResponsiveService } from '../../../../../shared/services/responsive.service';
import {
  cloudFireCdnImgsLink,
  getDefaultAccountImage,
  HIDE_VALUE,
} from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { BankAccountDetailsComponent } from '../../views/details/account-details.component';
import { AccountsFormDialog } from '../accounts-form-dialog/accounts-form-dialog.component';

@Component({
  selector: 'app-sub-accounts',
  imports: [
    CommonModule,
    TranslateModule,
    DynamicButtonComponent,
    NgOptimizedImage,
    CustomCurrencyPipe,
  ],
  templateUrl: './sub-accounts.component.html',
  styleUrl: './sub-accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubAccountsComponent {
  readonly getDefaultAccountImage = getDefaultAccountImage;
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly currency = this._utils.getUserConfigs.currency;
  readonly isMobileView = this._responsiveService.isMobileView;
  readonly hideValue = HIDE_VALUE;

  readonly primaryAccount = input.required<Account>();
  readonly subAccounts = input.required<Account[]>();
  readonly showValues = input.required<boolean>();
  readonly isLastPrimaryAccount = input.required<boolean>();
  readonly reloadList = output<Account>();

  registerOneBtnConfig: ButtonConfig = {
    preConfig: ButtonPreConfig.NEW,
    onClick: () => this.openAccountFormDialog(),
  };

  addMoreBtnConfig: ButtonConfig = {
    icon: 'add',
    onClick: () => this.openAccountFormDialog(),
  };

  constructor(
    private readonly _utils: UtilsService,
    private readonly _matDialog: MatDialog,
    private readonly _bottomSheet: MatBottomSheet,
    private readonly _responsiveService: ResponsiveService
  ) {}

  openAccountFormDialog(): void {
    const config = {
      data: <AccountFormDialogData>{
        primaryAccount: this.primaryAccount(),
      },
      minWidth: this.isMobileView() ? '100vw' : '45vw',
      autoFocus: false,
    };

    const observable = this._responsiveService.smallWidth()
      ? this._bottomSheet.open(AccountsFormDialog, config).afterDismissed()
      : this._matDialog.open(AccountsFormDialog, config).afterClosed();

    lastValueFrom(observable).then((result) => {
      if (!result) return;

      this.reloadList.emit(result);
    });
  }

  openDetails(account: Account) {
    this._bottomSheet.open(BankAccountDetailsComponent, {
      data: <BankAccountDetailsData>{
        account: account,
        primaryAccount: this.primaryAccount(),
      },
      panelClass: 'account-details',
    });
  }

  isLastItem(index: number) {
    return index === this.subAccounts().length - 1;
  }
}
