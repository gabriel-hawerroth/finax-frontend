import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Credentials } from 'src/app/interfaces/Credentials';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
})
export class ChangePasswordDialogComponent implements OnInit {
  changePasswordForm!: FormGroup;
  language: string = '';

  constructor(
    public utilsService: UtilsService,
    private _fb: FormBuilder,
    private _userService: UserService,
    private _loginService: LoginService,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>
  ) {}

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

        const savedLogin = localStorage.getItem('savedLoginFinax');

        localStorage.setItem('userFinax', btoa(JSON.stringify(user)));

        if (savedLogin) {
          const credentials: Credentials = {
            email: user.email,
            password: passwords.newPassword,
            rememberMe: true,
          };
          localStorage.setItem(
            'savedLoginFinax',
            btoa(JSON.stringify(credentials))
          );
        }
      })
      .catch((error) => {
        console.log(error.status);
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'A senha atual está incorreta'
            : 'The current password is incorrect'
        );
      });
  }
}
