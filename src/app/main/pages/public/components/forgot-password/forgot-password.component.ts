import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UtilsService } from '../../../../../utils/utils.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../../../../services/login.service';

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
  public utilsService = inject(UtilsService);
  private _loginService = inject(LoginService);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _matSnackBar = inject(MatSnackBar);
  private _translate = inject(TranslateService);

  originalFormValue!: FormGroup;
  showLoading: boolean = false;

  emailControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  ngOnInit(): void {
    this.emailControl.markAsTouched();
  }

  resetPassword() {
    this.showLoading = true;
    const email: string = this.emailControl.value;

    this._loginService
      .sendChangePasswordEmail(email)
      .then(() => {
        this.showLoading = false;
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
      .finally(() => {
        this.showLoading = false;
        this._changeDetectorRef.detectChanges();
      });
  }
}
