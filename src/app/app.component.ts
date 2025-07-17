import { CommonModule } from '@angular/common';
import { Component, computed, OnDestroy, signal } from '@angular/core';
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
import { ButtonConfig } from './core/interfaces/button-config';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { DynamicButtonComponent } from './shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { SpeedDialComponent } from './shared/components/speed-dial/speed-dial.component';
import { ResponsiveService } from './shared/services/responsive.service';
import { ThemingService } from './shared/services/theming.service';
import { UtilsService } from './shared/utils/utils.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    MatSidenavModule,
    MatToolbarModule,
    DynamicButtonComponent,
    SpeedDialComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '[style.--mat-checkbox-label-text-size]': '2',
  },
})
export class AppComponent implements OnDestroy {
  sidebarOpened = signal(this._loginService.logged && this._router.url !== '/');
  mobileToolbarOpened = signal(false);

  sidebarMode = computed(() => {
    if (this.mobileToolbarOpened()) return 'over';
    return 'side';
  });

  showMenu: boolean = false;

  resizeSubscription!: Subscription;

  contentStyle = {
    color: 'var(--primary-font-color)',
    transform: 'scale(1.1)',
  };

  HOME_TOOLBAR_ITEM_CONFIG: ButtonConfig = {
    type: ButtonType.ICON,
    icon: 'home',
    onClick: () => this._router.navigateByUrl('/home'),
    style: this.contentStyle,
  };

  RELEASES_TOOLBAR_ITEM_CONFIG: ButtonConfig = {
    type: ButtonType.ICON,
    icon: 'format_list_bulleted',
    onClick: () => this._router.navigateByUrl('/fluxo-de-caixa'),
    style: this.contentStyle,
  };

  MONITORING_TOOLBAR_ITEM_CONFIG: ButtonConfig = {
    type: ButtonType.ICON,
    icon: 'monitoring',
    onClick: () => this._router.navigateByUrl('/relatorios/mobile'),
    style: this.contentStyle,
  };

  MORE_TOOLBAR_ITEM_CONFIG: ButtonConfig = {
    type: ButtonType.ICON,
    icon: 'more_horiz',
    onClick: () => this.toogleSidebar(),
    style: this.contentStyle,
  };

  constructor(
    private readonly _responsiveService: ResponsiveService,
    private readonly _loginService: LoginService,
    private readonly _utils: UtilsService,
    private readonly _router: Router,
    private readonly _themingService: ThemingService
  ) {
    this.subscribeShowMenuChanges();
    this.subscribeWindowResize();
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) this.resizeSubscription.unsubscribe();
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
    this._themingService.reload();

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
}
