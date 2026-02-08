import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
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
import { EmailResendControlsComponent } from '../../../../shared/components/email-resend-controls/email-resend-controls.component';
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
  selector: 'app-create-account',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterModule,
    NgOptimizedImage,
    TranslateModule,
    ButtonsComponent,
    MatCheckboxModule,
    EmailResendControlsComponent,
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
  viewReady = signal(true);

  readonly timerUI: EmailResendTimerUI;
  private registeredEmail?: string;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _fb: FormBuilder,
    private readonly _authService: AuthService,
    _timerService: EmailResendTimerService
  ) {
    this.timerUI = new EmailResendTimerUI(
      _timerService,
      ResendEmailFlowType.CREATE_ACCOUNT
    );

    this.timerUI.setOnBlockExpired(() => {
      this.accountCreated.set(false);
      this.registeredEmail = undefined;
    });

    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      const existingEmail = this.timerUI.checkExistingState();
      if (existingEmail) {
        this.accountCreated.set(true);
        this.registeredEmail = existingEmail;
      }
    }
  }

  ngOnInit(): void {
    this.buildForm();
    if (this.accountCreated()) {
      this.timerUI.updateUI();
      this.timerUI.startInterval();
    }
  }

  ngOnDestroy(): void {
    this.timerUI.destroy();
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
        this.timerUI.startNewTimer(this.registeredEmail!);
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
    if (!this.timerUI.canResend() || !this.registeredEmail) return;

    this.showLoading.set(true);

    this._authService
      .resendActivationEmail(this.registeredEmail)
      .then(() => {
        this.timerUI.onResendSuccess();
        this._utils.showMessage('create-account.email-resent-successfully');
      })
      .catch((err) => {
        // If user already active, clear timer
        if (err.error?.errorDescription === 'user already active') {
          this.timerUI.reset();
          this._utils.showMessage('create-account.user-already-active', 5000);
        } else {
          this._utils.showMessage('create-account.error-resending-email');
        }
      })
      .finally(() => this.showLoading.set(false));
  }
}
