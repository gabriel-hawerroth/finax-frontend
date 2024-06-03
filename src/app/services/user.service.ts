import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _http = inject(HttpClient);

  private readonly apiUrl = `${environment.baseApiUrl}user`;

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

  getUserImage(): Promise<Blob> {
    return lastValueFrom(
      this._http.get<Blob>(`${this.apiUrl}/get-user-image`, {
        responseType: 'blob' as 'json',
      })
    );
  }
}
