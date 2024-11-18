import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './core/entities/auth/login.service';
import { ShowValues } from './core/enums/show-values';
import { SpendByCategoryInterval } from './core/enums/spend-by-category-interval';
import { MobilePage } from './main/pages/mobile-page/views/principal/mobile-page.component';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import {
  LS_DATE_INTERVAL_SPENDS_BY_CATEGORY,
  LS_SHOW_VALUES,
} from './shared/utils/local-storage-contants';
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
    this.setDefaults();
  }

  setDefaults() {
    this._utils.setDefaultLanguage();

    if (!this._utils.getItemLocalStorage(LS_SHOW_VALUES))
      this._utils.setItemLocalStorage(LS_SHOW_VALUES, ShowValues.ON);

    if (!this._utils.getItemLocalStorage(LS_DATE_INTERVAL_SPENDS_BY_CATEGORY))
      this._utils.setItemLocalStorage(
        LS_DATE_INTERVAL_SPENDS_BY_CATEGORY,
        SpendByCategoryInterval.LAST_30_DAYS
      );
  }
}
