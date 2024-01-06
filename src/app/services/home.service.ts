import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginService } from './login.service';
import { lastValueFrom } from 'rxjs';
import { HomeValues } from '../interfaces/Home';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private _http = inject(HttpClient);
  private _loginService = inject(LoginService);

  private apiUrl = `${environment.baseApiUrl}home`;

  getHomeValues(): Promise<HomeValues> {
    return lastValueFrom(
      this._http.get<HomeValues>(
        `${this.apiUrl}/get-home-values/${this._loginService.getLoggedUserId}`
      )
    );
  }

  getCurrentBalance(): Promise<number> {
    return lastValueFrom(
      this._http.get<number>(
        `${this.apiUrl}/get-current-balance/${this._loginService.getLoggedUserId}`
      )
    );
  }

  getMonthlyValues(): Promise<any> {
    return lastValueFrom(
      this._http.get(
        `${this.apiUrl}/get-monthly-values/${this._loginService.getLoggedUserId}`
      )
    );
  }
}
