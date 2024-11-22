import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../core/entities/auth/login.service';
import { UserConfigsService } from '../../core/entities/user-configs/user-configs.service';
import { UserService } from '../../core/entities/user/user.service';
import { UserAccess } from '../../core/enums/user-enums';
import {
  cloudFireCdnImgsLink,
  cloudFireCdnLink,
} from '../../shared/utils/utils';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  userAccess: UserAccess | null = this.utils.getLoggedUser?.access || null;

  reportsUl: boolean = false;
  noticesUl: boolean = false;
  moreUl: boolean = false;
  userActionsUl: boolean = false;

  darkThemeEnabled = signal(false);

  constructor(
    public readonly loginService: LoginService,
    public readonly utils: UtilsService,
    private readonly _userService: UserService,
    private readonly _userConfigsService: UserConfigsService
  ) {}

  ngOnInit(): void {
    this.getUserConfigs();
    this.getUserImage();
    this.subscribeUserConfigs();
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
      .pipe(takeUntilDestroyed())
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
    this.loginService.logout(false);
  }
}
