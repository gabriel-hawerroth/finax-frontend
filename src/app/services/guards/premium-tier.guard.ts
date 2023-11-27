import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login.service';
import { UtilsService } from '../../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class PremiumTierGuard implements CanActivate {
  private _loginService = inject(LoginService);
  private _router = inject(Router);
  private _utilsService = inject(UtilsService);

  language = this._utilsService.getSavedUserConfigs.language;

  canActivate() {
    if (this._loginService.logged) {
      if (
        this._loginService.getUserAccess === 'premium' ||
        this._loginService.getUserAccess === 'adm'
      )
        return true;
      else {
        this._router.navigate(['home']);
        this._utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Você não tem permissão para acessar essa tela'
            : "You don't have permission to access this screen"
        );
        return false;
      }
    }
    this._router.navigate(['']);
    return false;
  }
}
