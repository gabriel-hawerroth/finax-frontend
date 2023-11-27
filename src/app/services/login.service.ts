import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
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
  private _http = inject(HttpClient);
  private _router = inject(Router);
  private _utilsService = inject(UtilsService);
  private _userService = inject(UserService);
  private _userConfigsService = inject(UserConfigsService);

  apiUrl = `${environment.baseApiUrl}login`;

  async login(credentials: Credentials) {
    const language = this._utilsService.getSavedUserConfigs.language;

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
      .then(async (result: any) => {
        if (!result) {
          this._utilsService.showSimpleMessage(
            language === 'pt-br' ? 'Login inválido' : 'Invalid login'
          );
          return;
        }

        await this._userService
          .getByEmail(result.username)
          .then((user: User) => {
            if (!user) {
              this._utilsService.showSimpleMessage(
                language === 'pt-br'
                  ? 'Erro ao obter o usuário, entre em contato com nosso suporte'
                  : 'Error getting the user, please contact our support'
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

            this._router.navigate(['home']);

            this._utilsService.setItemLocalStorage(
              'tokenFinax',
              btoa(JSON.stringify(result.access_token))
            );
            this._utilsService.setItemLocalStorage(
              'userFinax',
              btoa(JSON.stringify(user))
            );

            this._utilsService.userToken = btoa(
              JSON.stringify(result.access_token)
            );

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

            if (credentials.rememberMe) {
              this._utilsService.setItemLocalStorage(
                'savedLoginFinax',
                btoa(JSON.stringify(credentials))
              );
            } else {
              this._utilsService.removeItemLocalStorage('savedLoginFinax');
            }

            this._userConfigsService
              .getByUserId(user.id!)
              .then((userConfigs: UserConfigs) => {
                this._utilsService.userConfigs.next(userConfigs);

                this._utilsService.setItemLocalStorage(
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
      .catch((error) => {
        if (error.status === 0) {
          this._utilsService.showSimpleMessage('Sistema fora do ar');
        } else {
          this._utilsService.showSimpleMessage(
            language === 'pt-br' ? 'Login inválido' : 'Invalid login'
          );
        }
      });
  }

  logout(userLogout: boolean = false) {
    this._utilsService.removeItemLocalStorage('userFinax');
    this._utilsService.removeItemLocalStorage('tokenFinax');
    this._router.navigate(['']);
    this._utilsService.userImage.next('assets/user-image.webp');
    this._utilsService.userToken = '';
    if (!userLogout)
      this._utilsService.showSimpleMessage(
        'Acesso expirado, por favor logue novamente'
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

  stillLoggedTest() {
    lastValueFrom(this._http.get(`${this.apiUrl}/authentication-test`)).catch(
      () => {
        this.logout();
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
