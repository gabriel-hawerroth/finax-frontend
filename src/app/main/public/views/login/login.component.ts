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
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../../../core/entities/auth/login.service';
import { ButtonsComponent } from '../../../../shared/components/buttons/buttons.component';
import {
  cloudFireCdnImgsLink,
  getBtnStyle,
} from '../../../../shared/utils/utils';
import { UtilsService } from '../../../../shared/utils/utils.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgOptimizedImage,
    MatCheckboxModule,
    RouterModule,
    TranslateModule,
    ButtonsComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly getBtnStyle = getBtnStyle;

  loginForm!: FormGroup;
  showLoading = signal(false);

  constructor(
    public readonly utils: UtilsService,
    public readonly loginService: LoginService,
    private readonly _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();

    const savedLogin = this.utils.getItemLocalStorage('savedLoginFinax');
    if (savedLogin) this.loginForm.patchValue(JSON.parse(atob(savedLogin!)));
  }

  buildForm() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: false,
    });
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
