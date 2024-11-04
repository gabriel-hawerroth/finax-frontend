import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endOfMonth, startOfMonth } from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { cloudFireCdnLink } from '../../../shared/utils/utils';
import { DuplicatedReleaseAction } from '../../enums/duplicated-release-action';
import { ReleasedOn } from '../../enums/released-on';
import { Release } from './release';
import { CashFlowValues, MonthlyFlow } from './release-dto';

@Injectable({
  providedIn: 'root',
})
export class ReleaseService {
  private readonly apiUrl = `${environment.baseApiUrl}cash-flow`;

  constructor(private readonly _http: HttpClient) {}

  getMonthlyFlow(selectedDt: Date): Promise<MonthlyFlow> {
    const firstDt = startOfMonth(selectedDt).toLocaleDateString();
    const lastDt = endOfMonth(selectedDt).toLocaleDateString();

    let params = new HttpParams();
    params = params.append('firstDt', firstDt);
    params = params.append('lastDt', lastDt);

    return lastValueFrom(this._http.get<MonthlyFlow>(this.apiUrl, { params }));
  }

  getValues(): Promise<CashFlowValues> {
    return lastValueFrom(
      this._http.get<CashFlowValues>(`${this.apiUrl}/get-values`)
    );
  }

  addRelease(
    data: Release,
    repeatFor: number,
    releasedOn: ReleasedOn
  ): Promise<Release> {
    let params = new HttpParams();
    params = params.append('repeatFor', repeatFor);

    return lastValueFrom(
      this._http.post<Release>(this.apiUrl, data, { params })
    );
  }

  editRelease(
    data: Release,
    duplicatedReleaseAction: DuplicatedReleaseAction,
    releasedOn: ReleasedOn
  ): Promise<Release> {
    let params = new HttpParams();
    params = params.append('duplicatedReleaseAction', duplicatedReleaseAction);

    return lastValueFrom(
      this._http.put<Release>(this.apiUrl, data, { params })
    );
  }

  delete(id: number, duplicatedReleasesAction: string): Promise<void> {
    let params = new HttpParams();
    params = params.append(
      'duplicatedReleasesAction',
      duplicatedReleasesAction
    );

    return lastValueFrom(
      this._http.delete<void>(`${this.apiUrl}/${id}`, { params })
    );
  }

  saveAttachment(releaseId: number, file: File): Promise<Release> {
    const formData = new FormData();
    formData.append('file', file);

    return lastValueFrom(
      this._http.patch<Release>(
        `${this.apiUrl}/add-attachment/${releaseId}`,
        formData
      )
    );
  }

  removeAttachment(releaseId: number): Promise<Release> {
    return lastValueFrom(
      this._http.patch<Release>(
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

  getAttachmentTeste(fileName: string): Promise<Blob> {
    return lastValueFrom(
      this._http.get(`${cloudFireCdnLink}/${fileName}`, {
        responseType: 'blob',
      })
    );
  }
}
