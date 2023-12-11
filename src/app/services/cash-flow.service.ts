import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  CashFlow,
  CashFlowFilters,
  MonthlyCashFlow,
} from '../interfaces/CashFlow';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CashFlowService {
  private _http = inject(HttpClient);

  private apiUrl = `${environment.baseApiUrl}cash-flow`;

  getById(id: number): Promise<CashFlow> {
    return lastValueFrom(this._http.get<CashFlow>(`${this.apiUrl}/${id}`));
  }

  getMonthlyReleases(filters: CashFlowFilters): Promise<MonthlyCashFlow[]> {
    let params = new HttpParams();
    params = params.append('userId', filters.userId);
    params = params.append('year', filters.year);
    params = params.append('month', filters.month);

    return lastValueFrom(
      this._http.get<MonthlyCashFlow[]>(this.apiUrl, { params: params })
    );
  }

  save(data: CashFlow): Promise<CashFlow> {
    return lastValueFrom(this._http.post<CashFlow>(this.apiUrl, data));
  }
}
