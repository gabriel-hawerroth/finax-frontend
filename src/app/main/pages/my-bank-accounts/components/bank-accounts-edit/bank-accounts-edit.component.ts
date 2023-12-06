import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil, lastValueFrom } from 'rxjs';
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
import { SelectIconDialogComponent } from '../select-icon-dialog/select-icon-dialog.component';
import { Account } from '../../../../../interfaces/Account';
import { MatSelectModule } from '@angular/material/select';

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
    NgOptimizedImage,
    MatSelectModule,
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

  accountForm!: FormGroup;

  changedIcon: boolean = false;

  ngOnInit(): void {
    this.accountId = +this._activatedRoute.snapshot.paramMap.get('id')! || null;

    this.buildForm();

    if (this.accountId) {
      this._accountService.getById(this.accountId).then((response) => {
        this.accountForm.patchValue(response);
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
      userId: null,
      name: ['', Validators.required],
      type: '',
      code: '',
      balance: [0, Validators.required],
      accountNumber: '',
      agency: null,
      investments: false,
      addOverallBalance: true,
      active: true,
      archived: false,
      image: '',
    });

    this.accountForm.markAllAsTouched();

    this.accountForm
      .get('code')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        if (!value) return;

        value = value.toString();
        if (value.length > 3) {
          value = value.substring(0, 3);
          this.accountForm.get('code')!.setValue(value);
        }
      });

    this.accountForm
      .get('agency')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        if (!value) return;

        value = value.toString();
        if (value.length > 5) {
          value = value.substring(0, 5);
          this.accountForm.get('agency')!.setValue(value);
        }
      });
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

  selectIcon() {
    lastValueFrom(
      this._dialog.open(SelectIconDialogComponent).afterClosed()
    ).then((value) => {
      if (!value) return;

      this.accountForm.get('image')!.setValue(value);
      this.changedIcon = true;
    });
  }

  disableSave(): boolean {
    return (
      (this.accountForm.invalid || this.accountForm.pristine) &&
      !this.changedIcon
    );
  }
}
