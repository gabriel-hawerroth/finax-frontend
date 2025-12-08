
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Account } from '../../../../../core/entities/account/account';
import { AccountFormDialogData } from '../../../../../core/entities/account/account-dto';
import { AccountService } from '../../../../../core/entities/account/account.service';
import {
  ButtonConfig,
  ButtonPreConfig,
} from '../../../../../core/interfaces/button-config';
import { DialogControls } from '../../../../../core/interfaces/dialogs-controls';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { AccountsFormComponent } from '../accounts-form/accounts-form.component';

@Component({
  selector: 'app-accounts-form-dialog',
  imports: [
    AccountsFormComponent,
    DynamicButtonComponent,
    MatDialogModule,
    TranslateModule
],
  templateUrl: './accounts-form-dialog.component.html',
  styleUrl: './accounts-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsFormDialog implements OnInit, AfterViewInit {
  @ViewChild(AccountsFormComponent)
  accountFormComponent!: AccountsFormComponent;

  readonly primaryAccount: Account;

  accountForm!: FormGroup;

  closeBtnConfig: ButtonConfig = {
    preConfig: ButtonPreConfig.CLOSE,
    onClick: () => this.control.close(),
  };

  saveBtnConfig: ButtonConfig = {
    preConfig: ButtonPreConfig.SAVE,
    onClick: () => this.save(),
  };

  readonly control: DialogControls<Account>;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _accountService: AccountService
  ) {
    const injector = inject(Injector);

    const data: AccountFormDialogData =
      injector.get(MAT_DIALOG_DATA, null) ||
      injector.get(MAT_BOTTOM_SHEET_DATA, null);

    this.primaryAccount = data.primaryAccount;

    const ref =
      injector.get<MatDialogRef<AccountsFormDialog> | null>(
        MatDialogRef,
        null
      ) ||
      injector.get<MatBottomSheetRef<AccountsFormDialog> | null>(
        MatBottomSheetRef,
        null
      );

    this.control = {
      close: (result) => {
        if (ref instanceof MatDialogRef) ref.close(result);
        else if (ref instanceof MatBottomSheetRef) ref.dismiss(result);
      },
    };
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
        this.control.close(response);
      })
      .catch(() => this._utils.showMessage('my-accounts.error-saving-account'));
  }
}
