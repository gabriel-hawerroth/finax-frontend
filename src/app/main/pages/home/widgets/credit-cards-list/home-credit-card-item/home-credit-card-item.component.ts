import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HomeCreditCard } from '../../../../../../core/entities/home-p/home-dto';
import { ButtonsComponent } from '../../../../../../shared/components/buttons/buttons.component';
import { CustomCurrencyPipe } from '../../../../../../shared/pipes/custom-currency.pipe';
import { cloudFireCdnImgsLink } from '../../../../../../shared/utils/utils';

@Component({
  selector: 'app-home-credit-card-item',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    TranslateModule,
    CustomCurrencyPipe,
    ButtonsComponent,
    RouterModule,
  ],
  templateUrl: './home-credit-card-item.component.html',
  styleUrl: './home-credit-card-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCreditCardItemComponent {
  public readonly card = input.required<HomeCreditCard>();
  public readonly currency = input.required<string>();

  public readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
}
