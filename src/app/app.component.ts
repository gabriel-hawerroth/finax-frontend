import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { Location } from '@angular/common';
import { MobilePageComponent } from './main/mobile-page/mobile-page.component';
import { UtilsService } from './utils/utils.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, MobilePageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public loginService = inject(LoginService);
  public location = inject(Location);
  private _utils = inject(UtilsService);

  constructor() {
    this._utils.setDefaultLanguage();
  }
}
