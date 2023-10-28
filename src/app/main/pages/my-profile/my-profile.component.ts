import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/utils/utils.service';
import { ChangePasswordDialogComponent } from '../../dialogs/change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  loggedUserId: number = this._loginService.getLoggedUserId;
  language: string = '';
  currency: string = '';

  userPlanTitle: string = '';
  monthYear: string = '';
  planPrice: string = '';
  signatureExpiration: string = '';

  profileImageSrc: string | ArrayBuffer | null = null;
  changedProfileImg: boolean = false;
  selectedProfileImage: File | null = null;

  showLoading: boolean = false;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _fb: FormBuilder,
    private _loginService: LoginService,
    private _userService: UserService,
    private _matDialog: MatDialog,
    public utilsService: UtilsService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.buildForm();
    this.subscribeUserObservables();
    this.getUser();
    this.getUserPlan();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }

  buildForm() {
    this.userForm = this._fb.group({
      id: '',
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: '',
    });
  }

  subscribeUserObservables() {
    this.utilsService.userImage
      .asObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((image) => {
        this.profileImageSrc = image;
      });

    this.utilsService.userConfigs
      .asObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.language = value!.language;
        this.currency = value!.currency;
      });
  }

  getUser() {
    this.userForm.patchValue(this._loginService.getLoggedUser);
  }

  getUserImage() {
    this._userService.getUserImage(this.loggedUserId).then((response) => {
      if (response === undefined) return;

      const file = new Blob([response], {
        type: response.type,
      });
      if (file.size !== 0) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => this.utilsService.userImage.next(reader.result);
      }
    });
  }

  getUserPlan() {
    this.monthYear =
      this._loginService.getLoggedUser.signature === 'month'
        ? 'Mensal'
        : 'Anual';

    if (this.monthYear === 'Anual') {
      this.signatureExpiration =
        this._loginService.getLoggedUser.signatureExpiration.toString();
    }

    switch (this._loginService.getUserAccess) {
      case 'free':
        this.userPlanTitle = 'Plano gratuito';
        document.getElementById('month-year')!.style.display = 'none';
        document.getElementById('signature-expiration')!.style.display = 'none';
        document.getElementById('cancel-signature')!.style.display = 'none';
        document.getElementById('change-payment-method')!.style.display =
          'none';
        this.planPrice = 'R$0,00';
        break;
      case 'basic':
        this.userPlanTitle = 'Plano básico';
        this.planPrice =
          'R$' + (this.monthYear === 'Mensal' ? '11,90' : '94,80');
        break;
      case 'premium':
        this.userPlanTitle = 'Plano premium';
        this.planPrice =
          'R$' + (this.monthYear === 'Mensal' ? '49,90' : '358,80');
        break;
      case 'adm':
        this.userPlanTitle = 'Acesso adm';
        document.getElementById('month-year')!.style.display = 'none';
        document.getElementById('adm-plan')!.style.display = 'block';
        document.getElementById('signature-expiration')!.style.display = 'none';
        break;

      default:
        this.userPlanTitle = 'Erro ao obter o plano';
        break;
    }
  }

  saveUser() {
    this.showLoading = true;

    this._userService
      .saveUser(this.userForm.value)
      .then((user: any) => {
        localStorage.setItem('userFinax', btoa(JSON.stringify(user)));

        if (this.changedProfileImg) {
          this._userService
            .changeProfileImagem(user.id, this.selectedProfileImage!)
            .then(() => {
              this.utilsService.showSimpleMessage(
                this.language === 'pt-br'
                  ? 'Perfil editado com sucesso'
                  : 'Profile edited sucessfully'
              );
              this.changedProfileImg = false;

              this.getUserImage();
            })
            .catch(() => {
              this.utilsService.showSimpleMessage(
                this.language === 'pt-br'
                  ? 'O perfil foi editado mas houve um erro ao salvar a nova foto de perfil'
                  : 'The profile was edited, but there was an error saving the new profile picture'
              );
            });
        } else {
          this.utilsService.showSimpleMessage(
            this.language === 'pt-br'
              ? 'Perfil editado com sucesso'
              : 'Profile edited sucessfully'
          );
        }
      })
      .catch(() => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao salvar as alterações'
            : 'Error saving changes '
        );
      })
      .finally(() => {
        this.userForm.markAsPristine();
        this.changedProfileImg = false;
        this.showLoading = false;
      });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'jfif'];
      const extension = file.name.split('.').pop().toLowerCase();
      if (imageExtensions.indexOf(extension) === -1) {
        alert(
          this.language === 'pt-br'
            ? 'Por favor, selecione um arquivo de imagem válido (jpg, jpeg, png, jfif).'
            : 'Please select a valid image file (jpg, jpeg, png, jfif).'
        );
        return;
      }

      const maxSize = 3 * 1024 * 1024; // first number(mb) converted to bytes
      if (file.size > maxSize) {
        alert(
          this.language === 'pt-br'
            ? 'O arquivo selecionado é muito grande. O tamanho máximo permitido é 3MB.'
            : 'The selected file is too large. The maximum size allowed is 3MB.'
        );
        return;
      }

      this.changedProfileImg = true;
      this.selectedProfileImage = file;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.profileImageSrc = e.target.result;
      };
    }
  }

  openChangePasswordDialog() {
    this._matDialog.open(ChangePasswordDialogComponent, {
      data: {
        userId: this._loginService.getLoggedUserId,
      },
      disableClose: false,
      autoFocus: true,
      width: '39%',
      height: '50%',
    });
  }

  changePlan() {}
}
