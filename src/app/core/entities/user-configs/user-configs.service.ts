import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UtilsService } from '../../../shared/utils/utils.service';
import { UserConfigsDTO } from './user-configs-dto';

@Injectable({
  providedIn: 'root',
})
export class UserConfigsService {
  private readonly apiUrl = `${environment.baseApiUrl}user-configs`;

  constructor(
    private readonly _http: HttpClient,
    private readonly _utils: UtilsService,
  ) {}

  getLoggedUserConfigs(): Promise<UserConfigsDTO> {
    return lastValueFrom(
      this._http.get<UserConfigsDTO>(`${this.apiUrl}/get-by-user`),
    );
  }

  save(userConfigs: UserConfigsDTO): Promise<UserConfigsDTO> {
    this._utils.setUserConfigs(userConfigs);

    return lastValueFrom(
      this._http.post<UserConfigsDTO>(`${this.apiUrl}/save`, userConfigs),
    );
  }
}
