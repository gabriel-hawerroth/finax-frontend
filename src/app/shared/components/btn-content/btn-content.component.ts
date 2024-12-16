import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

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
}
