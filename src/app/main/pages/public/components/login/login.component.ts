import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../../../../services/login.service';
import { UtilsService } from '../../../../../utils/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { ReleasedFeaturesDialogComponent } from '../../../../dialogs/released-features-dialog/released-features-dialog.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
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
  public utilsService = inject(UtilsService);
  public loginService = inject(LoginService);
  private _fb = inject(FormBuilder);
  private _matDialog = inject(MatDialog);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  loginForm!: FormGroup;
  showLoading: boolean = false;

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
    this.showLoading = true;

    this.loginService.login(credentials).finally(() => {
      this.showLoading = false;
      this._changeDetectorRef.detectChanges();
    });
  }

  openReleasedFeatures() {
    this._matDialog.open(ReleasedFeaturesDialogComponent, {
      width: '65%',
      height: '55%',
      autoFocus: false,
      panelClass: 'released-features-dialog',
    });
  }
}
