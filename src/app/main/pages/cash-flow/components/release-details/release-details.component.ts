import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UtilsService } from '../../../../../utils/utils.service';
import { CommonModule } from '@angular/common';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { CustomCurrencyPipe } from '../../../../../utils/customCurrencyPipe';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CashFlowService } from '../../../../../services/cash-flow.service';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { ConfirmDuplicatedReleasesActionComponent } from '../confirm-duplicated-releases-action/confirm-duplicated-releases-action.component';
import { ButtonsComponent } from '../../../../../utils/buttons/buttons.component';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { DuplicatedReleaseAction } from '../../../../../enums/duplicated-release-action';
import { MonthlyRelease } from '../../../../../interfaces/cash-flow';
import { Router } from '@angular/router';

@Component({
  selector: 'app-release-details',
  standalone: true,
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
  public utilsService = inject(UtilsService);
  public data = inject(MAT_BOTTOM_SHEET_DATA);
  private _cashFlowService = inject(CashFlowService);
  private _bottomSheet = inject(MatBottomSheetRef);
  private _matDialog = inject(MatDialog);
  private _router = inject(Router);

  currency = this.utilsService.getUserConfigs.currency;

  release: MonthlyRelease = this.data.cashFlow;

  confirmDelete: boolean = false;
  excluding: boolean = false;

  downloadAttachment() {
    this._cashFlowService.getAttachment(this.release.id).then((response) => {
      if (response.size === 0) {
        this.utilsService.showMessage('cash-flow.attachment-not-found');
        return;
      }

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
    });
  }

  getMimeTypeFromExtension(filename: string): string {
    const ext = filename.split('.').pop()!.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
      case 'jpeg':
      case 'jfif':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      default:
        return 'application/octet-stream';
    }
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
          .open(ConfirmDuplicatedReleasesActionComponent, {
            data: {
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
      await lastValueFrom(
        this._matDialog
          .open(ConfirmationDialogComponent, {
            data: {
              message: 'cash-flow.confirm-delete',
            },
            autoFocus: false,
          })
          .afterClosed()
      ).then((response) => {
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
      .delete(this.release.id, duplicatedReleasesAction)
      .then(() => {
        this._bottomSheet.dismiss('delete');
        this.utilsService.showMessage('cash-flow.deleted-successfully');
      })
      .catch(() => {
        this.utilsService.showMessage('cash-flow.delete-error');
      })
      .finally(() => {
        this.confirmDelete = false;
        this.excluding = false;
      });
  }

  seeInvoice() {
    this._bottomSheet.dismiss();
    this._router.navigate([
      `cartoes-de-credito/fatura/${this.release.accountId}`,
    ]);
  }
}
