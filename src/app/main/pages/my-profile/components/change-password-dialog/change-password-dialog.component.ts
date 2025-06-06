import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Credentials } from '../../../../../core/entities/auth/credentials';
import { UserService } from '../../../../../core/entities/user/user.service';
import { DialogControls } from '../../../../../core/interfaces/dialogs-controls';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
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
    ButtonsComponent,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialog implements OnInit {
  readonly passwordRequirementsText = this._utils.passwordRequirementsText;

  changePasswordForm!: FormGroup;

  loading = signal(false);

  readonly control: DialogControls<void>;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _fb: FormBuilder,
    private readonly _userService: UserService
  ) {
    const injector = inject(Injector);

    const ref =
      injector.get<MatDialogRef<ChangePasswordDialog> | null>(
        MatDialogRef,
        null
      ) ||
      injector.get<MatBottomSheetRef<ChangePasswordDialog> | null>(
        MatBottomSheetRef,
        null
      );

    this.control = {
      close: (result) => {
        if (ref instanceof MatDialogRef) ref.close(result);
        else if (ref instanceof MatBottomSheetRef) ref.dismiss(result);
      },
    };
  }

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
          Validators.pattern(this._utils.passwordValidator()),
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
      this._utils.showMessage("change-password.passwords-don't-match");
      return;
    }

    if (passwords.currentPassword === passwords.newPassword) {
      this._utils.showMessage(
        'change-password-dialog.cannot-be-the-same-as-current'
      );
      return;
    }

    this.loading.set(true);

    this._userService
      .changePassword(passwords.newPassword, passwords.currentPassword)
      .then((user) => {
        this._utils.showMessage('change-password.changed-successfully');
        this.control.close();

        const savedLogin = this._utils.getItemLocalStorage('savedLoginFinax');

        this._utils.setItemLocalStorage(
          'userFinax',
          btoa(JSON.stringify(user))
        );

        if (savedLogin) {
          const credentials: Credentials = {
            email: user.email,
            password: passwords.newPassword,
            rememberMe: true,
          };
          this._utils.setItemLocalStorage(
            'savedLoginFinax',
            btoa(JSON.stringify(credentials))
          );
        }
      })
      .catch((err: HttpErrorResponse) => {
        if (err.status === 406) {
          this._utils.showMessage(
            'change-password-dialog.incorrect-current-password'
          );
        } else {
          this._utils.showMessage(
            'change-password-dialog.unexpected-error-updating-password'
          );
        }
      })
      .finally(() => this.loading.set(false));
  }

  onCancel() {
    this.control.close();
  }
}
