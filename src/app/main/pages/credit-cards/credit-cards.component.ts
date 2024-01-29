import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UtilsService } from '../../../utils/utils.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-credit-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './credit-cards.component.html',
  styleUrl: './credit-cards.component.scss',
})
export class CreditCardsComponent {
  public utilsService = inject(UtilsService);

  language = this.utilsService.getUserConfigs.language;
}
