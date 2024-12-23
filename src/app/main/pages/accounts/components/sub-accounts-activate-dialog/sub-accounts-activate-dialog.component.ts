import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Account } from '../../../../../core/entities/account/account';
import { SubAccountsActivateDialogData } from '../../../../../core/entities/account/account-dto';
import { ButtonType } from '../../../../../core/enums/button-style';
import {
  ButtonConfig,
  ButtonPreConfig,
} from '../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import {
  cloudFireCdnImgsLink,
  getDefaultAccountImage,
} from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-sub-accounts-activate-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    NgOptimizedImage,
    DynamicButtonComponent,
  ],
  templateUrl: './sub-accounts-activate-dialog.component.html',
  styleUrl: './sub-accounts-activate-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubAccountsActivateDialog {
  readonly getDefaultAccountImage = getDefaultAccountImage;
  readonly darkThemeEnabled = this._utils.darkThemeEnable;
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  subAccounts: SelectAccount[];

  selectAll = true;

  closeDialogBtnConfig: ButtonConfig = {
    preConfig: ButtonPreConfig.CLOSE,
  };

  cancelBtnConfig: ButtonConfig = {
    type: ButtonType.BASIC,
    label: 'confirm-dialog.cancel',
  };

  confirmBtnConfig: ButtonConfig = {
    type: ButtonType.FLAT,
    label: 'confirm-dialog.confirm',
    onClick: () => this.onConfirm(),
  };

  constructor(
    private _utils: UtilsService,
    private readonly _dialogRef: MatDialogRef<SubAccountsActivateDialog>
  ) {
    const data: SubAccountsActivateDialogData = inject(MAT_DIALOG_DATA);
    this.subAccounts = data.subAccounts.map((account) => ({
      ...account,
      selected: true,
    }));
  }

  onSelectAccount() {
    const selectedAll = this.subAccounts.every((account) => account.selected);
    this.selectAll = selectedAll;
  }

  selectAllAccounts(event: MatCheckboxChange) {
    this.selectAll = event.checked;

    this.subAccounts.forEach((account) => (account.selected = this.selectAll));
  }

  onConfirm() {
    const selectedAccounts = this.subAccounts
      .filter((account) => account.selected)
      .map((account) => account.id);

    this._dialogRef.close(selectedAccounts);
  }
}

interface SelectAccount extends Account {
  selected: boolean;
}
