import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { UserConfigs } from '../interfaces/UserConfigs';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class UserConfigsService {
  private _http = inject(HttpClient);
  private _utilsService = inject(UtilsService);

  apiUrl = `${environment.baseApiUrl}user-configs`;

  getById(id: number): Promise<UserConfigs> {
    return lastValueFrom(this._http.get<UserConfigs>(`${this.apiUrl}/${id}`));
  }

  getAll(): Promise<UserConfigs[]> {
    return lastValueFrom(this._http.get<UserConfigs[]>(this.apiUrl));
  }

  getByUserId(userId: number): Promise<UserConfigs> {
    return lastValueFrom(
      this._http.get<UserConfigs>(`${this.apiUrl}/get-by-user/${userId}`)
    );
  }

  save(userConfigs: UserConfigs): Promise<UserConfigs> {
    this._utilsService.setItemLocalStorage(
      'savedUserConfigsFinax',
      btoa(JSON.stringify(userConfigs))
    );

    return lastValueFrom(
      this._http.post<UserConfigs>(`${this.apiUrl}/save`, userConfigs)
    );
  }
}
