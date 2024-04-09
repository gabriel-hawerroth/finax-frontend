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
import moment from 'moment';
import { NgxCurrencyDirective } from 'ngx-currency';
import { lastValueFrom } from 'rxjs';
import { DuplicatedReleaseAction } from '../../../enums/duplicated-release-action';
import { ReleasedOn } from '../../../enums/released-on';
import { Category } from '../../../interfaces/category';
import { CardBasicList } from '../../../interfaces/credit-card';
import { GenericIdDs } from '../../../interfaces/generic';
import { ConfirmDuplicatedReleasesActionComponent } from '../../../main/pages/cash-flow/components/confirm-duplicated-releases-action/confirm-duplicated-releases-action.component';
import { CashFlowService } from '../../../services/cash-flow.service';
import { UtilsService } from '../../../utils/utils.service';
import { ButtonsComponent } from '../buttons/buttons.component';
import { ReleaseFormComponent } from './components/release-form/release-form.component';

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
export class ReleaseFormDialogComponent implements OnInit {
  public readonly utilsService = inject(UtilsService);
  public readonly data = inject(MAT_DIALOG_DATA);
  private readonly _fb = inject(FormBuilder);
  private readonly _cashFlowService = inject(CashFlowService);
  private readonly _matDialog = inject(MatDialog);
  private readonly _matDialogRef = inject(MatDialogRef);
  private readonly _translate = inject(TranslateService);

  public releaseForm!: FormGroup;

  private currentDate: Date = new Date();

  public selectedFile: File | null = null;
  public showRepeat: boolean = false;
  public showObservation: boolean = false;

  public changedAttachment: boolean = false;
  private removedFile: boolean = false;

  public smallScreen: boolean =
    window.innerHeight < 800 && window.innerWidth < 1400;

  public saving = signal(false);

  public fixedRepeat = new FormControl(false);
  public installmenteRepeat = new FormControl(false);

  public repeatForSuffix: string = this._translate.instant(
    'release-form.repeat-for-suffix.monthly'
  );

  public selectedCreditCard = this.data.creditCardId !== undefined;

  ngOnInit(): void {
    this.buildForm();

    if (this.data.editing) {
      this.releaseForm.patchValue(this.data.release);

      if (this.data.release.attachmentName) {
        const blob = new Blob([this.data.release.attachment], {
          type: 'application/octet-stream',
        });

        const file = new File([blob], this.data.release.attachmentName);
        this.selectedFile = file;
      }

      if (this.data.release.observation) {
        this.showObservation = true;
      }
    } else if (this.data.releaseType !== 'T') {
      const otherCategorieId: number = this.data.categories.find(
        (item: Category) =>
          item.name ===
          (this.data.releaseType === 'E'
            ? 'Outras despesas'
            : this.data.releaseType === 'R'
            ? 'Outras receitas'
            : '')
      ).id;

      this.releaseForm.get('categoryId')!.setValue(otherCategorieId);
    }
  }

  buildForm() {
    this.releaseForm = this._fb.group({
      id: null,
      userId: this.utilsService.getLoggedUser!.id,
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
    });
    this.releaseForm.markAllAsTouched();

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

    if (this.data.releaseType === 'T') {
      this.releaseForm
        .get('targetAccountId')!
        .setValidators(Validators.required);

      this.releaseForm.get('categoryId')!.clearValidators();
    }

    this.releaseForm
      .get('done')!
      .setValue(!moment(this.releaseForm.value.date).isAfter(new Date()));
  }

  async save() {
    if (this.releaseForm.value.amount === 0) {
      this.utilsService.showMessage('release-form.amount-greater-than-zero');
      return;
    } else if (
      this.releaseForm.value.type === 'T' &&
      this.releaseForm.value.accountId == this.releaseForm.value.targetAccountId
    ) {
      this.utilsService.showMessage(
        'release-form.not-possible-transfer-same-bank'
      );
      return;
    }

    var release = this.releaseForm.value;
    var duplicatedReleaseAction: DuplicatedReleaseAction =
      DuplicatedReleaseAction.UNNECESSARY;

    if (release.id && this.data.release.isDuplicatedRelease) {
      await lastValueFrom(
        this._matDialog
          .open(ConfirmDuplicatedReleasesActionComponent, {
            data: {
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
        this.utilsService.showMessage(
          'release-form.date-must-remain-the-same',
          5000
        );
        return;
      }
    }

    this.saving.set(true);
    var requestError: boolean = false;

    const selectedAccount = this.data.accounts.find(
      (item: CardBasicList) => item.id === release.accountId
    );
    const releasedOn: ReleasedOn = selectedAccount
      ? ReleasedOn.ACCOUNT
      : ReleasedOn.CREDIT_CARD;

    if (release.repeat === '') release.fixedBy = '';

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
      this.utilsService.showMessage('release-form.error-saving-release');
      return;
    }

    if (this.changedAttachment && this.selectedFile) {
      if (this.selectedFile.size > 1.5 * 1024 * 1024) {
        this.utilsService.showMessage(
          'generic.this-may-take-few-seconds',
          6000
        );
      }

      await this._cashFlowService
        .addAttachment(release.id, this.selectedFile!)
        .catch(() => {
          this.utilsService.showMessage(
            'release-form.error-saving-attachment',
            6000
          );
          requestError = true;
        });
    } else if (this.removedFile) {
      await this._cashFlowService.removeAttachment(release.id).catch(() => {
        this.utilsService.showMessage(
          'release-form.error-excluding-attachment',
          6000
        );
        requestError = true;
      });
    }

    if (requestError) {
      this.saving.set(false);
      return;
    }

    this.utilsService.showMessage('release-form.release-saved-successfully');
    this._matDialogRef.close(true);

    this.saving.set(false);
  }

  get getDialogTitle(): string {
    let title = '';
    if (this.data.editing) title += this._translate.instant('generic.editing');
    else title += this._translate.instant('generic.new');

    title += ' ';

    switch (this.data.releaseType) {
      case 'E':
        title += this._translate.instant('generic.expense');
        break;
      case 'R':
        title += this._translate.instant('generic.revenue');
        break;
      case 'T':
        title += this._translate.instant('generic.transfer');
        break;
    }

    return title;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 3 * 1024 * 1024; // first number(mb) converted to bytes
    if (file.size > maxSize) {
      this.utilsService.showMessage('generic.file-too-large', 8000);
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

    if (this.data.release.attachmentName) {
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
