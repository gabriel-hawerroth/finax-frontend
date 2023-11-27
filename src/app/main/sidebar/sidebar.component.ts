import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
})
export class SidebarComponent implements OnInit, OnDestroy {
  private _userService = inject(UserService);
  public loginService = inject(LoginService);
  public utilsService = inject(UtilsService);

  private _unsubscribeAll: Subject<any> = new Subject();

  loggedUserId: number = this.loginService.getLoggedUserId;
  language: string = this.utilsService.getUserConfigs.language;
  profileImageSrc!: string | ArrayBuffer | null;
  userAccess: string = 'free';

  reportsUl: boolean = true;
  noticesUl: boolean = true;
  moreUl: boolean = true;
  userActionsUl: boolean = true;

  ngOnInit(): void {
    this.userAccess = this.loginService.getUserAccess;

    this.getUserImage();
    this.handleTheme();

    this.utilsService.userConfigs
      .asObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.language = value.language;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }

  getUserImage() {
    this._userService
      .getUserImage(this.loggedUserId)
      .then((response) => {
        if (response.size === 0) {
          this.utilsService.userImage.next('assets/user-image.webp');
          return;
        }

        const file = new Blob([response], {
          type: response.type,
        });
        if (file.size !== 0) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.utilsService.userImage.next(reader.result);
          };
        }
      })
      .catch(() => {
        this.utilsService.userImage.next('assets/user-image.webp');
      });
  }

  handleTheme() {
    const sidebar = document.getElementById('sidebar');
    const navUlItens = document.querySelectorAll('.nav-ul-item');

    this.utilsService.userConfigs
      .asObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        if (value.theme === 'light') {
          sidebar!.style.backgroundColor = '#fafafa';

          navUlItens.forEach((element) => {
            element.classList.remove('nav-ul-item-dark');
          });
        } else {
          sidebar!.style.backgroundColor = '#212121';

          navUlItens.forEach((element) => {
            element.classList.add('nav-ul-item-dark');
          });
        }
      });
  }

  logout() {
    this.loginService.logout(false);
  }
}
