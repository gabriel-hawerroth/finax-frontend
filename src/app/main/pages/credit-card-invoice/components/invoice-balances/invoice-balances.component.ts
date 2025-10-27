import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InvoiceBalanceComponent } from './invoice-balance/invoice-balance.component';

@Component({
  selector: 'app-invoice-balances',
  imports: [CommonModule, InvoiceBalanceComponent, TranslateModule],
  templateUrl: './invoice-balances.component.html',
  styleUrl: './invoice-balances.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceBalancesComponent {
  currency = input.required<string>();
  balances = input.required<InvoiceBalancesComponentData>();

  constructor() {}
}

export interface InvoiceBalancesComponentData {
  closing: Date;
  expiration: Date;
  balance: number;
  expectedBalance: number;
}
