import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../../../../services/login.service';
import { UtilsService } from '../../../../../utils/utils.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgOptimizedImage,
    MatCheckboxModule,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  public readonly utilsService = inject(UtilsService);
  public readonly loginService = inject(LoginService);
  private readonly _fb = inject(FormBuilder);

  public loginForm!: FormGroup;
  public showLoading = signal(false);

  ngOnInit(): void {
    this.buildForm();

    const savedLogin = this.utilsService.getItemLocalStorage('savedLoginFinax');
    if (savedLogin) this.loginForm.patchValue(JSON.parse(atob(savedLogin!)));

    this.loginForm.markAllAsTouched();
  }

  buildForm() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: false,
    });

    this.loginForm.markAllAsTouched();
  }

  login() {
    if (this.loginForm.invalid) return;

    const credentials = this.loginForm.value;
    this.showLoading.set(true);

    this.loginService
      .login(credentials)
      .finally(() => this.showLoading.set(false));
  }
}
