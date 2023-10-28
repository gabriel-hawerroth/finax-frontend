import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showLoading: boolean = false;
  darkTheme: boolean = false;
  language: string = 'pt-br';

  constructor(private _fb: FormBuilder, private _loginService: LoginService) {}

  ngOnInit(): void {
    this.buildForm();

    const savedLogin = localStorage.getItem('savedLoginFinax');
    if (savedLogin) this.loginForm.patchValue(JSON.parse(atob(savedLogin!)));

    const configs = localStorage.getItem('savedUserConfigsFinax');
    if (configs) {
      const savedConfigs = JSON.parse(atob(configs));
      this.darkTheme = savedConfigs.theme === 'dark';
      this.language = savedConfigs.language;
    }

    this.loginForm.markAllAsTouched();
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
    this.showLoading = true;

    this._loginService.login(this.loginForm.value).finally(() => {
      this.showLoading = false;
    });
  }
}
