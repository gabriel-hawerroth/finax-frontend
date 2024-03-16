import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { HomeValues } from '../interfaces/home';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly _http = inject(HttpClient);

  private readonly apiUrl = `${environment.baseApiUrl}home`;

  getHomeValues(): Promise<HomeValues> {
    const firstDt: string = moment(new Date()).startOf('month').toString();
    const lastDt: string = moment(new Date()).endOf('month').toString();

    let params = new HttpParams();
    params = params.append('firstDt', firstDt);
    params = params.append('lastDt', lastDt);

    return lastValueFrom(
      this._http.get<HomeValues>(`${this.apiUrl}/get-values`, { params })
    );
  }
}
