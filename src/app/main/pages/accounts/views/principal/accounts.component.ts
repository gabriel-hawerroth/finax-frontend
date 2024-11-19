import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Account } from '../../../../../core/entities/account/account';
import { AccountService } from '../../../../../core/entities/account/account.service';
import { ButtonType } from '../../../../../core/enums/button-style';
import { ShowValues } from '../../../../../core/enums/show-values';
import {
  ButtonConfig,
  ButtonPreConfig,
} from '../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { LS_SHOW_VALUES } from '../../../../../shared/utils/local-storage-contants';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { AccountsListComponent } from '../../components/accounts-list/accounts-list.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatBottomSheetModule,
    MatCardModule,
    TranslateModule,
    DynamicButtonComponent,
    AccountsListComponent,
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBankAccountsPage implements OnInit {
  readonly darkThemeEnable = this._utils.darkThemeEnable;

  situationFilter = new FormControl(true);

  rows: Account[] = [];
  filteredRows = signal<Account[]>([]);

  newBtnConfig: ButtonConfig = {
    preConfig: ButtonPreConfig.NEW,
    onClick: () => this.onNew(),
  };

  valuesViewBtnConfig: ButtonConfig = {
    type: ButtonType.ICON,
    icon: this._utils.getItemLocalStorage(LS_SHOW_VALUES) || ShowValues.OFF,
    style: {
      transform: 'scale(1.1)',
    },
    onClick: () => this.onChangeShowValues(),
  };

  constructor(
    private readonly _utils: UtilsService,
    private readonly _router: Router,
    private readonly _accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts() {
    this._accountService.getByUser().then((result: Account[]) => {
      this.rows = result;
      this.filterList(this.situationFilter.value!);
    });
  }

  filterList(newValue: 'all' | boolean) {
    let rows = this.rows.slice();

    if (newValue != 'all') {
      rows = this._utils.filterList(rows, 'active', newValue);
    }

    this.joinSubAccounts(rows);
  }

  joinSubAccounts(accounts: Account[]) {
    let rows: Account[] = [];

    accounts.forEach((account) => {
      if (account.primaryAccountId) return;

      const subAccounts = accounts.filter(
        (item) => item.primaryAccountId === account.id
      );
      account.subAccounts = subAccounts;
      rows.push(account);
    });

    this.filteredRows.set(rows);
  }

  onNew() {
    this._router.navigateByUrl('contas/nova');
  }

  onChangeShowValues() {
    switch (this.valuesViewBtnConfig.icon) {
      case ShowValues.ON:
        this.valuesViewBtnConfig.icon = ShowValues.OFF;
        break;
      case ShowValues.OFF:
        this.valuesViewBtnConfig.icon = ShowValues.ON;
        break;
    }

    this._utils.setItemLocalStorage(
      LS_SHOW_VALUES,
      this.valuesViewBtnConfig.icon!
    );
  }

  get showValues() {
    return this.valuesViewBtnConfig.icon === ShowValues.ON;
  }
}
