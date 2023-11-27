import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../../../services/account.service';
import { UtilsService } from '../../../../../utils/utils.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxCurrencyDirective } from 'ngx-currency';
import { CustomCurrencyPipe } from '../../../../../utils/customCurrencyPipe';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditBalanceDialogComponent } from '../edit-balance-dialog/edit-balance-dialog.component';

@Component({
  selector: 'app-bank-accounts-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgxCurrencyDirective,
    CustomCurrencyPipe,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './bank-accounts-edit.component.html',
  styleUrl: './bank-accounts-edit.component.scss',
})
export class BankAccountsEditComponent implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  public location = inject(Location);
  private _activatedRoute = inject(ActivatedRoute);
  private _accountService = inject(AccountService);
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _dialog = inject(MatDialog);

  private _unsubscribeAll: Subject<any> = new Subject();

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  accountId!: number | null;

  public accountForm!: FormGroup;

  ngOnInit(): void {
    this.buildForm();

    this.accountId = +this._activatedRoute.snapshot.paramMap.get('id')! || null;

    if (this.accountId) {
      this._accountService.getById(this.accountId!).then((account: any) => {
        this.accountForm.patchValue(account);
      });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
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
