import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { HomeUpcomingReleases } from '../../../../../core/entities/home-p/home-dto';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';

@Component({
  selector: 'app-home-payable-accounts-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    CustomCurrencyPipe,
    MatDividerModule,
  ],
  templateUrl: './home-payable-accounts-widget.component.html',
  styleUrl: './home-payable-accounts-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePayableAccountsWidget {
  releasesList = input.required<HomeUpcomingReleases[]>();
  currency = input.required<string>();

  isntLastItem(index: number): boolean {
    return index !== this.releasesList().length - 1;
  }
}