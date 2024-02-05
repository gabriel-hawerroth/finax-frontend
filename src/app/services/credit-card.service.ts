import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { CreditCard } from '../interfaces/CreditCard';

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
  private _http = inject(HttpClient);

  private apiUrl = `${environment.baseApiUrl}credit-card`;

  getByUser(): Promise<CreditCard[]> {
    return lastValueFrom(
      this._http.get<CreditCard[]>(`${this.apiUrl}/get-by-user`)
    );
  }

  getById(id: number): Promise<CreditCard> {
    return lastValueFrom(this._http.get<CreditCard>(`${this.apiUrl}/${id}`));
  }

  save(card: CreditCard): Promise<CreditCard> {
    return lastValueFrom(this._http.post<CreditCard>(this.apiUrl, card));
  }
}
