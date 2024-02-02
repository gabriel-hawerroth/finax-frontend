import { Component, OnInit, inject } from '@angular/core';
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

import { User } from '../../../../../interfaces/User';
import { UserService } from '../../../../../services/user.service';
import { UtilsService } from '../../../../../utils/utils.service';
import { Credentials } from '../../../../../interfaces/Credentials';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
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
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _fb = inject(FormBuilder);
  private _userService = inject(UserService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _loginService = inject(LoginService);

  changePasswordForm!: FormGroup;
  showLoading: boolean = false;
  user!: User;

  language: string = this.utilsService.getUserConfigs.language;

  ngOnInit(): void {
    this.buildForm();

    this._userService
      .getById(+this._activatedRoute.snapshot.paramMap.get('userId')!)
      .then((user) => {
        if (!user.canChangePassword) {
          this._router.navigate(['']);
        } else this.user = user;
      })
      .catch(() => {
        this._router.navigate(['']);
      });
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
      this.utilsService.showSimpleMessage(
        this.language === 'pt-br'
          ? 'A senha não cumpre os requisitos'
          : "Password doesn't meet the requirements"
      );
      return;
    }

    const newPassword = this.changePasswordForm.value.newPassword;
    const passwordConfirm = this.changePasswordForm.value.passwordConfirm;

    if (passwordConfirm !== newPassword) {
      this.utilsService.showSimpleMessage(
        this.language === 'pt-br'
          ? 'As senhas não coincidem'
          : "Passwords don't match"
      );
      this.showLoading = false;
      return;
    }

    this.showLoading = true;

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
          this.utilsService.showSimpleMessage(
            this.language === 'pt-br'
              ? 'Senha alterada com sucesso'
              : 'Password changed sucessfully'
          );
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
      .catch(() => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao alterar a senha, tente novamente mais tarde'
            : 'Error changing password, please try again later'
        );
      })
      .finally(() => {
        this.showLoading = false;
      });
  }
}
