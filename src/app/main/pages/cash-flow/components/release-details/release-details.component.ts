import { Component, inject } from '@angular/core';
import { UtilsService } from '../../../../../utils/utils.service';
import { CommonModule } from '@angular/common';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MonthlyCashFlow } from '../../../../../interfaces/CashFlow';
import { CustomCurrencyPipe } from '../../../../../utils/customCurrencyPipe';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CashFlowService } from '../../../../../services/cash-flow.service';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { ConfirmDuplicatedReleasesActionComponent } from '../confirm-duplicated-releases-action/confirm-duplicated-releases-action.component';

@Component({
  selector: 'app-release-details',
  standalone: true,
  imports: [
    CommonModule,
    CustomCurrencyPipe,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './release-details.component.html',
  styleUrl: './release-details.component.scss',
})
export class ReleaseDetailsComponent {
  public utilsService = inject(UtilsService);
  public data = inject(MAT_BOTTOM_SHEET_DATA);
  private _cashFlowService = inject(CashFlowService);
  private _bottomSheet = inject(MatBottomSheetRef);
  private _matDialog = inject(MatDialog);

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  release: MonthlyCashFlow = this.data.cashFlow;

  confirmDelete: boolean = false;
  excluding: boolean = false;

  downloadAttachment() {
    this._cashFlowService.getAttachment(this.release.id).then((response) => {
      if (response.size === 0) {
        this.utilsService.showSimpleMessage('Erro no arquivo, FFFF');
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
    let duplicatedReleasesAction: string = '';

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
      ).then((response: 'just-this' | 'nexts' | 'all') => {
        if (!response) return;

        duplicatedReleasesAction = response;
      });
    }

    if (this.release.isDuplicatedRelease && duplicatedReleasesAction === '')
      return;

    this.excluding = true;
    this.confirmDelete = false;

    this._cashFlowService
      .delete(this.release.id, duplicatedReleasesAction)
      .then((response) => {
        this._bottomSheet.dismiss('delete');
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Registro excluído com sucesso'
            : 'Record deleted successfully'
        );
      })
      .catch((err) => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao tentar excluir o registro'
            : 'Error trying to delete the record'
        );
      })
      .finally(() => {
        this.confirmDelete = false;
        this.excluding = false;
      });
  }
}
