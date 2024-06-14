import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import {
  ConfirmDuplicatedReleasesActionDialogData,
  MonthlyRelease,
  ReleaseDetailsData,
} from '../../../../../core/entities/cash-flow/cash-flow-dto';
import { CashFlowService } from '../../../../../core/entities/cash-flow/cash-flow.service';
import { DuplicatedReleaseAction } from '../../../../../core/enums/duplicated-release-action';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { ConfirmDuplicatedReleasesActionDialog } from '../../components/confirm-duplicated-releases-action/confirm-duplicated-releases-action.component';

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
  currency = this.utils.getUserConfigs.currency;

  release: MonthlyRelease = this.data.cashFlow;

  confirmDelete: boolean = false;
  excluding: boolean = false;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ReleaseDetailsData,
    public readonly utils: UtilsService,
    private readonly _bottomSheet: MatBottomSheetRef,
    private readonly _matDialog: MatDialog,
    private readonly _router: Router,
    private readonly _cashFlowService: CashFlowService
  ) {}

  downloadAttachment() {
    this._cashFlowService.getAttachment(this.release.id).then((response) => {
      console.log(response);
      
      if (response.size === 0) {
        this.utils.showMessage('generic.attachment-not-found');
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
      await this.utils
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
      .delete(this.release.id, duplicatedReleasesAction)
      .then(() => {
        this._bottomSheet.dismiss('delete');
        this.utils.showMessage('cash-flow.deleted-successfully');
      })
      .catch(() => {
        this.utils.showMessage('cash-flow.delete-error');
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
