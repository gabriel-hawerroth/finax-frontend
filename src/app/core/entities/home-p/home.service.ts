import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  EssentialExpenses,
  HomeAccountsList,
  HomeBalances,
  HomeUpcomingReleases,
  SpendByCategory,
} from './home-dto';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly apiUrl = `${environment.baseApiUrl}home`;

  constructor(private readonly _http: HttpClient) {}

  getRevenueExpense(): Promise<HomeBalances> {
    return lastValueFrom(
      this._http.get<HomeBalances>(`${this.apiUrl}/get-revenue-expense`)
    );
  }

  getAccountsList(): Promise<HomeAccountsList[]> {
    return lastValueFrom(
      this._http.get<HomeAccountsList[]>(`${this.apiUrl}/get-accounts-list`)
    );
  }

  getUpcomingReleases(): Promise<HomeUpcomingReleases[]> {
    return lastValueFrom(
      this._http.get<HomeUpcomingReleases[]>(
        `${this.apiUrl}/get-upcoming-releases`
      )
    );
  }

  getSpendsByCategory(): Promise<SpendByCategory[]> {
    return lastValueFrom(
      this._http.get<SpendByCategory[]>(`${this.apiUrl}/get-spends-by-category`)
    );
  }

  getEssentialsExpenses(): Promise<EssentialExpenses> {
    return lastValueFrom(
      this._http.get<EssentialExpenses>(`${this.apiUrl}/get-essential-expenses`)
    );
  }
}
