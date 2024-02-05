import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../../services/login.service';
import { UserService } from '../../../services/user.service';
import { UtilsService } from '../../../utils/utils.service';
import { ChangePasswordDialogComponent } from '../../dialogs/change-password-dialog/change-password-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ButtonsComponent } from '../../../utils/buttons/buttons.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ButtonsComponent,
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  public loginService = inject(LoginService);
  private _fb = inject(FormBuilder);
  private _userService = inject(UserService);
  private _matDialog = inject(MatDialog);

  private _unsubscribeAll: Subject<any> = new Subject();

  userForm!: FormGroup;
  language: string = this.utilsService.getUserConfigs.language;
  currency: string = this.utilsService.getUserConfigs.currency;

  userPlanTitle: string = '';
  monthYear: string = '';
  planPrice: string = '';
  signatureExpiration: string = '';

  profileImageSrc: string | ArrayBuffer | null =
    this.utilsService.userImage.getValue();
  changedProfileImg: boolean = false;
  selectedProfileImage: File | null = null;

  saving: boolean = false;

  ngOnInit(): void {
    this.buildForm();
    // this.getUserPlan();

    this.utilsService.userImage
      .asObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => (this.profileImageSrc = value));
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

    this.userForm.patchValue(this.loginService.getLoggedUser!);
  }

  saveUser() {
    this.saving = true;

    let showingMessage: boolean = false;

    setTimeout(() => {
      if (this.saving && this.selectedProfileImage) {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Devido ao tamanho da imagem isto pode levar alguns segundos'
            : 'Due to the size of the image, this may take a few seconds',
          6000
        );
        showingMessage = true;
        setTimeout(() => {
          showingMessage = false;
        }, 6000);
      }
    }, 8000);

    this._userService
      .saveUser(this.userForm.value)
      .then(async (user: any) => {
        this.utilsService.setItemLocalStorage(
          'userFinax',
          btoa(JSON.stringify(user))
        );

        if (this.changedProfileImg) {
          await this._userService
            .changeProfileImagem(this.selectedProfileImage!)
            .then(() => {
              this.utilsService.showSimpleMessage(
                this.language === 'pt-br'
                  ? 'Perfil editado com sucesso'
                  : 'Profile edited sucessfully'
              );
              this.changedProfileImg = false;

              const file = new Blob([this.selectedProfileImage!], {
                type: 'application/json',
              });
              if (file.size !== 0) {
                const reader = new FileReader();
                reader.onload = () => {
                  this.utilsService.userImage.next(reader.result);
                };
                reader.readAsDataURL(file);
              }
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
        this.saving = false;
      });

    if (showingMessage) this.utilsService.dismissMessage();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'jfif', 'webp'];
      const extension = file.name.split('.').pop().toLowerCase();
      if (imageExtensions.indexOf(extension) === -1) {
        alert(
          this.language === 'pt-br'
            ? 'Por favor, selecione um arquivo de imagem válido (jpg, jpeg, png, jfif, webp).'
            : 'Please select a valid image file (jpg, jpeg, png, jfif, webp).'
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
        userId: this.loginService.getLoggedUser!.id,
      },
      disableClose: false,
      autoFocus: true,
      width: '39%',
    });
  }

  changePlan() {}

  // getUserPlan() {
  //   this.monthYear =
  //     this.loginService.getLoggedUser!.signature === 'month'
  //       ? 'Mensal'
  //       : 'Anual';

  //   if (this.monthYear === 'Anual') {
  //     this.signatureExpiration =
  //       this.loginService.getLoggedUser!.signatureExpiration!.toString();
  //   }

  //   switch (this.loginService.getUserAccess) {
  //     case 'free':
  //       this.userPlanTitle = 'Plano gratuito';
  //       document.getElementById('month-year')!.style.display = 'none';
  //       document.getElementById('signature-expiration')!.style.display = 'none';
  //       document.getElementById('cancel-signature')!.style.display = 'none';
  //       document.getElementById('change-payment-method')!.style.display =
  //         'none';
  //       this.planPrice = 'R$0,00';
  //       break;
  //     case 'basic':
  //       this.userPlanTitle = 'Plano básico';
  //       this.planPrice =
  //         'R$' + (this.monthYear === 'Mensal' ? '11,90' : '94,80');
  //       break;
  //     case 'premium':
  //       this.userPlanTitle = 'Plano premium';
  //       this.planPrice =
  //         'R$' + (this.monthYear === 'Mensal' ? '49,90' : '358,80');
  //       break;
  //     case 'adm':
  //       this.userPlanTitle = 'Acesso adm';
  //       document.getElementById('month-year')!.style.display = 'none';
  //       document.getElementById('adm-plan')!.style.display = 'block';
  //       document.getElementById('signature-expiration')!.style.display = 'none';
  //       break;

  //     default:
  //       this.userPlanTitle = 'Erro ao obter o plano';
  //       break;
  //   }
  // }
}
