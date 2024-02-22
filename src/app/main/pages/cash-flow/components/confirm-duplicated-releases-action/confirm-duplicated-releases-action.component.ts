import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UtilsService } from '../../../../../utils/utils.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-duplicated-releases-action',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
  templateUrl: './confirm-duplicated-releases-action.component.html',
  styleUrl: './confirm-duplicated-releases-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDuplicatedReleasesActionComponent {
  public utilsService = inject(UtilsService);
  public data = inject(MAT_DIALOG_DATA);
  private _translate = inject(TranslateService);

  constructor() {
    this._translate.use(this.utilsService.getUserConfigs.language);
  }
}
