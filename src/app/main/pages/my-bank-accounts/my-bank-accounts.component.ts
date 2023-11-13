import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UtilsService } from 'src/app/utils/utils.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/interfaces/account';

@Component({
  selector: 'app-my-bank-accounts',
  templateUrl: './my-bank-accounts.component.html',
  styleUrls: ['./my-bank-accounts.component.scss'],
})
export class MyBankAccountsComponent implements OnInit, OnDestroy {
  language: string = '';

  accountsList: Account[] = [];

  changedOrder: boolean = false;

  private _unsubscribeAll: Subject<any>;

  constructor(
    public utilsService: UtilsService,
    private _router: Router,
    private _accountService: AccountService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.utilsService.userConfigs
      .asObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.language = value.language;
      });

    this._accountService.getByUser().then((result: any) => {
      this.accountsList = result;
    });
  }

  ngOnDestroy(): void {
    if (this.changedOrder) {
      this._accountService.saveSequence(this.accountsList).catch(() => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao salvar a sequência de apresentação'
            : ''
        );
      });
    }
    this._unsubscribeAll.complete();
  }

  drop(event: CdkDragDrop<Account[]>) {
    this.changedOrder = true;
    moveItemInArray(this.accountsList, event.previousIndex, event.currentIndex);
  }

  navigate(accountId: number) {
    this._router.navigate([`contas-de-banco/${accountId}`]);
  }
}
