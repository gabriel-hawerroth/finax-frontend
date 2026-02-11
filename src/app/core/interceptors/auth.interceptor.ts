import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../../shared/utils/utils.service';
import { onLogoutEvent } from '../events/events';

export const authInterceptor: HttpInterceptorFn = (
  request,
  next,
  utilsService = inject(UtilsService),
) => {
  const requestUrl: Array<string> = request.url.split('/');
  const apiUrl: Array<string> = environment.baseApiUrl.split('/');

  if (requestUrl[2] !== apiUrl[2]) return next(request);

  if (
    environment.baseApiUrl.includes('localhost:8080') ||
    environment.baseApiUrl.includes('api.appfinax.com.br')
  ) {
    request = request.clone({
      withCredentials: true,
    });
  }

  return next(request).pipe(
    catchError((error) => {
      console.log('Error: ', error);

      switch (error.status) {
        case 401:
          onLogoutEvent.next({ showMessage: true });
          break;
        case 403:
          onLogoutEvent.next({ showMessage: true });
          break;
        case 0:
          onLogoutEvent.next({ showMessage: false });
          utilsService.showMessage('generic.update-in-progress');
      }

      if (error?.error?.errorDescription) {
        error.error.errorDescription =
          (error.error.errorDescription as string)?.toLowerCase() || undefined;
      }

      const isAuthError = error.status === 401 || error.status === 403;
      if (isAuthError) error.skipSentry = true;

      return throwError(() => error);
    }),
  );
};
