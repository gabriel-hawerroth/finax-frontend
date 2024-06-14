import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.baseApiUrl}user`;

  constructor(private readonly _http: HttpClient) {}

  getTokenUser(token: string): Promise<User> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', `Bearer ${token}`);

    return lastValueFrom(
      this._http.get<User>(`${environment.baseApiUrl}user/get-auth-user`, {
        headers,
      })
    );
  }

  getById(userId: number): Promise<User> {
    return lastValueFrom(this._http.get<User>(`${this.apiUrl}/${userId}`));
  }

  saveUser(user: User): Promise<User> {
    return lastValueFrom(this._http.put<User>(this.apiUrl, user));
  }

  changeForgetedPassword(userId: number, newPassword: string): Promise<User> {
    let params = new HttpParams();
    params = params.append('userId', userId);
    params = params.append('newPassword', newPassword);

    return lastValueFrom(
      this._http.patch<User>(`${this.apiUrl}/change-forgeted-password`, null, {
        params,
      })
    );
  }

  changePassword(newPassword: string, currentPassword: string): Promise<User> {
    let params = new HttpParams();
    params = params.append('newPassword', newPassword);
    params = params.append('currentPassword', currentPassword);

    return lastValueFrom(
      this._http.patch<User>(`${this.apiUrl}/change-password`, null, { params })
    );
  }

  changeProfileImage(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('file', file);

    return lastValueFrom(
      this._http.patch<User>(`${this.apiUrl}/change-profile-image`, formData)
    );
  }

  getUserImage(): Promise<string> {
    return lastValueFrom(
      this._http.get(`${this.apiUrl}/get-user-image`, {
        responseType: 'text'
      })
    );
  }
}
