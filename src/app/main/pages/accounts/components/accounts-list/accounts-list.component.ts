import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Account } from '../../../../../core/entities/account/account';
import { BankAccountDetailsData } from '../../../../../core/entities/account/account-dto';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import {
  cloudFireCdnImgsLink,
  HIDE_VALUE,
} from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { BankAccountDetailsComponent } from '../../views/details/account-details.component';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, CustomCurrencyPipe],
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsListComponent {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly currency = this._utils.getUserConfigs.currency;
  readonly hideValue = HIDE_VALUE;

  readonly accounts = input.required<Account[]>();
  readonly showValues = input.required<boolean>();

  expandedSubAccounts: Map<number, boolean> = new Map();

  constructor(
    private readonly _utils: UtilsService,
    private readonly _bottomSheet: MatBottomSheet
  ) {}

  openDetails(account: Account) {
    this._bottomSheet.open(BankAccountDetailsComponent, {
      data: <BankAccountDetailsData>{
        account: account,
      },
      panelClass: 'account-details',
    });
  }

  expandSubAccounts(accountId: number, event: MouseEvent) {
    event.stopPropagation();

    if (this.expandedSubAccounts.has(accountId)) {
      this.expandedSubAccounts.set(
        accountId,
        !this.expandedSubAccounts.get(accountId)
      );
      return;
    }

    this.expandedSubAccounts.set(accountId, true);
  }
}
