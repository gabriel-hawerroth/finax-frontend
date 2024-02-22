import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditBalanceDialogComponent } from '../edit-balance-dialog/edit-balance-dialog.component';
import { SelectIconDialogComponent } from '../../../../dialogs/select-icon-dialog/select-icon-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { ButtonsComponent } from '../../../../../utils/buttons/buttons.component';

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
    MatCheckboxModule,
    NgOptimizedImage,
    MatSelectModule,
    ButtonsComponent,
  ],
  templateUrl: './bank-accounts-form.component.html',
  styleUrl: './bank-accounts-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountsFormComponent implements OnInit, OnDestroy {
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

  accountId: number | null =
    +this._activatedRoute.snapshot.paramMap.get('id')! || null;

  accountForm!: FormGroup;

  saving: boolean = false;

  ngOnInit(): void {
    this.buildForm();

    if (this.accountId) {
      this._accountService
        .getById(this.accountId)
        .then((response) => this.accountForm.patchValue(response));
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
      code: null,
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
  }

  save() {
    this.saving = true;

    this.accountForm.markAsPristine();
    const data = this.accountForm.value;

    this._accountService
      .save(data)
      .then(() => {
        this.utilsService.showMessage(
          this.language === 'pt-br'
            ? 'Conta salva com sucesso'
            : 'Account saved successfully'
        );
        this._router.navigate(['contas-de-banco']);
      })
      .catch(() => {
        this.utilsService.showMessage(
          this.language === 'pt-br'
            ? 'Erro ao salvar a conta'
            : 'Error saving account'
        );
      })
      .finally(() => {
        this.saving = false;
      });
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
      this.accountForm.markAsDirty();
    });
  }
}
