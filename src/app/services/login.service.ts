import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import moment from 'moment';

import { environment } from '../../environments/environment';
import { UtilsService } from '../utils/utils.service';
import { User } from '../interfaces/user';
import { Credentials } from '../interfaces/credentials';
import { UserConfigsService } from './user-configs.service';
import { UserConfigs } from '../interfaces/user-configs';
import { AuthResponse } from '../interfaces/auth-response';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _utilsService = inject(UtilsService);
  private readonly _userConfigsService = inject(UserConfigsService);

  private readonly apiUrl = `${environment.baseApiUrl}login`;

  async login(credentials: Credentials) {
    await this.oauthLogin(credentials)
      .then(async (response) => {
        if (!response) {
          this._utilsService.showMessage('login.invalid-login');
          return;
        }

        this.setToken(response.token);
        this._router.navigate(['home']);

        let headers = new HttpHeaders();
        headers = headers.append('Authorization', `Bearer ${response.token}`);

        await lastValueFrom(
          this._http.get<User>(`${environment.baseApiUrl}user/get-auth-user`, {
            headers,
          })
        )
          .then((user: User) => {
            if (!user) {
              this._utilsService.showMessage('login.error-getting-user');
              return;
            }

            this.updateLoggedUser(user);

            this._utilsService.getUserConfigs;
            this._userConfigsService
              .getLoggedUserConfigs()
              .then((response: UserConfigs) => {
                this._utilsService.setUserConfigs(response);
                this._utilsService.setItemLocalStorage(
                  'savedUserConfigsFinax',
                  JSON.stringify(response)
                );
              });

            if (credentials.rememberMe) {
              this._utilsService.setItemLocalStorage(
                'savedLoginFinax',
                btoa(JSON.stringify(credentials))
              );
            } else {
              this._utilsService.removeItemLocalStorage('savedLoginFinax');
            }

            if (!credentials.changedPassword) {
              this._utilsService.showMessage('login.login-successfully');
            } else {
              this._utilsService.showMessage(
                'change-password.changed-successfully'
              );
            }
          })
          .catch(() => {
            this._utilsService.showMessage('login.error-getting-user');
          });
      })
      .catch((err) => {
        switch (err.error.error_description) {
          case 'Bad credentials':
            this._utilsService.showMessage('login.invalid-login');
            break;
          case 'Inactive user':
            this._utilsService.showMessage('login.inactive-user');
        }
      });
  }

  oauthLogin(credentials: Credentials): Promise<AuthResponse> {
    const authDTO = {
      login: credentials.email,
      password: credentials.password,
    };

    return lastValueFrom(
      this._http.post<AuthResponse>(
        `${environment.baseApiUrl}auth/login`,
        authDTO
      )
    );
  }

  updateLoggedUser(user: User) {
    this._utilsService.setItemLocalStorage(
      'userFinax',
      btoa(JSON.stringify(user))
    );
    this._utilsService.userName.next(user.firstName);
  }

  setToken(token: string) {
    this._utilsService.setItemLocalStorage(
      'tokenFinax',
      btoa(JSON.stringify(token))
    );
    this._utilsService.setItemLocalStorage(
      'tokenExpiration',
      moment().add(1, 'hour').toDate().toString()
    );
  }

  logout(showMessage: boolean) {
    this._router.navigate(['']);

    this._utilsService.removeItemLocalStorage('userFinax');
    this._utilsService.removeItemLocalStorage('tokenFinax');
    this._utilsService.removeItemLocalStorage('tokenExpiration');
    this._utilsService.removeItemLocalStorage('selectedMonthCashFlow');

    if (showMessage)
      this._utilsService.showMessage('login.access-expired', 5000);
  }

  newUser(user: User): Promise<User> {
    return lastValueFrom(
      this._http.post<User>(`${this.apiUrl}/new-user`, user)
    );
  }

  sendChangePasswordEmail(email: string): Promise<any> {
    let params = new HttpParams();
    params = params.append('email', email);

    return lastValueFrom(
      this._http.post(`${this.apiUrl}/send-change-password-email`, params)
    );
  }

  get getUserToken(): string | null {
    return this._utilsService.getItemLocalStorage('tokenFinax')
      ? JSON.parse(atob(this._utilsService.getItemLocalStorage('tokenFinax')!))
      : null;
  }

  get logged(): boolean {
    return this._utilsService.getItemLocalStorage('tokenFinax') ? true : false;
  }
}
