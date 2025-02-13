import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonType } from '../../../../core/enums/button-style';
import {
  ButtonConfig,
  ButtonPreConfig,
} from '../../../../core/interfaces/button-config';
import { getBtnStyle } from '../../../utils/utils';
import { UtilsService } from '../../../utils/utils.service';
import { BtnContentComponent } from '../../btn-content/btn-content.component';

@Component({
  selector: 'dynamic-button',
  imports: [
    CommonModule,
    BtnContentComponent,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dynamic-button.component.html',
  styleUrl: './dynamic-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicButtonComponent implements OnInit {
  config = input.required<ButtonConfig>();

  getBtnStyle = getBtnStyle;

  readonly darkThemeEnabled = signal(this._utils.darkThemeEnable);

  constructor(private readonly _utils: UtilsService) {}

  ngOnInit(): void {
    if (this.config().type === undefined) {
      this.config().type = this.darkThemeEnabled()
        ? ButtonType.STROKED
        : ButtonType.RAISED;
    }

    if (this.config().preConfig !== undefined) {
      this.handleButtonPreConfig();
    }
  }

  private handleButtonPreConfig() {
    switch (this.config().preConfig) {
      case ButtonPreConfig.NEW:
        this.config().icon = 'add';
        this.config().label =
          this.config().gen === 'M' ? 'buttons.newM' : 'buttons.new';
        break;
      case ButtonPreConfig.SAVE:
        this.config().icon = 'save';
        this.config().label = 'actions.save';
        break;
      case ButtonPreConfig.DELETE:
        this.config().icon = 'delete';
        this.config().label = 'actions.exclude';
        this.config().contentStyle = {
          ...this.config().contentStyle,
          color: this.config().disabled || this.darkThemeEnabled() ? '' : 'red',
        };
        break;
      case ButtonPreConfig.EDIT:
        this.config().icon = 'edit';
        this.config().label = 'actions.edit';
        break;
      case ButtonPreConfig.CANCEL:
        this.config().icon = undefined;
        this.config().label = 'confirm-dialog.cancel';
        this.config().type = ButtonType.BASIC;
        break;
      case ButtonPreConfig.DOWNLOAD:
        this.config().icon = 'cloud_download';
        this.config().label = 'buttons.download-attachment';
        this.config().contentStyle = {
          ...this.config().contentStyle,
          color: '#585858',
        };
        break;
      case ButtonPreConfig.CLOSE:
        this.config().icon = 'close';
        this.config().label = '';
        this.config().type = ButtonType.ICON;
        break;
      case ButtonPreConfig.GO_BACK:
        this.config().icon = 'arrow_back';
        this.config().label = '';
        this.config().type = ButtonType.ICON;
        break;
      case ButtonPreConfig.CHANGE_PASSWORD:
        this.config().icon = 'vpn_key';
        this.config().label = 'buttons.change-password';
        break;
    }
  }

  get getIconBtnStyle() {
    return {
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      ...this.config()?.style,
    };
  }
}
