import { Component, inject } from '@angular/core';
import { UtilsService } from '../../../../../utils/utils.service';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-duplicated-releases-action',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-duplicated-releases-action.component.html',
  styleUrl: './confirm-duplicated-releases-action.component.scss',
})
export class ConfirmDuplicatedReleasesActionComponent {
  public utilsService = inject(UtilsService);
  public data = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject(MatDialogRef);

  language = this.utilsService.getUserConfigs.language;

  close(action: 'just-this' | 'nexts' | 'all') {
    this._dialogRef.close(action);
  }
}
