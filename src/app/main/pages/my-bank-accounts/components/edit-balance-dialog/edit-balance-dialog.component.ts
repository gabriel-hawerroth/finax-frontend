import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  ],
  templateUrl: './edit-balance-dialog.component.html',
  styleUrl: './edit-balance-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

    this._accountService
      .adjustBalance(this.data.account.id, this.balanceForm.value.balance)
      .then((response) => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Saldo alterado com sucesso'
            : 'Balance changed successfully'
        );

        console.log(response);

        this.dialogRef.close(response.balance);
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
