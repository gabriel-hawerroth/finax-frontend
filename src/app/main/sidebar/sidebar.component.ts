import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  loggedUserId: number = this._loginService.getLoggedUserId;
  language: string | undefined = '';
  profileImageSrc!: string | ArrayBuffer | null;
  userAccess: string = 'free';

  reportsUl: boolean = true;
  noticesUl: boolean = true;
  moreUl: boolean = true;
  userActionsUl: boolean = true;

  constructor(
    public _loginService: LoginService,
    private _userService: UserService,
    public _utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.userAccess = this._loginService.getUserAccess;

    this.getUserImage();
    this.handleTheme();

    this._utilsService.userConfigs.asObservable().subscribe((value) => {
      this.language = value?.language;
    });
  }

  getUserImage() {
    this._userService
      .getUserImage(this.loggedUserId)
      .then((response) => {
        if (response.size === 0) {
          this._utilsService.userImage.next('assets/user-image.png');
          return;
        }

        const file = new Blob([response], {
          type: response.type,
        });
        if (file.size !== 0) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this._utilsService.userImage.next(reader.result);
          };
        }
      })
      .catch(() => {
        this._utilsService.userImage.next('assets/user-image.png');
      });
  }

  handleTheme() {
    const sidebar = document.getElementById('sidebar');
    const navUlItens = document.querySelectorAll('.nav-ul-item');

    this._utilsService.userConfigs.asObservable().subscribe((value) => {
      if (value?.theme === 'light') {
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
    this._loginService.logout();
  }
}
