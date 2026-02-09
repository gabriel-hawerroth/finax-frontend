import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreditCard } from './credit-card';
import {
  BasicCard,
  SaveCreditCardDTO,
  UserCreditCard,
} from './credit-card-dto';

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
  private readonly apiUrl = `${environment.baseApiUrl}credit-card`;

  constructor(private readonly _http: HttpClient) {}

  getByUser(): Promise<UserCreditCard[]> {
    return lastValueFrom(
      this._http.get<UserCreditCard[]>(`${this.apiUrl}/get-by-user`),
    );
  }

  getById(id: number): Promise<CreditCard> {
    return lastValueFrom(this._http.get<CreditCard>(`${this.apiUrl}/${id}`));
  }

  createNew(card: SaveCreditCardDTO): Promise<CreditCard> {
    return lastValueFrom(this._http.post<CreditCard>(this.apiUrl, card));
  }

  edit(cardId: number, card: SaveCreditCardDTO): Promise<CreditCard> {
    return lastValueFrom(
      this._http.put<CreditCard>(`${this.apiUrl}/${cardId}`, card),
    );
  }

  getBasicList(): Promise<BasicCard[]> {
    return lastValueFrom(
      this._http.get<BasicCard[]>(`${this.apiUrl}/basic-list`),
    );
  }

  deleteById(id: number): Promise<void> {
    return lastValueFrom(this._http.delete<void>(`${this.apiUrl}/${id}`));
  }

  inactivateCard(id: number): Promise<void> {
    return lastValueFrom(
      this._http.patch<void>(`${this.apiUrl}/inactivate/${id}`, null),
    );
  }

  activateCard(id: number): Promise<void> {
    return lastValueFrom(
      this._http.patch<void>(`${this.apiUrl}/activate/${id}`, null),
    );
  }
}
