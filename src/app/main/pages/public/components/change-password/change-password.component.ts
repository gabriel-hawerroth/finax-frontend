import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { User } from '../../../../../interfaces/user';
import { UserService } from '../../../../../services/user.service';
import { UtilsService } from '../../../../../utils/utils.service';
import { Credentials } from '../../../../../interfaces/credentials';
import { LoginService } from '../../../../../services/login.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatButtonModule,
    NgOptimizedImage,
    TranslateModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit {
  public readonly utilsService = inject(UtilsService);
  private readonly _fb = inject(FormBuilder);
  private readonly _userService = inject(UserService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _loginService = inject(LoginService);

  private user!: User;
  public changePasswordForm!: FormGroup;
  public showLoading = signal(false);

  ngOnInit(): void {
    this.buildForm();

    this._userService
      .getById(+this._activatedRoute.snapshot.paramMap.get('userId')!)
      .then((user) => {
        if (!user.canChangePassword) {
          this._router.navigate(['']);
        } else this.user = user;
      })
      .catch(() => this._router.navigate(['']));
  }

  buildForm() {
    this.changePasswordForm = this._fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(this.utilsService.passwordValidator()),
        ],
      ],
      passwordConfirm: ['', Validators.required],
    });
  }

  changePassword() {
    if (this.changePasswordForm.invalid) {
      this.utilsService.showMessage(
        "generic.password-doesn't-meet-security-requirements"
      );
      return;
    }

    const newPassword = this.changePasswordForm.value.newPassword;
    const passwordConfirm = this.changePasswordForm.value.passwordConfirm;

    if (passwordConfirm !== newPassword) {
      this.utilsService.showMessage("change-password.passwords-don't-match");
      return;
    }

    this.showLoading.set(true);

    this._userService
      .changeForgetedPassword(this.user.id!, newPassword)
      .then(() => {
        const savedLogin =
          this.utilsService.getItemLocalStorage('savedLoginFinax');

        if (
          this.utilsService.isBrowser &&
          window.innerWidth < 870 &&
          window.innerHeight < 1230
        ) {
          this.utilsService.showMessage('change-password.changed-successfully');
          this._router.navigate(['']);
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
      .catch(() =>
        this.utilsService.showMessage('change-password.error-changing')
      )
      .finally(() => this.showLoading.set(false));
  }
}
