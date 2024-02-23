import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { AccountService } from '../../../../../services/account.service';
import { UtilsService } from '../../../../../utils/utils.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonsComponent } from '../../../../../utils/buttons/buttons.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-balance-dialog',
  standalone: true,
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
export class EditBalanceDialogComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<EditBalanceDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);
  public utilsService = inject(UtilsService);
  private _accountService = inject(AccountService);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  currency = this.utilsService.getUserConfigs.currency;

  balanceControl = new FormControl(this.data.account.balance || 0);
  loading: boolean = false;

  ngOnInit(): void {
    this.balanceControl.markAsTouched();
  }

  save() {
    this.loading = true;
    this._changeDetectorRef.detectChanges();

    this._accountService
      .adjustBalance(this.data.account.id, this.balanceControl.value)
      .then((response) => {
        this.utilsService.showMessage(
          'my-accounts.balance-changed-successfully'
        );

        this.dialogRef.close(response.balance);
      })
      .catch(() => {
        this.utilsService.showMessage('my-accounts.error-changing-balance');
      })
      .finally(() => {
        this.loading = false;
        this._changeDetectorRef.detectChanges();
      });

    this.balanceControl.markAsPristine();
  }
}
