import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-public-first-section',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MatButtonModule],
  templateUrl: './public-first-section.component.html',
  styleUrl: './public-first-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFirstSectionComponent {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  constructor(private readonly _el: ElementRef) {}

  get getWidth(): number {
    const width = +this._el.nativeElement.querySelector(
      '[id="fs-img-container"]'
    ).clientWidth;

    return (80 / 100) * width + 1;
  }

  get getHeight(): number {
    const height = +this._el.nativeElement.querySelector(
      '[id="fs-img-container"]'
    ).clientHeight;

    return (80 / 100) * height + 1;
  }
}
