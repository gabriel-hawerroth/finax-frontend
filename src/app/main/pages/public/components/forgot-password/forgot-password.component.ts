import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
import { LoginService } from '../../../../../services/login.service';
import { UtilsService } from '../../../../../utils/utils.service';

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
export class ForgotPasswordComponent implements OnInit {
  public readonly utilsService = inject(UtilsService);
  private readonly _loginService = inject(LoginService);
  private readonly _matSnackBar = inject(MatSnackBar);
  private readonly _translate = inject(TranslateService);

  public originalFormValue!: FormGroup;
  public showLoading = signal(false);

  public emailControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  ngOnInit(): void {
    this.emailControl.markAsTouched();
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
        this.utilsService.showMessage("forgot-password.user-doesn't-exist");
      })
      .finally(() => this.showLoading.set(false));
  }
}
