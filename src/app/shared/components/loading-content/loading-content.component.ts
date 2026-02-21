import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-content',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-content.component.html',
  styleUrl: './loading-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingContentComponent {
  readonly loading = input.required<boolean>();
  readonly diameter = input(40);
}
