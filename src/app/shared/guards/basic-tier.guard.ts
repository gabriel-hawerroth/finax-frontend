import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from '../../services/login.service';
import { UtilsService } from '../../utils/utils.service';

export const BasicTierGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  loginService = inject(LoginService),
  utilsService = inject(UtilsService),
  router = inject(Router)
) => {
  if (loginService.logged) {
    if (utilsService.getLoggedUser!.access !== 'free') return true;
    else {
      router.navigate(['home']);
      utilsService.showMessage('generic.without-permission');
      return false;
    }
  }
  router.navigate(['']);
  return false;
};
