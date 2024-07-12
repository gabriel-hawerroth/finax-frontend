import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { AccountBasicList } from '../../../../../core/entities/account/account-dto';
import {
  MonthlyRelease,
  ReleaseDetailsData,
  ReleaseFormDialogData,
} from '../../../../../core/entities/release/release-dto';
import { Category } from '../../../../../core/entities/category/category';
import { CardBasicList } from '../../../../../core/entities/credit-card/credit-card-dto';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/constant-utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { ReleaseDetailsComponent } from '../../views/details/release-details.component';

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

  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  constructor(
    public readonly utils: UtilsService,
    private readonly _bottomSheet: MatBottomSheet,
    private readonly _matDialog: MatDialog
  ) {}

  openDetails(cashFlow: MonthlyRelease) {
    lastValueFrom(
      this._bottomSheet
        .open(ReleaseDetailsComponent, {
          data: <ReleaseDetailsData>{
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
    this.utils
      .openReleaseFormDialog(<ReleaseFormDialogData>{
        accounts: this.accounts(),
        categories: this.categories(),
        creditCards: this.creditCards(),
        editing: true,
        releaseType: release.type,
        selectedDate: this.selectedDate(),
        release: release,
      })
      .then((response) => {
        if (!response) return;

        this.updateList.emit();
      });
  }
}
