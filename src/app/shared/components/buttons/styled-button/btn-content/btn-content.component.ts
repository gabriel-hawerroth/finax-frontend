import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ResponsiveService } from '../../../../utils/responsive.service';

@Component({
  selector: 'btn-content',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './btn-content.component.html',
  styleUrl: './btn-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnContentComponent {
  label = input.required<string>();
  icon = input.required<string>();
  contentStyle = input<any>();

  constructor(public readonly responsiveService: ResponsiveService) {}
}
