import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../user/user';
import { AuthResponse } from './auth-response';
import { Credentials } from './credentials';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.baseApiUrl}auth`;

  constructor(private readonly _http: HttpClient) {}

  doLogin(credentials: Credentials): Promise<AuthResponse> {
    const authDTO = {
      login: credentials.email,
      password: credentials.password,
    };

    return lastValueFrom(
      this._http.post<AuthResponse>(`${this.apiUrl}/login`, authDTO),
    );
  }

  registerNewUser(user: User): Promise<User> {
    return lastValueFrom(
      this._http.post<User>(`${this.apiUrl}/register`, user),
    );
  }

  resendActivationEmail(email: string): Promise<void> {
    return lastValueFrom(
      this._http.post<void>(`${this.apiUrl}/resend-activation-email`, {
        email,
      }),
    );
  }

  doLogout(): Promise<void> {
    return lastValueFrom(this._http.post<void>(`${this.apiUrl}/logout`, null));
  }
}
