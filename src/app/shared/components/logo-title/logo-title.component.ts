import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { cloudFireCdnImgsLink } from '../../utils/utils';

@Component({
  selector: 'app-logo-title',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <div id="logo-title">
      <img
        [ngSrc]="cloudFireCdnImgsLink + 'money-coin.svg'"
        width="40"
        height="40"
        alt="company logo"
      />
      <h1>Finax</h1>
    </div>
  `,
  styles: `
    @import 'generic.scss';

    #logo-title {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 !important;
        gap: 1rem;

        h1 {
            font-size: 2.4rem;
            color: #419544;
            font-family: $default-font-family !important;
            font-weight: bold;
        }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoTitleComponent {
  cloudFireCdnImgsLink = cloudFireCdnImgsLink;
}
