import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { cloudFireCdnImgsLink } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-public-footer',
  imports: [RouterModule, NgOptimizedImage, MatDividerModule],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFooterComponent {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
}
