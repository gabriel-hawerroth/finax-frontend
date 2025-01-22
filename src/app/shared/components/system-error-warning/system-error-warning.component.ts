import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { cloudFireCdnImgsLink } from '../../utils/utils';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-system-error-warning',
  imports: [CommonModule, RouterModule, NgOptimizedImage, DatePipe],
  templateUrl: './system-error-warning.component.html',
  styleUrl: './system-error-warning.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemErrorWarningPage {
  protected readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  protected readonly darkThemeEnable = inject(UtilsService).darkThemeEnable;

  private readonly currentDt = new Date();

  public readonly expectedReturnDate = new Date(
    this.currentDt.setHours(this.currentDt.getHours() + 3)
  );
}
