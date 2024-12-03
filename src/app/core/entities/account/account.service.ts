import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Account } from './account';
import { AccountConfigs, BasicAccount, GetAccountById } from './account-dto';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly apiUrl = `${environment.baseApiUrl}account`;

  constructor(
    private readonly _http: HttpClient,
    private readonly _fb: FormBuilder
  ) {}

  getFormGroup(primaryAccountId?: number): FormGroup {
    return this._fb.group({
      id: null,
      userId: null,
      name: ['', Validators.required],
      type: null,
      code: null,
      balance: [0, Validators.required],
      accountNumber: null,
      agency: null,
      investments: false,
      addOverallBalance: true,
      grouper: false,
      addToCashFlow: true,
      active: true,
      archived: false,
      image: null,
      primaryAccountId: primaryAccountId || null,
    });
  }

  getConfigs(isSubAccount: boolean): AccountConfigs[] {
    return [
      {
        key: 'grouper',
        label: 'my-accounts.grouper-account',
        show: !isSubAccount,
        tooltip: 'my-accounts.grouper-account-description',
      },
      {
        key: 'addToCashFlow',
        label: 'my-accounts.add-to-cash-flow',
        show: true,
        tooltip: 'my-accounts.add-to-cash-flow-description',
      },
      {
        key: 'addOverallBalance',
        label: 'my-accounts.add-to-overall-balance',
        show: true,
      },
      {
        key: 'active',
        label: 'generic.active',
        show: true,
      },
    ];
  }

  getByUser(): Promise<Account[]> {
    return lastValueFrom(
      this._http.get<Account[]>(`${this.apiUrl}/get-by-user`)
    );
  }

  getById(id: number): Promise<GetAccountById> {
    return lastValueFrom(
      this._http.get<GetAccountById>(`${this.apiUrl}/${id}`)
    );
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
