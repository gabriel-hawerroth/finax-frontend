import { NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnInit,
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
export class LoginPage implements OnInit, AfterViewInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly getBtnStyle = getBtnStyle;

  @ViewChild('googleButtonContainer') googleButtonContainer!: ElementRef;

  loginForm!: FormGroup;
  showLoading = signal(false);
  googleBtnRendered = signal(false);

  constructor(
    private readonly _utils: UtilsService,
    private readonly _loginService: LoginService,
    private readonly _fb: FormBuilder,
    private readonly _ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    const savedLogin = this._utils.getItemLocalStorage('savedLoginFinax');
    if (savedLogin) this.loginForm.patchValue(JSON.parse(atob(savedLogin!)));
  }

  ngAfterViewInit(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      this.initializeGoogleSignIn();
    } else {
      const checkInterval = setInterval(() => {
        if (typeof google !== 'undefined' && google.accounts) {
          clearInterval(checkInterval);
          this.initializeGoogleSignIn();
        }
      }, 100);

      setTimeout(() => clearInterval(checkInterval), 5000);
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
      const observer = new MutationObserver(() => {
        if (
          container.querySelector('iframe') ||
          container.children.length > 0
        ) {
          this._ngZone.run(() => this.googleBtnRendered.set(true));
          observer.disconnect();
        }
      });

      observer.observe(container, { childList: true, subtree: true });
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
}
