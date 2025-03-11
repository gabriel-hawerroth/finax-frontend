import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonType } from '../../../../core/enums/button-style';
import { ButtonsComponent } from '../../../../shared/components/buttons/buttons.component';
import { cloudFireCdnImgsLink } from '../../../../shared/utils/utils';

@Component({
  selector: 'privacy-policy-page',
  imports: [CommonModule, NgOptimizedImage, RouterModule, ButtonsComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyPage {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly homeButtonStyle = ButtonType.ICON;

  constructor() {}
}
