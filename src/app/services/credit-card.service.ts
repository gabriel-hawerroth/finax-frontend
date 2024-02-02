import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
  private _http = inject(HttpClient);

  private apiUrl = `${environment.baseApiUrl}credit-card`;

  sendTestRequest(): Promise<any> {
    return lastValueFrom(this._http.get(`${this.apiUrl}/teste`));
  }
}
