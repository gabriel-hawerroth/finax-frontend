import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UserConfigs } from '../interfaces/UserConfigs';

@Injectable({
  providedIn: 'root',
})
export class UserConfigsService {
  apiUrl = `${environment.baseApiUrl}user-configs`;

  constructor(private _http: HttpClient) {}

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
    localStorage.setItem(
      'savedUserConfigsFinax',
      btoa(JSON.stringify(userConfigs))
    );
    return lastValueFrom(
      this._http.post<UserConfigs>(`${this.apiUrl}/save`, userConfigs)
    );
  }
}
