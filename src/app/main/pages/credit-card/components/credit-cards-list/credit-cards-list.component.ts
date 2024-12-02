import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslateModule } from '@ngx-translate/core';
import {
  CreditCardDetailsData,
  UserCreditCard,
} from '../../../../../core/entities/credit-card/credit-card-dto';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { CreditCardDetailsComponent } from '../../views/details/credit-card-details.component';

@Component({
  selector: 'app-credit-cards-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgOptimizedImage],
  templateUrl: './credit-cards-list.component.html',
  styleUrl: './credit-cards-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardsListComponent {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  readonly creditCards = input.required<UserCreditCard[]>();
  readonly situationFilterValue = input.required<boolean | 'all'>();

  constructor(private readonly _bottomSheet: MatBottomSheet) {}

  openDetails(card: UserCreditCard) {
    this._bottomSheet.open(CreditCardDetailsComponent, {
      data: <CreditCardDetailsData>{
        card,
      },
      panelClass: 'credit-card-details',
    });
  }

  isLastItem(index: number) {
    return index === this.creditCards().length - 1;
  }
}
