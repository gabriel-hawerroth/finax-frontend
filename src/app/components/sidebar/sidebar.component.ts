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

  isAdmUser: boolean = this._loginService.getUserAccess === 'adm';
  isPremiumUser: boolean = this._loginService.getUserAccess === 'premium';
  isFreeUser: boolean = this._loginService.getUserAccess === 'free';

  private userActionsUl: Boolean = true;
  private reportsUl: boolean = true;
  private indicatorsUl: boolean = true;
  private noticesUl: boolean = true;
  private moreUl: boolean = true;

  profileImageSrc: any;

  constructor(
    public _loginService: LoginService,
    private _userService: UserService,
    public _utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.showByPlan();
    this.getUserImage();
    this.handleTheme();

    this._utilsService.userConfigs.asObservable().subscribe((value) => {
      this.language = value?.language;
    });
  }

  showByPlan() {
    const itensBasicPlan = document.querySelectorAll('.basic-plan');
    const itensPremiumPlan = document.querySelectorAll('.premium-plan');

    switch (this._loginService.getUserAccess) {
      case 'free':
        itensBasicPlan.forEach((element) => {
          element.classList.add('hidden');
        });
        itensPremiumPlan.forEach((element) => {
          element.classList.add('hidden');
        });
        break;

      case 'basic':
        itensPremiumPlan.forEach((element) => {
          element.classList.add('hidden');
        });
        break;
    }
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

  toggleUlVisibility(ulId: string) {
    const ul = document.querySelector(`#${ulId}`);

    if (
      ulId === 'userActionsUl'
        ? this.userActionsUl
        : ulId === 'reportsUl'
        ? this.reportsUl
        : ulId === 'indicatorsUl'
        ? this.indicatorsUl
        : ulId === 'noticesUl'
        ? this.noticesUl
        : ulId === 'moreUl'
        ? this.moreUl
        : false
    ) {
      ul!.classList.add('fadeindown');
      ul!.classList.remove('hidden');

      // this._renderer.addClass(ul, 'fadeindown');
      // this._renderer.removeClass(ul, 'hidden');
    } else {
      ul!.classList.remove('fadeindown');
      ul!.classList.add('hidden');

      // this._renderer.removeClass(ul, 'fadeindown');
      // this._renderer.addClass(ul, 'hidden');
    }

    switch (ulId) {
      case 'userActionsUl':
        this.userActionsUl = !this.userActionsUl;
        break;

      case 'reportsUl':
        this.reportsUl = !this.reportsUl;
        break;

      case 'indicatorsUl':
        this.indicatorsUl = !this.indicatorsUl;
        break;

      case 'noticesUl':
        this.noticesUl = !this.noticesUl;
        break;

      case 'moreUl':
        this.moreUl = !this.moreUl;
        break;

      default:
        break;
    }
  }
}
