import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../../../../core/entities/auth/login.service';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-cancel-account-dialog',
  imports: [CommonModule, MatDialogModule, TranslateModule, ButtonsComponent],
  templateUrl: './cancel-account-dialog.component.html',
  styleUrl: './cancel-account-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelAccountDialog {
  darkThemeEnabled = signal(false);

  loading = signal(false);

  constructor(
    private readonly _dialogRef: MatDialogRef<CancelAccountDialog>,
    private readonly _loginService: LoginService,
    private readonly _utils: UtilsService
  ) {
    this.darkThemeEnabled.set(_utils.getUserConfigs.theme === 'dark');
  }

  onCancel() {
    this._dialogRef.close();
  }

  confirmCancelAccount() {
    this.loading.set(true);

    this._loginService
      .sendCancelUserAccountEmail()
      .then(() => {
        this._utils.showMessage(
          'my-profile.cancel-account-dialog.email-sent-successfully',
          6000
        );
        this._dialogRef.close();
      })
      .catch(() =>
        this._utils.showMessage(
          'my-profile.cancel-account-dialog.error-sending-email',
          6000
        )
      )
      .finally(() => this.loading.set(false));
  }
}
