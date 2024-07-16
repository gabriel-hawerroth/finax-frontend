import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { InvoicePaymentPerson } from '../../../../../core/entities/invoice/invoice-payment-dto';
import { InvoiceService } from '../../../../../core/entities/invoice/invoice.service';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/constant-utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';

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
  public editPayment = output<InvoicePaymentPerson | undefined>();
  public updateValues = output<void>();
  public payments = input.required<InvoicePaymentPerson[]>();
  public invoiceValue = input.required<number>();

  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  currency = this.utils.getUserConfigs.currency;

  totalValue = computed(() => {
    const response = this.payments().reduce(
      (count, item) => (count += item.paymentAmount),
      0
    );

    return response;
  });

  constructor(
    public readonly utils: UtilsService,
    private readonly _invoiceService: InvoiceService
  ) {}

  deletePayment(invoicePaymentId: number) {
    this.utils
      .showConfirmDialog('invoice.payments-card.confirm-delete')
      .then((response) => {
        if (response !== true) return;

        this._invoiceService
          .deletePayment(invoicePaymentId)
          .then(() => {
            this.utils.showMessage(
              'invoice.payments-card.deleted-successfully'
            );

            this.updateValues.emit();
          })
          .catch(() => {
            this.utils.showMessage('invoice.payments-card.error-deleting');
          });
      });
  }

  downloadAttachment(invoicePaymentId: number) {
    this._invoiceService
      .getPaymentAttachment(invoicePaymentId)
      .then((response) => {
        if (response.size === 0) {
          this.utils.showMessage('generic.attachment-not-found');
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
            ?.attachmentName || '';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);
      });
  }
}
