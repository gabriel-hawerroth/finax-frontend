import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsService } from '../../../../../utils/utils.service';
import { ButtonsComponent } from '../../../../../utils/buttons/buttons.component';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AccountBasicList } from '../../../../../interfaces/account';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Invoice, InvoicePaymentSave } from '../../../../../interfaces/invoice';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InvoiceService } from '../../../../../services/invoice.service';

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
  ],
  templateUrl: './invoice-payment-dialog.component.html',
  styleUrl: './invoice-payment-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicePaymentDialogComponent implements OnInit {
  public readonly data = inject(MAT_DIALOG_DATA);
  public readonly utilsService = inject(UtilsService);
  private readonly _fb = inject(FormBuilder);
  private readonly _invoiceService = inject(InvoiceService);
  private readonly _dialogRef = inject(MatDialogRef);

  public currency = this.utilsService.getUserConfigs.currency;

  private invoice: Invoice = this.data.invoice;
  private invoiceAmount: number = this.data.invoiceAmount || 0;
  public accounts: AccountBasicList[] = this.data.accounts || [];
  private defaultPaymmentAccount: number =
    this.data.defaultPaymmentAccount || null;

  public form!: FormGroup;

  public selectedAccount: AccountBasicList | null = null;
  public selectedFile: File | null = null;

  public saving = signal(false);

  ngOnInit(): void {
    this.buildForm();

    this.form.get('paymentAccountId')!.setValue(this.defaultPaymmentAccount);
    this.paymentAccountChanges(this.defaultPaymmentAccount);
  }

  buildForm() {
    this.form = this._fb.group({
      id: null,
      invoiceId: this.invoice.id,
      paymentAccountId: null,
      paymentAmount: this.invoiceAmount,
      paymentDate: new Date(),
      paymentHour: '',
    });
  }

  save() {
    this.saving.set(true);

    const paymentDTO: InvoicePaymentSave = {
      payment: this.form.getRawValue(),
      attachment: this.selectedFile || undefined,
    };

    if (this.selectedFile && this.selectedFile.size > 1.5 * 1024 * 1024) {
      this.utilsService.showMessage('generic.this-may-take-few-seconds', 6000);
    }

    this._invoiceService
      .savePayment(this.form.getRawValue())
      .then(async (reponse) => {
        if (this.selectedFile) {
          await this._invoiceService.saveAttachment(
            reponse.id,
            this.selectedFile
          );
        }

        this.utilsService.showMessage('invoice.payment.saved-successfully');
        this._dialogRef.close(true);
      })
      .catch(() =>
        this.utilsService.showMessage('invoice.payment.error-saving')
      )
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
      this.utilsService.showMessage('generic.file-too-large', 8000);
      return;
    }

    this.selectedFile = file;
  }

  removeFile() {
    this.selectedFile = null;

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';
  }
}
