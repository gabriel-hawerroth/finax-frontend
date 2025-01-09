import { CommonModule, NgOptimizedImage } from '@angular/common';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../core/entities/auth/auth.service';
import { ButtonsComponent } from '../../../../shared/components/buttons/buttons.component';
import {
  cloudFireCdnImgsLink,
  getBtnStyle,
} from '../../../../shared/utils/utils';
import { UtilsService } from '../../../../shared/utils/utils.service';

@Component({
  selector: 'app-create-account',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterModule,
    NgOptimizedImage,
    TranslateModule,
    ButtonsComponent,
    MatCheckboxModule,
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountPage implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly getBtnStyle = getBtnStyle;

  userRegisterForm!: FormGroup;
  showLoading = signal(false);

  constructor(
    public readonly utils: UtilsService,
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _matSnackBar: MatSnackBar,
    private readonly _translate: TranslateService,
    private readonly _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.userRegisterForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(this.utils.passwordValidator()),
        ],
      ],
      firstName: ['', Validators.required],
      lastName: '',
      useTerms: [false, Validators.requiredTrue],
    });
  }

  createUser() {
    if (this.userRegisterForm.get('password')!.invalid) {
      this.userRegisterForm.controls['password'].markAsTouched();
      this.utils.showMessage(
        "generic.password-doesn't-meet-security-requirements"
      );
      return;
    } else if (this.userRegisterForm.get('useTerms')!.invalid) {
      this.userRegisterForm.controls['useTerms'].markAsTouched();
      this.utils.showMessage('create-account.accept-terms');
      return;
    } else if (this.userRegisterForm.invalid) {
      this.userRegisterForm.markAllAsTouched();
      this.utils.showMessage('generic.invalid-form');
      return;
    }

    this.showLoading.set(true);
    this._authService
      .registerNewUser(this.userRegisterForm.value)
      .then((result) => {
        this._matSnackBar.open(
          `${this._translate.instant('create-account.sended-activate-link')}: ${
            result.email
          }`,
          'OK'
        );
        this._router.navigateByUrl('login');
      })
      .catch((err) => {
        if (err.error.errorDescription === 'this email is already in use')
          this.utils.showMessage(
            'create-account.email-already-registered',
            5000
          );
        else if (err.error.errorDescription === 'invalid email')
          this.utils.showMessage('generic.invalid-mail', 6000);
        else this.utils.showMessage('create-account.error-creating-user', 4000);
      })
      .finally(() => this.showLoading.set(false));
  }
}
