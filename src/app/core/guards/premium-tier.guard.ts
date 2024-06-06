import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UtilsService } from '../../shared/utils/utils.service';
import { LoginService } from '../entities/auth/login.service';

export const PremiumTierGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  loginService = inject(LoginService),
  utilsService = inject(UtilsService),
  router = inject(Router)
) => {
  if (loginService.logged) {
    if (
      utilsService.getLoggedUser!.access === 'premium' ||
      utilsService.getLoggedUser!.access === 'adm'
    )
      return true;
    else {
      router.navigate(['home']);
      utilsService.showMessage('generic.without-permission');
      return false;
    }
  }
  router.navigate(['']);
  return false;
};
