import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { cloudFireCdnLink } from '../../../shared/utils/utils';
import { DuplicatedReleaseAction } from '../../enums/duplicated-release-action';
import { ReleasedOn } from '../../enums/released-on';
import { Release } from './release';
import { CashFlowValues, MonthlyRelease } from './release-dto';

@Injectable({
  providedIn: 'root',
})
export class ReleaseService {
  private readonly apiUrl = `${environment.baseApiUrl}cash-flow`;

  constructor(private readonly _http: HttpClient) {}

  getMonthlyReleases(selectedDt: Date): Promise<MonthlyRelease[]> {
    const monthYear = format(selectedDt, 'yyyy-MM');

    let params = new HttpParams();
    params = params.append('monthYear', monthYear);

    return lastValueFrom(
      this._http.get<MonthlyRelease[]>(`${this.apiUrl}/get-monthly-releases`, {
        params,
      })
    );
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
