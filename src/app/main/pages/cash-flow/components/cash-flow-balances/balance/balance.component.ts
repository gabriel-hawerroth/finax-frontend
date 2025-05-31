import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { CustomCurrencyPipe } from '../../../../../../shared/pipes/custom-currency.pipe';

@Component({
  selector: 'app-balance',
  imports: [CommonModule, MatCardModule, CustomCurrencyPipe, TranslateModule],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceComponent {
  title = input.required<string>();
  value = input.required<number>();
  currency = input.required<string>();
  icon = input.required<string>();
  iconColor = input.required<string>();
}
