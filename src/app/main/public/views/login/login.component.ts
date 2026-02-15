import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
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
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { LoginService } from '../../../../core/entities/auth/login.service';
import { ButtonsComponent } from '../../../../shared/components/buttons/buttons.component';
import {
  cloudFireCdnImgsLink,
  getBtnStyle,
} from '../../../../shared/utils/utils';
import { UtilsService } from '../../../../shared/utils/utils.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgOptimizedImage,
    MatCheckboxModule,
    RouterModule,
    TranslateModule,
    ButtonsComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage implements OnInit, AfterViewInit, OnDestroy {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly getBtnStyle = getBtnStyle;

  @ViewChild('googleButtonContainer') googleButtonContainer!: ElementRef;

  loginForm!: FormGroup;
  showLoading = signal(false);
  googleBtnRendered = signal(false);

  private checkInterval?: ReturnType<typeof setInterval>;
  private checkTimeout?: ReturnType<typeof setTimeout>;
  private mutationObserver?: MutationObserver;
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private readonly _utils: UtilsService,
    private readonly _loginService: LoginService,
    private readonly _fb: FormBuilder,
    private readonly _ngZone: NgZone,
  ) {
    effect(() => {
      const loading = this.showLoading();
      if (!loading && this.googleBtnRendered() && isPlatformBrowser(this.platformId)) {
        // Reset and re-render Google button when loading ends
        setTimeout(() => {
          if (this.googleButtonContainer && this.isGoogleSignInAvailable()) {
            this.googleBtnRendered.set(false);
            this.initializeGoogleSignIn();
          }
        }, 0);
      }
    });
  }

  ngOnInit(): void {
    this.buildForm();

    const savedLogin = this._utils.getItemLocalStorage('savedLoginFinax');
    if (savedLogin) this.loginForm.patchValue(JSON.parse(atob(savedLogin!)));
  }

  ngAfterViewInit(): void {
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

  ngOnDestroy(): void {
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

  buildForm() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: false,
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    const credentials = this.loginForm.value;

    this.showLoading.set(true);

    this._loginService
      .login(credentials)
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
      text: 'signin_with',
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
