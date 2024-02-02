import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root',
})
export class UnauthenticatedUserGuard implements CanActivate {
  private _loginService = inject(LoginService);
  private _router = inject(Router);

  canActivate() {
    if (this._loginService.logged) {
      this._router.navigate(['home']);
      return false;
    }
    return true;
  }
}
