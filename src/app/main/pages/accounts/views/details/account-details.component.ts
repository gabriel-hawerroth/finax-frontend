import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Account } from '../../../../../core/entities/account/account';
import {
  BankAccountDetailsData,
  EditBalanceDialogData,
} from '../../../../../core/entities/account/account-dto';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { EditBalanceDialog } from '../../components/edit-balance-dialog/edit-balance-dialog.component';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { ButtonType } from '../../../../../core/enums/button-style';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    CommonModule,
    CustomCurrencyPipe,
    NgOptimizedImage,
    TranslateModule,
    ButtonsComponent,
  ],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountDetailsComponent {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  readonly currency = this.utils.getUserConfigs.currency;

  account: Account = this.data.account;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: BankAccountDetailsData,
    public readonly utils: UtilsService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _bottomSheetRef: MatBottomSheetRef,
    private readonly _dialog: MatDialog,
    private readonly _router: Router
  ) {}

  edit() {
    this._bottomSheetRef.dismiss();
    this._router.navigate([`contas/${this.account.id}`]);
  }

  adjustBalance() {
    lastValueFrom(
      this._dialog
        .open(EditBalanceDialog, {
          data: <EditBalanceDialogData>{
            account: this.account,
          },
          panelClass: 'edit-balance-dialog',
          autoFocus: false,
        })
        .afterClosed()
    ).then((result: any) => {
      if (!result) return;

      this.account.balance = result;
      this._changeDetectorRef.detectChanges();
    });
  }

  get getAccountType(): string {
    let type = 'my-accounts.account-types.';
    type += this.account.type.toString().toLowerCase();
    return type;
  }

  get getBtnStyle() {
    return ButtonType.STROKED;
  }

  get getEditBtnStyle() {
    return ButtonType.BASIC;
  }
}
