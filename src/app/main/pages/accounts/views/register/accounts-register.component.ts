import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Account } from '../../../../../core/entities/account/account';
import { AccountService } from '../../../../../core/entities/account/account.service';
import { AccountType } from '../../../../../core/enums/account-enums';
import {
  ButtonConfig,
  ButtonPreConfig,
} from '../../../../../core/interfaces/button-config';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { BackButtonDirective } from '../../../../../shared/directives/back-button.directive';
import { SpeedDialService } from '../../../../../shared/services/speed-dial.service';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { AccountsFormComponent } from '../../components/accounts-form/accounts-form.component';

@Component({
  selector: 'accounts-register-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    ButtonsComponent,
    TranslateModule,
    BackButtonDirective,
    MatCardModule,
    AccountsFormComponent,
  ],
  templateUrl: './accounts-register.component.html',
  styleUrl: './accounts-register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsFormPage implements OnInit, OnDestroy {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly currency = this._utils.getUserConfigs.currency;

  private readonly _unsubscribeAll = new Subject<void>();

  accountId: number | null =
    +this._activatedRoute.snapshot.paramMap.get('id')! || null;

  primaryAccount: Account | null = null;

  accountForm!: FormGroup;

  saving = signal(false);

  removeSelectedPrimaryAccountBtnConfig: ButtonConfig = {
    preConfig: ButtonPreConfig.CLOSE,
  };

  constructor(
    private readonly _utils: UtilsService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _accountService: AccountService,
    private readonly _speedDialService: SpeedDialService,
  ) {}

  ngOnInit() {
    this.accountForm = this._accountService.getFormGroup();

    this.getValues();

    this.subscribeValueChanges();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private async getValues() {
    if (this.accountId) {
      this.accountForm.controls['grouper'].disable();

      this._accountService.getById(this.accountId).then((response) => {
        this.accountForm.patchValue(response.account);
        this.primaryAccount = response.primaryAccount;

        if (this.primaryAccount?.grouper) {
          this.accountForm.get('addToCashFlow')!.disable();
          this.accountForm.get('addOverallBalance')!.disable();
        }
      });
    }
  }

  public save() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.accountForm.markAsPristine();

    this.getSaveRequest(this.accountForm.getRawValue())
      .then((account) => {
        this._utils.showMessage('my-accounts.saved-successfully');
        this._router.navigateByUrl('contas');
        this._speedDialService.onSaveAccount(account);
      })
      .catch((err) => {
        if (
          err.error.errorDescription.includes(
            'grouping accounts cannot have a balance'
          )
        ) {
          this._utils.showMessage(
            'my-accounts.grouper-accounts-with-balance-error',
            4000
          );
          this.accountForm.controls['grouper'].setValue(false);
          this.accountForm.markAsDirty();
        } else {
          this._utils.showMessage('my-accounts.error-saving-account');
        }
      })
      .finally(() => this.saving.set(false));
  }

  private getSaveRequest(data: Account) {
    if (data.id) return this._accountService.edit(data);
    else return this._accountService.createNew(data);
  }

  private subscribeValueChanges() {
    const formControls = this.accountForm.controls;

    formControls['type'].valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        if (value === AccountType.CASH) {
          formControls['code'].setValue(null, { emitEvent: false });
          formControls['accountNumber'].setValue('', { emitEvent: false });
          formControls['agency'].setValue(null, { emitEvent: false });
          formControls['investments'].setValue(false, { emitEvent: false });
          formControls['code'].disable({ emitEvent: false });
          formControls['accountNumber'].disable({ emitEvent: false });
          formControls['agency'].disable({ emitEvent: false });
          formControls['investments'].disable({ emitEvent: false });
          return;
        }

        formControls['code'].enable({ emitEvent: false });
        formControls['accountNumber'].enable({ emitEvent: false });
        formControls['agency'].enable({ emitEvent: false });
        formControls['investments'].enable({ emitEvent: false });
      });

    if (!this.accountId) {
      formControls['grouper'].valueChanges
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((value) => {
          if (value) {
            formControls['balance'].setValue(0, { emitEvent: false });
            formControls['balance'].disable({ emitEvent: false });
            return;
          }

          formControls['balance'].enable({ emitEvent: false });
        });
    }
  }
}
