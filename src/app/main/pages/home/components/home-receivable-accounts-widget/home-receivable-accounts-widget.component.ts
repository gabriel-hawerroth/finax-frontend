import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MonthlyRelease } from '../../../../../interfaces/cash-flow';
import { CustomCurrencyPipe } from '../../../../../utils/customCurrencyPipe';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-home-receivable-accounts-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    CustomCurrencyPipe,
    MatDividerModule,
  ],
  templateUrl: './home-receivable-accounts-widget.component.html',
  styleUrl: './home-receivable-accounts-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeReceivableAccountsWidget {
  releasesList = input.required<MonthlyRelease[]>();
  currency = input.required<string>();

  isntLastItem(id: number): boolean {
    const index = this.releasesList().findIndex((item) => item.id === id);

    return index !== this.releasesList().length - 1;
  }
}
