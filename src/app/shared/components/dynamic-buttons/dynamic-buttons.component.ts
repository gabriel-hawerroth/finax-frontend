import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppButtonsConfig } from '../../../core/interfaces/button-config';
import { DynamicButtonComponent } from './dynamic-button/dynamic-button.component';

@Component({
  selector: 'dynamic-buttons',
  standalone: true,
  imports: [CommonModule, DynamicButtonComponent],
  templateUrl: './dynamic-buttons.component.html',
  styleUrl: './dynamic-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicButtonsComponent {
  config = input.required<AppButtonsConfig>();
}
