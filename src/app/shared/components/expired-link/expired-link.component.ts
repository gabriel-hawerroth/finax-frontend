import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { cloudFireCdnImgsLink } from '../../utils/utils';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-expired-link',
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './expired-link.component.html',
  styleUrl: './expired-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpiredLinkComponent {
  protected readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  protected readonly darkThemeEnable = inject(UtilsService).darkThemeEnable;
}
