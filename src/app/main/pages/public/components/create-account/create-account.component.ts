import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../../services/auth.service';
import { UtilsService } from '../../../../../utils/utils.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterModule,
    NgOptimizedImage,
    TranslateModule,
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountComponent implements OnInit {
  public readonly utilsService = inject(UtilsService);
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _matSnackBar = inject(MatSnackBar);
  private readonly _translate = inject(TranslateService);
  private readonly _authService = inject(AuthService);

  public userRegisterForm!: FormGroup;
  public showLoading = signal(false);

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
          Validators.pattern(this.utilsService.passwordValidator()),
        ],
      ],
      firstName: ['', Validators.required],
      lastName: '',
    });

    this.userRegisterForm.markAllAsTouched();
  }

  createUser() {
    if (this.userRegisterForm.get('password')!.invalid) {
      this.utilsService.showMessage(
        "generic.password-doesn't-meet-security-requirements"
      );
      return;
    } else if (this.userRegisterForm.invalid) {
      this.utilsService.showMessage('generic.invalid-form');
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
        this._router.navigate(['login']);
      })
      .catch((error) => {
        if (error.status == 406) {
          this.utilsService.showMessage(
            'create-account.email-already-registered'
          );
        } else {
          this.utilsService.showMessage('create-account.error-creating-user');
        }
      })
      .finally(() => this.showLoading.set(false));
  }
}
