import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserCreditCards } from '../../../../../interfaces/credit-card';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { cloudFireCdnImgsLink } from '../../../../../utils/constants';
import { UtilsService } from '../../../../../utils/utils.service';

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

  cloudFireCdnImgsLink = cloudFireCdnImgsLink;

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
