import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../interfaces/auth-response';
import { Credentials } from '../interfaces/credentials';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);

  private readonly apiUrl = `${environment.baseApiUrl}auth`;

  doLogin(credentials: Credentials): Promise<AuthResponse> {
    const authDTO = {
      login: credentials.email,
      password: credentials.password,
    };

    return lastValueFrom(
      this._http.post<AuthResponse>(`${this.apiUrl}/login`, authDTO)
    );
  }

  registerNewUser(user: User): Promise<User> {
    return lastValueFrom(
      this._http.post<User>(`${this.apiUrl}/register`, user)
    );
  }
}
