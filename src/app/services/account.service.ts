import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { Account, AccountBasicList } from '../interfaces/account';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _http = inject(HttpClient);
  private _utilsService = inject(UtilsService);

  apiUrl = `${environment.baseApiUrl}accounts`;

  getByUser(): Promise<Account[]> {
    return lastValueFrom(
      this._http.get<Account[]>(`${this.apiUrl}/get-by-user`)
    );
  }

  getById(id: number): Promise<Account> {
    return lastValueFrom(this._http.get<Account>(`${this.apiUrl}/${id}`));
  }

  save(data: Account): Promise<Account> {
    data.userId = this._utilsService.getLoggedUser!.id;

    return lastValueFrom(this._http.post<Account>(this.apiUrl, data));
  }

  adjustBalance(accountId: number, newBalance: number): Promise<Account> {
    let params = new HttpParams();
    params = params.append('newBalance', newBalance);

    return lastValueFrom(
      this._http.get<Account>(`${this.apiUrl}/adjust-balance/${accountId}`, {
        params,
      })
    );
  }

  getBasicList(): Promise<AccountBasicList[]> {
    return lastValueFrom(
      this._http.get<AccountBasicList[]>(`${this.apiUrl}/basic-list`)
    );
  }
}
