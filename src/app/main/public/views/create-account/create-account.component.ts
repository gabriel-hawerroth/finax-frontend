import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../core/entities/auth/auth.service';
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
  selector: 'app-create-account',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterModule,
    NgOptimizedImage,
    TranslateModule,
    ButtonsComponent,
    MatCheckboxModule,
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountPage implements OnInit, OnDestroy {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly passwordRequirementsText = this._utils.passwordRequirementsText;
  readonly getBtnStyle = getBtnStyle;

  userRegisterForm!: FormGroup;
  showLoading = signal(false);

  accountCreated = signal(false);

  // Resend timer signals
  resendAvailable = signal(false);
  remainingTime = signal(0);
  isBlocked = signal(false);
  resendAttempts = signal(0);

  private timerInterval?: ReturnType<typeof setInterval>;
  private registeredEmail?: string;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _fb: FormBuilder,
    private readonly _authService: AuthService,
    private readonly _timerService: EmailResendTimerService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.checkExistingTimerState();
  }

  ngOnDestroy(): void {
    this.clearTimerInterval();
  }

  private checkExistingTimerState(): void {
    const state = this._timerService.getTimerState();
    if (
      state &&
      state.flowType === ResendEmailFlowType.CREATE_ACCOUNT
    ) {
      // Restore UI state if timer exists
      this.accountCreated.set(true);
      this.registeredEmail = state.email;
      this.updateTimerUI();
      this.startTimerInterval();
    }
  }

  buildForm() {
    this.userRegisterForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(this._utils.passwordValidator()),
        ],
      ],
      firstName: ['', Validators.required],
      lastName: '',
      useTerms: [false, Validators.requiredTrue],
    });
  }

  createUser() {
    if (!this.isValidForm()) return;

    this.showLoading.set(true);
    this.registeredEmail = this.userRegisterForm.value.email;

    this._authService
      .registerNewUser(this.userRegisterForm.value)
      .then(() => {
        this.accountCreated.set(true);
        // Start the resend timer
        this._timerService.startTimer(
          this.registeredEmail!,
          ResendEmailFlowType.CREATE_ACCOUNT
        );
        this.updateTimerUI();
        this.startTimerInterval();
      })
      .catch((err) => {
        if (err.error.errorDescription === 'this email is already in use')
          this._utils.showMessage(
            'create-account.email-already-registered',
            5000
          );
        else if (err.error.errorDescription === 'invalid email')
          this._utils.showMessage('generic.invalid-mail', 6000);
        else
          this._utils.showMessage('create-account.error-creating-user', 4000);
      })
      .finally(() => this.showLoading.set(false));
  }

  isValidForm(): boolean {
    if (this.userRegisterForm.get('password')!.invalid) {
      this.userRegisterForm.controls['password'].markAsTouched();
      this._utils.showMessage(
        "generic.password-doesn't-meet-security-requirements"
      );
      return false;
    } else if (this.userRegisterForm.get('useTerms')!.invalid) {
      this.userRegisterForm.controls['useTerms'].markAsTouched();
      this._utils.showMessage('create-account.accept-terms');
      return false;
    } else if (this.userRegisterForm.invalid) {
      this.userRegisterForm.markAllAsTouched();
      this._utils.showMessage('generic.invalid-form');
      return false;
    }

    return true;
  }

  resendConfirmationEmail(): void {
    if (!this._timerService.canResend() || !this.registeredEmail) return;

    this.showLoading.set(true);

    this._authService
      .resendActivationEmail(this.registeredEmail)
      .then(() => {
        this._timerService.incrementAttempt();
        this.updateTimerUI();
        this._utils.showMessage('create-account.email-resent-successfully');
      })
      .catch((err) => {
        // If user already active, clear timer
        if (err.error?.errorDescription === 'user already active') {
          this._timerService.reset();
          this._utils.showMessage('create-account.user-already-active', 5000);
        } else {
          this._utils.showMessage('create-account.error-resending-email');
        }
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
