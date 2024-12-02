import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Account } from '../../../../../core/entities/account/account';
import {
  AccountsListItemDTO,
  BankAccountDetailsData,
} from '../../../../../core/entities/account/account-dto';
import { AccountType } from '../../../../../core/enums/account-enums';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import {
  cloudFireCdnImgsLink,
  getDefaultAccountImage,
  HIDE_VALUE,
} from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { BankAccountDetailsComponent } from '../../views/details/account-details.component';
import { SubAccountsComponent } from '../sub-accounts/sub-accounts.component';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    CustomCurrencyPipe,
    SubAccountsComponent,
    TranslateModule,
  ],
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsListComponent implements OnDestroy {
  readonly getDefaultAccountImage = getDefaultAccountImage;
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly currency = this._utils.getUserConfigs.currency;
  readonly hideValue = HIDE_VALUE;

  private readonly _unsubscribeAll = new Subject<void>();

  readonly accounts = input.required<Account[]>();
  readonly showValues = input.required<boolean>();
  readonly situationFilterValue = input.required<boolean | 'all'>();
  readonly reloadList = output<Account>();

  filteredRows = signal<AccountsListItemDTO[]>([]);

  expandedSubAccounts: Map<number, boolean> = new Map();

  constructor(
    private readonly _utils: UtilsService,
    private readonly _bottomSheet: MatBottomSheet
  ) {
    toObservable(this.situationFilterValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => this.filterList(value));

    toObservable(this.accounts)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => this.filterList(this.situationFilterValue()));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();
  }

  filterList(situation: boolean | 'all') {
    let rows = this.accounts();

    if (situation != 'all') {
      rows = this._utils.filterList(rows, 'active', situation);
    }

    this.joinSubAccounts(rows);
  }

  private joinSubAccounts(accountsFiltered: Account[]) {
    let rows: AccountsListItemDTO[] = [];

    accountsFiltered.forEach((account) => {
      if (account.primaryAccountId) {
        return;
      }

      const subAccounts = accountsFiltered.filter(
        (ac) => ac.primaryAccountId === account.id
      );
      rows.push({ ...account, primaryAccount: null, subAccounts });
    });

    const soloSubAccounts = accountsFiltered.filter(
      (item) =>
        item.primaryAccountId &&
        rows.find((ac) => ac.id === item.primaryAccountId) === undefined
    );

    const subAccounts: AccountsListItemDTO[] = soloSubAccounts.map(
      (account) => {
        const primaryAccount = this.accounts().find(
          (ac) => ac.id === account.primaryAccountId
        )!;

        return { ...account, primaryAccount, subAccounts: [] };
      }
    );

    rows.push(...subAccounts);

    this.filteredRows.set(rows);
  }

  openDetails(account: AccountsListItemDTO) {
    this._bottomSheet.open(BankAccountDetailsComponent, {
      data: <BankAccountDetailsData>{
        account: account,
        primaryAccount: account.primaryAccount,
        subAccounts: account.subAccounts,
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

  isExpanded(account: Account): boolean {
    return this.expandedSubAccounts.get(account.id!) || false;
  }

  isLastItem(index: number) {
    return index === this.filteredRows().length - 1;
  }

  showSubAccounts(account: AccountsListItemDTO): boolean {
    return (
      (!this.hasCashType(account) &&
        account.primaryAccount === null &&
        account.active) ||
      account.subAccounts.length > 0
    );
  }

  hasCashType(account: Account): boolean {
    return account.type === AccountType.CASH;
  }
}
