import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslateModule } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { BasicAccount } from '../../../../../core/entities/account/account-dto';
import { Category } from '../../../../../core/entities/category/category';
import { BasicCard } from '../../../../../core/entities/credit-card/credit-card-dto';
import { Release } from '../../../../../core/entities/release/release';
import {
  MonthlyRelease,
  ReleaseDetailsData,
  ReleaseFormDialogData,
} from '../../../../../core/entities/release/release-dto';
import { ReleaseType } from '../../../../../core/enums/release-enums';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { ResponsiveService } from '../../../../../shared/utils/responsive.service';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { ReleaseDetailsComponent } from '../../views/details/release-details.component';

@Component({
  selector: 'app-releases-list',
  imports: [CommonModule, TranslateModule, CustomCurrencyPipe],
  templateUrl: './releases-list.component.html',
  styleUrl: './releases-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleasesListComponent {
  readonly smallWidth = this._responsiveService.smallWidth;

  releases = input.required<MonthlyRelease[]>();
  accounts = input.required<BasicAccount[]>();
  categories = input.required<Category[]>();
  creditCards = input.required<BasicCard[]>();
  selectedDate = input.required<Date>();
  updateList = output<void>();

  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  readonly theme = this._utils.getUserConfigs.theme;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _bottomSheet: MatBottomSheet,
    private readonly _responsiveService: ResponsiveService
  ) {}

  openDetails(release: MonthlyRelease) {
    lastValueFrom(
      this._bottomSheet
        .open(ReleaseDetailsComponent, {
          data: <ReleaseDetailsData>{
            release,
            isDuplicatedRelease: release.isDuplicatedRelease,
          },
          panelClass: 'release-details',
        })
        .afterDismissed()
    ).then((response) => {
      if (!response) return;

      if (response === 'edit') this.editRelease(release);
      else if (response === 'delete') this.updateList.emit();
    });
  }

  editRelease(release: MonthlyRelease) {
    this._utils
      .openReleaseFormDialog(<ReleaseFormDialogData>{
        accounts: this.accounts(),
        categories: this.categories(),
        creditCards: this.creditCards(),
        editing: true,
        releaseType: release.type,
        selectedDate: this.selectedDate(),
        release: this.mapToRelease(release),
        isDuplicatedRelease: release.isDuplicatedRelease,
      })
      .then((response) => {
        if (!response) return;

        this.updateList.emit();
      });
  }

  mapToRelease(release: MonthlyRelease): Release {
    return {
      id: release.id,
      userId: release.userId,
      description: release.description,
      accountId: release.account?.id || release.card!.id,
      amount: release.amount,
      type: release.type,
      done: release.done,
      targetAccountId: release.targetAccount?.id,
      categoryId: release.category?.id,
      date: release.date,
      time: release.time,
      observation: release.observation,
      attachment: undefined,
      attachmentName: release.attachmentName,
      duplicatedReleaseId: release.duplicatedReleaseId,
      repeat: undefined,
      fixedBy: undefined,
      creditCardId: release.card?.id,
      isBalanceAdjustment: release.isBalanceAdjustment,
    };
  }

  isTransfer(release: MonthlyRelease): boolean {
    return release.type === ReleaseType.TRANSFER;
  }
}
