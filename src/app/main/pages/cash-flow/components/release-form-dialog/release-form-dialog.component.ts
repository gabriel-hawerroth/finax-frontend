import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UtilsService } from '../../../../../utils/utils.service';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CashFlowService } from '../../../../../services/cash-flow.service';
import { CashFlow } from '../../../../../interfaces/CashFlow';
import { Category } from '../../../../../interfaces/Category';
import { Subject, takeUntil } from 'rxjs';
import moment from 'moment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReleaseFormComponent } from './components/release-form/release-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgxCurrencyDirective } from 'ngx-currency';
import { LoginService } from '../../../../../services/login.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'release-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    ReleaseFormComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    MatTooltipModule,
    MatRadioModule,
    MatSelectModule,
    NgxCurrencyDirective,
    MatProgressSpinnerModule,
  ],
  templateUrl: './release-form-dialog.component.html',
  styleUrl: './release-form-dialog.component.scss',
})
export class ReleaseFormDialogComponent implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  public data = inject(MAT_DIALOG_DATA);
  private _fb = inject(FormBuilder);
  private _cashFlowService = inject(CashFlowService);
  private _matDialogRef = inject(MatDialogRef);
  private _loginService = inject(LoginService);

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

  _unsubscribeAll: Subject<any> = new Subject();

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
    } else if (this.data.releaseType === 'E' || this.data.releaseType === 'R') {
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
      userId: this._loginService.getLoggedUserId,
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
      installmentsBy: '2',
    });
    this.releaseForm.markAllAsTouched();

    if (this.data.releaseType === 'T') {
      this.releaseForm
        .get('targetAccountId')!
        .setValidators(Validators.required);

      this.releaseForm.get('categoryId')!.clearValidators();
    }

    this.releaseForm
      .get('date')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.releaseForm
          .get('done')!
          .setValue(!moment(value).isAfter(new Date()));
      });

    this.releaseForm
      .get('installmentsBy')!
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value: string) => {
        if (value == '0') {
          this.releaseForm.get('installmentsBy')!.setValue('2');
        }
      });
  }

  save() {
    if (this.releaseForm.value.amount === 0) {
      this.utilsService.showSimpleMessage(
        this.language === 'pt-br'
          ? 'O valor deve ser maior que zero'
          : 'The amount must be greater than zero'
      );
      return;
    }
    if (
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

    this.saving = true;

    setTimeout(() => {
      if (this.saving) {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Devido ao tamanho da imagem isto pode levar alguns segundos'
            : 'Due to the size of the image, this may take a few seconds',
          4000
        );

        setTimeout(() => {
          if (this.saving) {
            this.utilsService.showSimpleMessage(
              this.language === 'pt-br' ? 'Quase lá...' : 'Almost there...'
            );
          }
        }, 10000);
      }
    }, 8000);

    this._cashFlowService
      .save({
        repeat: this.releaseForm.value.repeat,
        fixedBy: this.releaseForm.value.fixedBy,
        installmentsBy: this.releaseForm.value.installmentsBy,
        release: this.releaseForm.value,
      })
      .then(async (response: CashFlow) => {
        if (this.changedAttachment && this.selectedFile) {
          await this._cashFlowService
            .addAttachment(response.id!, this.selectedFile)
            .catch((err) => {
              this.utilsService.showSimpleMessage(
                this.language === 'pt-br'
                  ? 'Lançamento salvo com sucesso porém houve um erro ao salvar o anexo'
                  : 'Launch saved successfully, but there was an error saving the attachment',
                6000
              );
            });
        } else if (this.removedFile) {
          await this._cashFlowService
            .removeAttachment(response.id!)
            .catch((err) => {
              this.utilsService.showSimpleMessage(
                this.language === 'pt-br'
                  ? 'Lançamento salvo com sucesso porém houve um erro ao excluir o anexo'
                  : 'Launch saved successfully, but there was an error excluding the attachment',
                6000
              );
            });
        }

        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Lançamento salvo com sucesso'
            : 'Release saved successfully'
        );

        this._matDialogRef.close(true);
      })
      .catch((err) => {
        if (err.error.status === 406) {
          this.utilsService.showSimpleMessage(
            this.language === 'pt-br'
              ? 'Saldo insuficiente'
              : 'Insufficient balance'
          );
        } else {
          this.utilsService.showSimpleMessage(
            this.language === 'pt-br'
              ? 'Erro ao salvar o lançamento'
              : 'Error saving release'
          );
        }
      })
      .finally(() => {
        this.saving = false;
        this.utilsService.dismissMessage();
      });
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
    this.releaseForm.markAsDirty();
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
}
