import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UtilsService } from '../../shared/utils/utils.service';
import { LoginService } from '../entities/auth/login.service';
import { UserAccess } from '../enums/user-enums';

export const PremiumTierGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  loginService = inject(LoginService),
  utilsService = inject(UtilsService),
  router = inject(Router)
) => {
  if (loginService.logged) {
    if (
      utilsService.getLoggedUser!.access === UserAccess.PREMIUM ||
      utilsService.getLoggedUser!.access === UserAccess.ADM
    )
      return true;
    else {
      router.navigateByUrl('home');
      utilsService.showMessage('generic.without-permission');
      return false;
    }
  }
  router.navigateByUrl('');
  return false;
};
