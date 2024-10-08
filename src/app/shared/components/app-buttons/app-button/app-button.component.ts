import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ButtonConfig } from '../../../../core/interfaces/button-config';
import { getBtnStyle } from '../../../utils/utils';
import { CommonModule } from '@angular/common';
import { BtnContentComponent } from '../../btn-content/btn-content.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonType } from '../../../../core/enums/button-style';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    CommonModule,
    BtnContentComponent,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppButtonComponent implements OnInit {
  config = input.required<ButtonConfig>();

  getBtnStyle = getBtnStyle;

  get getIconBtnStyle() {
    return {
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      ...this.config()?.style,
    };
  }

  readonly darkThemeEnabled = signal(false);

  constructor(private readonly _utils: UtilsService) {}

  ngOnInit(): void {
    this._utils.getUserConfigsObservable().subscribe((configs) => {
      this.darkThemeEnabled.set(configs.theme === 'dark');
    });

    if (this.config().type === undefined) {
      this.config().type = this.darkThemeEnabled()
        ? ButtonType.STROKED
        : ButtonType.RAISED;
    }
  }
}
