import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  CashFlow,
  CashFlowFilters,
  MonthlyCashFlow,
  MonthlyFlow,
  ReleaseSave,
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

  getMonthlyFlow(filters: CashFlowFilters): Promise<MonthlyFlow> {
    let params = new HttpParams();
    params = params.append('userId', filters.userId);
    params = params.append('year', filters.year);
    params = params.append('month', filters.month);

    return lastValueFrom(
      this._http.get<MonthlyFlow>(this.apiUrl, { params: params })
    );
  }

  save(data: ReleaseSave): Promise<CashFlow> {
    return lastValueFrom(this._http.post<CashFlow>(this.apiUrl, data));
  }

  delete(id: number, duplicatedReleasesAction: string): Promise<any> {
    let params = new HttpParams();
    params = params.append(
      'duplicatedReleasesAction',
      duplicatedReleasesAction
    );

    return lastValueFrom(
      this._http.delete<any>(`${this.apiUrl}/${id}`, { params })
    );
  }

  addAttachment(releaseId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return lastValueFrom(
      this._http.put(`${this.apiUrl}/add-attachment/${releaseId}`, formData)
    );
  }

  removeAttachment(releaseId: number) {
    return lastValueFrom(
      this._http.put(`${this.apiUrl}/remove-attachment/${releaseId}`, {})
    );
  }

  getAttachment(releaseId: number): Promise<Blob> {
    return lastValueFrom(
      this._http.get<Blob>(`${this.apiUrl}/get-attachment/${releaseId}`, {
        responseType: 'blob' as 'json',
      })
    );
  }
}
