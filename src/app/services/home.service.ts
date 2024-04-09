import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  EssentialExpenses,
  HomeValues,
  SpendByCategory,
} from '../interfaces/home';

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

  getSpendsByCategory(): Promise<SpendByCategory[]> {
    const currentDt = new Date();
    const firstDt = new Date(currentDt.setDate(1));
    const lastDt = new Date(
      new Date(currentDt.setMonth(currentDt.getMonth() + 1)).setDate(1 - 1)
    ).toString();

    let params = new HttpParams();
    params = params.append('firstDt', firstDt.toString());
    params = params.append('lastDt', lastDt);

    return lastValueFrom(
      this._http.get<SpendByCategory[]>(
        `${this.apiUrl}/get-spends-by-category`,
        { params }
      )
    );
  }

  getEssentialsExpenses(): Promise<EssentialExpenses> {
    const currentDt = new Date();
    const firstDt = new Date(currentDt.setDate(1));
    const lastDt = new Date(
      new Date(currentDt.setMonth(currentDt.getMonth() + 1)).setDate(1 - 1)
    ).toString();

    let params = new HttpParams();
    params = params.append('firstDt', firstDt.toString());
    params = params.append('lastDt', lastDt);

    return lastValueFrom(
      this._http.get<EssentialExpenses>(
        `${this.apiUrl}/get-essential-expenses`,
        { params }
      )
    );
  }
}
