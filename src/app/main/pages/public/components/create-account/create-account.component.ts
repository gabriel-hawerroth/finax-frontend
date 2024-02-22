import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../../../../services/login.service';
import { UtilsService } from '../../../../../utils/utils.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterModule,
    NgOptimizedImage,
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _loginService = inject(LoginService);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  language: string = this.utilsService.getUserConfigs.language;

  userRegisterForm!: FormGroup;
  showLoading: boolean = false;

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
        this.language === 'pt-br'
          ? 'A senha não cumpre os requisitos de segurança'
          : "Password doesn't meet security requirements"
      );
    } else if (this.userRegisterForm.invalid) {
      this.utilsService.showMessage(
        this.language === 'pt-br' ? 'Formulário inválido' : 'Invalid form'
      );
    }

    this.showLoading = true;

    this._loginService
      .newUser(this.userRegisterForm.value)
      .then((result) => {
        this.showLoading = false;
        this.utilsService.showMessageWithoutDuration(
          this.language === 'pt-br'
            ? `Conta criada com sucesso, um link de ativação foi enviado \n para o email: ${result.email}`
            : `Account created successfully, an activation link was sent to the email: ${result.email}`
        );
        this._router.navigate(['login']);
      })
      .catch((error) => {
        this.showLoading = false;
        if (error.status == 406) {
          this.utilsService.showMessage(
            this.language === 'pt-br'
              ? 'Esse email já está cadastrado'
              : 'This email is already registered'
          );
        } else {
          this.utilsService.showMessage(
            this.language === 'pt-br'
              ? 'Erro ao criar o usuário, entre em contato com nosso suporte'
              : 'Error creating user, please contact our support'
          );
        }
      })
      .finally(() => {
        this._changeDetectorRef.detectChanges();
      });
  }
}
