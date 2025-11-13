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
  FormGroup,
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
import {
  cloudFireCdnImgsLink,
  getBtnStyle,
} from '../../../../shared/utils/utils';
import { UtilsService } from '../../../../shared/utils/utils.service';
import {
  EmailResendTimerService,
  ResendEmailFlowType,
} from '../../../../shared/services/email-resend-timer.service';

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

  originalFormValue!: FormGroup;
  showLoading = signal(false);

  emailControl!: FormControl;
  emailSent = signal(false);

  // Resend timer signals
  resendAvailable = signal(false);
  remainingTime = signal(0);
  isBlocked = signal(false);
  resendAttempts = signal(0);

  private timerInterval?: ReturnType<typeof setInterval>;
  private sentEmail?: string;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _loginService: LoginService,
    private readonly _matSnackBar: MatSnackBar,
    private readonly _translate: TranslateService,
    private readonly _timerService: EmailResendTimerService
  ) {}

  ngOnInit(): void {
    this.emailControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);
    this.checkExistingTimerState();
  }

  ngOnDestroy(): void {
    this.clearTimerInterval();
  }

  private checkExistingTimerState(): void {
    const state = this._timerService.getTimerState();
    if (
      state &&
      state.flowType === ResendEmailFlowType.FORGOT_PASSWORD
    ) {
      // Restore UI state if timer exists
      this.emailSent.set(true);
      this.sentEmail = state.email;
      this.updateTimerUI();
      this.startTimerInterval();
    }
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
        // Start the resend timer
        this._timerService.startTimer(
          email,
          ResendEmailFlowType.FORGOT_PASSWORD
        );
        this.updateTimerUI();
        this.startTimerInterval();
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
    if (!this._timerService.canResend() || !this.sentEmail) return;

    this.showLoading.set(true);

    this._loginService
      .sendChangePasswordEmail(this.sentEmail)
      .then(() => {
        this._timerService.incrementAttempt();
        this.updateTimerUI();
        this._utils.showMessage('forgot-password.email-resent-successfully');
      })
      .catch((err) => {
        this._utils.showMessage('forgot-password.error-resending-email');
      })
      .finally(() => this.showLoading.set(false));
  }

  private startTimerInterval(): void {
    this.clearTimerInterval();

    this.timerInterval = setInterval(() => {
      this.updateTimerUI();
    }, 1000);
  }

  private clearTimerInterval(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  private updateTimerUI(): void {
    const state = this._timerService.getTimerState();
    if (!state) {
      this.resendAvailable.set(false);
      this.remainingTime.set(0);
      this.isBlocked.set(false);
      this.resendAttempts.set(0);
      return;
    }

    const remaining = this._timerService.getRemainingTime();
    const canResend = this._timerService.canResend();
    const blocked = this._timerService.isBlocked();

    this.remainingTime.set(remaining);
    this.resendAvailable.set(canResend);
    this.isBlocked.set(blocked);
    this.resendAttempts.set(state.attemptCount);

    // Clear interval if no longer needed
    if (remaining === 0 && !blocked) {
      this.clearTimerInterval();
    }
  }

  formatTime(seconds: number): string {
    if (seconds >= 3600) {
      // Show hours and minutes for 1-hour block
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    } else {
      // Show minutes and seconds for shorter waits
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }
}
