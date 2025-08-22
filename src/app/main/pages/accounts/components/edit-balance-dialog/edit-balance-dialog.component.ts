import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyDirective } from 'ngx-currency-v2';
import { EditBalanceDialogData } from '../../../../../core/entities/account/account-dto';
import { AccountService } from '../../../../../core/entities/account/account.service';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-edit-balance-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxCurrencyDirective,
    MatProgressSpinnerModule,
    MatDialogModule,
    ButtonsComponent,
    TranslateModule,
  ],
  templateUrl: './edit-balance-dialog.component.html',
  styleUrl: './edit-balance-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditBalanceDialog implements OnInit {
  readonly data: EditBalanceDialogData = inject(MAT_DIALOG_DATA);

  readonly currency = this._utils.getUserConfigs.currency;

  balanceControl = new FormControl(this.data.account.balance || 0);

  loading = signal(false);

  constructor(
    private readonly dialogRef: MatDialogRef<EditBalanceDialog>,
    private readonly _utils: UtilsService,
    private readonly _accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.balanceControl.markAsTouched();
  }

  public save() {
    this.loading.set(true);
    this.balanceControl.markAsPristine();

    this._accountService
      .adjustBalance(this.data.account.id!, this.balanceControl.value!)
      .then((response) => {
        this.dialogRef.close(response.balance);
        this._utils.showMessage('my-accounts.balance-changed-successfully');
      })
      .catch(() =>
        this._utils.showMessage('my-accounts.error-changing-balance')
      )
      .finally(() => this.loading.set(false));
  }
}
