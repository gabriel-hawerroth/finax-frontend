import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  WritableSignal,
  inject,
} from '@angular/core';
import { MonthlyRelease } from '../../../../../interfaces/cash-flow';
import { lastValueFrom } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ReleaseDetailsComponent } from '../release-details/release-details.component';
import { MatDialog } from '@angular/material/dialog';
import { ReleaseFormDialogComponent } from '../../../../dialogs/release-form-dialog/release-form-dialog.component';
import { AccountBasicList } from '../../../../../interfaces/account';
import { Category } from '../../../../../interfaces/category';
import { CardBasicList } from '../../../../../interfaces/credit-card';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CustomCurrencyPipe } from '../../../../../utils/customCurrencyPipe';

@Component({
  selector: 'app-releases-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, CustomCurrencyPipe],
  templateUrl: './releases-list.component.html',
  styleUrl: './releases-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleasesListComponent {
  @Input() releases!: WritableSignal<MonthlyRelease[]>;
  @Input() accounts!: AccountBasicList[];
  @Input() categories!: Category[];
  @Input() creditCards!: CardBasicList[];
  @Input() selectedDate!: Date;

  @Output() updateList = new EventEmitter();

  private _bottomSheet = inject(MatBottomSheet);
  private _matDialog = inject(MatDialog);

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
      else if (response === 'delete') this.updateList.emit('');
    });
  }

  editRelease(release: MonthlyRelease) {
    lastValueFrom(
      this._matDialog
        .open(ReleaseFormDialogComponent, {
          data: {
            accounts: this.accounts,
            categories: this.categories,
            creditCards: this.creditCards,
            editing: true,
            releaseType: release.type,
            selectedDate: this.selectedDate,
            release: release,
          },
          panelClass: 'new-release-cash-flow-dialog',
          autoFocus: false,
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;

      this.updateList.emit('');
    });
  }
}
