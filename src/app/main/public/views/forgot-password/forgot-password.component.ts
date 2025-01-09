import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../../../core/entities/auth/login.service';
import { ButtonsComponent } from '../../../../shared/components/buttons/buttons.component';
import {
  cloudFireCdnImgsLink,
  getBtnStyle,
} from '../../../../shared/utils/utils';
import { UtilsService } from '../../../../shared/utils/utils.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    NgOptimizedImage,
    MatProgressSpinnerModule,
    TranslateModule,
    RouterModule,
    ButtonsComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly getBtnStyle = getBtnStyle;

  originalFormValue!: FormGroup;
  showLoading = signal(false);

  emailControl!: FormControl;

  constructor(
    public readonly utils: UtilsService,
    private readonly _loginService: LoginService,
    private readonly _matSnackBar: MatSnackBar,
    private readonly _translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.emailControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);
  }

  sendChangePasswordEmail() {
    this.showLoading.set(true);
    const email: string = this.emailControl.value;

    this._loginService
      .sendChangePasswordEmail(email)
      .then(() => {
        this.emailControl.reset('');
        this._matSnackBar.open(
          `${this._translate.instant(
            'forgot-password.sended-recovery-link'
          )}: ${email}`,
          'OK'
        );
      })
      .catch((err) => {
        const error = err.error.errorDescription;

        switch (error) {
          case 'invalid email':
            this.utils.showMessage('generic.invalid-mail', 6000);
            break;
          case 'entity not found':
            this.utils.showMessage("forgot-password.user-doesn't-exist", 4000);
            break;
          case 'error sending email':
            this.utils.showMessage('forgot-password.error-sending-email', 4500);
            break;
          default:
            this.utils.showMessage("forgot-password.user-doesn't-exist", 4000);
        }
      })
      .finally(() => this.showLoading.set(false));
  }
}
