import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
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
import { ThemingService } from './shared/utils/theming.service';

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
    private readonly _router: Router,
    private readonly _themingService: ThemingService
  ) {
    _utils.setUserConfigs(_utils.getUserConfigs);
    this.subscribeShowMenuChanges();
    this.subscribeWindowResize();
    _themingService.applyTheme(_utils.getUserConfigs.theme);
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

  private subscribeWindowResize() {
    if (!this._utils.isBrowser) return;

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.handleSidebarVisibilityChange());
  }

  toogleSidebar() {
    this.sidebarOpened.set(!this.sidebarOpened());
  }

  setTheme = effect(() => {
    if (!this._utils.isBrowser) return;

    console.log('setTheme');

    document.body.style.setProperty(
      `--primary-background-color`,
      this._themingService.primaryBackgroundColor()
    );
    document.body.style.setProperty(
      `--sidebar-content-background-color`,
      this._themingService.sidebarBackgroundColor()
    );
    document.body.style.setProperty(
      `--card-background-color`,
      this._themingService.cardBackgroundColor()
    );
    document.body.style.setProperty(
      `--primary-font-color`,
      this._themingService.primaryFontColor()
    );
    document.body.style.setProperty(
      `--disabled-font-color`,
      this._themingService.disabledFontColor()
    );
    document.body.style.setProperty(
      `--page-title-font-color`,
      this._themingService.pageTitleFontColor()
    );
    document.body.style.setProperty(
      `--form-field-hint-font-color`,
      this._themingService.formFieldHintFontColor()
    );
    document.body.style.setProperty(
      `--card-title-font-color`,
      this._themingService.cardTitleFontColor()
    );
    document.body.style.setProperty(
      `--snack-bar-message-font-color`,
      this._themingService.snackBarMessageFontColor()
    );
    document.body.style.setProperty(
      `--policy-page-paragraph-font-color`,
      this._themingService.policyPageParagraphFontColor()
    );
    document.body.style.setProperty(
      `--empty-message-font-color`,
      this._themingService.emptyMessageFontColor()
    );
    document.body.style.setProperty(
      `--divider-color`,
      this._themingService.dividerColor()
    );
    document.body.style.setProperty(
      `--default-box-shadow`,
      this._themingService.defaultBoxShadow()
    );
    document.body.style.setProperty(
      `--default-account-logo-box-shadow`,
      this._themingService.defaultAccountLogoBoxShadow()
    );
    document.body.style.setProperty(
      `--default-account-logo-color`,
      this._themingService.defaultAccountLogoColor()
    );
    document.body.style.setProperty(
      `--category-option-color`,
      this._themingService.categoryOptionColor()
    );
    document.body.style.setProperty(
      `--button-hover-background-color`,
      this._themingService.buttonHoverBackgroundColor()
    );
  });
}
