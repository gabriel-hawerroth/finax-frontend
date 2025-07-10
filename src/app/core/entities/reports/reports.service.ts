import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ReportReleasesByInterval } from '../../enums/report-releases-by-interval';
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
    let httpParams = this.createHttpParams(params);

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
    let httpParams = this.createHttpParams(params);

    return lastValueFrom(
      this._http.get<ReportReleasesByAccountOutput>(
        `${this.apiUrl}/releases-by-account`,
        {
          params: httpParams,
        }
      )
    );
  }

  private createHttpParams(params: ReportReleasesByParams) {
    let httpParams = new HttpParams()
      .set('interval', params.interval)
      .set('releaseType', params.releaseType);

    httpParams = this.applyDateFilters(params, httpParams);
    return httpParams;
  }

  private applyDateFilters(
    params: ReportReleasesByParams,
    httpParams: HttpParams
  ) {
    if (params.interval !== ReportReleasesByInterval.LAST_30_DAYS) {
      if (!params.initialDate || !params.finalDate) {
        throw new Error(
          'Initial and final dates are required for intervals other than LAST_30_DAYS.'
        );
      }

      httpParams = httpParams.set(
        'initialDate',
        moment(params.initialDate).format('YYYY-MM-DD')
      );
      httpParams = httpParams.set(
        'finalDate',
        moment(params.finalDate).format('YYYY-MM-DD')
      );
    }
    return httpParams;
  }
}
