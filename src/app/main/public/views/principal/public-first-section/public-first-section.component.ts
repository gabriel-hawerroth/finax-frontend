import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-public-first-section',
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './public-first-section.component.html',
  styleUrl: './public-first-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFirstSectionComponent {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
}
