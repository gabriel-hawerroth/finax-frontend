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

  private _unsubscribeAll: Subject<any> = new Subject();

  language = this.utilsService.getUserConfigs.language;

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

  repeatForSuffix: string = this.language === 'pt-br' ? 'meses' : 'months';

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
      this.utilsService.showSimpleMessage(
        this.language === 'pt-br'
          ? 'O valor deve ser maior que zero'
          : 'The amount must be greater than zero'
      );
      return;
    } else if (
      this.releaseForm.value.type === 'T' &&
      this.releaseForm.value.accountId == this.releaseForm.value.targetAccountId
    ) {
      this.utilsService.showSimpleMessage(
        this.language === 'pt-br'
          ? 'Não é possível realizar uma transferência para o mesmo banco'
          : 'It is not possible to make a transfer to the same bank'
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
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Para alterar outros lançamentos junto com este, a data deve permanecer igual'
            : 'To change other releases along with this one, the date must remain the same',
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
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Devido ao tamanho do anexo isto pode levar alguns segundos'
            : 'Due to the size of the attachment, this may take a few seconds',
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
          this.utilsService.showSimpleMessage(
            this.language === 'pt-br'
              ? 'Erro ao salvar o lançamento'
              : 'Error saving the release'
          );
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
      this.utilsService.showSimpleMessage(
        this.language === 'pt-br'
          ? 'Erro ao salvar o lançamento'
          : 'Error saving the release'
      );
      this.saving = false;
      this._changeDetectorRef.detectChanges();
      return;
    }

    if (this.changedAttachment && this.selectedFile) {
      await this._cashFlowService
        .addAttachment(release.id, this.selectedFile!)
        .catch((err) => {
          this.utilsService.showSimpleMessage(
            this.language === 'pt-br'
              ? 'Lançamento salvo com sucesso porém houve um erro ao salvar o anexo'
              : 'Launch saved successfully, but there was an error saving the attachment',
            6000
          );
          requestError = true;
        });
    } else if (this.removedFile) {
      await this._cashFlowService.removeAttachment(release.id).catch((err) => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Lançamento salvo com sucesso porém houve um erro ao excluir o anexo'
            : 'Launch saved successfully, but there was an error excluding the attachment',
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

    this.utilsService.showSimpleMessage(
      this.language === 'pt-br'
        ? 'Lançamento salvo com sucesso'
        : 'Release saved successfully'
    );
    this._matDialogRef.close(true);

    this.saving = false;

    if (showingMessage) this.utilsService.dismissMessage();

    this._changeDetectorRef.detectChanges();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    const fileExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'jfif', 'webp'];
    const extension = file.name.split('.').pop().toLowerCase();
    if (fileExtensions.indexOf(extension) === -1) {
      alert(
        this.language === 'pt-br'
          ? 'Por favor, selecione um arquivo válido (pdf, jpg, jpeg, png, jfif, webp).'
          : 'Please select a valid file (pdf, jpg, jpeg, png, jfif, webp).'
      );
      return;
    }

    const maxSize = 3 * 1024 * 1024; // first number(mb) converted to bytes
    if (file.size > maxSize) {
      alert(
        this.language === 'pt-br'
          ? 'O arquivo selecionado é muito grande. O tamanho máximo permitido é 3MB.'
          : 'The selected file is too large. The maximum size allowed is 3MB.'
      );
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

  onChangeFixedBy(value: string) {
    switch (value) {
      case 'daily':
        this.releaseForm.get('repeatFor')!.setValue('365');
        this.repeatForSuffix = this.language === 'pt-br' ? 'dias' : 'days';
        break;
      case 'weekly':
        this.releaseForm.get('repeatFor')!.setValue('52');
        this.repeatForSuffix = this.language === 'pt-br' ? 'semanas' : 'weeks';
        break;
      case 'monthly':
        this.releaseForm.get('repeatFor')!.setValue('12');
        this.repeatForSuffix = this.language === 'pt-br' ? 'meses' : 'months';
        break;
      case 'bimonthly':
        this.releaseForm.get('repeatFor')!.setValue('12');
        this.repeatForSuffix =
          this.language === 'pt-br' ? 'bimestres' : 'bimesters';
        break;
      case 'quarterly':
        this.releaseForm.get('repeatFor')!.setValue('8');
        this.repeatForSuffix =
          this.language === 'pt-br' ? 'trimestres' : 'quarters';
        break;
      case 'biannual':
        this.releaseForm.get('repeatFor')!.setValue('6');
        this.repeatForSuffix =
          this.language === 'pt-br' ? 'semestres' : 'semesters';
        break;
      case 'annual':
        this.releaseForm.get('repeatFor')!.setValue('5');
        this.repeatForSuffix = this.language === 'pt-br' ? 'anos' : 'years';
        break;
    }
  }
}
