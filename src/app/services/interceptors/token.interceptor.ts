import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import { LoginService } from '../login.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/utils/utils.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private _loginService: LoginService,
    private _utilsService: UtilsService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this._loginService.getUserToken;
    const requestUrl: Array<string> = request.url.split('/');
    const apiUrl: Array<string> = environment.baseApiUrl.split('/');

    if (token && requestUrl[2] === apiUrl[2]) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(request).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this._loginService.logout();
            return EMPTY;
          } else {
            return throwError(() => new Error(error.message));
          }
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
