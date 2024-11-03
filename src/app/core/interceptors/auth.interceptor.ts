import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../../shared/utils/utils.service';
import { LoginService } from '../entities/auth/login.service';

export const authInterceptor: HttpInterceptorFn = (
  request,
  next,
  loginService = inject(LoginService),
  utilsService = inject(UtilsService)
) => {
  const requestUrl: Array<string> = request.url.split('/');
  const apiUrl: Array<string> = environment.baseApiUrl.split('/');

  if (requestUrl[2] === apiUrl[2]) {
    const token: string | null = loginService.getUserToken;

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next(request).pipe(
      catchError((error) => {
        console.log('Error: ', error);

        switch (error.status) {
          case 401:
            loginService.logout(true);
            break;
          case 403:
            loginService.logout(true);
            break;
          case 0:
            loginService.logout(false);
            utilsService.showMessage('generic.update-in-progress');
        }

        error.error.errorDescription =
          (error.error.errorDescription as string)?.toLowerCase() || undefined;

        return throwError(() => error);
      })
    );
  } else {
    return next(request);
  }
};
