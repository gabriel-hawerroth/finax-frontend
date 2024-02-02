import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { HomeValues } from '../interfaces/Home';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private _http = inject(HttpClient);

  private apiUrl = `${environment.baseApiUrl}home`;

  getHomeValues(): Promise<HomeValues> {
    return lastValueFrom(
      this._http.get<HomeValues>(`${this.apiUrl}/get-home-values`)
    );
  }
}
