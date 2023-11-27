import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from '../../../../../services/account.service';
import { UtilsService } from '../../../../../utils/utils.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule,
  ],
  templateUrl: './edit-balance-dialog.component.html',
  styleUrl: './edit-balance-dialog.component.scss',
})
export class EditBalanceDialogComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<EditBalanceDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);
  public utilsService = inject(UtilsService);
  private _fb = inject(FormBuilder);
  private _accountService = inject(AccountService);

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  balanceForm!: FormGroup;
  loading: boolean = false;

  ngOnInit(): void {
    this.balanceForm = this._fb.group({
      balance: ['', Validators.required],
    });

    this.balanceForm.patchValue(this.data.account);
    this.balanceForm.markAsTouched();
  }

  save() {
    this.loading = true;

    const data = this.data.account;

    data.balance = this.balanceForm.value.balance;

    this._accountService
      .save(data)
      .then(() => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Saldo alterado com sucesso'
            : 'Balance changed successfully'
        );
        this.dialogRef.close(data.balance);
      })
      .catch(() => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao alterar o saldo'
            : 'Error changing balance'
        );
      })
      .finally(() => {
        this.loading = false;
      });

    this.balanceForm.markAsPristine();
  }
}
