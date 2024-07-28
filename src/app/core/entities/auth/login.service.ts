import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { addHours } from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UtilsService } from '../../../shared/utils/utils.service';
import { UserConfigs } from '../user-configs/user-configs';
import { UserConfigsService } from '../user-configs/user-configs.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Credentials } from './credentials';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly apiUrl = `${environment.baseApiUrl}login`;

  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router,
    private readonly _utils: UtilsService,
    private readonly _userConfigsService: UserConfigsService,
    private readonly _authService: AuthService,
    private readonly _userService: UserService
  ) {}

  async login(credentials: Credentials) {
    await this._authService
      .doLogin(credentials)
      .then(async (response) => {
        if (!response) {
          this._utils.showMessage('login.invalid-login');
          return;
        }

        this.setToken(response.token);

        await this._userService
          .getTokenUser(response.token)
          .then((user: User) => {
            if (!user) {
              this._utils.showMessage('login.error-getting-user');
              return;
            }

            this._utils.updateLoggedUser(user);

            this._userConfigsService
              .getLoggedUserConfigs()
              .then((response: UserConfigs) => {
                this._utils.setUserConfigs(response);
                this._utils.setItemLocalStorage(
                  'savedUserConfigsFinax',
                  JSON.stringify(response)
                );
              });

            if (credentials.rememberMe) {
              this._utils.setItemLocalStorage(
                'savedLoginFinax',
                btoa(JSON.stringify(credentials))
              );
            } else {
              this._utils.removeItemLocalStorage('savedLoginFinax');
            }

            if (!credentials.changedPassword) {
              this._utils.showMessage('login.login-successfully');
            } else {
              this._utils.showMessage('change-password.changed-successfully');
            }

            this._router.navigateByUrl('home');
          })
          .catch(() => {
            this._utils.showMessage('login.error-getting-user');
          });
      })
      .catch((err) => {
        switch (err.error.errorDescription) {
          case 'inactive user':
            this._utils.showMessage('login.inactive-user');
            break;
          default:
            this._utils.showMessage('login.invalid-login');
            break;
        }
      });
  }

  setToken(token: string) {
    this._utils.setItemLocalStorage('tokenFinax', btoa(JSON.stringify(token)));
    this._utils.setItemLocalStorage(
      'tokenExpiration',
      addHours(new Date(), 2).toString()
    );
  }

  logout(showMessage: boolean, redirectToPublicPage: boolean = true) {
    if (redirectToPublicPage) this._router.navigate(['']);

    this._utils.removeItemLocalStorage('userFinax');
    this._utils.removeItemLocalStorage('tokenFinax');
    this._utils.removeItemLocalStorage('tokenExpiration');
    this._utils.removeItemLocalStorage('selectedMonthCashFlow');
    this._utils.userImage.next('');

    if (showMessage) this._utils.showMessage('login.access-expired', 5000);
  }

  sendChangePasswordEmail(email: string): Promise<void> {
    let params = new HttpParams();
    params = params.append('email', email);

    return lastValueFrom(
      this._http.post<void>(`${this.apiUrl}/send-change-password-email`, null, {
        params,
      })
    );
  }

  get getUserToken(): string | null {
    return this._utils.getItemLocalStorage('tokenFinax')
      ? JSON.parse(atob(this._utils.getItemLocalStorage('tokenFinax')!))
      : null;
  }

  get logged(): boolean {
    return this._utils.getItemLocalStorage('tokenFinax') ? true : false;
  }

  sendCancelUserAccountEmail(): Promise<void> {
    const userId = this._utils.getLoggedUser?.id;
    if (!userId) {
      throw new Error('user must be logged to send cancel user account email');
    }

    return lastValueFrom(
      this._http.post<void>(
        `${this.apiUrl}/send-cancel-account-email/${userId}`,
        null
      )
    );
  }
}
