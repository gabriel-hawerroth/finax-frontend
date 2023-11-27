import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login.service';
import { UtilsService } from '../../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class UnauthenticatedUserGuard implements CanActivate {
  private _loginService = inject(LoginService);
  private _utilsService = inject(UtilsService);
  private _router = inject(Router);

  canActivate() {
    if (this._loginService.logged) {
      this._router.navigate(['home']);
      return false;
    }
    this._utilsService.userImage.next('assets/user-image.webp');
    return true;
  }
}
