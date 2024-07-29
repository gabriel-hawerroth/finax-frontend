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
import { getBtnStyle } from '../../../utils/utils';
import { BtnContentComponent } from './btn-content/btn-content.component';

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
  getBtnStyle = getBtnStyle;

  onClick = output<void>();
  btnType = input.required<ButtonType>();

  label = input.required<string>();
  icon = input.required<string>();
  disabled = input<boolean>();
  loading = input<boolean>();
  btnStyle = input<{}>();
  contentStyle = input<{}>();
}
