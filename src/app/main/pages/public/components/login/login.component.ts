import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../../../../services/login.service';
import { Router, RouterModule } from '@angular/router';
import { UtilsService } from '../../../../../utils/utils.service';
import { User } from '../../../../../interfaces/User';
import { UserService } from '../../../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgOptimizedImage,
    MatCheckboxModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _fb = inject(FormBuilder);
  private _loginService = inject(LoginService);
  private _router = inject(Router);
  private _userService = inject(UserService);

  loginForm!: FormGroup;
  showLoading: boolean = false;

  language: string = this.utilsService.getUserConfigs.language;

  ngOnInit(): void {
    this.buildForm();

    const savedLogin = this.utilsService.getItemLocalStorage('savedLoginFinax');
    if (savedLogin) this.loginForm.patchValue(JSON.parse(atob(savedLogin!)));

    this.loginForm.markAllAsTouched();
  }

  buildForm() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: false,
    });

    this.loginForm.markAllAsTouched();
  }

  login(credentials: any = null) {
    if (this.loginForm.invalid) return;

    if (credentials === null) credentials = this.loginForm.value;

    this.showLoading = true;

    this._loginService
      .oauthLogin(credentials)
      .then((response: any) => {
        if (!response) {
          this.utilsService.showSimpleMessage(
            this.language === 'pt-br' ? 'Login inválido' : 'Invalid login'
          );
          return;
        }

        this._userService
          .getByEmail(response.username)
          .then((user: User) => {
            if (!user) {
              this.utilsService.showSimpleMessage(
                this.language === 'pt-br'
                  ? 'Erro ao obter o usuário, entre em contato com nosso suporte'
                  : 'Error getting the user, please contact our support'
              );
              return;
            } else if (user.activate === false) {
              this.utilsService.showSimpleMessage(
                this.language === 'pt-br'
                  ? 'Usuário inativo, verifique seu email'
                  : 'Inactive user, check your email'
              );
              return;
            }

            this._router.navigate(['home']);

            if (!credentials.changedPassword) {
              this.utilsService.showSimpleMessage(
                this.language === 'pt-br'
                  ? 'Login realizado com sucesso'
                  : 'Login successfully'
              );
            } else {
              this.utilsService.showSimpleMessage(
                this.language === 'pt-br'
                  ? 'Senha alterada com sucesso'
                  : 'Password changed successfully'
              );
            }

            this.utilsService.setItemLocalStorage(
              'tokenFinax',
              btoa(JSON.stringify(response.access_token))
            );
            this.utilsService.setItemLocalStorage(
              'userFinax',
              btoa(JSON.stringify(user))
            );

            if (credentials.rememberMe) {
              this.utilsService.setItemLocalStorage(
                'savedLoginFinax',
                btoa(JSON.stringify(credentials))
              );
            } else {
              this.utilsService.removeItemLocalStorage('savedLoginFinax');
            }
          })
          .finally(() => {
            this.showLoading = false;
          });
      })
      .catch((err) => {
        this.showLoading = false;
      });
  }
}
