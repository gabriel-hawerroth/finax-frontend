import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonStyle } from '../../../../core/enums/button-style';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BtnContentComponent } from './btn-content/btn-content.component';
import { getBtnStyle } from '../../../utils/constant-utils';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'styled-button',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
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
  btnStyle = input.required<ButtonStyle>();

  label = input.required<string>();
  icon = input.required<string>();
  disabled = input.required<boolean>();
  btnSize = input<number>();
  color = input<string>();
  loading = input<boolean>();

  getBtnStyle = getBtnStyle;
}
