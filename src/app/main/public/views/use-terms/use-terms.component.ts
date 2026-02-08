import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { ButtonType } from '../../../../core/enums/button-style';
import { ButtonsComponent } from '../../../../shared/components/buttons/buttons.component';
import { cloudFireCdnImgsLink } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-use-terms',
  imports: [
    NgOptimizedImage,
    RouterModule,
    ButtonsComponent,
    MatDividerModule
],
  templateUrl: './use-terms.component.html',
  styleUrl: './use-terms.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseTermsPage {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly homeButtonStyle = ButtonType.ICON;

  constructor() {}
}
