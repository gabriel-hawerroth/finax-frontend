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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../../../../services/login.service';
import { UserService } from '../../../../../services/user.service';
import { UtilsService } from '../../../../../utils/utils.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _fb = inject(FormBuilder);
  private _loginService = inject(LoginService);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  forgotPasswordForm!: FormGroup;
  originalFormValue!: FormGroup;
  showLoading: boolean = false;

  language: string = this.utilsService.getUserConfigs.language;

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.forgotPasswordForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.originalFormValue = this.forgotPasswordForm;
    this.forgotPasswordForm.markAllAsTouched();
  }

  resetPassword() {
    if (this.forgotPasswordForm.invalid) return;
    this.showLoading = true;
    const email: string = this.forgotPasswordForm.value.email;

    this._loginService
      .sendChangePasswordEmail(email)
      .then(() => {
        this.showLoading = false;
        this.forgotPasswordForm.reset(this.originalFormValue);
        this.utilsService.showMessageWithoutDuration(
          this.language === 'pt-br'
            ? `O link de recuperação foi enviado para o email: ${email}`
            : `The recovery link has been sent to the email: ${email}`
        );
      })
      .catch(() => {
        this.utilsService.showMessage(
          this.language === 'pt-br'
            ? 'Esse usuário não existe'
            : "This user don't exist"
        );
      })
      .finally(() => {
        this.showLoading = false;
        this._changeDetectorRef.detectChanges();
      });
  }
}
