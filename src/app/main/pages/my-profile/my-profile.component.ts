import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import { ButtonsComponent } from '../../../shared/components/buttons/buttons.component';
import { UtilsService } from '../../../utils/utils.service';
import { ChangePasswordDialog } from './components/change-password-dialog/change-password-dialog.component';
import { MyProfileFormComponent } from './components/my-profile-form/my-profile-form.component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ButtonsComponent,
    TranslateModule,
    MyProfileFormComponent,
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfilePage implements OnInit, OnDestroy {
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

  profileImageSrc: WritableSignal<string | ArrayBuffer | null> = signal('');
  changedProfileImg: boolean = false;
  selectedProfileImage: File | null = null;

  saving: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.buildForm();
    // this.getUserPlan();

    this.utilsService.userImage
      .asObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => this.profileImageSrc.set(value));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.unsubscribe();
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
    this.saving.set(true);

    this.userForm.markAsPristine();
    let showingMessage: boolean = false;

    setTimeout(() => {
      if (this.saving() && this.selectedProfileImage) {
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
        this.utilsService.updateLoggedUser(user);

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
        this.saving.set(false);
      });

    if (showingMessage) this.utilsService.dismissMessage();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) return;

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
      this.profileImageSrc.set(e.target.result);
    };
  }

  openChangePasswordDialog() {
    this._matDialog.open(ChangePasswordDialog, {
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
