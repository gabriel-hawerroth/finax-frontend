import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppButtonsConfig } from '../../../core/interfaces/button-config';
import { CommonModule } from '@angular/common';
import { AppButtonComponent } from './app-button/app-button.component';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [CommonModule, AppButtonComponent],
  templateUrl: './app-buttons.component.html',
  styleUrl: './app-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppButtonsComponent {
  config = input.required<AppButtonsConfig>();
}
