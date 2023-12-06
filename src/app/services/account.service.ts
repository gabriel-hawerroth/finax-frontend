import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginService } from './login.service';
import { lastValueFrom } from 'rxjs';
import { Account } from '../interfaces/Account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _http = inject(HttpClient);
  private _loginService = inject(LoginService);

  apiUrl = `${environment.baseApiUrl}accounts`;

  getByUser(): Promise<Account[]> {
    return lastValueFrom(
      this._http.get<Account[]>(
        `${this.apiUrl}/get-by-user/${this._loginService.getLoggedUserId}`
      )
    );
  }

  getById(id: number): Promise<Account> {
    return lastValueFrom(this._http.get<Account>(`${this.apiUrl}/${id}`));
  }

  save(data: Account): Promise<Account> {
    data.userId = this._loginService.getLoggedUserId;

    return lastValueFrom(this._http.post<Account>(this.apiUrl, data));
  }
}
