import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectorRef,
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyDirective } from 'ngx-currency';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { Account } from '../../../../../core/entities/account/account';
import { BasicAccount } from '../../../../../core/entities/account/account-dto';
import { AccountService } from '../../../../../core/entities/account/account.service';
import { AccountType } from '../../../../../core/enums/account-enums';
import {
  ButtonConfig,
  ButtonPreConfig,
} from '../../../../../core/interfaces/button-config';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { SelectIconDialog } from '../../../../../shared/components/select-icon-dialog/select-icon-dialog.component';
import { BackButtonDirective } from '../../../../../shared/directives/back-button.directive';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-accounts-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    NgxCurrencyDirective,
    NgOptimizedImage,
    ButtonsComponent,
    TranslateModule,
    BackButtonDirective,
    MatTooltipModule,
  ],
  templateUrl: './accounts-form.component.html',
  styleUrl: './accounts-form.component.scss',
})
export class BankAccountsFormPage implements OnInit, OnDestroy {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly darkThemeEnabled = this._utils.darkThemeEnable;
  readonly currency = this._utils.getUserConfigs.currency;

  private readonly unsubscribeAll = new Subject<void>();

  accountId: number | null =
    +this._activatedRoute.snapshot.paramMap.get('id')! || null;

  accountForm!: FormGroup;

  saving = signal(false);

  accounts: BasicAccount[] = [];

  selectedPrimaryAccount: BasicAccount | null = null;

  removeSelectedPrimaryAccountBtnConfig: ButtonConfig = {
    preConfig: ButtonPreConfig.CLOSE,
  };

  constructor(
    private readonly _utils: UtilsService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _accountService: AccountService,
    private readonly _location: Location
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
      const [accounts, account] = await Promise.all([
        this._accountService.getBasicList(),
        this._accountService.getById(this.accountId),
      ]);

      this.accounts = accounts.filter((item) => item.id !== this.accountId);
      this.accountForm.patchValue(account);
      return;
    }

    this._accountService
      .getBasicList()
      .then((response) => (this.accounts = response))
      .catch(() => this._utils.showMessage('home.error-getting-accounts'));
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

  public selectIcon() {
    lastValueFrom(this._dialog.open(SelectIconDialog).afterClosed()).then(
      (value) => {
        if (!value) return;

        this.accountForm.get('image')!.setValue(value);
        this.accountForm.markAsDirty();
        this._changeDetectorRef.detectChanges();
      }
    );
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

    formControls['primaryAccountId'].valueChanges
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        if (value) {
          this.selectedPrimaryAccount = this.accounts.find(
            (item) => item.id === value
          )!;
          return;
        }

        this.selectedPrimaryAccount = null;
      });
  }

  public primaryAccountChanges(value: number) {
    this.selectedPrimaryAccount = this.accounts.find(
      (item) => item.id === value
    )!;
  }

  removeAccountType(event: MouseEvent) {
    event.stopPropagation();
    this.accountForm.get('type')!.setValue(null);
    this.accountForm.markAsDirty();
  }

  removeSelectedPrimaryAccount(event: MouseEvent) {
    event.stopPropagation();
    this.accountForm.get('primaryAccountId')!.setValue(null);
    this.accountForm.markAsDirty();
  }

  get showDescriptionErrorHint() {
    return (
      this.accountForm.controls['name'].touched &&
      this.accountForm.controls['name'].hasError('required')
    );
  }
}
