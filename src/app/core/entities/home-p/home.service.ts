import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endOfMonth, startOfMonth } from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EssentialExpenses, HomeValues, SpendByCategory } from './home-dto';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly apiUrl = `${environment.baseApiUrl}home`;

  constructor(private readonly _http: HttpClient) {}

  getHomeValues(): Promise<HomeValues> {
    const firstDt: string = startOfMonth(new Date()).toString();
    const lastDt: string = endOfMonth(new Date()).toString();

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
