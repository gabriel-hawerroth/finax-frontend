import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonType } from '../../../../core/enums/button-style';
import { BtnContentComponent } from './btn-content/btn-content.component';
import { getBtnStyle } from '../../../utils/utils';

@Component({
  selector: 'styled-button',
  standalone: true,
  imports: [
    CommonModule,
    BtnContentComponent,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './styled-button.component.html',
  styleUrl: './styled-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StyledButtonComponent {
  onClick = output<void>();

  btnType = input.required<ButtonType>();
  label = input.required<string>();
  icon = input.required<string>();
  disabled = input<boolean>();
  loading = input<boolean>();
  btnStyle = input<{}>();
  contentStyle = input<{}>();

  getMatButtonClass(): string {
    switch (this.btnType()) {
      case getBtnStyle('raised'):
        return 'mat-raised-button';
      case getBtnStyle('stroked'):
        return 'mat-stroked-button';
      case getBtnStyle('flat'):
        return 'mat-flat-button';
      case getBtnStyle('icon'):
        return 'mat-icon-button';
      case getBtnStyle('fab'):
      case getBtnStyle('extended-fab'):
      case getBtnStyle('mini-fab'):
        return 'mat-fab';
      default:
        return 'mat-button';
    }
  }

  isIconButton(): boolean {
    return this.btnType() === getBtnStyle('icon');
  }

  public get getIconBtnStyle() {
    return {
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      ...this.btnStyle(),
    };
  }
}
