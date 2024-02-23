import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import moment from 'moment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReleaseFormComponent } from './components/release-form/release-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { NgxCurrencyDirective } from 'ngx-currency';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { ButtonsComponent } from '../../../utils/buttons/buttons.component';
import { Category } from '../../../interfaces/Category';
import { CashFlowService } from '../../../services/cash-flow.service';
import { LoginService } from '../../../services/login.service';
import { UtilsService } from '../../../utils/utils.service';
import { ConfirmDuplicatedReleasesActionComponent } from '../../pages/cash-flow/components/confirm-duplicated-releases-action/confirm-duplicated-releases-action.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GenericIdDs } from '../../../interfaces/Generic';

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
export class ReleaseFormDialogComponent implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  public data = inject(MAT_DIALOG_DATA);
  private _fb = inject(FormBuilder);
  private _cashFlowService = inject(CashFlowService);
  private _matDialog = inject(MatDialog);
  private _matDialogRef = inject(MatDialogRef);
  private _loginService = inject(LoginService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _translate = inject(TranslateService);

  private _unsubscribeAll: Subject<any> = new Subject();

  releaseForm!: FormGroup;

  currentDate: Date = new Date();
  defaultDate: Date = this.data.selectedDate;

  selectedFile: File | null = null;
  showRepeat: boolean = false;
  showObservation: boolean = false;

  changedAttachment: boolean = false;
  removedFile: boolean = false;

  smallScreen: boolean = window.innerHeight < 800 && window.innerWidth < 1400;

  saving: boolean = false;

  fixedRepeat = new FormControl(false);
  installmenteRepeat = new FormControl(false);

  repeatForSuffix: string = this._translate.instant(
    'release-form.repeat-for-suffix.monthly'
  );

  ngOnInit(): void {
    if (
      this.defaultDate.getMonth() === this.currentDate.getMonth() &&
      this.defaultDate.getFullYear() === this.currentDate.getFullYear()
    ) {
      this.defaultDate = this.currentDate;
    } else {
      this.defaultDate = new Date(this.defaultDate.setDate(1));
    }

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

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }

  buildForm() {
    this.releaseForm = this._fb.group({
      id: null,
      userId: this._loginService.getLoggedUser!.id,
      description: '',
      accountId: [null, Validators.required],
      targetAccountId: [null],
      amount: [0, Validators.required],
      type: [this.data.releaseType, Validators.required],
      done: [true, Validators.required],
      categoryId: [null, Validators.required],
      date: [this.defaultDate, Validators.required],
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
    if (this.data.releaseType === 'T') {
      this.releaseForm
        .get('targetAccountId')!
        .setValidators(Validators.required);

      this.releaseForm.get('categoryId')!.clearValidators();
    }

    this.releaseForm
      .get('done')!
      .setValue(!moment(this.releaseForm.value.date).isAfter(new Date()));

    if (this.data.accounts.length > 0)
      this.releaseForm.get('accountId')!.setValue(this.data.accounts[0].id);

    this.releaseForm
      .get('repeat')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        switch (value) {
          case 'fixed':
            this.releaseForm
              .get('repeatFor')!
              .setValidators(Validators.required);
            this.releaseForm.get('installmentsBy')!.clearValidators();
            break;
          case 'installments':
            this.releaseForm
              .get('installmentsBy')!
              .setValidators(Validators.required);
            this.releaseForm.get('repeatFor')!.clearValidators();
        }
      });

    this.releaseForm
      .get('fixedBy')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.onChangeFixedBy(value);
      });
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

    let release = this.releaseForm.value;
    let duplicatedReleaseAction: string = '';

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
      ).then((response: 'just-this' | 'nexts' | 'all') => {
        if (!response) return;

        duplicatedReleaseAction = response;
      });

      if (duplicatedReleaseAction === '') return;

      if (
        duplicatedReleaseAction !== 'just-this' &&
        this.releaseForm.get('date')!.dirty
      ) {
        this.utilsService.showMessage(
          'release-form.date-must-remain-the-same',
          5000
        );
        return;
      }
    }

    this.saving = true;
    let showingMessage: boolean = false;
    var requestError: boolean = false;
    this._changeDetectorRef.detectChanges();

    setTimeout(() => {
      if (this.saving) {
        this.utilsService.showMessage(
          'release-form.this-may-take-few-seconds',
          6000
        );
        showingMessage = true;
        setTimeout(() => {
          showingMessage = false;
        }, 6000);
      }
    }, 8000);

    if (!release.id) {
      await this._cashFlowService
        .addRelease(
          release,
          release.repeat === 'fixed'
            ? release.repeatFor
            : release.installmentsBy
        )
        .then((response) => {
          release = response;
        })
        .catch(() => {
          requestError = true;
        });
    } else {
      await this._cashFlowService
        .editRelease(release, duplicatedReleaseAction)
        .then((response) => {
          release = response;
        })
        .catch(() => {
          requestError = true;
        });
    }

    if (requestError) {
      this.saving = false;
      this._changeDetectorRef.detectChanges();
      this.utilsService.showMessage('release-form.error-saving-release');
      return;
    }

    if (this.changedAttachment && this.selectedFile) {
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
      this.saving = false;
      this._changeDetectorRef.detectChanges();
      return;
    }

    this.utilsService.showMessage('release-form.release-saved-successfully');
    this._matDialogRef.close(true);

    this.saving = false;

    if (showingMessage) this.utilsService.dismissMessage();

    this._changeDetectorRef.detectChanges();
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

    const fileExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'jfif', 'webp'];
    const extension = file.name.split('.').pop().toLowerCase();
    if (fileExtensions.indexOf(extension) === -1) {
      this.utilsService.showMessage('release-form.select-valid-file', 10000);
      return;
    }

    const maxSize = 3 * 1024 * 1024; // first number(mb) converted to bytes
    if (file.size > maxSize) {
      this.utilsService.showMessage('release-form.file-too-large', 8000);
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
        break;
      case 'installments':
        this.fixedRepeat.setValue(false);
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
