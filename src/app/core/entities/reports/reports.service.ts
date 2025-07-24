import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ReportReleasesByInterval } from '../../enums/report-releases-by-interval';
import {
  BalanceEvolutionItem,
  ReleasesByAccount,
  ReleasesByCategory,
  ReportBalanceEvolutionParams,
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
  ): Promise<ReleasesByCategory[]> {
    let httpParams = this.createHttpParams(params);

    return lastValueFrom(
      this._http.get<ReleasesByCategory[]>(
        `${this.apiUrl}/releases-by-category`,
        {
          params: httpParams,
        }
      )
    );
  }

  getReleasesByAccount(
    params: ReportReleasesByParams
  ): Promise<ReleasesByAccount[]> {
    let httpParams = this.createHttpParams(params);

    return lastValueFrom(
      this._http.get<ReleasesByAccount[]>(
        `${this.apiUrl}/releases-by-account`,
        {
          params: httpParams,
        }
      )
    );
  }

  getBalanceEvolution(
    params: ReportBalanceEvolutionParams
  ): Promise<BalanceEvolutionItem[]> {
    let httpParams = new HttpParams()
      .set('interval', params.interval)
      .set('grouper', params.grouper);

    if (params.accountId) {
      httpParams = httpParams.set('accountId', params.accountId.toString());
    }

    httpParams = this.applyDateFilters(params, httpParams);

    return lastValueFrom(
      this._http.get<BalanceEvolutionItem[]>(
        `${this.apiUrl}/balance-evolution`,
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
    params: ReportReleasesByParams | ReportBalanceEvolutionParams,
    httpParams: HttpParams
  ) {
    if (
      ![
        ReportReleasesByInterval.LAST_30_DAYS,
        ReportReleasesByInterval.LAST_12_MONTHS,
      ].includes(params.interval)
    ) {
      if (!params.initialDate || !params.finalDate) {
        const message = `Initial and final dates are required for interval: ${params.interval}`;
        console.error(message);
        throw new Error(message);
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
