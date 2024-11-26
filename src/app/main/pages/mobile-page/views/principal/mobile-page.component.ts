import { ChangeDetectionStrategy, Component } from '@angular/core';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { PublicHeaderComponent } from '../../../../public/components/header/public-header.component';

@Component({
  selector: 'app-mobile-page',
  standalone: true,
  imports: [PublicHeaderComponent],
  templateUrl: './mobile-page.component.html',
  styleUrl: './mobile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobilePage {
  cloudFireCdnImgsLink = cloudFireCdnImgsLink;
}
