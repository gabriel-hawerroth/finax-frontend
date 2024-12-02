import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Account } from './account';
import { BasicAccount } from './account-dto';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly apiUrl = `${environment.baseApiUrl}account`;

  constructor(private readonly _http: HttpClient) {}

  getByUser(): Promise<Account[]> {
    return lastValueFrom(
      this._http.get<Account[]>(`${this.apiUrl}/get-by-user`)
    );
  }

  getById(id: number): Promise<Account> {
    return lastValueFrom(this._http.get<Account>(`${this.apiUrl}/${id}`));
  }

  getBasicList(): Promise<BasicAccount[]> {
    return lastValueFrom(
      this._http.get<BasicAccount[]>(`${this.apiUrl}/basic-list`)
    );
  }

  createNew(data: Account): Promise<Account> {
    data.id = undefined;
    return lastValueFrom(this._http.post<Account>(this.apiUrl, data));
  }

  edit(data: Account): Promise<Account> {
    return lastValueFrom(this._http.put<Account>(this.apiUrl, data));
  }

  adjustBalance(accountId: number, newBalance: number): Promise<Account> {
    let params = new HttpParams();
    params = params.append('newBalance', newBalance);

    return lastValueFrom(
      this._http.patch<Account>(
        `${this.apiUrl}/adjust-balance/${accountId}`,
        null,
        {
          params,
        }
      )
    );
  }

  deleteById(id: number): Promise<void> {
    return lastValueFrom(this._http.delete<void>(`${this.apiUrl}/${id}`));
  }

  inactivateAccount(id: number): Promise<void> {
    return lastValueFrom(
      this._http.patch<void>(`${this.apiUrl}/inactivate/${id}`, null)
    );
  }

  activateAccount(id: number, subAccountIds: number[]): Promise<void> {
    let params = new HttpParams();
    params = params.append('subAccounts', subAccountIds.toString());

    return lastValueFrom(
      this._http.patch<void>(`${this.apiUrl}/activate/${id}`, null, { params })
    );
  }
}
