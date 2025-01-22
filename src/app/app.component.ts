import { CommonModule } from '@angular/common';
import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Subscription,
} from 'rxjs';
import { LoginService } from './core/entities/auth/login.service';
import { ButtonType } from './core/enums/button-style';
import { ShowValues } from './core/enums/show-values';
import { SpendByCategoryInterval } from './core/enums/spend-by-category-interval';
import { Theme } from './core/enums/theme';
import { ButtonConfig } from './core/interfaces/button-config';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { DynamicButtonComponent } from './shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { LogoTitleComponent } from './shared/components/logo-title/logo-title.component';
import {
  LS_DATE_INTERVAL_SPENDS_BY_CATEGORY,
  LS_SHOW_VALUES,
} from './shared/utils/local-storage-contants';
import { ResponsiveService } from './shared/utils/responsive.service';
import { UtilsService } from './shared/utils/utils.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    MatSidenavModule,
    MatToolbarModule,
    LogoTitleComponent,
    DynamicButtonComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '[style.--mat-checkbox-label-text-size]': '2',
  },
})
export class AppComponent implements OnInit, OnDestroy {
  sidebarOpened = signal(this._loginService.logged && this._router.url !== '/');
  mobileToolbarOpened = signal(false);

  sidebarMode = computed(() => {
    if (this.mobileToolbarOpened()) return 'over';
    return 'side';
  });

  showMenu: boolean = false;

  darkThemeEnabled = signal(this._utils.darkThemeEnable);

  resizeSubscription!: Subscription;

  toogleSidebarBtnConfig: ButtonConfig = {
    type: ButtonType.ICON,
    icon: 'menu',
    onClick: () => this.toogleSidebar(),
  };

  constructor(
    private readonly _responsiveService: ResponsiveService,
    private readonly _loginService: LoginService,
    private readonly _utils: UtilsService,
    private readonly _router: Router
  ) {
    _utils.setUserConfigs(_utils.getUserConfigs);

    this.subscribeShowMenuChanges();
    this.handleThemeChanges();
    this.subscribeWindowResize();
  }

  ngOnInit(): void {
    this.setDefaults();
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) this.resizeSubscription.unsubscribe();
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

  private subscribeShowMenuChanges() {
    const location$ = this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this._router.url),
      distinctUntilChanged()
    );

    const isLogged$ = this._loginService.isLogged$.pipe(distinctUntilChanged());

    combineLatest([location$, isLogged$])
      .pipe(
        map(
          ([path, isLogged]) =>
            isLogged && path !== '/' && path !== '/link-expirado'
        ),
        takeUntilDestroyed()
      )
      .subscribe((showMenu) => {
        this.showMenu = showMenu;
        this.handleSidebarVisibilityChange();
      });
  }

  private handleSidebarVisibilityChange() {
    if (this._responsiveService.isMobileView()) {
      this.mobileToolbarOpened.set(this.showMenu);
      this.sidebarOpened.set(false);
      return;
    }

    this.sidebarOpened.set(this.showMenu);
    this.mobileToolbarOpened.set(false);
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
            `--primary-background-color`,
            this.darkThemeEnabled() ? '#383838' : '#eff3f8'
          );

          document.body.style.setProperty(
            `--sidebar-content-background-color`,
            this.darkThemeEnabled() ? '#383838' : '#eff3f8'
          );

          document.body.style.setProperty(
            `--card-background-color`,
            this.darkThemeEnabled() ? '#212121' : '#fefefe'
          );
        }
      });
  }

  private subscribeWindowResize() {
    if (!this._utils.isBrowser) return;

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.handleSidebarVisibilityChange());
  }

  toogleSidebar() {
    this.sidebarOpened.set(!this.sidebarOpened());
  }
}
