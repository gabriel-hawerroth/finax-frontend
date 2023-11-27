import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginService } from './login.service';
import { lastValueFrom } from 'rxjs';
import { Account } from '../interfaces/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _http = inject(HttpClient);
  private _loginService = inject(LoginService);

  apiUrl = `${environment.baseApiUrl}accounts`;

  getByUser() {
    return lastValueFrom(
      this._http.get(
        `${this.apiUrl}/get-by-user/${this._loginService.getLoggedUserId}`
      )
    );
  }

  getById(id: number) {
    return lastValueFrom(this._http.get(`${this.apiUrl}/${id}`));
  }

  save(data: Account) {
    data.userId = this._loginService.getLoggedUserId;

    return lastValueFrom(this._http.post(this.apiUrl, data));
  }
}
