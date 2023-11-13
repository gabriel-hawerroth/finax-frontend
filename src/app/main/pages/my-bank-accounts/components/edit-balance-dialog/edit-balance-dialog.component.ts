import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountService } from 'src/app/services/account.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-edit-balance-dialog',
  templateUrl: './edit-balance-dialog.component.html',
  styleUrls: ['./edit-balance-dialog.component.scss'],
})
export class EditBalanceDialogComponent implements OnInit {
  language = '';
  currency = '';

  balanceForm!: FormGroup;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditBalanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public utilsService: UtilsService,
    private _fb: FormBuilder,
    private _accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.language = this.utilsService.getSavedUserConfigs.language;
    this.currency = this.utilsService.getSavedUserConfigs.currency;

    this.balanceForm = this._fb.group({
      balance: ['', Validators.required],
    });
    this.balanceForm.markAsTouched();

    this.balanceForm.patchValue(this.data.account);
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
