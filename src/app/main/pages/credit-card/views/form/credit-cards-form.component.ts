import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
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
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { BasicAccount } from '../../../../../core/entities/account/account-dto';
import { AccountService } from '../../../../../core/entities/account/account.service';
import { CreditCard } from '../../../../../core/entities/credit-card/credit-card';
import { CreditCardService } from '../../../../../core/entities/credit-card/credit-card.service';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { SelectIconDialog } from '../../../../../shared/components/select-icon-dialog/select-icon-dialog.component';
import { BackButtonDirective } from '../../../../../shared/directives/back-button.directive';
import { ResponsiveService } from '../../../../../shared/utils/responsive.service';
import {
  cloudFireCdnImgsLink,
  getDefaultAccountImage,
  getResponsiveFieldWidth,
  Widths,
} from '../../../../../shared/utils/utils';
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
    BackButtonDirective,
  ],
  templateUrl: './credit-cards-form.component.html',
  styleUrl: './credit-cards-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardsFormPage implements OnInit, OnDestroy {
  readonly getDefaultAccountImage = getDefaultAccountImage;
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly currency = this.utils.getUserConfigs.currency;

  private readonly unsubscribeAll = new Subject<void>();

  cardId: number | null =
    +this._activatedRoute.snapshot.paramMap.get('id')! || null;

  cardForm!: FormGroup;

  saving = signal(false);

  accounsList: BasicAccount[] = [];
  selectedAccount: BasicAccount | null = null;

  daysOfMonth: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];

  selectedIcon: WritableSignal<string | null> = signal(null);
  changedIcon: boolean = false;

  constructor(
    public readonly utils: UtilsService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _creditCardService: CreditCardService,
    private readonly _accountService: AccountService,
    private readonly _location: Location,
    private readonly _responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getValues();
    this.subscribeValueChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  private buildForm() {
    this.cardForm = this._fb.group({
      id: null,
      userId: this.utils.getLoggedUser!.id,
      name: ['', Validators.required],
      cardLimit: [0, Validators.required],
      closeDay: [1, Validators.required],
      expiresDay: [1, Validators.required],
      image: null,
      standardPaymentAccountId: [null, Validators.required],
      active: true,
    });
  }

  private getValues() {
    if (this.cardId) {
      Promise.all([
        this._accountService.getBasicList(),
        this._creditCardService.getById(this.cardId),
      ])
        .then(([accounts, card]) => {
          this.accounsList = accounts;

          this.cardForm.patchValue(card);
          if (card.image) this.selectedIcon.set(card.image);
        })
        .catch(() => {
          this.utils.showMessage('credit-cards.error-getting-card');
          this._location.back();
        });

      return;
    }

    this._accountService
      .getBasicList()
      .then((response) => (this.accounsList = response))
      .catch(() =>
        this.utils.showMessage('credit-cards.error-getting-accounts')
      );
  }

  public save() {
    if (this.cardForm.value.cardLimit === 0) {
      this.utils.showMessage('credit-cards.limit-must-be-greater-than-zero');
      return;
    }

    this.saving.set(true);
    this.cardForm.markAsPristine();

    this.getSaveRequest(this.cardForm.getRawValue())
      .then(() => {
        this.utils.showMessage('credit-cards.saved-successfully');
        this._router.navigateByUrl('cartoes-de-credito');
      })
      .catch(() => this.utils.showMessage('credit-cards.error-saving-card'))
      .finally(() => this.saving.set(false));
  }

  private getSaveRequest(card: CreditCard) {
    if (card.id) return this._creditCardService.edit(card);
    else return this._creditCardService.createNew(card);
  }

  public selectIcon() {
    lastValueFrom(this._dialog.open(SelectIconDialog).afterClosed()).then(
      (value) => {
        if (!value) return;

        this.selectedIcon.set(value);
        this.cardForm.get('image')!.setValue(value);
        this.cardForm.markAsDirty();
      }
    );
  }

  private subscribeValueChanges() {
    this.cardForm
      .get('standardPaymentAccountId')!
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => this.paymentAccountChanges(value));
  }

  private paymentAccountChanges(value: number) {
    this.selectedAccount = this.accounsList.find((item) => item.id === value)!;
  }

  getResponsiveFieldWidth(
    widths: Widths,
    defaultWidth?: string,
    minWidth?: string
  ) {
    return getResponsiveFieldWidth(
      this._responsiveService,
      widths,
      defaultWidth,
      minWidth
    );
  }
}
