import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HomeCreditCard } from '../../../../../../core/entities/home-p/home-dto';
import { ButtonConfig } from '../../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { CustomCurrencyPipe } from '../../../../../../shared/pipes/custom-currency.pipe';
import { cloudFireCdnImgsLink } from '../../../../../../shared/utils/utils';

@Component({
  selector: 'app-home-credit-card-item',
  imports: [
    NgOptimizedImage,
    TranslateModule,
    CustomCurrencyPipe,
    RouterModule,
    DynamicButtonComponent
],
  templateUrl: './home-credit-card-item.component.html',
  styleUrl: './home-credit-card-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCreditCardItemComponent {
  readonly card = input.required<HomeCreditCard>();
  readonly currency = input.required<string>();

  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  btnConfig: ButtonConfig = {
    label: 'credit-cards.see-invoice',
  };
}
