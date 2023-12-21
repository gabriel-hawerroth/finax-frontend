import { Component, inject } from '@angular/core';
import { UtilsService } from '../../../../../utils/utils.service';
import { CommonModule } from '@angular/common';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MonthlyCashFlow } from '../../../../../interfaces/CashFlow';
import { CustomCurrencyPipe } from '../../../../../utils/customCurrencyPipe';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CashFlowService } from '../../../../../services/cash-flow.service';

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
  private _bottomSheet = inject(MatBottomSheetRef);
  private _cashFlowService = inject(CashFlowService);

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  release: MonthlyCashFlow = this.data.cashFlow;

  confirmDelete: boolean = false;
  excluding: boolean = false;

  edit() {
    this._bottomSheet.dismiss('edit');
  }

  delete() {
    this.excluding = true;
    this.confirmDelete = false;

    this._cashFlowService
      .delete(this.release.id)
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
