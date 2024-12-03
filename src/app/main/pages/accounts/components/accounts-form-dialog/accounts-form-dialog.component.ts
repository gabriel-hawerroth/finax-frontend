import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Account } from '../../../../../core/entities/account/account';
import { AccountFormDialogData } from '../../../../../core/entities/account/account-dto';
import { AccountService } from '../../../../../core/entities/account/account.service';
import {
  ButtonConfig,
  ButtonPreConfig,
} from '../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { AccountsFormComponent } from '../accounts-form/accounts-form.component';

@Component({
  selector: 'app-accounts-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    AccountsFormComponent,
    DynamicButtonComponent,
    MatDialogModule,
  ],
  templateUrl: './accounts-form-dialog.component.html',
  styleUrl: './accounts-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsFormDialog implements OnInit, AfterViewInit {
  readonly darkThemeEnabled = this._utils.darkThemeEnable;

  @ViewChild(AccountsFormComponent)
  accountFormComponent!: AccountsFormComponent;

  readonly primaryAccount: Account;

  accountForm!: FormGroup;

  closeBtnConfig: ButtonConfig = {
    preConfig: ButtonPreConfig.CLOSE,
  };

  saveBtnConfig: ButtonConfig = {
    preConfig: ButtonPreConfig.SAVE,
    onClick: () => this.save(),
  };

  constructor(
    private readonly _utils: UtilsService,
    private readonly _accountService: AccountService,
    private readonly _matDialogRef: MatDialogRef<AccountsFormDialog>
  ) {
    const data: AccountFormDialogData = inject(MAT_DIALOG_DATA);
    this.primaryAccount = data.primaryAccount;
  }

  ngOnInit(): void {
    this.accountForm = this._accountService.getFormGroup(
      this.primaryAccount.id
    );

    if (this.primaryAccount.grouper) {
      const formControls = this.accountForm.controls;

      formControls['addToCashFlow'].setValue(this.primaryAccount.addToCashFlow);
      formControls['addToCashFlow'].disable();

      formControls['addOverallBalance'].setValue(
        this.primaryAccount.addOverallBalance
      );
      formControls['addOverallBalance'].disable();
    }
  }

  ngAfterViewInit(): void {
    if (this.primaryAccount.image)
      this.accountFormComponent.selectIcon(this.primaryAccount.image);
  }

  save() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.accountForm.markAsPristine();

    this._accountService
      .createNew(this.accountForm.getRawValue())
      .then((response) => {
        this._utils.showMessage('my-accounts.saved-successfully');
        this._matDialogRef.close(response);
      })
      .catch(() => this._utils.showMessage('my-accounts.error-saving-account'));
  }
}
