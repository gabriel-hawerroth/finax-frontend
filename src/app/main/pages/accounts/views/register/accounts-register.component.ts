import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { AccountsFormComponent } from '../../components/accounts-form/accounts-form.component';

@Component({
  selector: 'accounts-register-page',
  standalone: true,
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
  readonly darkThemeEnabled = this._utils.darkThemeEnable;
  readonly currency = this._utils.getUserConfigs.currency;

  private readonly unsubscribeAll = new Subject<void>();

  accountId: number | null =
    +this._activatedRoute.snapshot.paramMap.get('id')! || null;

  accountForm!: FormGroup;

  saving = signal(false);

  removeSelectedPrimaryAccountBtnConfig: ButtonConfig = {
    preConfig: ButtonPreConfig.CLOSE,
  };

  constructor(
    private readonly _utils: UtilsService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _accountService: AccountService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.getValues();

    this.subscribeValueChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  private buildForm() {
    this.accountForm = this._fb.group({
      id: null,
      userId: null,
      name: ['', Validators.required],
      type: null,
      code: null,
      balance: [0, Validators.required],
      accountNumber: null,
      agency: null,
      investments: false,
      addOverallBalance: true,
      active: true,
      archived: false,
      image: null,
      primaryAccountId: null,
    });
  }

  private async getValues() {
    if (this.accountId) {
      this._accountService.getById(this.accountId).then((account) => {
        this.accountForm.patchValue(account);
      });
    }
  }

  public save() {
    this.saving.set(true);
    this.accountForm.markAsPristine();

    this.getSaveRequest(this.accountForm.getRawValue())
      .then(() => {
        this._utils.showMessage('my-accounts.saved-successfully');
        this._router.navigateByUrl('contas');
      })
      .catch(() => this._utils.showMessage('my-accounts.error-saving-account'))
      .finally(() => this.saving.set(false));
  }

  private getSaveRequest(data: Account) {
    if (data.id) return this._accountService.edit(data);
    else return this._accountService.createNew(data);
  }

  private subscribeValueChanges() {
    const formControls = this.accountForm.controls;

    formControls['type'].valueChanges
      .pipe(takeUntil(this.unsubscribeAll))
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
        } else {
          formControls['code'].enable({ emitEvent: false });
          formControls['accountNumber'].enable({ emitEvent: false });
          formControls['agency'].enable({ emitEvent: false });
          formControls['investments'].enable({ emitEvent: false });
        }
      });
  }
}
