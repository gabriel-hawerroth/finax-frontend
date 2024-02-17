import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../utils/utils.service';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit, OnDestroy {
  private _userService = inject(UserService);
  public loginService = inject(LoginService);
  public utilsService = inject(UtilsService);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  private _unsubscribeAll: Subject<any> = new Subject();

  language: string = this.utilsService.getUserConfigs.language;
  userAccess: string = this.loginService.getLoggedUser?.access || '';

  reportsUl: boolean = true;
  noticesUl: boolean = true;
  moreUl: boolean = true;
  userActionsUl: boolean = true;

  darkThemeEnabled: boolean = false;

  ngOnInit(): void {
    this.subscribeUserConfigs();
    this.getUserImage();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }

  subscribeUserConfigs() {
    this.utilsService.userConfigs
      .asObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.darkThemeEnabled = value.theme === 'dark';
        this.language = value.language;

        this._changeDetectorRef.detectChanges();
      });
  }

  getUserImage() {
    this._userService.getUserImage().then((response: Blob) => {
      if (response.size !== 0) {
        const reader = new FileReader();
        reader.onload = () => {
          this.utilsService.userImage.next(reader.result);
        };
        reader.readAsDataURL(response);
      }
    });
  }

  logout() {
    this.loginService.logout(false);
  }
}
