import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { CashFlow, MonthlyFlow } from '../interfaces/CashFlow';
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

  getMonthlyFlow(date: Date): Promise<MonthlyFlow> {
    let params = new HttpParams();
    params = params.append('date', date.toLocaleDateString());

    return lastValueFrom(
      this._http.get<MonthlyFlow>(this.apiUrl, { params: params })
    );
  }

  addRelease(data: CashFlow, repeatFor: number): Promise<CashFlow> {
    let params = new HttpParams();
    params = params.append('repeatFor', repeatFor);

    return lastValueFrom(
      this._http.post<CashFlow>(this.apiUrl, data, { params })
    );
  }

  editRelease(
    data: CashFlow,
    duplicatedReleaseAction: string
  ): Promise<CashFlow> {
    let params = new HttpParams();
    params = params.append('duplicatedReleaseAction', duplicatedReleaseAction);

    return lastValueFrom(
      this._http.put<CashFlow>(this.apiUrl, data, { params })
    );
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
