import { Component, OnInit, inject } from '@angular/core';
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
})
export class CreateAccountComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _loginService = inject(LoginService);

  userRegisterForm!: FormGroup;
  showLoading: boolean = false;

  language: string = this.utilsService.getSavedUserConfigs.language;

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
      this.utilsService.showSimpleMessage(
        'A senha não cumpre os requisitos de segurança'
      );
      return;
    } else if (this.userRegisterForm.invalid) return;

    this.showLoading = true;

    this._loginService
      .newUser(this.userRegisterForm.value)
      .then((result) => {
        this.showLoading = false;
        this.utilsService.showSimpleMessageWithoutDuration(
          this.language === 'pt-br'
            ? `Conta criada com sucesso, um link de ativação foi enviado \n para o email: ${result.email}`
            : `Account created successfully, an activation link was sent to the email: ${result.email}`
        );
        this._router.navigate(['login']);
      })
      .catch((error) => {
        this.showLoading = false;
        if (error.status == 406) {
          this.utilsService.showSimpleMessage(
            this.language === 'pt-br'
              ? 'Esse usuário já existe'
              : 'This user already exists'
          );
        } else {
          this.utilsService.showSimpleMessage(
            this.language === 'pt-br'
              ? 'Erro ao criar o usuário, entre em contato com nosso suporte'
              : 'Error creating user, please contact our support'
          );
        }
      });
  }
}
