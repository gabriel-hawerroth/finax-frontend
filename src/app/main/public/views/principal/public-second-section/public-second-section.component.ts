import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-public-second-section',
  imports: [NgOptimizedImage, MatDividerModule],
  templateUrl: './public-second-section.component.html',
  styleUrl: './public-second-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicSecondSectionComponent {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
}
