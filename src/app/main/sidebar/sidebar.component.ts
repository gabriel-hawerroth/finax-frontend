import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from '../../core/entities/auth/login.service';
import { UserService } from '../../core/entities/user/user.service';
import { cloudFireCdnImgsLink, cloudFireCdnLink } from '../../shared/utils/constants';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit, OnDestroy {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  private readonly _unsubscribeAll = new Subject<void>();

  userAccess: string = this.utils.getLoggedUser?.access || '';

  reportsUl: boolean = false;
  noticesUl: boolean = false;
  moreUl: boolean = false;
  userActionsUl: boolean = false;

  darkThemeEnabled = signal(false);

  constructor(
    public readonly loginService: LoginService,
    public readonly utils: UtilsService,
    private readonly _userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscribeUserConfigs();
    this.getUserImage();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();
  }

  subscribeUserConfigs() {
    this.utils
      .getUserConfigsObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.darkThemeEnabled.set(value.theme === 'dark');
      });
  }

  getUserImage() {
    this._userService.getUserImage().then((response) => {
      this.utils.userImage.next(`${cloudFireCdnLink}/${response}`);
    });
  }

  logout() {
    this.loginService.logout(false);
  }
}
