import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _http = inject(HttpClient);

  apiUrl = `${environment.baseApiUrl}user`;

  getById(userId: number): Promise<User> {
    return lastValueFrom(this._http.get<User>(`${this.apiUrl}/${userId}`));
  }

  changeForgetedPassword(userId: number, newPassword: string): Promise<User> {
    let params = new HttpParams();
    params = params.append('userId', userId);
    params = params.append('newPassword', newPassword);

    return lastValueFrom(
      this._http.put<User>(`${this.apiUrl}/change-forgeted-password`, params)
    );
  }

  saveUser(user: User): Promise<User> {
    return lastValueFrom(this._http.put<User>(this.apiUrl, user));
  }

  changeProfileImagem(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('file', file);

    return lastValueFrom(
      this._http.put<User>(`${this.apiUrl}/change-profile-image`, formData)
    );
  }

  getUserImage(): Promise<Blob> {
    return lastValueFrom(
      this._http.get<Blob>(`${this.apiUrl}/get-user-image`, {
        responseType: 'blob' as 'json',
      })
    );
  }

  changePassword(newPassword: string, currentPassword: string): Promise<User> {
    let params = new HttpParams();
    params = params.append('newPassword', newPassword);
    params = params.append('currentPassword', currentPassword);

    return lastValueFrom(
      this._http.put<User>(`${this.apiUrl}/change-password`, params)
    );
  }
}
