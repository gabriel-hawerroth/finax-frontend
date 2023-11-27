import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { UtilsService } from '../utils/utils.service';
import { User } from '../interfaces/User';
import { Credentials } from '../interfaces/Credentials';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _http = inject(HttpClient);
  private _router = inject(Router);
  private _utilsService = inject(UtilsService);

  apiUrl = `${environment.baseApiUrl}login`;

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
    this._router.navigate(['']);
    this._utilsService.userImage.next('assets/user-image.webp');
    if (showMessage)
      this._utilsService.showSimpleMessage(
        this._utilsService.getUserConfigs.language === 'pt-br'
          ? 'Acesso expirado, por favor logue novamente'
          : 'Access expired, please log in again'
      );
  }

  stillLoggedTest() {
    lastValueFrom(this._http.get(`${this.apiUrl}/authentication-test`)).catch(
      (err) => {
        if (err.status === 0) {
          this._utilsService.showSimpleMessage(
            this._utilsService.getUserConfigs.language === 'pt-br'
              ? 'Atualização em andamento, tente novamente mais tarde'
              : 'Update in progress, please try again later'
          );
        } else if (err.status === 401) {
          this.logout();
        }
      }
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
    return +JSON.parse(
      atob(this._utilsService.getItemLocalStorage('userFinax')!)
    ).id;
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
