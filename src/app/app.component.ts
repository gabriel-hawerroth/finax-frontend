import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './core/entities/auth/login.service';
import { MobilePage } from './main/pages/mobile-page/views/principal/mobile-page.component';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { UtilsService } from './shared/utils/utils.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, MobilePage],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '[style.--mat-checkbox-label-text-size]': '2',
  },
})
export class AppComponent implements OnInit {
  constructor(
    public readonly loginService: LoginService,
    public readonly location: Location,
    private readonly _utils: UtilsService
  ) {}

  ngOnInit(): void {
    this._utils.setDefaultLanguage();
  }
}
