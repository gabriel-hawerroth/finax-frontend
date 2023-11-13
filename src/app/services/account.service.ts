import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';
import { lastValueFrom } from 'rxjs';
import { Account } from '../interfaces/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  apiUrl = `${environment.baseApiUrl}accounts`;

  constructor(private _http: HttpClient, private _loginService: LoginService) {}

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

  saveSequence(accountsList: Account[]) {
    return lastValueFrom(
      this._http.put(`${this.apiUrl}/save-sequence`, accountsList)
    );
  }
}
