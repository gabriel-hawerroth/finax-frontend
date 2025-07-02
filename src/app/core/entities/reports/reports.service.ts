import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ReportReleasesByAccountOutput,
  ReportReleasesByCategoryOutput,
  ReportReleasesByParams,
} from './reports-dtos';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly apiUrl = `${environment.baseApiUrl}reports`;

  constructor(private readonly _http: HttpClient) {}

  getReleasesByCategory(
    params: ReportReleasesByParams
  ): Promise<ReportReleasesByCategoryOutput> {
    let httpParams = new HttpParams()
      .set('interval', params.interval)
      .set('releaseType', params.releaseType);

    if (params.monthYear) {
      httpParams = httpParams.set('monthYear', params.monthYear);
    }

    return lastValueFrom(
      this._http.get<ReportReleasesByCategoryOutput>(
        `${this.apiUrl}/releases-by-category`,
        {
          params: httpParams,
        }
      )
    );
  }

  getReleasesByAccount(
    params: ReportReleasesByParams
  ): Promise<ReportReleasesByAccountOutput> {
    let httpParams = new HttpParams()
      .set('interval', params.interval)
      .set('releaseType', params.releaseType);

    if (params.monthYear) {
      httpParams = httpParams.set('monthYear', params.monthYear);
    }

    return lastValueFrom(
      this._http.get<ReportReleasesByAccountOutput>(
        `${this.apiUrl}/releases-by-account`,
        {
          params: httpParams,
        }
      )
    );
  }
}
