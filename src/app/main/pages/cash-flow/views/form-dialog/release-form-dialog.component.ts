import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { isAfter, setHours } from 'date-fns';
import moment from 'moment';
import { NgxCurrencyDirective } from 'ngx-currency';
import { lastValueFrom } from 'rxjs';
import { Category } from '../../../../../core/entities/category/category';
import { BasicCard } from '../../../../../core/entities/credit-card/credit-card-dto';
import { GenericIdDs } from '../../../../../core/entities/generic';
import { Release } from '../../../../../core/entities/release/release';
import {
  ConfirmDuplicatedReleasesActionDialogData,
  ReleaseFormDialogData,
} from '../../../../../core/entities/release/release-dto';
import { ReleaseService } from '../../../../../core/entities/release/release.service';
import { DuplicatedReleaseAction } from '../../../../../core/enums/duplicated-release-action';
import {
  ReleaseFixedBy,
  ReleaseType,
} from '../../../../../core/enums/release-enums';
import { ReleasedOn } from '../../../../../core/enums/released-on';
import { getBtnStyle } from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { ConfirmDuplicatedReleasesActionDialog } from '../../components/confirm-duplicated-releases-action/confirm-duplicated-releases-action.component';
import { ReleaseFormComponent } from '../../components/release-form/release-form.component';

@Component({
  selector: 'release-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReleaseFormComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatTooltipModule,
    MatSelectModule,
    NgxCurrencyDirective,
    MatCheckboxModule,
    TranslateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './release-form-dialog.component.html',
  styleUrl: './release-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseFormDialog implements OnInit {
  readonly data: ReleaseFormDialogData = inject(MAT_DIALOG_DATA);

  readonly getBtnStyle = getBtnStyle;

  readonly darkThemeEnabled = signal(
    this.utils.getUserConfigs.theme === 'dark'
  );

  readonly isPcScreen = this.utils.isPcScreen;

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
    'release-form.repeat-for-suffix.MONTHLY'
  );

  selectedCreditCard = this.data.creditCardId !== undefined;

  constructor(
    public readonly utils: UtilsService,
    private readonly _matDialogRef: MatDialogRef<ReleaseFormDialog>,
    private readonly _translate: TranslateService,
    private readonly _matDialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _cashFlowService: ReleaseService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.formValidations();

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

  private buildForm() {
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
      time: null,
      observation: null,
      repeat: null,
      fixedBy: 'MONTHLY',
      repeatFor: '12',
      installmentsBy: '2',
    });
  }

  private formValidations() {
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

  public async save() {
    if (!this.validForm()) return;

    const saveAction = this.releaseForm.value.id
      ? SaveAction.UPDATE
      : SaveAction.INSERT;

    const saveDto = await this.getSaveDto(saveAction);
    if (!saveDto) return;

    let release = saveDto.release;
    const repeatFor = saveDto.repeatFor;
    const duplicatedReleaseAction = saveDto.duplicatedReleaseAction;
    const releasedOn = saveDto.releasedOn;

    var requestError: boolean = false;
    this.saving.set(true);

    release.date = setHours(release.date, 12);

    switch (saveAction) {
      case SaveAction.INSERT:
        await this._cashFlowService
          .addRelease(release, repeatFor!, releasedOn)
          .then((response) => {
            release = response;
          })
          .catch(() => {
            requestError = true;
          });
        break;
      case SaveAction.UPDATE:
        await this._cashFlowService
          .editRelease(release, duplicatedReleaseAction!, releasedOn)
          .then((response) => {
            release = response;
          })
          .catch(() => {
            requestError = true;
          });
        break;
    }

    if (requestError) {
      this.saving.set(false);
      this.utils.showMessage('release-form.error-saving-release');
      this.releaseForm.markAsPristine();
      return;
    }

    if (this.changedAttachment && this.selectedFile) {
      await this._cashFlowService
        .saveAttachment(release.id!, this.selectedFile!)
        .catch(() => {
          this.utils.showMessage('release-form.error-saving-attachment', 6000);
          requestError = true;
        });
    } else if (this.removedFile) {
      await this._cashFlowService.removeAttachment(release.id!).catch(() => {
        this.utils.showMessage('release-form.error-excluding-attachment', 6000);
        requestError = true;
      });
    }

    if (requestError) {
      this.saving.set(false);
      this.releaseForm.markAsPristine();
      return;
    }

    this.utils.showMessage('release-form.release-saved-successfully');
    this._matDialogRef.close(true);

    this.saving.set(false);
  }

  private validForm(): boolean {
    if (this.releaseForm.value.amount === 0) {
      this.utils.showMessage('release-form.amount-greater-than-zero');
      return false;
    } else if (
      this.releaseForm.value.type === 'T' &&
      this.releaseForm.value.accountId == this.releaseForm.value.targetAccountId
    ) {
      this.utils.showMessage('release-form.not-possible-transfer-same-bank');
      return false;
    }

    return true;
  }

  private async getSaveDto(
    saveAction: SaveAction
  ): Promise<SaveDto | undefined> {
    var release = this.releaseForm.value;
    var duplicatedReleaseAction: DuplicatedReleaseAction =
      DuplicatedReleaseAction.UNNECESSARY;

    let confirmedAction = false;

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
        confirmedAction = true;
      });

      if (!confirmedAction) return;

      if (
        !duplicatedReleaseAction.match(DuplicatedReleaseAction.JUST_THIS) &&
        this.releaseForm.get('date')!.dirty
      ) {
        this.utils.showMessage('release-form.date-must-remain-the-same', 5000);
        return;
      }
    }

    const selectedAccount = this.data.accounts.find(
      (item: BasicCard) => item.id === release.accountId
    );
    const releasedOn: ReleasedOn = selectedAccount
      ? ReleasedOn.ACCOUNT
      : ReleasedOn.CREDIT_CARD;

    let repeatFor: number;
    if (!release.repeat) {
      release.fixedBy = null;
      release.installmentsBy = null;
      delete release.repeatFor;
      repeatFor = 0;
    } else {
      repeatFor =
        release.repeat === 'FIXED'
          ? +release.repeatFor
          : +release.installmentsBy;
    }

    if (releasedOn == ReleasedOn.CREDIT_CARD) {
      release.creditCardId = release.accountId;
      release.accountId = null;
    }

    switch (saveAction) {
      case SaveAction.INSERT:
        return {
          release,
          repeatFor,
          duplicatedReleaseAction: null,
          releasedOn,
        };
      case SaveAction.UPDATE:
        return {
          release,
          repeatFor: null,
          duplicatedReleaseAction,
          releasedOn,
        };
    }
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

  public onFileSelected(event: any) {
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

  public removeFile() {
    this.selectedFile = null;
    this.releaseForm.markAsDirty();

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';

    if (this.data.release?.attachmentName) {
      this.removedFile = true;
    }
  }

  public onChangeRepeat(
    action: 'FIXED' | 'INSTALLMENTS',
    event: MatCheckboxChange
  ) {
    if (!event.checked) {
      this.releaseForm.get('repeat')!.setValue('');
      return;
    }

    this.releaseForm.get('repeat')!.setValue(action);

    switch (action) {
      case 'FIXED':
        this.installmenteRepeat.setValue(false);
        this.releaseForm.get('repeatFor')!.setValidators(Validators.required);
        this.releaseForm.get('installmentsBy')!.clearValidators();
        break;
      case 'INSTALLMENTS':
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
        id: ReleaseFixedBy.DAILY,
        ds: this._translate.instant('release-form.fixed-by-list.daily'),
      },
      {
        id: ReleaseFixedBy.WEEKLY,
        ds: this._translate.instant('release-form.fixed-by-list.weekly'),
      },
      {
        id: ReleaseFixedBy.MONTHLY,
        ds: this._translate.instant('release-form.fixed-by-list.monthly'),
      },
      {
        id: ReleaseFixedBy.BIMONTHLY,
        ds: this._translate.instant('release-form.fixed-by-list.bimonthly'),
      },
      {
        id: ReleaseFixedBy.QUARTERLY,
        ds: this._translate.instant('release-form.fixed-by-list.quarterly'),
      },
      {
        id: ReleaseFixedBy.BIANNUAL,
        ds: this._translate.instant('release-form.fixed-by-list.biannual'),
      },
      {
        id: ReleaseFixedBy.ANNUAL,
        ds: this._translate.instant('release-form.fixed-by-list.annual'),
      },
    ];
  }

  public onChangeFixedBy(value: ReleaseFixedBy) {
    let fixedBy = '';

    switch (value) {
      case ReleaseFixedBy.DAILY:
        fixedBy = '365';
        break;
      case ReleaseFixedBy.WEEKLY:
        fixedBy = '52';
        break;
      case ReleaseFixedBy.MONTHLY:
        fixedBy = '12';
        break;
      case ReleaseFixedBy.BIMONTHLY:
        fixedBy = '12';
        break;
      case ReleaseFixedBy.QUARTERLY:
        fixedBy = '8';
        break;
      case ReleaseFixedBy.BIANNUAL:
        fixedBy = '6';
        break;
      case ReleaseFixedBy.ANNUAL:
        fixedBy = '5';
        break;
    }

    this.releaseForm.get('repeatFor')!.setValue(fixedBy);
    this.repeatForSuffix = this._translate.instant(
      `release-form.repeat-for-suffix.${value}`
    );
  }

  public disableSave(): boolean {
    return (
      (this.data.editing &&
        this.releaseForm.pristine &&
        !this.changedAttachment) ||
      this.releaseForm.invalid ||
      (this.releaseForm.value.repeat === 'FIXED' &&
        !this.releaseForm.value.repeatFor) ||
      (this.releaseForm.value.repeat === 'INSTALLMENTS' &&
        !this.releaseForm.value.installmentsBy) ||
      this.saving()
    );
  }
}

interface SaveDto {
  release: Release;
  repeatFor: number | null;
  duplicatedReleaseAction: DuplicatedReleaseAction | null;
  releasedOn: ReleasedOn;
}

enum SaveAction {
  INSERT,
  UPDATE,
}
