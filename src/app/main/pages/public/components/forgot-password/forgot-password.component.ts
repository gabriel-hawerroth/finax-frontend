import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../../../interfaces/User';
import { LoginService } from '../../../../../services/login.service';
import { UserService } from '../../../../../services/user.service';
import { UtilsService } from '../../../../../utils/utils.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    NgOptimizedImage,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  public utilsService = inject(UtilsService);

  private _fb = inject(FormBuilder);
  private _loginService = inject(LoginService);
  private _userService = inject(UserService);

  forgotPasswordForm!: FormGroup;
  originalFormValue!: FormGroup;
  showLoading: boolean = false;

  language: string = this.utilsService.getSavedUserConfigs.language;

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.forgotPasswordForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.originalFormValue = this.forgotPasswordForm;
    this.forgotPasswordForm.markAllAsTouched();
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
            this.utilsService.showSimpleMessageWithoutDuration(
              this.language === 'pt-br'
                ? `O link de recuperação foi enviado para o email: ${user.email}`
                : `The recovery link has been sent to the email: ${user.email}`
            );
          })
          .catch(() => {
            this.showLoading = false;
            this.utilsService.showSimpleMessage(
              this.language === 'pt-br'
                ? 'Erro no sistema, tente novamente mais tarde'
                : 'System error, please try again later'
            );
          });
      })
      .catch(() => {
        this.showLoading = false;
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Esse usuário não existe'
            : "This user don't exist"
        );
      });
  }
}
