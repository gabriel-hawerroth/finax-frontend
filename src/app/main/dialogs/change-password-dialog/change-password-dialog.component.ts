import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { UtilsService } from '../../../utils/utils.service';
import { LoginService } from '../../../services/login.service';
import { UserService } from '../../../services/user.service';
import { Credentials } from '../../../interfaces/Credentials';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialogComponent implements OnInit {
  public utilsService = inject(UtilsService);
  public dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);
  private _fb = inject(FormBuilder);
  private _userService = inject(UserService);
  private _loginService = inject(LoginService);

  changePasswordForm!: FormGroup;
  language: string = '';

  ngOnInit(): void {
    this.buildForm();

    this.utilsService.userConfigs.asObservable().subscribe((value) => {
      this.language = value!.language;
    });
  }

  buildForm() {
    this.changePasswordForm = this._fb.group({
      currentPassword: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(this.utilsService.passwordValidator()),
        ],
      ],
      newPasswordConfirm: ['', Validators.required],
    });
  }

  changePassword() {
    const passwords = {
      currentPassword: this.changePasswordForm.get('currentPassword')!.value,
      newPassword: this.changePasswordForm.get('newPassword')!.value,
      newPasswordConfirm:
        this.changePasswordForm.get('newPasswordConfirm')!.value,
    };

    if (passwords.newPassword !== passwords.newPasswordConfirm) {
      this.utilsService.showSimpleMessage(
        this.language === 'pt-br'
          ? 'As senhas não coincidem'
          : "Passwords don't match"
      );
      return;
    }

    if (passwords.currentPassword === passwords.newPassword) {
      this.utilsService.showSimpleMessage(
        this.language === 'pt-br'
          ? 'A nova senha não pode ser igual a senha atual'
          : 'The new password cannot be the same as the current password'
      );
      return;
    }

    this._userService
      .changePassword(
        this._loginService.getLoggedUserId!,
        passwords.newPassword,
        passwords.currentPassword
      )
      .then((user: any) => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Senha alterada com sucesso'
            : 'Password changed sucessfully'
        );
        this.dialogRef.close();

        const savedLogin =
          this.utilsService.getItemLocalStorage('savedLoginFinax');

        this.utilsService.setItemLocalStorage(
          'userFinax',
          btoa(JSON.stringify(user))
        );

        if (savedLogin) {
          const credentials: Credentials = {
            email: user.email,
            password: passwords.newPassword,
            rememberMe: true,
          };
          this.utilsService.setItemLocalStorage(
            'savedLoginFinax',
            btoa(JSON.stringify(credentials))
          );
        }
      })
      .catch((error) => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'A senha atual está incorreta'
            : 'The current password is incorrect'
        );
      });
  }
}
