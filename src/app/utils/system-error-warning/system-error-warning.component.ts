import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-system-error-warning',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage, DatePipe],
  templateUrl: './system-error-warning.component.html',
  styleUrl: './system-error-warning.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemErrorWarningComponent {
  private readonly currentDt = new Date();

  public readonly expectedReturnDate = new Date(
    this.currentDt.setHours(this.currentDt.getHours() + 3)
  );
}
