import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  WritableSignal,
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
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyDirective } from 'ngx-currency';
import { lastValueFrom } from 'rxjs';
import { AccountBasicList } from '../../../../../core/entities/account/account-dto';
import { AccountService } from '../../../../../core/entities/account/account.service';
import { CreditCardService } from '../../../../../core/entities/credit-card/credit-card.service';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { SelectIconDialog } from '../../../../../shared/components/select-icon-dialog/select-icon-dialog.component';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/constant-utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-credit-cards-form',
  standalone: true,
  imports: [
    CommonModule,
    ButtonsComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    NgxCurrencyDirective,
    MatSelectModule,
    NgOptimizedImage,
    MatCheckboxModule,
    TranslateModule,
  ],
  templateUrl: './credit-cards-form.component.html',
  styleUrl: './credit-cards-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardsFormPage implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  currency = this.utils.getUserConfigs.currency;

  cardId: number | null =
    +this._activatedRoute.snapshot.paramMap.get('id')! || null;

  cardForm!: FormGroup;

  saving: boolean = false;

  accounsList: AccountBasicList[] = [];
  selectedAccount: AccountBasicList | null = null;

  daysOfMonth: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];

  selectedIcon: WritableSignal<string | null> = signal(null);
  changedIcon: boolean = false;

  constructor(
    public readonly location: Location,
    public readonly utils: UtilsService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _creditCardService: CreditCardService,
    private readonly _accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.buildForm();

    if (this.cardId) {
      this._creditCardService.getById(this.cardId).then((response) => {
        this.cardForm.patchValue(response);
        this.paymentAccountChanges(response.standard_payment_account_id);

        if (response.image) {
          this.selectedIcon.set(response.image);
        }
      });
    }

    this._accountService.getBasicList().then((response) => {
      this.accounsList = response;

      if (this.cardId && !this.selectedAccount) {
        const standardPaymentAccount =
          this.cardForm.value.standard_payment_account_id;

        this.cardForm
          .get('standard_payment_account_id')!
          .setValue(standardPaymentAccount);
        this.paymentAccountChanges(standardPaymentAccount);
      }
    });
  }

  buildForm() {
    this.cardForm = this._fb.group({
      id: null,
      user_id: this.utils.getLoggedUser!.id,
      name: ['', Validators.required],
      card_limit: [0, Validators.required],
      close_day: [1, Validators.required],
      expires_day: [1, Validators.required],
      image: null,
      standard_payment_account_id: [null, Validators.required],
      active: true,
    });
  }

  save() {
    if (this.cardForm.value.card_limit === 0) {
      this.utils.showMessage('credit-cards.limit-must-be-greater-than-zero');
      return;
    }

    this.saving = true;

    this.cardForm.markAsPristine();
    const data = this.cardForm.value;

    this._creditCardService
      .save(data)
      .then(() => {
        this.utils.showMessage('credit-cards.saved-successfully');
        this._router.navigate(['cartoes-de-credito']);
      })
      .catch(() => {
        this.utils.showMessage('credit-cards.error-saving-card');
      })
      .finally(() => {
        this.saving = false;
      });
  }

  selectIcon() {
    lastValueFrom(this._dialog.open(SelectIconDialog).afterClosed()).then(
      (value) => {
        if (!value) return;

        this.selectedIcon.set(value);
        this.cardForm.get('image')!.setValue(value);
        this.cardForm.markAsDirty();
      }
    );
  }

  paymentAccountChanges(value: number) {
    this.selectedAccount = this.accounsList.find((item) => item.id === value)!;
  }
}
