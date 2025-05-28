import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { BasicAccount } from '../../../../../core/entities/account/account-dto';
import { Category } from '../../../../../core/entities/category/category';
import { BasicCard } from '../../../../../core/entities/credit-card/credit-card-dto';
import { Release } from '../../../../../core/entities/release/release';
import {
  MonthlyRelease,
  MonthlyReleasesByDay,
  ReleaseDetailsData,
  ReleaseFormDialogData,
} from '../../../../../core/entities/release/release-dto';
import { ResponsiveService } from '../../../../../shared/utils/responsive.service';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { ReleaseDetailsComponent } from '../../views/details/release-details.component';
import { ReleaseItemComponent } from './release-item/release-item.component';

@Component({
  selector: 'app-releases-list',
  imports: [CommonModule, ReleaseItemComponent, ScrollingModule],
  templateUrl: './releases-list.component.html',
  styleUrl: './releases-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleasesListComponent {
  readonly smallWidth = this._responsiveService.smallWidth;
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  releases = input.required<MonthlyRelease[]>();
  accounts = input.required<BasicAccount[]>();
  categories = input.required<Category[]>();
  creditCards = input.required<BasicCard[]>();
  selectedDate = input.required<Date>();
  updateList = output<void>();

  releasesByDay = computed((): MonthlyReleasesByDay[] =>
    this.groupReleasesByDay(this.releases())
  );

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
      date: release.date as Date,
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

  trackByRelease(_: number, r: MonthlyRelease) {
    return r.id;
  }

  groupReleasesByDay(releases: MonthlyRelease[]): MonthlyReleasesByDay[] {
    const releasesByDay = new Map<string, MonthlyRelease[]>();

    // Group releases by day
    releases.forEach((release) => {
      // Format the date as dd/mm/yyyy
      const day = this.formatDate(release.date);
      if (!releasesByDay.has(day)) {
        releasesByDay.set(day, []);
      }
      releasesByDay.get(day)?.push(release);
    });

    // Convert map to array and calculate total amounts
    const result: MonthlyReleasesByDay[] = [];
    releasesByDay.forEach((dayReleases, day) => {
      result.push({
        day,
        releases: dayReleases,
      });
    });

    // Sort by date (convert back to Date objects for comparison)
    return result.sort((a, b) => {
      const [dayA, monthA, yearA] = a.day.split('/').map(Number);
      const [dayB, monthB, yearB] = b.day.split('/').map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateA.getTime() - dateB.getTime();
    });
  }

  formatDate(dateString: string | Date): string {
    return moment(dateString).format('DD/MM/YYYY');
  }
}
