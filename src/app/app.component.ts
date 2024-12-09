import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { combineLatest, distinctUntilChanged, filter, map } from 'rxjs';
import { LoginService } from './core/entities/auth/login.service';
import { ShowValues } from './core/enums/show-values';
import { SpendByCategoryInterval } from './core/enums/spend-by-category-interval';
import { Theme } from './core/enums/theme';
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
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    MobilePage,
    MatSidenavModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '[style.--mat-checkbox-label-text-size]': '2',
  },
})
export class AppComponent implements OnInit {
  sidebarOpened = signal(this._loginService.logged && this._router.url !== '/');

  darkThemeEnabled = signal(this._utils.darkThemeEnable);

  constructor(
    private readonly _loginService: LoginService,
    private readonly _utils: UtilsService,
    private readonly _router: Router
  ) {
    this.handleSidebarVisibilityChange();
    this.handleThemeChanges();
  }

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

  private handleSidebarVisibilityChange() {
    const location$ = this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this._router.url),
      distinctUntilChanged()
    );

    const isLogged$ = this._loginService.isLogged$.pipe(distinctUntilChanged());

    combineLatest([location$, isLogged$])
      .pipe(
        map(([path, isLogged]) => isLogged && path !== '/'),
        takeUntilDestroyed()
      )
      .subscribe((isSidebarOpen) => this.sidebarOpened.set(isSidebarOpen));
  }

  private handleThemeChanges() {
    this._utils
      .getUserConfigsObservable()
      .pipe(
        map((value) => value.theme),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe((value) => {
        this.darkThemeEnabled.set(value === Theme.DARK);

        if (this._utils.isBrowser) {
          document.body.style.setProperty(
            `--sidebar-content-background-color`,
            this.darkThemeEnabled() ? '#383838' : '#eff3f8'
          );
        }
      });
  }
}
