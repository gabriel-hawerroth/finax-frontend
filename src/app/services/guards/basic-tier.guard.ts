import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class BasicTierGuard implements CanActivate {
  savedUserConfigs = localStorage.getItem('savedUserConfigs');
  language: string = this.savedUserConfigs
    ? JSON.parse(atob(this.savedUserConfigs)).language
    : 'pt-br';

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _utilsService: UtilsService
  ) {}

  canActivate() {
    if (this._loginService.logged) {
      if (this._loginService.getUserAccess !== 'free') return true;
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
