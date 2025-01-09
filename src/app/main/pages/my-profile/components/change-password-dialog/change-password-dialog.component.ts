import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
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
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Credentials } from '../../../../../core/entities/auth/credentials';
import { UserService } from '../../../../../core/entities/user/user.service';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-change-password-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialog implements OnInit {
  changePasswordForm!: FormGroup;

  loading = signal(false);

  constructor(
    public readonly utils: UtilsService,
    private readonly _dialogRef: MatDialogRef<ChangePasswordDialog>,
    private readonly _fb: FormBuilder,
    private readonly _userService: UserService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.changePasswordForm = this._fb.group({
      currentPassword: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(this.utils.passwordValidator()),
        ],
      ],
      newPasswordConfirm: ['', Validators.required],
    });
  }

  changePassword() {
    const passwords = {
      currentPassword: this.changePasswordForm.value.currentPassword,
      newPassword: this.changePasswordForm.value.newPassword,
      newPasswordConfirm: this.changePasswordForm.value.newPasswordConfirm,
    };

    if (passwords.newPassword !== passwords.newPasswordConfirm) {
      this.utils.showMessage("change-password.passwords-don't-match");
      return;
    }

    if (passwords.currentPassword === passwords.newPassword) {
      this.utils.showMessage(
        'change-password-dialog.cannot-be-the-same-as-current'
      );
      return;
    }

    this.loading.set(true);

    this._userService
      .changePassword(passwords.newPassword, passwords.currentPassword)
      .then((user) => {
        this.utils.showMessage('change-password.changed-successfully');
        this._dialogRef.close();

        const savedLogin = this.utils.getItemLocalStorage('savedLoginFinax');

        this.utils.setItemLocalStorage('userFinax', btoa(JSON.stringify(user)));

        if (savedLogin) {
          const credentials: Credentials = {
            email: user.email,
            password: passwords.newPassword,
            rememberMe: true,
          };
          this.utils.setItemLocalStorage(
            'savedLoginFinax',
            btoa(JSON.stringify(credentials))
          );
        }
      })
      .catch((err: HttpErrorResponse) => {
        if (err.status === 406) {
          this.utils.showMessage(
            'change-password-dialog.incorrect-current-password'
          );
        } else {
          this.utils.showMessage(
            'change-password-dialog.unexpected-error-updating-password'
          );
        }
      })
      .finally(() => {
        this.loading.set(false);
      });
  }
}
