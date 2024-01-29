import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { UtilsService } from '../../../utils/utils.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-released-features-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './released-features-dialog.component.html',
  styleUrl: './released-features-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleasedFeaturesDialogComponent {
  public utilsService = inject(UtilsService);

  language = this.utilsService.getUserConfigs.language;
}
