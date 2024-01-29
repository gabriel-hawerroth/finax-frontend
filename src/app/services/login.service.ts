import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { UtilsService } from '../utils/utils.service';
import { User } from '../interfaces/User';
import { Credentials } from '../interfaces/Credentials';
import { UserService } from './user.service';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _http = inject(HttpClient);
  private _router = inject(Router);
  private _utilsService = inject(UtilsService);
  private _userService = inject(UserService);

  apiUrl = `${environment.baseApiUrl}login`;

  async login(credentials: Credentials) {
    const language = this._utilsService.getUserConfigs.language;

    await this.oauthLogin(credentials).then(async (response: any) => {
      if (!response) {
        this._utilsService.showSimpleMessage(
          language === 'pt-br' ? 'Login inválido' : 'Invalid login'
        );
        return;
      }

      await this._userService
        .getByEmail(response.username)
        .then((user: User) => {
          if (!user) {
            this._utilsService.showSimpleMessage(
              language === 'pt-br'
                ? 'Erro ao obter o usuário, entre em contato com nosso suporte'
                : 'Error getting the user, please contact our support'
            );
            return;
          }

          this._router.navigate(['home']);

          if (!credentials.changedPassword) {
            this._utilsService.showSimpleMessage(
              language === 'pt-br'
                ? 'Login realizado com sucesso'
                : 'Login successfully'
            );
          } else {
            this._utilsService.showSimpleMessage(
              language === 'pt-br'
                ? 'Senha alterada com sucesso'
                : 'Password changed successfully'
            );
          }

          this._utilsService.setItemLocalStorage(
            'tokenFinax',
            btoa(JSON.stringify(response.access_token))
          );
          this._utilsService.setItemLocalStorage(
            'userFinax',
            btoa(JSON.stringify(user))
          );

          if (credentials.rememberMe) {
            this._utilsService.setItemLocalStorage(
              'savedLoginFinax',
              btoa(JSON.stringify(credentials))
            );
          } else {
            this._utilsService.removeItemLocalStorage('savedLoginFinax');
          }

          this._utilsService.setItemLocalStorage(
            'tokenExpiration',
            moment().add(1, 'hour').toDate().toString()
          );
        })
        .catch((error) => {
          this._utilsService.showSimpleMessage(
            language === 'pt-br'
              ? 'Erro ao obter o usuário, entre em contato com o nosso suporte'
              : 'Error getting the user, please contact our support'
          );
        });
    });
  }

  oauthLogin(credentials: Credentials) {
    const basicAuth = 'client-id:secret-id';
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic ' + btoa(basicAuth));

    let params = new HttpParams();
    params = params.append('grant_type', 'password');
    params = params.append('username', credentials.email);
    params = params.append('password', credentials.password);

    return lastValueFrom(
      this._http.get(`${environment.baseApiUrl}oauth/token`, {
        headers: headers,
        params: params,
      })
    );
  }

  logout(showMessage: boolean = true) {
    this._utilsService.removeItemLocalStorage('userFinax');
    this._utilsService.removeItemLocalStorage('tokenFinax');
    this._utilsService.removeItemLocalStorage('tokenExpiration');
    this._router.navigate(['']);
    this._utilsService.userImage.next('assets/user-image.webp');
    if (showMessage)
      this._utilsService.showSimpleMessage(
        this._utilsService.getUserConfigs.language === 'pt-br'
          ? 'Acesso expirado, por favor logue novamente'
          : 'Access expired, please log in again',
        5000
      );
  }

  newUser(user: User): Promise<User> {
    return lastValueFrom(
      this._http.post<User>(`${this.apiUrl}/new-user`, user)
    );
  }

  sendChangePasswordEmail(userId: number): Promise<any> {
    let params = new HttpParams();
    params = params.append('userId', userId);

    return lastValueFrom(
      this._http.post(`${this.apiUrl}/send-change-password-email`, params)
    );
  }

  get getLoggedUser(): User {
    return this._utilsService.getItemLocalStorage('userFinax')
      ? JSON.parse(atob(this._utilsService.getItemLocalStorage('userFinax')!))
      : null;
  }

  get getLoggedUserId(): number {
    return this._utilsService.getItemLocalStorage('userFinax')
      ? +JSON.parse(atob(this._utilsService.getItemLocalStorage('userFinax')!))
          .id
      : 0;
  }

  get getUserToken(): string {
    return this._utilsService.getItemLocalStorage('tokenFinax')
      ? JSON.parse(atob(this._utilsService.getItemLocalStorage('tokenFinax')!))
      : '';
  }

  get getUserAccess(): string {
    return this._utilsService.getItemLocalStorage('userFinax')
      ? JSON.parse(atob(this._utilsService.getItemLocalStorage('userFinax')!))
          .access
      : null;
  }

  get logged(): boolean {
    return this._utilsService.getItemLocalStorage('tokenFinax') ? true : false;
  }
}
