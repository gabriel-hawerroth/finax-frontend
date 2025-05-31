import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ResponsiveService } from '../../../../../shared/utils/responsive.service';
import { BalanceComponent } from './balance/balance.component';

@Component({
  selector: 'app-cash-flow-balances',
  imports: [CommonModule, BalanceComponent, TranslateModule],
  templateUrl: './cash-flow-balances.component.html',
  styleUrl: './cash-flow-balances.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowBalancesComponent {
  currency = input.required<string>();
  balances = input.required<CashFlowBalancesComponentData>();

  smallWidth = this._responsiveService.smallWidth;
  isMobileView = this._responsiveService.isMobileView;

  constructor(private readonly _responsiveService: ResponsiveService) {}
}

export interface CashFlowBalancesComponentData {
  revenues: number;
  expenses: number;
  balance: number;
  expectedBalance: number;
}
