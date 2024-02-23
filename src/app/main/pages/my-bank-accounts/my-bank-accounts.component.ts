import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Account } from '../../../interfaces/Account';
import { AccountService } from '../../../services/account.service';
import { UtilsService } from '../../../utils/utils.service';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { BankAccountDetailsComponent } from './components/bank-account-details/bank-account-details.component';
import { MatCardModule } from '@angular/material/card';
import { ButtonsComponent } from '../../../utils/buttons/buttons.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-bank-accounts',
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
  templateUrl: './my-bank-accounts.component.html',
  styleUrl: './my-bank-accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBankAccountsComponent implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  private _accountService = inject(AccountService);
  private _bottomSheet = inject(MatBottomSheet);
  private _router = inject(Router);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  private _unsubscribeAll: Subject<any> = new Subject();

  situationFilter = new FormControl();

  rows: Account[] = [];
  filteredRows: Account[] = [];

  ngOnInit(): void {
    this.getAccounts();

    this.situationFilter.setValue(true);

    this.situationFilter.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.filterList();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }

  getAccounts() {
    this._accountService.getByUser().then((result: any) => {
      this.rows = result;
      this.filterList();
      this._changeDetectorRef.detectChanges();
    });
  }

  filterList() {
    let rows = this.rows.slice();

    if (this.situationFilter.value != 'all') {
      rows = this.utilsService.filterList(
        rows,
        'active',
        this.situationFilter.value
      );
    }

    this.filteredRows = rows;
  }

  onNew() {
    this._router.navigate(['contas-de-banco/novo']);
  }

  openDetails(account: Account) {
    this._bottomSheet.open(BankAccountDetailsComponent, {
      data: {
        account: account,
      },
      panelClass: 'bank-account-details',
    });
  }
}
