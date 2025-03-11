import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { cloudFireCdnImgsLink } from '../../utils/utils';

@Component({
  selector: 'app-expired-link',
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './expired-link.component.html',
  styleUrl: './expired-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpiredLinkComponent {
  protected readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
}
