import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Account } from '../../../../../core/entities/account/account';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/constant-utils';

@Component({
  selector: 'app-home-accounts-list-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    CustomCurrencyPipe,
    NgOptimizedImage,
    MatDividerModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './home-accounts-list-widget.component.html',
  styleUrl: './home-accounts-list-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeAccountsListWidget {
  accountsList = input.required<Account[]>();
  generalBalance = input.required<number>();
  currency = input.required<string>();

  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  isntLastItemAccounts(id: number): boolean {
    const index = this.accountsList().findIndex((item) => item.id === id);

    return index !== this.accountsList().length - 1;
  }
}
