import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UtilsService } from '../../utils/utils.service';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root',
})
export class AdmTierGuard implements CanActivate {
  private _loginService = inject(LoginService);
  private _router = inject(Router);
  private _utilsService = inject(UtilsService);

  canActivate() {
    if (this._loginService.logged) {
      if (this._utilsService.getLoggedUser?.access === 'adm') return true;
      else {
        this._router.navigate(['home']);
        this._utilsService.showMessage('generic.without-permission');
        return false;
      }
    }
    this._router.navigate(['']);
    return false;
  }
}
