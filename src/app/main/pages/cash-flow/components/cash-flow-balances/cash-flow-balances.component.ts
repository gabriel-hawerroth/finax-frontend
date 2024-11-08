import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';

@Component({
  selector: 'app-cash-flow-balances',
  standalone: true,
  imports: [CommonModule, CustomCurrencyPipe, TranslateModule],
  templateUrl: './cash-flow-balances.component.html',
  styleUrl: './cash-flow-balances.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowBalancesComponent {
  currency = input.required<string>();
  balances = input.required<CashFlowBalancesComponentData>();
}

export interface CashFlowBalancesComponentData {
  revenues: number;
  expenses: number;
  balance: number;
  expectedBalance: number;
}
