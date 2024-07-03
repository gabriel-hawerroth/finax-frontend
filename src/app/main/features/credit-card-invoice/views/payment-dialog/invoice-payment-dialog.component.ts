import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyDirective } from 'ngx-currency';
import { AccountBasicList } from '../../../../../core/entities/account/account-dto';
import { InvoicePaymentDialogData } from '../../../../../core/entities/invoice/invoice-payment-dto';
import { InvoiceService } from '../../../../../core/entities/invoice/invoice.service';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/constant-utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-invoice-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    ButtonsComponent,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatSelectModule,
    NgxCurrencyDirective,
    MatDatepickerModule,
    MatNativeDateModule,
    NgOptimizedImage,
    MatButtonModule,
    MatProgressSpinnerModule,
    ButtonsComponent,
  ],
  templateUrl: './invoice-payment-dialog.component.html',
  styleUrl: './invoice-payment-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicePaymentDialog implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  readonly currency = this.utils.getUserConfigs.currency;

  accounts: AccountBasicList[] = this.data.accounts || [];
  defaultPaymmentAccount: number | null =
    this.data.defaultPaymmentAccount || null;

  form!: FormGroup;

  selectedAccount: AccountBasicList | null = null;
  selectedFile: File | null = null;

  saving = signal(false);

  changedAttachment = false;
  removedFile = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: InvoicePaymentDialogData,
    public readonly utils: UtilsService,
    private readonly _fb: FormBuilder,
    private readonly _dialogRef: MatDialogRef<InvoicePaymentDialog>,
    private readonly _invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.buildForm();

    if (this.data.payment) {
      this.form.patchValue(this.data.payment);
      this.paymentAccountChanges(this.form.value.payment_account_id);

      if (this.data.payment.attachment_name) {
        this.selectedFile = new File(
          [new Blob()],
          this.data.payment.attachment_name
        );
      }
    } else {
      this.form
        .get('payment_account_id')!
        .setValue(this.defaultPaymmentAccount);
      this.paymentAccountChanges(this.defaultPaymmentAccount!);

      this.form.get('payment_date')!.setValue(this.data.expireDate);
    }
  }

  buildForm() {
    this.form = this._fb.group({
      id: null,
      credit_card_id: this.data.creditCardId,
      invoice_month_year: this.data.monthYear,
      payment_account_id: null,
      payment_amount: this.data.defaultPaymentAmount,
      payment_date: new Date(),
      payment_hour: '',
    });
  }

  save() {
    // if (this.form.value.payment_amount > this.data.defaultPaymentAmount) {
    //   this.utilsService.showMessage('invoice.payment.invalid-amount', 5000);
    //   return;
    // }

    this.saving.set(true);

    if (this.selectedFile && this.selectedFile.size > 1.5 * 1024 * 1024) {
      this.utils.showMessage('generic.this-may-take-few-seconds', 6000);
    }

    this._invoiceService
      .savePayment(this.form.getRawValue())
      .then(async (response) => {
        let error = false;
        if (this.changedAttachment && this.selectedFile) {
          await this._invoiceService
            .saveAttachment(response.id!, this.selectedFile)
            .catch(() => (error = true));
        } else if (this.removedFile) {
          await this._invoiceService
            .removeAttachment(response.id!)
            .catch(() => (error = true));
        }

        if (!error) {
          this.utils.showMessage('invoice.payment.saved-successfully');
        } else if (this.removedFile) {
          this.utils.showMessage(
            'invoice.payment.error-deleting-attachment',
            6000
          );
        } else {
          this.utils.showMessage(
            'invoice.payment.error-saving-attachment',
            6000
          );
        }

        this._dialogRef.close(true);
      })
      .catch(() => this.utils.showMessage('invoice.payment.error-saving'))
      .finally(() => this.saving.set(false));
  }

  paymentAccountChanges(value: number) {
    this.selectedAccount = this.accounts.find((item) => item.id === value)!;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 3 * 1024 * 1024; // first number(mb) converted to bytes
    if (file.size > maxSize) {
      this.utils.showMessage('generic.file-too-large', 8000);
      return;
    }

    this.selectedFile = file;
    this.changedAttachment = true;
  }

  removeFile() {
    this.selectedFile = null;
    this.form.markAsDirty();

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';

    if (this.data.payment?.attachment_name) {
      this.removedFile = true;
    }
  }
}
