import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReleaseFormDialogData } from '../../../core/entities/release/release-dto';
import { ReleaseType } from '../../../core/enums/release-enums';
import { releaseCreatedEvent } from '../../../core/events/events';
import { SpeedDialService } from '../../services/speed-dial.service';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-speed-dial',
  imports: [RouterModule, TranslateModule],
  templateUrl: './speed-dial.component.html',
  styleUrl: './speed-dial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeedDialComponent {
  isOpen = signal(false);

  constructor(
    private readonly _speedDialService: SpeedDialService,
    private readonly _utils: UtilsService
  ) {}

  toggle() {
    this.isOpen.set(!this.isOpen());
  }

  options = [
    {
      color: '#00ff88',
      icon: 'trending_up',
      label: 'generic.revenue',
      onClick: () => this.addRelease(ReleaseType.REVENUE),
    },
    {
      id: 'center',
      color: '#44aaff',
      icon: 'south_west',
      label: 'generic.transfer',
      onClick: () => this.addRelease(ReleaseType.TRANSFER),
    },
    {
      color: '#ff4455',
      icon: 'trending_down',
      label: 'generic.expense',
      onClick: () => this.addRelease(ReleaseType.EXPENSE),
    },
  ];

  addRelease(releaseType: ReleaseType) {
    this.isOpen.set(false);

    this._utils
      .openReleaseFormDialog(<ReleaseFormDialogData>{
        accounts: this._speedDialService.accounts,
        categories: this._speedDialService.categories,
        creditCards: this._speedDialService.creditCards,
        editing: false,
        releaseType: releaseType,
        selectedDate: new Date(),
      })
      .then((response) => {
        if (!response) return;
        releaseCreatedEvent.next();
      });
  }

  capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
