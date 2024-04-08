import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from '../../services/login.service';

export const FreeTierGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  loginService = inject(LoginService),
  router = inject(Router)
) => {
  if (loginService.logged) {
    return true;
  }
  router.navigate(['']);
  return false;
};
