import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from '../../core/entities/auth/login.service';
import { UserConfigsService } from '../../core/entities/user-configs/user-configs.service';
import { UserService } from '../../core/entities/user/user.service';
import { UserAccess } from '../../core/enums/user-enums';
import { LogoTitleComponent } from '../../shared/components/logo-title/logo-title.component';
import { ResponsiveService } from '../../shared/utils/responsive.service';
import {
  cloudFireCdnImgsLink,
  cloudFireCdnLink,
} from '../../shared/utils/utils';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    TranslateModule,
    MatListModule,
    LogoTitleComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit, OnDestroy {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  private readonly _unsubscribeAll = new Subject<void>();

  userAccess: UserAccess | null = this.utils.getLoggedUser?.access || null;

  reportsUl: boolean = false;
  noticesUl: boolean = false;
  moreUl: boolean = false;
  userActionsUl: boolean = false;

  darkThemeEnabled = signal(false);

  isMobile = this._responsiveService.isMobileView;

  constructor(
    public readonly utils: UtilsService,
    private readonly _loginService: LoginService,
    private readonly _userService: UserService,
    private readonly _userConfigsService: UserConfigsService,
    private readonly _responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {
    this.subscribeUserConfigs();

    if (this._loginService.logged) {
      this.getUserConfigs();
      this.getUserImage();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();
  }

  getUserConfigs() {
    this._userConfigsService.getLoggedUserConfigs().then((response) => {
      this.utils.setUserConfigs(response);
      this.utils.setItemLocalStorage(
        'savedUserConfigsFinax',
        JSON.stringify(response)
      );
    });
  }

  subscribeUserConfigs() {
    this.utils
      .getUserConfigsObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => this.darkThemeEnabled.set(value.theme === 'dark'));
  }

  getUserImage() {
    this._userService.getUserImage().then((response) => {
      if (!response) return;

      this.utils.userImage.next(
        `${cloudFireCdnLink}/user/profile-image/${response}`
      );
    });
  }

  logout() {
    this._loginService.logout(false);
  }

  routes: NavItem[] = [
    {
      route: 'home',
      icon: 'home',
      label: 'sidebar.home',
    },
    {
      route: 'fluxo-de-caixa',
      icon: 'wallet',
      label: 'sidebar.cash-flow',
    },
    {
      route: 'contas',
      icon: 'account_balance',
      label: 'sidebar.my-accounts',
    },
    {
      route: 'cartoes-de-credito',
      icon: 'credit_card',
      label: 'sidebar.credit-cards',
    },
    {
      route: 'categorias',
      icon: 'sell',
      label: 'sidebar.categories',
    },
  ];

  bottomRoutes: NavItem[] = [
    {
      route: 'meu-perfil',
      icon: 'account_circle',
      label: 'sidebar.my-profile',
    },
    {
      route: 'configuracoes',
      icon: 'settings',
      label: 'sidebar.settings',
    },
    {
      route: '',
      icon: 'logout',
      label: 'sidebar.logout',
      onClick: () => this.logout(),
    },
  ];
}

interface NavItem {
  route: string;
  icon: string;
  label: string;
  onClick?: () => void;
}
