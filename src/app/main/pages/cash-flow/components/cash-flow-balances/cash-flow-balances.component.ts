import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-cash-flow-balances',
  standalone: true,
  imports: [],
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
