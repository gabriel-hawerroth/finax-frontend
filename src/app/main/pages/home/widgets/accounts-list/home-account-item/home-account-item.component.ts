import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HomeAccount } from '../../../../../../core/entities/home-p/home-dto';
import { CustomCurrencyPipe } from '../../../../../../shared/pipes/custom-currency.pipe';
import { cloudFireCdnImgsLink } from '../../../../../../shared/utils/utils';

@Component({
  selector: 'app-home-account-item',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, CustomCurrencyPipe],
  templateUrl: './home-account-item.component.html',
  styleUrl: './home-account-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeAccountItemComponent {
  public readonly account = input.required<HomeAccount>();
  public readonly currency = input.required<string>();

  public readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
}
