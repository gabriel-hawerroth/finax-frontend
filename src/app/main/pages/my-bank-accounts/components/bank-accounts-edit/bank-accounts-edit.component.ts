import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Account } from 'src/app/interfaces/account';
import { AccountService } from 'src/app/services/account.service';
import { UtilsService } from 'src/app/utils/utils.service';
import { EditBalanceDialogComponent } from '../edit-balance-dialog/edit-balance-dialog.component';

@Component({
  selector: 'app-bank-accounts-edit',
  templateUrl: './bank-accounts-edit.component.html',
  styleUrls: ['./bank-accounts-edit.component.scss'],
})
export class BankAccountsEditComponent implements OnInit, OnDestroy {
  language = '';
  currency = '';

  accountId!: number | null;

  accountForm!: FormGroup;

  private _unsubscribeAll: Subject<any>;

  constructor(
    public utilsService: UtilsService,
    public location: Location,
    private _activatedRoute: ActivatedRoute,
    private _accountService: AccountService,
    private _fb: FormBuilder,
    private _router: Router,
    private _dialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.buildForm();

    this.accountId = +this._activatedRoute.snapshot.paramMap.get('id')! || null;

    this.utilsService.userConfigs
      .asObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.language = value.language;
        this.currency = value.currency;
      });

    this.utilsService.userConfigs
      .asObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {},
        error: () => {},
        complete() {},
      });

    if (this.accountId) {
      this._accountService.getById(this.accountId!).then((account: any) => {
        this.accountForm.patchValue(account);
      });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }

  buildForm() {
    this.accountForm = this._fb.group({
      id: null,
      userId: '',
      accountName: ['', Validators.required],
      balance: [0, Validators.required],
      investments: false,
      addOverallBalance: true,
      active: true,
      archived: false,
      presentationSequence: null,
    });

    this.accountForm.markAllAsTouched();
  }

  save() {
    if (this.accountForm.invalid) return;

    const data = this.accountForm.value;

    this._accountService
      .save(data)
      .then((result) => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Conta salva com sucesso'
            : 'Account Saved Successfully'
        );
        this._router.navigate(['contas-de-banco']);
      })
      .catch((error) => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao salvar a conta'
            : 'Error saving account'
        );
      });

    this.accountForm.markAsPristine();
  }

  changeBalance() {
    this._dialog
      .open(EditBalanceDialogComponent, {
        data: {
          account: this.accountForm.value,
        },
        panelClass: 'edit-balance-dialog',
      })
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result: any) => {
        if (!result) return;

        this.accountForm.get('balance')!.setValue(result);
      });
  }
}
