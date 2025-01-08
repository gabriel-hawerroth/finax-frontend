import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvoicePaymentPerson } from '../../../../../core/entities/invoice/invoice-payment-dto';
import { InvoicePaymentsCardComponent } from '../payments-card/invoice-payments-card.component';

@Component({
  selector: 'app-payments-card-dialog',
  standalone: true,
  imports: [CommonModule, InvoicePaymentsCardComponent],
  templateUrl: './payments-card-dialog.component.html',
  styleUrl: './payments-card-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicePaymentsCardDialog implements OnInit {
  readonly data: InvoicePaymentsCardDialogData = inject(MAT_DIALOG_DATA);

  payments!: InvoicePaymentPerson[];
  invoiceValue!: number;
  fullyPaid!: boolean;
  editPayment!: (invoicePayment?: InvoicePaymentPerson) => void;
  updateValues!: () => void;

  loadData: boolean = false;

  constructor(
    private readonly _dialogRef: MatDialogRef<InvoicePaymentsCardDialog>
  ) {}

  ngOnInit(): void {
    this.payments = this.data.payments;
    this.invoiceValue = this.data.invoiceValue;
    this.fullyPaid = this.data.fullyPaid;
    this.editPayment = this.data.editPayment;
    this.updateValues = this.data.updateValues;

    this.loadData = true;
  }

  onEdit(event: any) {
    this._dialogRef.close(event);
  }
}

export interface InvoicePaymentsCardDialogData {
  payments: InvoicePaymentPerson[];
  invoiceValue: number;
  fullyPaid: boolean;
  editPayment: (invoicePayment?: InvoicePaymentPerson) => void;
  updateValues: () => void;
}
