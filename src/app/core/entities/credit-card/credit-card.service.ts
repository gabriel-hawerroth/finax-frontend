import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreditCard } from './credit-card';
import { CardBasicList, UserCreditCard } from './credit-card-dto';

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
  private readonly apiUrl = `${environment.baseApiUrl}credit-card`;

  constructor(private readonly _http: HttpClient) {}

  getByUser(): Promise<UserCreditCard[]> {
    return lastValueFrom(
      this._http.get<UserCreditCard[]>(`${this.apiUrl}/get-by-user`)
    );
  }

  getById(id: number): Promise<CreditCard> {
    return lastValueFrom(this._http.get<CreditCard>(`${this.apiUrl}/${id}`));
  }

  createNew(card: CreditCard): Promise<CreditCard> {
    card.id = undefined;
    return lastValueFrom(this._http.post<CreditCard>(this.apiUrl, card));
  }

  edit(card: CreditCard): Promise<CreditCard> {
    return lastValueFrom(this._http.put<CreditCard>(this.apiUrl, card));
  }

  getBasicList(): Promise<CardBasicList[]> {
    return lastValueFrom(
      this._http.get<CardBasicList[]>(`${this.apiUrl}/basic-list`)
    );
  }
}
