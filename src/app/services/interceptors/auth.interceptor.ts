import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';
import { LoginService } from '../login.service';
import { UtilsService } from '../../utils/utils.service';

const getToken = (): string => {
  return inject(LoginService).getUserToken;
};

export const authInterceptor: HttpInterceptorFn = (
  request,
  next,
  loginService = inject(LoginService),
  utilsService = inject(UtilsService)
) => {
  let token: string = getToken();

  const requestUrl: Array<string> = request.url.split('/');
  const apiUrl: Array<string> = environment.baseApiUrl.split('/');

  if (token !== '' && requestUrl[2] === apiUrl[2]) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          (error.status === 401 || error.status === 0)
        ) {
          loginService.logout(error.status !== 0);
          return EMPTY;
        }
        return throwError(() => new Error(error.message));
      })
    );
  } else {
    return next(request).pipe(
      catchError((err) => {
        if (err.status === 0) {
          utilsService.showSimpleMessage(
            utilsService.getUserConfigs.language === 'pt-br'
              ? 'Atualização em andamento, tente novamente mais tarde'
              : 'Update in progress, please try again later'
          );
        }
        return EMPTY;
      })
    );
  }
};
