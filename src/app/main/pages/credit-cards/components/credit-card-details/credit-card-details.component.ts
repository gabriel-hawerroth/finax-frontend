import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UtilsService } from '../../../../../utils/utils.service';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { UserCreditCards } from '../../../../../interfaces/CreditCard';
import { CustomCurrencyPipe } from '../../../../../utils/customCurrencyPipe';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-credit-card-details',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    CustomCurrencyPipe,
    MatButtonModule,
    TranslateModule,
  ],
  templateUrl: './credit-card-details.component.html',
  styleUrl: './credit-card-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardDetailsComponent {
  public utilsService = inject(UtilsService);
  public data = inject(MAT_BOTTOM_SHEET_DATA);
  private _router = inject(Router);
  private _bottomSheetRef = inject(MatBottomSheetRef);

  currency = this.utilsService.getUserConfigs.currency;

  card: UserCreditCards = this.data.card;

  edit() {
    this._bottomSheetRef.dismiss();
    this._router.navigate([`cartoes-de-credito/${this.card.id}`]);
  }

  seeInvoice() {
    this._bottomSheetRef.dismiss();
    this._router.navigate([`cartoes-de-credito/fatura/${this.card.id}`]);
  }
}
