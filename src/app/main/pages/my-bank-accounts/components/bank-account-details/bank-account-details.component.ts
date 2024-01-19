import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UtilsService } from '../../../../../utils/utils.service';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { Account } from '../../../../../interfaces/Account';
import { MatButtonModule } from '@angular/material/button';
import { CustomCurrencyPipe } from '../../../../../utils/customCurrencyPipe';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditBalanceDialogComponent } from '../edit-balance-dialog/edit-balance-dialog.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-bank-account-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    CustomCurrencyPipe,
    NgOptimizedImage,
  ],
  templateUrl: './bank-account-details.component.html',
  styleUrl: './bank-account-details.component.scss',
})
export class BankAccountDetailsComponent {
  public utilsService = inject(UtilsService);
  public data = inject(MAT_BOTTOM_SHEET_DATA);
  private _router = inject(Router);
  private _bottomSheetRef = inject(MatBottomSheetRef);
  private _dialog = inject(MatDialog);

  language = this.utilsService.getUserConfigs.language;
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
    });
  }
}