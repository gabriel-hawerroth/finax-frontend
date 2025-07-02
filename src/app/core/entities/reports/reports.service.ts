import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SpendByCategoryOutput } from '../home-p/home-dto';
import { ReleasesByCategoryParams } from './reports-dtos';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly apiUrl = `${environment.baseApiUrl}reports`;

  constructor(private readonly _http: HttpClient) {}

  getReleasesByCategory(
    params: ReleasesByCategoryParams
  ): Promise<SpendByCategoryOutput> {
    let httpParams = new HttpParams()
      .set('interval', params.interval)
      .set('releaseType', params.releaseType);

    if (params.monthYear) {
      httpParams = httpParams.set('monthYear', params.monthYear);
    }

    return lastValueFrom(
      this._http.get<SpendByCategoryOutput>(
        `${this.apiUrl}/releases-by-category`,
        {
          params: httpParams,
        }
      )
    );
  }
}
