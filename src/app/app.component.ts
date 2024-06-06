import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MobilePage } from './main/pages/mobile-page/mobile-page.component';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { LoginService } from './services/login.service';
import { UtilsService } from './utils/utils.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, MobilePage],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public readonly loginService = inject(LoginService);
  public readonly location = inject(Location);
  private readonly _utils = inject(UtilsService);

  constructor() {
    this._utils.removeItemLocalStorage('savedUserConfigsFinax');

    this._utils.setDefaultLanguage();
  }
}
