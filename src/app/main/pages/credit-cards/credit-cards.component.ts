import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UtilsService } from '../../../utils/utils.service';
import { MatCardModule } from '@angular/material/card';
import { CreditCardService } from '../../../services/credit-card.service';
import { ButtonsComponent } from '../../../utils/buttons/buttons.component';

@Component({
  selector: 'app-credit-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule, ButtonsComponent],
  templateUrl: './credit-cards.component.html',
  styleUrl: './credit-cards.component.scss',
})
export class CreditCardsComponent {
  public utilsService = inject(UtilsService);
  private _creditCardService = inject(CreditCardService);

  language = this.utilsService.getUserConfigs.language;

  sendTestRequest() {
    this._creditCardService.sendTestRequest();
  }
}
