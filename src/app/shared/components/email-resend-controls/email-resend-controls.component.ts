import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EmailResendTimerUI } from '../../services/email-resend-timer-ui';
import { getBtnStyle } from '../../utils/utils';
import { ButtonsComponent } from '../buttons/buttons.component';

@Component({
  selector: 'app-email-resend-controls',
  imports: [TranslateModule, ButtonsComponent],
  templateUrl: './email-resend-controls.component.html',
  styleUrl: './email-resend-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailResendControlsComponent {
  readonly getBtnStyle = getBtnStyle;

  readonly timerUI = input.required<EmailResendTimerUI>();
  readonly showLoading = input.required<boolean>();

  readonly resend = output<void>();
}
