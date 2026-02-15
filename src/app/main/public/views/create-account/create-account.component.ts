import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
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
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/entities/auth/auth.service';
import { LoginService } from '../../../../core/entities/auth/login.service';
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
export class CreateAccountPage implements OnInit, OnDestroy, AfterViewInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly passwordRequirementsText = this._utils.passwordRequirementsText;
  readonly getBtnStyle = getBtnStyle;

  @ViewChild('googleButtonContainer') googleButtonContainer!: ElementRef;

  userRegisterForm!: FormGroup;
  showLoading = signal(false);
  googleBtnRendered = signal(false);

  accountCreated = signal(false);
  viewReady = signal(false);

  readonly timerUI: EmailResendTimerUI;
  private registeredEmail?: string;
  private checkInterval?: ReturnType<typeof setInterval>;
  private checkTimeout?: ReturnType<typeof setTimeout>;
  private mutationObserver?: MutationObserver;
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private readonly _utils: UtilsService,
    private readonly _fb: FormBuilder,
    private readonly _authService: AuthService,
    private readonly _loginService: LoginService,
    private readonly _ngZone: NgZone,
    _timerService: EmailResendTimerService,
  ) {
    this.timerUI = new EmailResendTimerUI(
      _timerService,
      ResendEmailFlowType.CREATE_ACCOUNT,
    );

    this.timerUI.setOnBlockExpired(() => {
      this.accountCreated.set(false);
      this.registeredEmail = undefined;
    });

    if (isPlatformBrowser(this.platformId)) {
      const existingEmail = this.timerUI.checkExistingState();
      if (existingEmail) {
        this.accountCreated.set(true);
        this.registeredEmail = existingEmail;
      }
      this.viewReady.set(true);
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

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
    }
    if (this.checkTimeout) {
      clearTimeout(this.checkTimeout);
      this.checkTimeout = undefined;
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = undefined;
    }
  }

  ngAfterViewInit(): void {
    if (this.accountCreated()) return;
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.isGoogleSignInAvailable()) {
      this.initializeGoogleSignIn();
    } else {
      this.checkInterval = setInterval(() => {
        if (this.isGoogleSignInAvailable()) {
          clearInterval(this.checkInterval);
          this.checkInterval = undefined;
          this.initializeGoogleSignIn();
        }
      }, 100);

      this.checkTimeout = setTimeout(() => {
        if (this.checkInterval) {
          clearInterval(this.checkInterval);
          this.checkInterval = undefined;
        }
      }, 5000);
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
        this.timerUI.startNewTimer(this.registeredEmail!);
      })
      .catch((err) => {
        if (err.error.errorDescription === 'this email is already in use')
          this._utils.showMessage(
            'create-account.email-already-registered',
            5000,
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
        "generic.password-doesn't-meet-security-requirements",
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

  private initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response) => {
        this._ngZone.run(() => {
          this.handleGoogleCredentialResponse(response);
        });
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    const container = this.googleButtonContainer.nativeElement;

    google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signup_with',
      shape: 'rectangular',
      width: 280,
    });

    if (container.querySelector('iframe') || container.children.length > 0) {
      this.googleBtnRendered.set(true);
    } else {
      this.mutationObserver = new MutationObserver(() => {
        if (
          container.querySelector('iframe') ||
          container.children.length > 0
        ) {
          this._ngZone.run(() => this.googleBtnRendered.set(true));
          if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = undefined;
          }
        }
      });

      this.mutationObserver.observe(container, { childList: true, subtree: true });
    }
  }

  private handleGoogleCredentialResponse(
    response: google.accounts.id.CredentialResponse,
  ): void {
    this.showLoading.set(true);

    this._loginService
      .googleLogin(response.credential)
      .finally(() => this.showLoading.set(false));
  }

  private isGoogleSignInAvailable(): boolean {
    return typeof google !== 'undefined' && google.accounts !== undefined;
  }
}
