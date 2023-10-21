import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/User';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-forgot-my-password',
  templateUrl: './forgot-my-password.component.html',
  styleUrls: ['./forgot-my-password.component.scss'],
})
export class ForgotMyPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  originalFormValue!: FormGroup;
  showLoading: boolean = false;
  darkTheme: boolean = false;
  language: string = 'pt-br';

  constructor(
    private _fb: FormBuilder,
    private _loginService: LoginService,
    private _userService: UserService,
    private _utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.originalFormValue = this.forgotPasswordForm;

    const configs = localStorage.getItem('savedUserConfigsFinax');
    if (configs) {
      const savedConfigs = JSON.parse(atob(configs));
      this.darkTheme = savedConfigs.theme === 'dark';
      this.language = savedConfigs.language;
    }
  }

  resetPassword() {
    if (this.forgotPasswordForm.invalid) return;
    this.showLoading = true;

    this._userService
      .getByEmail(this.forgotPasswordForm.get('email')!.value)
      .then((user: User) => {
        this._loginService
          .sendChangePasswordEmail(user.id!)
          .then(() => {
            this.showLoading = false;
            this.forgotPasswordForm.reset(this.originalFormValue);
            this._utilsService.showSimpleMessageWithoutDuration(
              this.language === 'pt-br'
                ? `O link de recuperação foi enviado para o email: ${user.email}`
                : `The recovery link has been sent to the email: ${user.email}`
            );
          })
          .catch(() => {
            this.showLoading = false;
            this._utilsService.showSimpleMessage(
              this.language === 'pt-br'
                ? 'Erro no sistema, tente novamente mais tarde'
                : 'System error, please try again later'
            );
          });
      })
      .catch(() => {
        this.showLoading = false;
        this._utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Esse usuário não existe'
            : "This user don't exist"
        );
      });
  }
}
