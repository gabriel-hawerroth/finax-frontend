import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { ResponsiveService } from '../../../../../shared/utils/responsive.service';

@Component({
  selector: 'app-cash-flow-balances',
  imports: [CommonModule, CustomCurrencyPipe, TranslateModule],
  templateUrl: './cash-flow-balances.component.html',
  styleUrl: './cash-flow-balances.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowBalancesComponent {
  readonly smallWidth = inject(ResponsiveService).smallWidth;

  currency = input.required<string>();
  balances = input.required<CashFlowBalancesComponentData>();
}

export interface CashFlowBalancesComponentData {
  revenues: number;
  expenses: number;
  balance: number;
  expectedBalance: number;
}
