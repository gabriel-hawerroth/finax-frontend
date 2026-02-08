import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../../../core/entities/auth/login.service';
import { ButtonsComponent } from '../../../../shared/components/buttons/buttons.component';
import { EmailResendTimerUI } from '../../../../shared/services/email-resend-timer-ui';
import {
  EmailResendTimerService,
  ResendEmailFlowType,
} from '../../../../shared/services/email-resend-timer.service';
import {
  cloudFireCdnImgsLink,
  getBtnStyle,
} from '../../../../shared/utils/utils';
import { UtilsService } from '../../../../shared/utils/utils.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    NgOptimizedImage,
    MatProgressSpinnerModule,
    TranslateModule,
    RouterModule,
    ButtonsComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage implements OnInit, OnDestroy {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly getBtnStyle = getBtnStyle;

  showLoading = signal(false);
  readonly isViewReady = signal(false);

  emailControl!: FormControl;
  emailSent = signal(false);

  readonly timerUI: EmailResendTimerUI;
  private sentEmail?: string;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _loginService: LoginService,
    private readonly _matSnackBar: MatSnackBar,
    private readonly _translate: TranslateService,
    _timerService: EmailResendTimerService
  ) {
    this.timerUI = new EmailResendTimerUI(
      _timerService,
      ResendEmailFlowType.FORGOT_PASSWORD
    );

    // Check timer state synchronously in constructor to prevent
    // flash of form view on page reload when email was already sent
    const existingEmail = this.timerUI.checkExistingState();
    if (existingEmail) {
      this.emailSent.set(true);
      this.sentEmail = existingEmail;
    }

    this.isViewReady.set(true);
  }

  ngOnInit(): void {
    this.emailControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);
    if (this.emailSent()) {
      this.timerUI.updateUI();
      this.timerUI.startInterval();
    }
  }

  ngOnDestroy(): void {
    this.timerUI.destroy();
  }

  sendChangePasswordEmail() {
    this.showLoading.set(true);
    const email: string = this.emailControl.value;
    this.sentEmail = email;

    this._loginService
      .sendChangePasswordEmail(email)
      .then(() => {
        this.emailSent.set(true);
        this._matSnackBar.open(
          `${this._translate.instant(
            'forgot-password.sended-recovery-link'
          )}: ${email}`,
          'OK'
        );
        this.timerUI.startNewTimer(email);
      })
      .catch((err) => {
        const error = err.error.errorDescription;

        switch (error) {
          case 'invalid email':
            this._utils.showMessage('generic.invalid-mail', 6000);
            break;
          case 'entity not found':
            this._utils.showMessage("forgot-password.user-doesn't-exist", 4000);
            break;
          case 'error sending email':
            this._utils.showMessage(
              'forgot-password.error-sending-email',
              4500
            );
            break;
          default:
            this._utils.showMessage("forgot-password.user-doesn't-exist", 4000);
        }
      })
      .finally(() => this.showLoading.set(false));
  }

  resendPasswordResetEmail(): void {
    if (!this.timerUI.canResend() || !this.sentEmail) return;

    this.showLoading.set(true);

    this._loginService
      .sendChangePasswordEmail(this.sentEmail)
      .then(() => {
        this.timerUI.onResendSuccess();
        this._utils.showMessage('forgot-password.email-resent-successfully');
      })
      .catch(() => {
        this._utils.showMessage('forgot-password.error-resending-email');
      })
      .finally(() => this.showLoading.set(false));
  }
}
