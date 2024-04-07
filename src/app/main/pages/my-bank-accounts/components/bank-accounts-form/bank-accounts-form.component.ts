import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../../../services/account.service';
import { UtilsService } from '../../../../../utils/utils.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { SelectIconDialogComponent } from '../../../../../shared/components/select-icon-dialog/select-icon-dialog.component';

@Component({
  selector: 'app-bank-accounts-edit',
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
  ],
  templateUrl: './bank-accounts-form.component.html',
  styleUrl: './bank-accounts-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountsFormComponent implements OnInit {
  public utilsService = inject(UtilsService);
  public location = inject(Location);
  private _activatedRoute = inject(ActivatedRoute);
  private _accountService = inject(AccountService);
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _dialog = inject(MatDialog);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  currency = this.utilsService.getUserConfigs.currency;

  accountId: number | null =
    +this._activatedRoute.snapshot.paramMap.get('id')! || null;

  accountForm!: FormGroup;

  saving: boolean = false;

  ngOnInit(): void {
    this.buildForm();

    if (this.accountId) {
      this._accountService
        .getById(this.accountId)
        .then((response) => this.accountForm.patchValue(response));
    }
  }

  buildForm() {
    this.accountForm = this._fb.group({
      id: null,
      userId: null,
      name: ['', Validators.required],
      type: '',
      code: null,
      balance: [0, Validators.required],
      accountNumber: '',
      agency: null,
      investments: false,
      addOverallBalance: true,
      active: true,
      archived: false,
      image: '',
    });

    this.accountForm.markAllAsTouched();
  }

  save() {
    this.saving = true;

    this.accountForm.markAsPristine();
    const data = this.accountForm.value;

    this._accountService
      .save(data)
      .then(() => {
        this.utilsService.showMessage('my-accounts.saved-successfully');
        this._router.navigate(['contas-de-banco']);
      })
      .catch(() => {
        this.utilsService.showMessage('my-accounts.error-saving-account');
      })
      .finally(() => {
        this.saving = false;
      });
  }

  selectIcon() {
    lastValueFrom(
      this._dialog.open(SelectIconDialogComponent).afterClosed()
    ).then((value) => {
      if (!value) return;

      this.accountForm.get('image')!.setValue(value);
      this.accountForm.markAsDirty();
      this._changeDetectorRef.detectChanges();
    });
  }
}
