import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { Location } from '@angular/common';
import { UtilsService } from './utils/utils.service';
import { LoginService } from './services/login.service';
import { MobilePageComponent } from './main/pages/mobile-page/mobile-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, MobilePageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public readonly loginService = inject(LoginService);
  public readonly location = inject(Location);
  private readonly _utils = inject(UtilsService);

  constructor() {
    this._utils.setDefaultLanguage();
  }
}
