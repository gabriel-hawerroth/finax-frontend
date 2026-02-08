import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { cloudFireCdnImgsLink } from '../../utils/utils';

@Component({
  selector: 'app-activation-error',
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './activation-error.component.html',
  styleUrl: './activation-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivationErrorComponent {
  protected readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
}
