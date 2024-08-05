import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  CreditCardDetailsData,
  UserCreditCard,
} from '../../../../../core/entities/credit-card/credit-card-dto';
import { ButtonType } from '../../../../../core/enums/button-style';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-credit-card-details',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    CustomCurrencyPipe,
    TranslateModule,
    ButtonsComponent,
  ],
  templateUrl: './credit-card-details.component.html',
  styleUrl: './credit-card-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardDetailsComponent {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  currency = this.utils.getUserConfigs.currency;

  card: UserCreditCard = this.data.card;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: CreditCardDetailsData,
    public readonly utils: UtilsService,
    private readonly _router: Router,
    private readonly _bottomSheetRef: MatBottomSheetRef
  ) {}

  edit() {
    this._bottomSheetRef.dismiss();
    this._router.navigate([`cartoes-de-credito/${this.card.id}`]);
  }

  seeInvoice() {
    this._bottomSheetRef.dismiss();
    this._router.navigate([`cartoes-de-credito/fatura/${this.card.id}`]);
  }

  get strokedBtnStyle() {
    return ButtonType.STROKED;
  }

  get basicBtnStyle() {
    return ButtonType.BASIC;
  }
}
