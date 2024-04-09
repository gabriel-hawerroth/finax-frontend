import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Account } from '../../../../../interfaces/account';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { UtilsService } from '../../../../../utils/utils.service';
import { EditBalanceDialogComponent } from '../edit-balance-dialog/edit-balance-dialog.component';

@Component({
  selector: 'app-bank-account-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    CustomCurrencyPipe,
    NgOptimizedImage,
    TranslateModule,
  ],
  templateUrl: './bank-account-details.component.html',
  styleUrl: './bank-account-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountDetailsComponent {
  public utilsService = inject(UtilsService);
  public data = inject(MAT_BOTTOM_SHEET_DATA);
  private _router = inject(Router);
  private _bottomSheetRef = inject(MatBottomSheetRef);
  private _dialog = inject(MatDialog);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  currency = this.utilsService.getUserConfigs.currency;

  account: Account = this.data.account;

  edit() {
    this._bottomSheetRef.dismiss();
    this._router.navigate([`contas-de-banco/${this.account.id}`]);
  }

  adjustBalance() {
    lastValueFrom(
      this._dialog
        .open(EditBalanceDialogComponent, {
          data: {
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
}
