import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { UserService } from '../../../services/user.service';
import { Credentials } from '../../../interfaces/Credentials';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

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
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialogComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);
  private _fb = inject(FormBuilder);
  private _userService = inject(UserService);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  changePasswordForm!: FormGroup;

  loading: boolean = false;

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
          Validators.pattern(this.utilsService.passwordValidator()),
        ],
      ],
      newPasswordConfirm: ['', Validators.required],
    });

    this.changePasswordForm.markAllAsTouched();
  }

  changePassword() {
    const passwords = {
      currentPassword: this.changePasswordForm.value.currentPassword,
      newPassword: this.changePasswordForm.value.newPassword,
      newPasswordConfirm: this.changePasswordForm.value.newPasswordConfirm,
    };

    if (passwords.newPassword !== passwords.newPasswordConfirm) {
      this.utilsService.showMessage("change-password.passwords-don't-match");
      return;
    }

    if (passwords.currentPassword === passwords.newPassword) {
      this.utilsService.showMessage(
        'change-password-dialog.cannot-be-the-same-as-current'
      );
      return;
    }

    this.loading = true;

    this._userService
      .changePassword(passwords.newPassword, passwords.currentPassword)
      .then((user: any) => {
        this.utilsService.showMessage('change-password.changed-successfully');
        this._dialogRef.close();

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
      .catch((err: HttpErrorResponse) => {
        if (err.status === 406) {
          this.utilsService.showMessage(
            'change-password-dialog.incorrect-current-password'
          );
        } else {
          this.utilsService.showMessage(
            'change-password-dialog.unexpected-error-updating-password'
          );
        }
      })
      .finally(() => {
        this.loading = false;
        this._changeDetectorRef.detectChanges();
      });
  }
}
