import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { UtilsService } from '../../../utils/utils.service';
import { ChangePasswordDialogComponent } from '../../dialogs/change-password-dialog/change-password-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ButtonsComponent } from '../../../utils/buttons/buttons.component';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../interfaces/User';

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
    TranslateModule,
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  private _fb = inject(FormBuilder);
  private _userService = inject(UserService);
  private _matDialog = inject(MatDialog);

  private _unsubscribeAll: Subject<any> = new Subject();

  currency: string = this.utilsService.getUserConfigs.currency;

  userForm!: FormGroup;

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

    this.userForm.patchValue(this.utilsService.getLoggedUser!);
  }

  saveUser() {
    this.saving = true;

    this.userForm.markAsPristine();
    let showingMessage: boolean = false;

    setTimeout(() => {
      if (this.saving && this.selectedProfileImage) {
        this.utilsService.showMessage(
          'generic.this-may-take-few-seconds',
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
      .then(async (user: User) => {
        this.utilsService.setItemLocalStorage(
          'userFinax',
          btoa(JSON.stringify(user))
        );
        this.utilsService.userName.next(user.firstName);

        if (this.changedProfileImg) {
          await this._userService
            .changeProfileImagem(this.selectedProfileImage!)
            .then(() => {
              this.utilsService.showMessage('my-profile.edited-successfully');
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
              this.utilsService.showMessage(
                'my-profile.edited-but-error-saving-picture'
              );
            });
        } else {
          this.utilsService.showMessage('my-profile.edited-successfully');
        }
      })
      .catch(() => {
        this.utilsService.showMessage('my-profile.error-saving');
      })
      .finally(() => {
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
        this.utilsService.showMessage('my-profile.select-valid-file', 10000);
        return;
      }

      const maxSize = 3 * 1024 * 1024; // first number(mb) converted to bytes
      if (file.size > maxSize) {
        this.utilsService.showMessage('generic.file-too-large', 8000);
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
        userId: this.utilsService.getLoggedUser!.id,
      },
      disableClose: false,
      autoFocus: true,
      width: '39%',
    });
  }

  changePlan() {}
}
