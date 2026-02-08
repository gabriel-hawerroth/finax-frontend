import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Credentials } from '../../../../core/entities/auth/credentials';
import { LoginService } from '../../../../core/entities/auth/login.service';
import { User } from '../../../../core/entities/user/user';
import { UserService } from '../../../../core/entities/user/user.service';
import { ButtonsComponent } from '../../../../shared/components/buttons/buttons.component';
import { EmailResendTimerService } from '../../../../shared/services/email-resend-timer.service';
import {
  cloudFireCdnImgsLink,
  getBtnStyle,
} from '../../../../shared/utils/utils';
import { UtilsService } from '../../../../shared/utils/utils.service';

@Component({
  selector: 'app-change-password',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgOptimizedImage,
    TranslateModule,
    ButtonsComponent
],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordPage implements OnInit {
  readonly passwordRequirementsText = this._utils.passwordRequirementsText;
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly getBtnStyle = getBtnStyle;

  user!: User;
  changePasswordForm!: FormGroup;
  showLoading = signal(false);

  constructor(
    private readonly _utils: UtilsService,
    private readonly _fb: FormBuilder,
    private readonly _userService: UserService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _loginService: LoginService,
    private readonly _timerService: EmailResendTimerService
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this._userService
      .getById(+this._activatedRoute.snapshot.paramMap.get('userId')!)
      .then((user) => {
        if (!user.canChangePassword) {
          this._router.navigateByUrl('');
        } else this.user = user;
      })
      .catch(() => this._router.navigateByUrl(''));
  }

  buildForm() {
    this.changePasswordForm = this._fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(this._utils.passwordValidator()),
        ],
      ],
      passwordConfirm: ['', Validators.required],
    });
  }

  changePassword() {
    if (this.changePasswordForm.invalid) {
      this._utils.showMessage(
        "generic.password-doesn't-meet-security-requirements"
      );
      return;
    }

    const newPassword = this.changePasswordForm.value.newPassword;
    const passwordConfirm = this.changePasswordForm.value.passwordConfirm;

    if (passwordConfirm !== newPassword) {
      this._utils.showMessage("change-password.passwords-don't-match");
      return;
    }

    this.showLoading.set(true);

    this._userService
      .changeForgetedPassword(this.user.id!, newPassword)
      .then(() => {
        this._timerService.reset();

        const savedLogin = this._utils.getItemLocalStorage('savedLoginFinax');

        if (
          this._utils.isBrowser &&
          window.innerWidth < 870 &&
          window.innerHeight < 1230
        ) {
          this._utils.showMessage('change-password.changed-successfully');
          this._router.navigateByUrl('');
        } else {
          const credentials: Credentials = {
            email: this.user!.email,
            password: newPassword,
            rememberMe: savedLogin ? true : false,
            changedPassword: true,
          };

          this._loginService.login(credentials);
        }
      })
      .catch(() => this._utils.showMessage('change-password.error-changing'))
      .finally(() => this.showLoading.set(false));
  }
}
