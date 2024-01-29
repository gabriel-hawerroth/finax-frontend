import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilsService } from '../../../utils/utils.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  public utilsService = inject(UtilsService);
  public data = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);

  language: string = this.utilsService.getUserConfigs.language;

  onConfirmClick(): void {
    this._dialogRef.close(true);
  }

  onCancelClick(): void {
    this._dialogRef.close(false);
  }
}
