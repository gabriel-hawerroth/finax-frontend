import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { InvoicePaymentPerson } from '../../../../../core/entities/invoice/invoice-payment-dto';
import { InvoiceService } from '../../../../../core/entities/invoice/invoice.service';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { ResponsiveService } from '../../../../../shared/utils/responsive.service';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
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
export class InvoicePaymentsCardComponent implements OnInit {
  editPayment = output<InvoicePaymentPerson | undefined>();
  updateValues = output<void>();
  payments = input.required<InvoicePaymentPerson[]>();
  invoiceValue = input.required<number>();
  fullyPaid = input.required<boolean>();

  readonly darkThemeEnabled = this._utils.darkThemeEnable;
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly currency = this._utils.getUserConfigs.currency;

  totalValue = computed(() =>
    this.payments().reduce((count, item) => (count += item.paymentAmount), 0)
  );

  showPayRemainingButton!: boolean;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _invoiceService: InvoiceService,
    private readonly _responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {
    this.showPayRemainingButton =
      !this.fullyPaid() && !this._responsiveService.smallWidth();
  }

  deletePayment(invoicePaymentId: number) {
    this._utils
      .showConfirmDialog('invoice.payments-card.confirm-delete')
      .then((response) => {
        if (response !== true) return;

        this._invoiceService
          .deletePayment(invoicePaymentId)
          .then(() => {
            this._utils.showMessage(
              'invoice.payments-card.deleted-successfully'
            );

            this.updateValues.emit();
          })
          .catch(() => {
            this._utils.showMessage('invoice.payments-card.error-deleting');
          });
      });
  }

  downloadAttachment(invoicePaymentId: number) {
    this._invoiceService
      .getPaymentAttachment(invoicePaymentId)
      .then((response) => {
        if (response.size === 0) {
          this._utils.showMessage('generic.attachment-not-found');
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
