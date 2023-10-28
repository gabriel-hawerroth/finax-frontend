import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit {
  userRegisterForm!: FormGroup;
  showLoading: boolean = false;
  darkTheme: boolean = false;
  language: string = 'pt-br';

  constructor(
    private _fb: FormBuilder,
    private _utilsService: UtilsService,
    private _router: Router,
    private _loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.buildForm();

    const configs = localStorage.getItem('savedUserConfigsFinax');
    if (configs) {
      const savedConfigs: any = JSON.parse(atob(configs));
      this.darkTheme = savedConfigs.theme === 'dark';
      this.language = savedConfigs.language;
    }
  }

  buildForm() {
    this.userRegisterForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(this._utilsService.passwordValidator()),
        ],
      ],
      firstName: ['', Validators.required],
      lastName: '',
    });
  }

  createUser() {
    this.showLoading = true;

    if (this.userRegisterForm.invalid) return;

    this._loginService
      .newUser(this.userRegisterForm.value)
      .then((result) => {
        this.showLoading = false;
        this._utilsService.showSimpleMessageWithoutDuration(
          this.language === 'pt-br'
            ? `Conta criada com sucesso, um link de ativação foi enviado \n para o email: ${result.email}`
            : `Account created successfully, an activation link was sent to the email: ${result.email}`
        );
        this._router.navigate(['login']);
      })
      .catch((error) => {
        this.showLoading = false;
        if (error.status == 406) {
          this._utilsService.showSimpleMessage(
            this.language === 'pt-br'
              ? 'Esse usuário já existe'
              : 'This user already exists'
          );
        } else {
          this._utilsService.showSimpleMessage(
            this.language === 'pt-br'
              ? 'Erro ao criar o usuário, entre em contato com nosso suporte'
              : 'Error creating user, please contact our support'
          );
        }
      });
  }
}
