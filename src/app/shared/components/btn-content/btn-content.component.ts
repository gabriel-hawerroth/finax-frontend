import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ResponsiveService } from '../../utils/responsive.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'btn-content',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatProgressSpinnerModule],
  templateUrl: './btn-content.component.html',
  styleUrl: './btn-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnContentComponent {
  label = input<string | undefined>();
  icon = input<string | undefined>();
  contentStyle = input<Object | undefined>();
  loading = input<boolean | undefined>();

  constructor(public readonly responsiveService: ResponsiveService) {}

  get showLabel() {
    return (
      (this.responsiveService.largeWidth() ||
        this.responsiveService.veryLargeWith() ||
        !this.icon()) &&
      this.label()
    );
  }
}
