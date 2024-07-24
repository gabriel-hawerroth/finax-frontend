import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { getBtnStyle } from '../../utils/constant-utils';
import { UtilsService } from '../../utils/utils.service';
import { StyledButtonComponent } from './styled-button/styled-button.component';
import { ButtonType } from '../../../core/enums/button-style';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [CommonModule, StyledButtonComponent],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonsComponent {
  getBtnStyle = getBtnStyle;

  readonly onNew = output<void>();
  readonly onSave = output<void>();
  readonly onDelete = output<void>();
  readonly onEdit = output<void>();
  readonly onCancel = output<void>();
  readonly onDownload = output<void>();
  readonly onClose = output<void>();
  readonly onGoBack = output<void>();
  readonly onChangePassword = output<void>();
  readonly onGeneric = output<void>();

  readonly showNew = input<boolean>(false);
  readonly showSave = input<boolean>(false);
  readonly showDelete = input<boolean>(false);
  readonly showEdit = input<boolean>(false);
  readonly showCancel = input<boolean>(false);
  readonly showDownload = input<boolean>(false);
  readonly showClose = input<boolean>(false);
  readonly showGoBack = input<boolean>(false);
  readonly showChangePassword = input<boolean>(false);
  readonly showGeneric = input<boolean>(false);

  readonly disableNew = input<boolean>(false);
  readonly disableSave = input<boolean>(false);
  readonly disableDelete = input<boolean>(false);
  readonly disableEdit = input<boolean>(false);
  readonly disableCancel = input<boolean>(false);
  readonly disableDownload = input<boolean>(false);
  readonly disableChangePassword = input<boolean>(false);
  readonly disableGeneric = input<boolean>(false);

  readonly showLoading = input<boolean>(false);

  readonly labelNewM = input<boolean>(false);

  readonly genericStyle = input<ButtonType>();
  readonly genericIcon = input<string>('');
  readonly genericLabel = input<string>('');

  readonly btnStyle = input<{}>();
  readonly contentStyle = input<{}>();

  readonly darkThemeEnabled = signal(false);

  constructor() {
    inject(UtilsService)
      .getUserConfigsObservable()
      .subscribe((configs) => {
        this.darkThemeEnabled.set(configs.theme === 'dark');
      });
  }
}
