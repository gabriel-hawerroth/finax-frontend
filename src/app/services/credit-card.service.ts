import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CardBasicList,
  CreditCard,
  UserCreditCards,
} from '../interfaces/credit-card';

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
  private readonly _http = inject(HttpClient);

  private readonly apiUrl = `${environment.baseApiUrl}credit-card`;

  getByUser(): Promise<UserCreditCards[]> {
    return lastValueFrom(
      this._http.get<UserCreditCards[]>(`${this.apiUrl}/get-by-user`)
    );
  }

  getById(id: number): Promise<CreditCard> {
    return lastValueFrom(this._http.get<CreditCard>(`${this.apiUrl}/${id}`));
  }

  save(card: CreditCard): Promise<CreditCard> {
    return lastValueFrom(this._http.post<CreditCard>(this.apiUrl, card));
  }

  getBasicList(): Promise<CardBasicList[]> {
    return lastValueFrom(
      this._http.get<CardBasicList[]>(`${this.apiUrl}/basic-list`)
    );
  }
}
