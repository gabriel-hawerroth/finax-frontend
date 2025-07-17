import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../core/entities/auth/login.service';
import { UserConfigsService } from '../../core/entities/user-configs/user-configs.service';
import { UserService } from '../../core/entities/user/user.service';
import { UserAccess } from '../../core/enums/user-enums';
import { NavItem } from '../../core/interfaces/nav-item';
import { LogoTitleComponent } from '../../shared/components/logo-title/logo-title.component';
import { ResponsiveService } from '../../shared/services/responsive.service';
import {
  cloudFireCdnImgsLink,
  cloudFireCdnLink,
} from '../../shared/utils/utils';
import { UtilsService } from '../../shared/utils/utils.service';
import { SidebarItensComponent } from './sidebar-itens/sidebar-itens.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    TranslateModule,
    MatListModule,
    LogoTitleComponent,
    SidebarItensComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  userAccess: UserAccess | null = this.utils.getLoggedUser?.access || null;

  reportsUl: boolean = false;
  noticesUl: boolean = false;
  moreUl: boolean = false;
  userActionsUl: boolean = false;

  isMobile = this._responsiveService.isMobileView;

  constructor(
    public readonly utils: UtilsService,
    private readonly _loginService: LoginService,
    private readonly _userService: UserService,
    private readonly _userConfigsService: UserConfigsService,
    private readonly _responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {
    if (this._loginService.logged) {
      this.getUserConfigs();
      this.getUserImage();
    }
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
    {
      icon: 'finance',
      label: 'sidebar.reports',
      classes: 'hide-mobile',
      childs: [
        {
          route: 'relatorios/por-categoria',
          icon: 'data_usage',
          label: 'sidebar.by-category',
        },
        {
          route: 'relatorios/por-conta',
          icon: 'equalizer',
          label: 'sidebar.by-account',
        },
      ],
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
      icon: 'logout',
      label: 'sidebar.logout',
      onClick: () => this.logout(),
    },
  ];
}
