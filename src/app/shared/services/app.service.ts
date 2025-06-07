import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppErrorLog } from '../../core/interfaces/app-error-log';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly apiUrl = `${environment.baseApiUrl}user`;

  constructor(private readonly _http: HttpClient) {}

  logAppError(error: any): void {
    let errorData: AppErrorLog;

    if (error instanceof Error) {
      errorData = {
        message: error.message,
        stackTrace: error.stack || '',
      };
    } else {
      errorData = {
        message: 'An unknown error occurred',
        stackTrace: JSON.stringify(error),
      };
    }

    lastValueFrom(this._http.post(`${this.apiUrl}/log-app-error`, errorData));
  }
}
