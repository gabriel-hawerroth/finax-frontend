import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsService } from '../../utils/utils.service';
import { StyledButtonComponent } from './styled-button/styled-button.component';
import { getBtnStyle } from '../../utils/constant-utils';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslateModule,
    StyledButtonComponent,
  ],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonsComponent {
  readonly onNew = output<void>();
  readonly onSave = output<void>();
  readonly onDelete = output<void>();
  readonly onEdit = output<void>();
  readonly onDownload = output<void>();
  readonly onClose = output<void>();
  readonly onGoBack = output<void>();
  readonly onChangePassword = output<void>();
  readonly onGeneric = output<void>();

  readonly showNew = input<boolean>(false);
  readonly showSave = input<boolean>(false);
  readonly showDelete = input<boolean>(false);
  readonly showEdit = input<boolean>(false);
  readonly showDownload = input<boolean>(false);
  readonly showClose = input<boolean>(false);
  readonly showGoBack = input<boolean>(false);
  readonly showChangePassword = input<boolean>(false);
  readonly showGeneric = input<boolean>(false);

  readonly disableNew = input<boolean>(false);
  readonly disableSave = input<boolean>(false);
  readonly disableDelete = input<boolean>(false);
  readonly disableEdit = input<boolean>(false);
  readonly disableDownload = input<boolean>(false);
  readonly disableChangePassword = input<boolean>(false);
  readonly disableGeneric = input<boolean>(false);

  readonly showLoading = input<boolean>(false);

  readonly smallBtn = input<boolean>(false);
  readonly bigBtn = input<boolean>(false);

  readonly labelNewM = input<boolean>(false);

  readonly genericIcon = input<string>('');
  readonly genericLabel = input<string>('');
  readonly genericColor = input<string>('');

  readonly isPcScreen = this._utils.isPcScreen;

  readonly darkThemeEnabled = signal(false);

  getBtnStyle = getBtnStyle;

  constructor(private readonly _utils: UtilsService) {
    _utils.getUserConfigsObservable().subscribe((configs) => {
      this.darkThemeEnabled.set(configs.theme === 'dark');
    });
  }

  get getBtnSize(): number {
    if (this.smallBtn() && !this.bigBtn()) return 1.3;
    else if (this.bigBtn() && !this.smallBtn()) return 1.9;

    return 1.6;
  }
}
