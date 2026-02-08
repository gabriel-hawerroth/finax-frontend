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
  utilsService = inject(UtilsService)
) => {
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
    })
  );
};
