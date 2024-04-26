import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { InvoicePaymentPerson } from '../../../../../../../interfaces/invoice-payment';
import { InvoiceService } from '../../../../../../../services/invoice.service';
import { CustomCurrencyPipe } from '../../../../../../../shared/pipes/custom-currency.pipe';
import { UtilsService } from '../../../../../../../utils/utils.service';

@Component({
  selector: 'app-invoice-payments-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CustomCurrencyPipe,
    MatButtonModule,
    NgOptimizedImage,
    MatTooltipModule,
  ],
  templateUrl: './invoice-payments-card.component.html',
  styleUrl: './invoice-payments-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicePaymentsCardComponent {
  public payments = input.required<InvoicePaymentPerson[]>();
  public invoiceValue = input.required<number>();
  public updateValues = output<void>();
  public editPayment = output<InvoicePaymentPerson | undefined>();

  public readonly utilsService = inject(UtilsService);
  private readonly _invoiceService = inject(InvoiceService);

  currency = this.utilsService.getUserConfigs.currency;

  totalValue = computed(() => {
    const response = this.payments().reduce(
      (count, item) => (count += item.payment_amount),
      0
    );
    // console.log(this.invoiceValue());
    // console.log(response);
    // console.log(this.invoiceValue() - response);

    return response;
  });

  deletePayment(invoicePaymentId: number) {
    this.utilsService
      .showConfirmDialog('invoice.payments-card.confirm-delete')
      .then((response) => {
        if (response !== true) return;

        this._invoiceService
          .deletePayment(invoicePaymentId)
          .then(() => {
            this.utilsService.showMessage(
              'invoice.payments-card.deleted-successfully'
            );

            this.updateValues.emit();
          })
          .catch(() => {
            this.utilsService.showMessage(
              'invoice.payments-card.error-deleting'
            );
          });
      });
  }

  downloadAttachment(invoicePaymentId: number) {
    this._invoiceService
      .getPaymentAttachment(invoicePaymentId)
      .then((response) => {
        if (response.size === 0) {
          this.utilsService.showMessage('generic.attachment-not-found');
          return;
        }

        const blob = new Blob([response], {
          type: response.type,
        });

        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download =
          this.payments().find((item) => item.id === invoicePaymentId)
            ?.attachment_name || '';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);
      });
  }
}
