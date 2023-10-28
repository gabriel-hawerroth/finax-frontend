import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Credentials } from 'src/app/interfaces/Credentials';
import { User } from 'src/app/interfaces/User';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  showLoading: boolean = false;
  user!: User;
  darkTheme: boolean = false;
  language: string = '';

  constructor(
    private _fb: FormBuilder,
    private _utilsService: UtilsService,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.buildForm();

    const configs = localStorage.getItem('savedUserConfigsFinax');
    if (configs) {
      const savedConfigs = JSON.parse(atob(configs));
      this.darkTheme = savedConfigs.theme === 'dark';
      this.language = savedConfigs.language;
    }

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
          Validators.pattern(this._utilsService.passwordValidator()),
        ],
      ],
      newPasswordConfirm: ['', Validators.required],
    });
  }

  changePassword() {
    if (this.changePasswordForm.invalid) return;
    this.showLoading = true;

    const newPassword = this.changePasswordForm.get('newPassword')!.value;
    const newPasswordConfirm =
      this.changePasswordForm.get('newPasswordConfirm')!.value;

    if (newPassword !== newPasswordConfirm) {
      this._utilsService.showSimpleMessage(
        this.language === 'pt-br'
          ? 'As senhas não coincidem'
          : "Passwords don't match"
      );
      this.showLoading = false;
      return;
    }

    this._userService
      .changeForgetedPassword(this.user.id!, newPassword)
      .then(() => {
        const savedLogin = localStorage.getItem('savedLoginFinax');

        if (window.innerWidth < 870 && window.innerHeight < 1230) {
          this._utilsService.showSimpleMessage(
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
        this.showLoading = false;
      })
      .catch(() => {
        this.showLoading = false;
        this._utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao alterar a senha, tente novamente mais tarde'
            : 'Error changing password, please try again later'
        );
      });
  }
}
