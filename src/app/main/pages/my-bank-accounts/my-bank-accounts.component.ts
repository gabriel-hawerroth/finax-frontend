import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { Account } from '../../../interfaces/account';
import { AccountService } from '../../../services/account.service';
import { UtilsService } from '../../../utils/utils.service';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-bank-accounts',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    NgOptimizedImage,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './my-bank-accounts.component.html',
  styleUrl: './my-bank-accounts.component.scss',
})
export class MyBankAccountsComponent implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  private _router = inject(Router);
  private _accountService = inject(AccountService);

  private _unsubscribeAll: Subject<any> = new Subject();

  language: string = this.utilsService.getUserConfigs.language;

  situationFilter = new FormControl();

  rows: Account[] = [];
  filteredRows: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);

  ngOnInit(): void {
    this._accountService.getByUser().then((result: any) => {
      this.rows = result;
      this.filteredRows.next(result);
      this.filterList();
    });

    this.situationFilter.setValue(true);

    this.situationFilter.valueChanges.subscribe(() => {
      this.filterList();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }

  filterList() {
    let rows = this.rows.slice();

    if (this.situationFilter.value !== 'all') {
      rows = this.utilsService.filterList(
        rows,
        'active',
        this.situationFilter.value
      );
    }

    this.filteredRows.next(rows);
  }

  navigate(accountId: number) {
    this._router.navigate([`contas-de-banco/${accountId}`]);
  }
}
