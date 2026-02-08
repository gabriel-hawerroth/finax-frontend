import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { addHours } from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  LS_REPORT_RELEASES_BY_ACCOUNT_CONFIGS,
  LS_REPORT_RELEASES_BY_CATEGORY_CONFIGS,
} from '../../../shared/utils/local-storage-contants';
import { cloudFireCdnLink } from '../../../shared/utils/utils';
import { UtilsService } from '../../../shared/utils/utils.service';
import { onLogoutEvent } from '../../events/events';
import { UserConfigsService } from '../user-configs/user-configs.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Credentials } from './credentials';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly apiUrl = `${environment.baseApiUrl}login`;

  isLogged = signal(this.logged);
  isLogged$ = toObservable(this.isLogged);

  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router,
    private readonly _utils: UtilsService,
    private readonly _authService: AuthService,
    private readonly _userConfigsService: UserConfigsService,
    private readonly _userService: UserService
  ) {
    onLogoutEvent.subscribe((event) =>
      this.logout(event.showMessage, event.redirectToPublicPage)
    );
  }

  async login(credentials: Credentials) {
    await this._authService
      .doLogin(credentials)
      .then(async (response) => {
        if (!response.token || !response.user) {
          this._utils.showMessage('login.error-getting-user');
          return;
        }

        this._utils.updateLoggedUser(response.user);

        if (credentials.rememberMe) {
          this._utils.setItemLocalStorage(
            'savedLoginFinax',
            btoa(JSON.stringify(credentials))
          );
        } else {
          this._utils.removeItemLocalStorage('savedLoginFinax');
        }

        // Token is now handled by httpOnly cookie

        this.getUserConfigs();
        this.getUserImage();

        if (!credentials.changedPassword) {
          this._utils.showMessage('login.login-successfully');
        } else {
          this._utils.showMessage('change-password.changed-successfully');
        }

        this._router.navigateByUrl('home');
        this.isLogged.set(true);
      })
      .catch((err) => {
        if (err.error.message === 'Failed to fetch') {
          this._utils.showJoinedMessages(
            '. ',
            4500,
            'generic.server-down',
            'generic.try-again-later'
          );
          return;
        }

        switch (err.error.errorDescription) {
          case 'inactive user':
            this._utils.showMessage('login.inactive-user');
            break;
          case 'bad credentials':
            this._utils.showMessage('login.invalid-login');
            break;
          default:
            this._utils.showJoinedMessages(
              '. ',
              4500,
              'generic.server-down',
              'generic.try-again-later'
            );
            break;
        }
      });
  }

  getUserConfigs() {
    this._userConfigsService.getLoggedUserConfigs().then((response) => {
      this._utils.setUserConfigs(response);
      this._utils.setItemLocalStorage(
        'savedUserConfigsFinax',
        JSON.stringify(response)
      );
    });
  }

  getUserImage() {
    this._userService.getUserImage().then((response) => {
      if (!response) return;

      this._utils.userImage.next(
        `${cloudFireCdnLink}/user/profile-image/${response}`
      );
    });
  }

  logout(showMessage: boolean, redirectToPublicPage: boolean = true) {
    // Call logout API to clear cookie
    this._http.post(`${environment.baseApiUrl}logout`, {}).subscribe({
      error: () => console.warn('Logout API call failed')
    });

    this.isLogged.set(false);

    if (redirectToPublicPage) this._router.navigateByUrl('login');

    this.clearLocalStorage();

    if (showMessage) this._utils.showMessage('login.access-expired', 5000);
  }

  private clearLocalStorage() {
    this._utils.removeItemLocalStorage('userFinax');
    this._utils.removeItemLocalStorage('tokenFinax'); // cleanup old token
    this._utils.removeItemLocalStorage('tokenExpiration'); // cleanup old expiration
    this._utils.removeItemLocalStorage('selectedMonthCashFlow');
    this._utils.removeItemLocalStorage(LS_REPORT_RELEASES_BY_CATEGORY_CONFIGS);
    this._utils.removeItemLocalStorage(LS_REPORT_RELEASES_BY_ACCOUNT_CONFIGS);
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

  get logged(): boolean {
    return this._utils.getItemLocalStorage('userFinax') ? true : false;
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
