import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Account } from '../../../../../core/entities/account/account';
import { AccountFormDialogData } from '../../../../../core/entities/account/account-dto';
import {
  ButtonConfig,
  ButtonPreConfig,
} from '../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { AccountsFormDialog } from '../accounts-form-dialog/accounts-form-dialog.component';
import { AccountsListComponent } from '../accounts-list/accounts-list.component';

@Component({
  selector: 'app-sub-accounts',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DynamicButtonComponent,
    AccountsListComponent,
  ],
  templateUrl: './sub-accounts.component.html',
  styleUrl: './sub-accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubAccountsComponent {
  primaryAccountId = input.required<number>();
  subAccounts = input.required<Account[]>();
  isLastPrimaryAccount = input.required<boolean>();
  reloadList = output<void>();

  registerOneBtnConfig: ButtonConfig = {
    preConfig: ButtonPreConfig.NEW,
    onClick: () => this.openAccountFormDialog(),
  };

  addMoreBtnConfig: ButtonConfig = {
    icon: 'add',
    onClick: () => this.openAccountFormDialog(),
  };

  constructor(private readonly _matDialog: MatDialog) {}

  openAccountFormDialog(): void {
    lastValueFrom(
      this._matDialog
        .open(AccountsFormDialog, {
          data: <AccountFormDialogData>{
            primaryAccountId: this.primaryAccountId(),
          },
          minWidth: '45vw',
          autoFocus: false,
        })
        .afterClosed()
    ).then((result) => {
      console.log('closed', result);

      if (!result) return;

      this.reloadList.emit();
    });
  }
}
