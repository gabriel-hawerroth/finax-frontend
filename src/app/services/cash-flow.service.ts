import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { addMonths, endOfMonth, startOfMonth } from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { DuplicatedReleaseAction } from '../enums/duplicated-release-action';
import { ReleasedOn } from '../enums/released-on';
import { ReleasesViewMode } from '../enums/releases-view-mode';
import { CashFlow, CashFlowValues, MonthlyFlow } from '../interfaces/cash-flow';

@Injectable({
  providedIn: 'root',
})
export class CashFlowService {
  private readonly _http = inject(HttpClient);

  private readonly apiUrl = `${environment.baseApiUrl}cash-flow`;

  getMonthlyFlow(
    selectedDt: Date,
    viewMode: ReleasesViewMode
  ): Promise<MonthlyFlow> {
    const firstDt = startOfMonth(selectedDt).toString();
    const lastDt = endOfMonth(selectedDt).toString();
    const firstDtCurrentMonth = startOfMonth(new Date()).toString();

    const firstDtInvoice = startOfMonth(addMonths(selectedDt, -1)).toString();
    const lastDtInvoice = endOfMonth(addMonths(selectedDt, -1)).toString();

    let params = new HttpParams();
    params = params.append('firstDt', firstDt);
    params = params.append('lastDt', lastDt);
    params = params.append('firstDtCurrentMonth', firstDtCurrentMonth);
    params = params.append('viewMode', viewMode);
    params = params.append('firstDtInvoice', firstDtInvoice);
    params = params.append('lastDtInvoice', lastDtInvoice);

    return lastValueFrom(this._http.get<MonthlyFlow>(this.apiUrl, { params }));
  }

  getValues(): Promise<CashFlowValues> {
    return lastValueFrom(
      this._http.get<CashFlowValues>(`${this.apiUrl}/get-values`)
    );
  }

  addRelease(
    data: CashFlow,
    repeatFor: number,
    releasedOn: ReleasedOn
  ): Promise<CashFlow> {
    let params = new HttpParams();
    params = params.append('repeatFor', repeatFor);
    params = params.append('releasedOn', releasedOn);

    return lastValueFrom(
      this._http.post<CashFlow>(this.apiUrl, data, { params })
    );
  }

  editRelease(
    data: CashFlow,
    duplicatedReleaseAction: DuplicatedReleaseAction,
    releasedOn: ReleasedOn
  ): Promise<CashFlow> {
    let params = new HttpParams();
    params = params.append('duplicatedReleaseAction', duplicatedReleaseAction);
    params = params.append('releasedOn', releasedOn);

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

  addAttachment(releaseId: number, file: File): Promise<CashFlow> {
    const formData = new FormData();
    formData.append('file', file);

    return lastValueFrom(
      this._http.patch<CashFlow>(
        `${this.apiUrl}/add-attachment/${releaseId}`,
        formData
      )
    );
  }

  removeAttachment(releaseId: number): Promise<CashFlow> {
    return lastValueFrom(
      this._http.patch<CashFlow>(
        `${this.apiUrl}/remove-attachment/${releaseId}`,
        null
      )
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
