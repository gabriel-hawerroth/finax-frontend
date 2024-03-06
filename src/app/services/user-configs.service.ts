import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { UserConfigs } from '../interfaces/user-configs';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class UserConfigsService {
  private _http = inject(HttpClient);
  private _utilsService = inject(UtilsService);

  apiUrl = `${environment.baseApiUrl}user-configs`;

  getLoggedUserConfigs(): Promise<UserConfigs> {
    return lastValueFrom(
      this._http.get<UserConfigs>(`${this.apiUrl}/get-by-user`)
    );
  }

  save(userConfigs: UserConfigs): Promise<UserConfigs> {
    this._utilsService.setUserConfigs(userConfigs);
    this._utilsService.setItemLocalStorage(
      'savedUserConfigsFinax',
      JSON.stringify(userConfigs)
    );

    return lastValueFrom(
      this._http.post<UserConfigs>(`${this.apiUrl}/save`, userConfigs)
    );
  }
}
