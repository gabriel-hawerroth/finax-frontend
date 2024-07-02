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
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../../../core/entities/auth/login.service';
import { cloudFireCdnImgsLink } from '../../../../shared/utils/constant-utils';
import { UtilsService } from '../../../../shared/utils/utils.service';

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
    TranslateModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

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

  resetPassword() {
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
      .catch(() => {
        this.utils.showMessage("forgot-password.user-doesn't-exist");
      })
      .finally(() => this.showLoading.set(false));
  }
}
