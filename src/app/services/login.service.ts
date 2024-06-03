import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { addHours } from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Credentials } from '../interfaces/credentials';
import { User } from '../interfaces/user';
import { UserConfigs } from '../interfaces/user-configs';
import { UtilsService } from '../utils/utils.service';
import { AuthService } from './auth.service';
import { UserConfigsService } from './user-configs.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _utilsService = inject(UtilsService);
  private readonly _userConfigsService = inject(UserConfigsService);
  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UserService);

  private readonly apiUrl = `${environment.baseApiUrl}login`;

  async login(credentials: Credentials) {
    await this._authService
      .doLogin(credentials)
      .then(async (response) => {
        if (!response) {
          this._utilsService.showMessage('login.invalid-login');
          return;
        }

        this.setToken(response.token);

        await this._userService
          .getTokenUser(response.token)
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

            this._router.navigate(['home']);
          })
          .catch(() => {
            this._utilsService.showMessage('login.error-getting-user');
          });
      })
      .catch((err) => {
        switch (err.error.error_description) {
          case 'Inactive user':
            this._utilsService.showMessage('login.inactive-user');
            break;
          default:
            this._utilsService.showMessage('login.invalid-login');
            break;
        }
      });
  }

  updateLoggedUser(user: User) {
    user.password = '';
    user.profileImage = undefined;

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
      addHours(new Date(), 2).toString()
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
