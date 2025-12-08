import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HomeAccount } from '../../../../../../core/entities/home-p/home-dto';
import { CustomCurrencyPipe } from '../../../../../../shared/pipes/custom-currency.pipe';
import {
  cloudFireCdnImgsLink,
  getDefaultAccountImage,
} from '../../../../../../shared/utils/utils';

@Component({
  selector: 'app-home-account-item',
  imports: [NgOptimizedImage, CustomCurrencyPipe],
  templateUrl: './home-account-item.component.html',
  styleUrl: './home-account-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeAccountItemComponent {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly getDefaultAccountImage = getDefaultAccountImage;

  readonly account = input.required<HomeAccount>();
  readonly currency = input.required<string>();
}
