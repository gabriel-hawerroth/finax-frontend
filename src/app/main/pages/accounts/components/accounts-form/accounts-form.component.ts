import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  input,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyDirective } from 'ngx-currency';
import { lastValueFrom } from 'rxjs';
import { SelectIconDialog } from '../../../../../shared/components/select-icon-dialog/select-icon-dialog.component';
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
    TranslateModule,
  ],
  templateUrl: './accounts-form.component.html',
  styleUrl: './accounts-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsFormComponent {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly currency = this._utils.getUserConfigs.currency;

  accountForm = input.required<FormGroup>();
  accountId = input.required<number | null>();
  isDialog = input<boolean>(false);

  constructor(
    private readonly _utils: UtilsService,
    private readonly _dialog: MatDialog,
    private readonly _cdr: ChangeDetectorRef
  ) {}

  public selectIcon() {
    lastValueFrom(
      this._dialog.open(SelectIconDialog, { autoFocus: false }).afterClosed()
    ).then((value) => {
      if (!value) return;

      this.accountForm().get('image')!.setValue(value);
      this.accountForm().markAsDirty();
      this._cdr.detectChanges();
    });
  }

  removeAccountType(event: MouseEvent) {
    event.stopPropagation();
    this.accountForm().get('type')!.setValue(null);
    this.accountForm().markAsDirty();
  }

  get showDescriptionErrorHint() {
    return (
      this.accountForm().controls['name'].touched &&
      this.accountForm().controls['name'].hasError('required')
    );
  }
}
