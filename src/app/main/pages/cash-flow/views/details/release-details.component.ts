import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import {
  ConfirmDuplicatedReleasesActionDialogData,
  MonthlyRelease,
  ReleaseDetailsData,
} from '../../../../../core/entities/release/release-dto';
import { ReleaseService } from '../../../../../core/entities/release/release.service';
import { DuplicatedReleaseAction } from '../../../../../core/enums/duplicated-release-action';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { ConfirmDuplicatedReleasesActionDialog } from '../../components/confirm-duplicated-releases-action/confirm-duplicated-releases-action.component';

@Component({
  selector: 'app-release-details',
  imports: [
    CommonModule,
    CustomCurrencyPipe,
    MatButtonModule,
    MatProgressSpinnerModule,
    ButtonsComponent,
    TranslateModule,
  ],
  templateUrl: './release-details.component.html',
  styleUrl: './release-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseDetailsComponent {
  readonly currency = this._utils.getUserConfigs.currency;

  release: MonthlyRelease;

  confirmDelete: boolean = false;
  excluding: boolean = false;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _bottomSheet: MatBottomSheetRef,
    private readonly _matDialog: MatDialog,
    private readonly _cashFlowService: ReleaseService
  ) {
    const data: ReleaseDetailsData = inject(MAT_BOTTOM_SHEET_DATA);
    this.release = data.release;
  }

  downloadAttachment() {
    this._cashFlowService
      .getAttachment(this.release.id!)
      .then((response) => {
        if (response.size === 0) throw new Error('Attachment not found');

        const blob = new Blob([response], {
          type: response.type,
        });

        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = this.release.attachmentName!;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);
      })
      .catch(() => {
        this._utils.showMessage('generic.attachment-not-found');
      });
  }

  edit() {
    this._bottomSheet.dismiss('edit');
  }

  async delete() {
    let duplicatedReleasesAction: DuplicatedReleaseAction =
      DuplicatedReleaseAction.UNNECESSARY;
    let confirmedDelete: boolean = false;

    if (this.release.isDuplicatedRelease) {
      await lastValueFrom(
        this._matDialog
          .open(ConfirmDuplicatedReleasesActionDialog, {
            data: <ConfirmDuplicatedReleasesActionDialogData>{
              action: 'delete',
            },
            autoFocus: false,
            panelClass: 'confirm-duplicated-releases-action',
          })
          .afterClosed()
      ).then((response: DuplicatedReleaseAction) => {
        if (!response) return;

        duplicatedReleasesAction = response;
        confirmedDelete = true;
      });
    } else {
      await this._utils
        .showConfirmDialog('cash-flow.confirm-delete')
        .then((response) => {
          if (!response) return;

          confirmedDelete = response;
        });
    }

    if (
      this.release.isDuplicatedRelease &&
      duplicatedReleasesAction === DuplicatedReleaseAction.UNNECESSARY
    )
      return;
    else if (!confirmedDelete) return;

    this.excluding = true;
    this.confirmDelete = false;

    this._cashFlowService
      .delete(this.release.id!, duplicatedReleasesAction)
      .then(() => {
        this._bottomSheet.dismiss('delete');
        this._utils.showMessage('cash-flow.deleted-successfully');
      })
      .catch(() => {
        this._utils.showMessage('cash-flow.delete-error');
      })
      .finally(() => {
        this.confirmDelete = false;
        this.excluding = false;
      });
  }
}
