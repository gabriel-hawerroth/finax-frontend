import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UtilsService } from '../../../shared/utils/utils.service';
import { UserConfigs } from './user-configs';

@Injectable({
  providedIn: 'root',
})
export class UserConfigsService {
  private readonly apiUrl = `${environment.baseApiUrl}user-configs`;

  constructor(
    private readonly _http: HttpClient,
    private readonly _utils: UtilsService
  ) {}

  getLoggedUserConfigs(): Promise<UserConfigs> {
    return lastValueFrom(
      this._http.get<UserConfigs>(`${this.apiUrl}/get-by-user`)
    );
  }

  save(userConfigs: UserConfigs): Promise<UserConfigs> {
    this._utils.setUserConfigs(userConfigs);
    this._utils.setItemLocalStorage(
      'savedUserConfigsFinax',
      JSON.stringify(userConfigs)
    );

    return lastValueFrom(
      this._http.post<UserConfigs>(`${this.apiUrl}/save`, userConfigs)
    );
  }
}
