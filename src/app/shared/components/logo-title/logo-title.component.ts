import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { cloudFireCdnImgsLink } from '../../utils/utils';

@Component({
  selector: 'app-logo-title',
  imports: [NgOptimizedImage],
  template: `
    <div id="logo-title" [class.minimized]="minimized()">
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
    @use 'generic.scss' as *;

    #logo-title {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 !important;
      gap: 1rem;
      transition:
        margin-right 0.3s ease,
        gap 0.3s ease;
      margin-right: 2rem;

      h1 {
        font-size: 2.4rem;
        color: #419544;
        font-family: $default-font-family !important;
        font-weight: bold;
        overflow: hidden;
        max-width: 10rem;
        opacity: 1;
        transition:
          max-width 0.3s ease,
          opacity 0.2s ease;
      }

      &.minimized {
        gap: 0;
        margin-right: 0;

        h1 {
          max-width: 0;
          opacity: 0;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoTitleComponent {
  readonly minimized = input(false);
  cloudFireCdnImgsLink = cloudFireCdnImgsLink;
}
