import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
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
export class AccountsFormDialog implements OnInit {
  readonly darkThemeEnabled = this._utils.darkThemeEnable;

  readonly data: AccountFormDialogData = inject(MAT_DIALOG_DATA);

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
    private readonly _fb: FormBuilder,
    private readonly _accountService: AccountService,
    private readonly _matDialogRef: MatDialogRef<AccountsFormDialog>
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.accountForm = this._fb.group({
      id: null,
      name: ['', Validators.required],
      type: null,
      code: null,
      balance: [0, Validators.required],
      accountNumber: null,
      agency: null,
      investments: false,
      addOverallBalance: true,
      active: true,
      archived: false,
      image: null,
      primaryAccountId: this.data.primaryAccountId,
    });
  }

  save() {
    if (this.accountForm.invalid) return;

    // this.saving.set(true);
    this.accountForm.markAsPristine();

    this._accountService
      .createNew(this.accountForm.getRawValue())
      .then(() => {
        this._utils.showMessage('my-accounts.saved-successfully');
        this._matDialogRef.close(true);
      })
      .catch(() => this._utils.showMessage('my-accounts.error-saving-account'));
    // .finally(() => this.saving.set(false));
  }
}
