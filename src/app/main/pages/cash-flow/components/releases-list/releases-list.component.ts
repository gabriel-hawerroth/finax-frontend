import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { AccountBasicList } from '../../../../../interfaces/account';
import { MonthlyRelease } from '../../../../../interfaces/cash-flow';
import { Category } from '../../../../../interfaces/category';
import { CardBasicList } from '../../../../../interfaces/credit-card';
import { ReleaseFormDialogComponent } from '../../../../../shared/components/release-form-dialog/release-form-dialog.component';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { cloudFireCdnImgsLink } from '../../../../../utils/constants';
import { UtilsService } from '../../../../../utils/utils.service';
import { ReleaseDetailsComponent } from '../release-details/release-details.component';

@Component({
  selector: 'app-releases-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CustomCurrencyPipe,
    NgOptimizedImage,
  ],
  templateUrl: './releases-list.component.html',
  styleUrl: './releases-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleasesListComponent {
  public releases = input.required<MonthlyRelease[]>();
  public accounts = input.required<AccountBasicList[]>();
  public categories = input.required<Category[]>();
  public creditCards = input.required<CardBasicList[]>();
  public selectedDate = input.required<Date>();
  public updateList = output<void>();

  public utilsService = inject(UtilsService);
  private _bottomSheet = inject(MatBottomSheet);
  private _matDialog = inject(MatDialog);

  cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  openDetails(cashFlow: MonthlyRelease) {
    lastValueFrom(
      this._bottomSheet
        .open(ReleaseDetailsComponent, {
          data: {
            cashFlow: cashFlow,
          },
          panelClass: 'release-details',
        })
        .afterDismissed()
    ).then((response) => {
      if (!response) return;

      if (response === 'edit') this.editRelease(cashFlow);
      else if (response === 'delete') this.updateList.emit();
    });
  }

  editRelease(release: MonthlyRelease) {
    lastValueFrom(
      this._matDialog
        .open(ReleaseFormDialogComponent, {
          data: {
            accounts: this.accounts(),
            categories: this.categories(),
            creditCards: this.creditCards(),
            editing: true,
            releaseType: release.type,
            selectedDate: this.selectedDate(),
            release: release,
          },
          panelClass: 'new-release-cash-flow-dialog',
          autoFocus: false,
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;

      this.updateList.emit();
    });
  }
}
