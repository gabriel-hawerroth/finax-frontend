import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmDuplicatedReleasesActionDialogData } from '../../../../../core/entities/release/release-dto';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-confirm-duplicated-releases-action',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
  templateUrl: './confirm-duplicated-releases-action.component.html',
  styleUrl: './confirm-duplicated-releases-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDuplicatedReleasesActionDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ConfirmDuplicatedReleasesActionDialogData,
    public readonly utils: UtilsService
  ) {}
}
