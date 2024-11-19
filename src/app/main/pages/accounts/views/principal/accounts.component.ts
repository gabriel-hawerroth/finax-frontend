import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Account } from '../../../../../core/entities/account/account';
import { BankAccountDetailsData } from '../../../../../core/entities/account/account-dto';
import { AccountService } from '../../../../../core/entities/account/account.service';
import { ButtonType } from '../../../../../core/enums/button-style';
import { ShowValues } from '../../../../../core/enums/show-values';
import {
  ButtonConfig,
  ButtonPreConfig,
} from '../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { LS_SHOW_VALUES } from '../../../../../shared/utils/local-storage-contants';
import {
  cloudFireCdnImgsLink,
  HIDE_VALUE,
} from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { BankAccountDetailsComponent } from '../details/account-details.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatBottomSheetModule,
    MatCardModule,
    TranslateModule,
    DynamicButtonComponent,
    CustomCurrencyPipe,
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBankAccountsPage implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly darkThemeEnable = this._utils.darkThemeEnable;
  readonly currency = this._utils.getUserConfigs.currency;
  readonly hideValue = HIDE_VALUE;

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
    private readonly _bottomSheet: MatBottomSheet,
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

    this.filteredRows.set(rows);
  }

  onNew() {
    this._router.navigateByUrl('contas/nova');
  }

  openDetails(account: Account) {
    this._bottomSheet.open(BankAccountDetailsComponent, {
      data: <BankAccountDetailsData>{
        account: account,
      },
      panelClass: 'account-details',
    });
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
