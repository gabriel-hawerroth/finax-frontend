import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { isAfter } from 'date-fns';
import moment from 'moment';
import { NgxCurrencyDirective } from 'ngx-currency';
import { lastValueFrom } from 'rxjs';
import {
  ConfirmDuplicatedReleasesActionDialogData,
  ReleaseFormDialogData,
} from '../../../../../core/entities/cash-flow/cash-flow-dto';
import { CashFlowService } from '../../../../../core/entities/cash-flow/cash-flow.service';
import { Category } from '../../../../../core/entities/category/category';
import { CardBasicList } from '../../../../../core/entities/credit-card/credit-card-dto';
import { GenericIdDs } from '../../../../../core/entities/generic';
import { DuplicatedReleaseAction } from '../../../../../core/enums/duplicated-release-action';
import { ReleaseType } from '../../../../../core/enums/release-type';
import { ReleasedOn } from '../../../../../core/enums/released-on';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { ConfirmDuplicatedReleasesActionDialog } from '../../components/confirm-duplicated-releases-action/confirm-duplicated-releases-action.component';
import { ReleaseFormComponent } from '../../components/release-form/release-form.component';

@Component({
  selector: 'release-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReleaseFormComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    MatTooltipModule,
    MatSelectModule,
    NgxCurrencyDirective,
    ButtonsComponent,
    MatCheckboxModule,
    TranslateModule,
  ],
  templateUrl: './release-form-dialog.component.html',
  styleUrl: './release-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseFormDialog implements OnInit {
  releaseForm!: FormGroup;

  currentDate: Date = new Date();

  selectedFile: File | null = null;
  showRepeat: boolean = false;
  showObservation: boolean = false;

  changedAttachment: boolean = false;
  removedFile: boolean = false;

  smallScreen: boolean = window.innerHeight < 800 && window.innerWidth < 1400;

  saving = signal(false);

  fixedRepeat = new FormControl(false);
  installmenteRepeat = new FormControl(false);

  repeatForSuffix: string = this._translate.instant(
    'release-form.repeat-for-suffix.monthly'
  );

  selectedCreditCard = this.data.creditCardId !== undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReleaseFormDialogData,
    public readonly utils: UtilsService,
    private readonly _matDialogRef: MatDialogRef<ReleaseFormDialog>,
    private readonly _translate: TranslateService,
    private readonly _matDialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _cashFlowService: CashFlowService
  ) {}

  ngOnInit(): void {
    this.buildForm();

    if (this.data.editing && this.data.release) {
      this.releaseForm.patchValue(this.data.release);
      this.releaseForm
        .get('date')!
        .setValue(moment(this.releaseForm.value.date).toISOString());

      const cardId = this.data.release.cardId;
      if (cardId) this.releaseForm.get('accountId')!.setValue(cardId);

      if (this.data.release.attachmentName) {
        this.selectedFile = new File(
          [new Blob()],
          this.data.release.attachmentName
        );
      }

      if (this.data.release.observation) {
        this.showObservation = true;
      }
    } else if (this.data.releaseType !== ReleaseType.TRANSFER) {
      const otherCategorieId: number = this.data.categories.find(
        (item: Category) =>
          item.name ===
          (this.data.releaseType === ReleaseType.EXPENSE
            ? 'Outras despesas'
            : this.data.releaseType === ReleaseType.REVENUE
            ? 'Outras receitas'
            : '')
      )!.id!;

      this.releaseForm.get('categoryId')!.setValue(otherCategorieId);
    }
  }

  buildForm() {
    this.releaseForm = this._fb.group({
      id: null,
      userId: this.utils.getLoggedUser!.id,
      description: '',
      accountId: [null, Validators.required],
      targetAccountId: [null],
      amount: [0, Validators.required],
      type: [this.data.releaseType, Validators.required],
      done: [true, Validators.required],
      categoryId: [null, Validators.required],
      date: ['', Validators.required],
      time: '',
      observation: '',
      repeat: '',
      fixedBy: 'monthly',
      repeatFor: '12',
      installmentsBy: '2',
      cardId: null,
    });

    this.formValidations();
  }

  formValidations() {
    if (this.data.creditCardId) {
      this.releaseForm.get('accountId')!.setValue(this.data.creditCardId);
    }

    const selectedDt: Date = this.data.selectedDate;

    const selectedMonth: string = `${selectedDt.getMonth()}/${selectedDt.getFullYear()}`;
    const currentMonth: string = `${this.currentDate.getMonth()}/${this.currentDate.getFullYear()}`;

    if (selectedMonth === currentMonth) {
      this.releaseForm.get('date')!.setValue(this.currentDate);
    } else {
      this.releaseForm
        .get('date')!
        .setValue(new Date(this.data.selectedDate.setDate(1)));
    }

    if (this.data.releaseType === ReleaseType.TRANSFER) {
      this.releaseForm
        .get('targetAccountId')!
        .setValidators(Validators.required);

      this.releaseForm.get('categoryId')!.clearValidators();
    }

    this.releaseForm
      .get('done')!
      .setValue(!isAfter(new Date(), this.releaseForm.value.data));
  }

  async save() {
    if (this.releaseForm.value.amount === 0) {
      this.utils.showMessage('release-form.amount-greater-than-zero');
      return;
    } else if (
      this.releaseForm.value.type === 'T' &&
      this.releaseForm.value.accountId == this.releaseForm.value.targetAccountId
    ) {
      this.utils.showMessage('release-form.not-possible-transfer-same-bank');
      return;
    }

    var release = this.releaseForm.value;
    var duplicatedReleaseAction: DuplicatedReleaseAction =
      DuplicatedReleaseAction.UNNECESSARY;

    if (this.data.editing && this.data.release!.isDuplicatedRelease) {
      await lastValueFrom(
        this._matDialog
          .open(ConfirmDuplicatedReleasesActionDialog, {
            data: <ConfirmDuplicatedReleasesActionDialogData>{
              action: 'edit',
            },
            autoFocus: false,
            panelClass: 'confirm-duplicated-releases-action',
          })
          .afterClosed()
      ).then((response: DuplicatedReleaseAction) => {
        if (!response) return;

        duplicatedReleaseAction = response;
      });

      if (!duplicatedReleaseAction) return;

      if (
        !duplicatedReleaseAction.match(DuplicatedReleaseAction.JUST_THIS) &&
        this.releaseForm.get('date')!.dirty
      ) {
        this.utils.showMessage('release-form.date-must-remain-the-same', 5000);
        return;
      }
    }

    var requestError: boolean = false;
    this.saving.set(true);

    const selectedAccount = this.data.accounts.find(
      (item: CardBasicList) => item.id === release.accountId
    );
    const releasedOn: ReleasedOn = selectedAccount
      ? ReleasedOn.ACCOUNT
      : ReleasedOn.CREDIT_CARD;

    if (release.repeat === '') release.fixedBy = '';

    if (releasedOn == ReleasedOn.CREDIT_CARD) {
      release.credit_card_id = release.accountId;
      release.accountId = null;
    }

    if (!release.id) {
      await this._cashFlowService
        .addRelease(
          release,
          release.repeat === 'fixed'
            ? release.repeatFor
            : release.installmentsBy,
          releasedOn
        )
        .then((response) => {
          release = response;
        })
        .catch(() => {
          requestError = true;
        });
    } else {
      await this._cashFlowService
        .editRelease(release, duplicatedReleaseAction, releasedOn)
        .then((response) => {
          release = response;
        })
        .catch(() => {
          requestError = true;
        });
    }

    if (requestError) {
      this.saving.set(false);
      this.utils.showMessage('release-form.error-saving-release');
      return;
    }

    if (this.changedAttachment && this.selectedFile) {
      if (this.selectedFile.size > 1.5 * 1024 * 1024) {
        this.utils.showMessage('generic.this-may-take-few-seconds', 6000);
      }

      await this._cashFlowService
        .addAttachment(release.id, this.selectedFile!)
        .catch(() => {
          this.utils.showMessage('release-form.error-saving-attachment', 6000);
          requestError = true;
        });
    } else if (this.removedFile) {
      await this._cashFlowService.removeAttachment(release.id).catch(() => {
        this.utils.showMessage('release-form.error-excluding-attachment', 6000);
        requestError = true;
      });
    }

    if (requestError) {
      this.saving.set(false);
      return;
    }

    this.utils.showMessage('release-form.release-saved-successfully');
    this._matDialogRef.close(true);

    this.saving.set(false);
  }

  get getDialogTitle(): string {
    let title = '';
    if (this.data.editing) title += this._translate.instant('generic.editing');
    else title += this._translate.instant('generic.new');

    title += ' ';

    switch (this.data.releaseType) {
      case ReleaseType.EXPENSE:
        title += this._translate.instant('generic.expense');
        break;
      case ReleaseType.REVENUE:
        title += this._translate.instant('generic.revenue');
        break;
      case ReleaseType.TRANSFER:
        title += this._translate.instant('generic.transfer');
        break;
    }

    return title;
  }

  onFileSelected(event: any) {
    const file = event.target?.files[0];
    if (!file) return;

    const maxSize = 3 * 1024 * 1024; // first number(mb) converted to bytes
    if (file.size > maxSize) {
      this.utils.showMessage('generic.file-too-large', 8000);
      return;
    }

    this.selectedFile = file;
    this.changedAttachment = true;
  }

  removeFile() {
    this.selectedFile = null;
    this.releaseForm.markAsDirty();

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';

    if (this.data.release?.attachmentName) {
      this.removedFile = true;
    }
  }

  onChangeRepeat(action: 'fixed' | 'installments', event: MatCheckboxChange) {
    if (!event.checked) {
      this.releaseForm.get('repeat')!.setValue('');
      return;
    }

    this.releaseForm.get('repeat')!.setValue(action);

    switch (action) {
      case 'fixed':
        this.installmenteRepeat.setValue(false);
        this.releaseForm.get('repeatFor')!.setValidators(Validators.required);
        this.releaseForm.get('installmentsBy')!.clearValidators();
        break;
      case 'installments':
        this.fixedRepeat.setValue(false);
        this.releaseForm
          .get('installmentsBy')!
          .setValidators(Validators.required);
        this.releaseForm.get('repeatFor')!.clearValidators();
        break;
    }
  }

  get getFixedByList(): GenericIdDs[] {
    return [
      {
        id: 'daily',
        ds: this._translate.instant('release-form.fixed-by-list.daily'),
      },
      {
        id: 'weekly',
        ds: this._translate.instant('release-form.fixed-by-list.weekly'),
      },
      {
        id: 'monthly',
        ds: this._translate.instant('release-form.fixed-by-list.monthly'),
      },
      {
        id: 'bimonthly',
        ds: this._translate.instant('release-form.fixed-by-list.bimonthly'),
      },
      {
        id: 'quarterly',
        ds: this._translate.instant('release-form.fixed-by-list.quarterly'),
      },
      {
        id: 'biannual',
        ds: this._translate.instant('release-form.fixed-by-list.biannual'),
      },
      {
        id: 'annual',
        ds: this._translate.instant('release-form.fixed-by-list.annual'),
      },
    ];
  }

  onChangeFixedBy(value: string) {
    let setValue = '';

    switch (value) {
      case 'daily':
        setValue = '365';
        break;
      case 'weekly':
        setValue = '52';
        break;
      case 'monthly':
        setValue = '12';
        break;
      case 'bimonthly':
        setValue = '12';
        break;
      case 'quarterly':
        setValue = '8';
        break;
      case 'biannual':
        setValue = '6';
        break;
      case 'annual':
        setValue = '5';
        break;
    }

    this.releaseForm.get('repeatFor')!.setValue(setValue);
    this.repeatForSuffix = this._translate.instant(
      `release-form.repeat-for-suffix.${value}`
    );
  }
}
