import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { CustomCurrencyPipe } from '../../../../../../shared/pipes/custom-currency.pipe';

@Component({
  selector: 'app-invoice-balance',
  imports: [CommonModule, MatCardModule, CustomCurrencyPipe, TranslateModule],
  templateUrl: './invoice-balance.component.html',
  styleUrl: './invoice-balance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceBalanceComponent {
  title = input.required<string>();
  value = input.required<number | Date>();
  currency = input.required<string>();
  icon = input.required<string>();
  iconColor = input.required<string>();

  valueIsNumber = computed(() => typeof this.value() === 'number');
}
