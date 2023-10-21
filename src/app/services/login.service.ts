import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UtilsService } from '../utils/utils.service';
import { UserService } from './user.service';
import { User } from '../interfaces/User';
import { Credentials } from '../interfaces/Credentials';
import { UserConfigsService } from './userConfigs.service';
import { UserConfigs } from '../interfaces/UserConfigs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  apiUrl = `${environment.baseApiUrl}login`;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _utilsService: UtilsService,
    private _userService: UserService,
    private _userConfigsService: UserConfigsService
  ) {}

  async login(credentials: Credentials) {
    const savedConfigs = localStorage.getItem('savedConfigsFinax');
    var language: string = '';
    if (savedConfigs) {
      language = JSON.parse(atob(savedConfigs)).language;
    }

    const basicAuth = 'client-id:secret-id';
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic ' + btoa(basicAuth));

    let params = new HttpParams();
    params = params.append('grant_type', 'password');
    params = params.append('username', credentials.email);
    params = params.append('password', credentials.password);

    await lastValueFrom(
      this._http.get(`${environment.baseApiUrl}oauth/token`, {
        headers: headers,
        params: params,
      })
    )
      .then((result: any) => {
        if (!result) {
          this._utilsService.showSimpleMessage(
            language === 'pt-br' ? 'Login inválido' : 'Invalid login'
          );
          return;
        }

        this._userService
          .getByEmail(result.username)
          .then((user: User) => {
            if (!user) {
              this._utilsService.showSimpleMessage(
                language === 'pt-br' ? 'Login inválido' : 'Invalid login'
              );
              return;
            }

            if (user.activate === false) {
              this._utilsService.showSimpleMessage(
                language === 'pt-br'
                  ? 'Usuário inativo, verifique seu email'
                  : 'Inactive user, check your email'
              );
              return;
            }

            localStorage.setItem(
              'tokenFinax',
              btoa(JSON.stringify(result.access_token))
            );
            localStorage.setItem('userFinax', btoa(JSON.stringify(user)));

            if (credentials.changedPassword) {
              this._utilsService.showSimpleMessage(
                language === 'pt-br'
                  ? 'Senha alterada com sucesso'
                  : 'Password changed successfully'
              );
            } else {
              this._utilsService.showSimpleMessage(
                language === 'pt-br'
                  ? 'Login realizado com sucesso'
                  : 'Login successfully'
              );
            }

            this._router.navigate(['home']);

            if (credentials.rememberMe) {
              localStorage.setItem(
                'savedLoginFinax',
                btoa(JSON.stringify(credentials))
              );
            } else localStorage.removeItem('savedLoginFinax');

            this._userConfigsService
              .getByUserId(user.id!)
              .then((userConfigs: UserConfigs) => {
                this._utilsService.userConfigs.next(userConfigs);
                localStorage.setItem(
                  'savedUserConfigsFinax',
                  btoa(JSON.stringify(userConfigs))
                );
              })
              .catch(() => {
                const userConfigs: UserConfigs = {
                  userId: user.id!,
                  theme: 'light',
                  addingMaterialGoodsToPatrimony: false,
                  language: 'pt-br',
                  currency: 'R$',
                };
                this._userConfigsService.save(userConfigs);
              });
          })
          .catch(() => {
            this._utilsService.showSimpleMessage(
              language === 'pt-br'
                ? 'Erro ao obter o usuário, entre em contato com nosso suporte'
                : 'Error getting the user, please contact our support'
            );
          });
      })
      .catch(() => {
        this._utilsService.showSimpleMessage(
          language === 'pt-br' ? 'Login inválido' : 'Invalid login'
        );
      });
  }

  logout() {
    localStorage.removeItem('userFinax');
    localStorage.removeItem('tokenFinax');
    this._router.navigate(['']);
    this._utilsService.userImage.next('assets/user-image.png');
  }

  get getLoggedUser(): User {
    return localStorage.getItem('userFinax')
      ? JSON.parse(atob(localStorage.getItem('userFinax')!))
      : null;
  }

  get getLoggedUserId(): number {
    return +JSON.parse(atob(localStorage.getItem('userFinax')!)).id;
  }

  get getUserToken(): string {
    return localStorage.getItem('tokenFinax')
      ? JSON.parse(atob(localStorage.getItem('tokenFinax')!))
      : null;
  }

  get getUserAccess(): string {
    return localStorage.getItem('userFinax')
      ? JSON.parse(atob(localStorage.getItem('userFinax')!)).access
      : null;
  }

  get logged(): boolean {
    return localStorage.getItem('tokenFinax') ? true : false;
  }

  stillLoggedTest() {
    lastValueFrom(this._http.get(`${this.apiUrl}/authentication-test`)).catch(
      () => {
        localStorage.removeItem('tokenFinax');
        localStorage.removeItem('userFinax');
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
}
