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
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Account } from '../../../../../core/entities/account/account';
import { BankAccountDetailsData } from '../../../../../core/entities/account/account-dto';
import { AccountService } from '../../../../../core/entities/account/account.service';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/constant-utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { BankAccountDetailsComponent } from '../details/bank-account-details.component';

@Component({
  selector: 'app-bank-accounts',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatBottomSheetModule,
    MatCardModule,
    ButtonsComponent,
    TranslateModule,
  ],
  templateUrl: './bank-accounts.component.html',
  styleUrl: './bank-accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBankAccountsPage implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  situationFilter = new FormControl(true);

  rows: Account[] = [];
  filteredRows = signal<Account[]>([]);

  constructor(
    public utils: UtilsService,
    private _bottomSheet: MatBottomSheet,
    private _router: Router,
    private _accountService: AccountService
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
      rows = this.utils.filterList(rows, 'active', newValue);
    }

    this.filteredRows.set(rows);
  }

  onNew() {
    this._router.navigate(['contas-de-banco/novo']);
  }

  openDetails(account: Account) {
    this._bottomSheet.open(BankAccountDetailsComponent, {
      data: <BankAccountDetailsData>{
        account: account,
      },
      panelClass: 'bank-account-details',
    });
  }
}
