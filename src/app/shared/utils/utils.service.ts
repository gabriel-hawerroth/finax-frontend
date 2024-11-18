import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { ConfirmDialogData } from '../../core/entities/generic';
import { ReleaseFormDialogData } from '../../core/entities/release/release-dto';
import { UserConfigs } from '../../core/entities/user-configs/user-configs';
import { User } from '../../core/entities/user/user';
import { ReleasesViewMode } from '../../core/enums/releases-view-mode';
import { ShowValues } from '../../core/enums/show-values';
import { Theme } from '../../core/enums/theme';
import { ReleaseFormDialog } from '../../main/pages/cash-flow/views/form-dialog/release-form-dialog.component';
import { ConfirmDialog } from '../components/confirm-dialog/confirm-dialog.component';
import { LS_SHOW_VALUES } from './local-storage-contants';
import { ResponsiveService } from './responsive.service';
import { cloudFireCdnImgsLink, cloudFireCdnLink } from './utils';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  public isBrowser: boolean;
  public isPcScreen: boolean;

  constructor(
    private readonly _snackBar: MatSnackBar,
    private readonly _matDialog: MatDialog,
    private readonly _translateService: TranslateService,
    private readonly _responsiveService: ResponsiveService
  ) {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    this.isPcScreen = this.isBrowser
      ? window.innerWidth > 1000 && window.innerHeight > 520
      : false;

    this.username.next(this.getLoggedUser?.firstName || '');
  }

  // user observables
  public readonly username = new BehaviorSubject<string>('');

  public readonly userImage = new BehaviorSubject<string>(
    cloudFireCdnImgsLink + 'user-image.webp'
  );

  private readonly userConfigs: BehaviorSubject<UserConfigs> =
    new BehaviorSubject<UserConfigs>(this.getUserConfigs);
  // user observables

  get getLoggedUser(): User | null {
    return this.getItemLocalStorage('userFinax')
      ? JSON.parse(atob(this.getItemLocalStorage('userFinax')!))
      : null;
  }

  updateLoggedUser(user: User) {
    this.username.next(user.firstName);

    if (user.profileImage)
      this.userImage.next(
        `${cloudFireCdnLink}/user/profile-image/${user.profileImage}`
      );

    user.password = '';
    user.profileImage = undefined;
    this.setItemLocalStorage('userFinax', btoa(JSON.stringify(user)));
  }

  get getUserConfigs(): UserConfigs {
    if (this.getItemLocalStorage('savedUserConfigsFinax')) {
      try {
        return JSON.parse(this.getItemLocalStorage('savedUserConfigsFinax')!);
      } catch {
        return JSON.parse(
          atob(this.getItemLocalStorage('savedUserConfigsFinax')!)
        );
      }
    }

    return {
      userId: 0,
      theme: 'light',
      addingMaterialGoodsToPatrimony: false,
      language: 'pt-BR',
      currency: 'R$',
      releasesViewMode: ReleasesViewMode.releases,
      emailNotifications: true,
    };
  }

  get darkThemeEnable() {
    return this.getUserConfigs.theme === Theme.DARK;
  }

  get showValues() {
    return this.getItemLocalStorage(LS_SHOW_VALUES) === ShowValues.ON;
  }

  setDefaultLanguage() {
    this._translateService.setDefaultLang(this.getUserConfigs.language);
    this._translateService.use(this.getUserConfigs.language);
  }

  setUserConfigs(configs: UserConfigs) {
    this.userConfigs.next(configs);
    this._translateService.use(configs.language);
  }

  getUserConfigsObservable(): Observable<UserConfigs> {
    return this.userConfigs.asObservable();
  }

  getItemLocalStorage(item: string): string | null {
    return this.isBrowser ? localStorage.getItem(item) : null;
  }

  setItemLocalStorage(key: string, value: string): void {
    if (this.isBrowser) localStorage.setItem(key, value);
  }

  removeItemLocalStorage(item: string): void {
    if (this.isBrowser) localStorage.removeItem(item);
  }

  showMessage(message: string, duration: number = 3500) {
    message = this._translateService.instant(message);

    this._snackBar.open(message, '', {
      duration: duration,
    });
  }

  showMessageWithoutDuration(message: string) {
    message = this._translateService.instant(message);
    this._snackBar.open(message, 'OK');
  }

  showJoinedMessages(
    separator: string,
    duration: number,
    ...messages: string[]
  ) {
    const joinedMessages = messages
      .map((message) => this._translateService.instant(message))
      .join(separator);

    this._snackBar.open(joinedMessages, '', {
      duration: duration,
    });
  }

  dismissMessage() {
    this._snackBar.dismiss();
  }

  passwordValidator(): RegExp {
    return /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[A-Z]).{8,}$/;
  }

  get passwordRequirementsText(): string {
    return this._translateService.instant('generic.password-requirements');
  }

  filterList(rows: any[], atributo: string | string[], keyWord: any): any[] {
    if (!rows) return [];

    const attributes = atributo instanceof Array ? atributo : [atributo];

    if (typeof keyWord === 'string') {
      return rows.filter((item: any) => {
        for (const attribute of attributes) {
          if (item[attribute]) {
            return (
              this.removeAccents(String(item[attribute]).toLowerCase()).indexOf(
                this.removeAccents(keyWord.toLowerCase())
              ) !== -1
            );
          }
        }
        return false;
      });
    }

    if (keyWord instanceof Array) {
      return rows.filter((item: any) => {
        for (const attribute of attributes) {
          if (item[attribute]) {
            if (typeof item[attribute] === 'string') {
              return keyWord
                .map((item) => this.removeAccents(item.toLowerCase()))
                .includes(this.removeAccents(item[attribute].toLowerCase()));
            }
            return keyWord.includes(item[attribute]);
          }
        }
        return false;
      });
    }

    return rows.filter((item: any) => {
      for (const attribute of attributes) {
        if (item[attribute] !== null && item[attribute] !== undefined) {
          return item[attribute] === keyWord;
        }
      }
      return false;
    });
  }

  filterListByDate(
    rows: any[],
    atributo: string,
    dateFilterStart: Date,
    dateFilterEnd: Date
  ) {
    if (!rows || !dateFilterStart) return rows;

    return rows.filter((item: any) => {
      if (item[atributo]) {
        const itemDate = new Date(item[atributo]);

        if (!isNaN(itemDate.getTime())) {
          return (
            itemDate >= dateFilterStart &&
            (!dateFilterEnd || itemDate <= dateFilterEnd)
          );
        }
      }
      return false;
    });
  }

  removeAccents(newStringComAcento: string): string {
    if (!newStringComAcento) {
      return '';
    } else if (newStringComAcento === null) {
      alert('Campo descrição nulo');
    }

    let str = newStringComAcento;

    const mapaAcentosHex: { [key: string]: RegExp } = {
      a: /[\xE0-\xE6]/g,
      A: /[\xC0-\xC6]/g,
      e: /[\xE8-\xEB]/g,
      E: /[\xC8-\xCB]/g,
      i: /[\xEC-\xEF]/g,
      I: /[\xCC-\xCF]/g,
      o: /[\xF2-\xF6]/g,
      O: /[\xD2-\xD6]/g,
      u: /[\xF9-\xFC]/g,
      U: /[\xD9-\xDC]/g,
      c: /\xE7/g,
      C: /\xC7/g,
      n: /\xF1/g,
      N: /\xD1/g,
    };

    for (const letra in mapaAcentosHex) {
      const expressaoRegular = mapaAcentosHex[letra];
      str = str.replace(expressaoRegular, letra);
    }

    return str;
  }

  maxLengthValidator(maxLength: number): ValidatorFn {
    const pattern = new RegExp(`^\\d{0,${maxLength}}$`);

    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (value === null || value === undefined || value === '') {
        return null;
      }

      const stringValue = value.toString();
      const isValid =
        stringValue.length <= maxLength && pattern.test(stringValue);

      return isValid ? null : { maxCharacterLength: { maxLength } };
    };
  }

  showConfirmDialog(message: string): Promise<boolean> {
    return lastValueFrom(
      this._matDialog
        .open(ConfirmDialog, {
          data: <ConfirmDialogData>{
            message,
          },
          panelClass: 'confirm-dialog',
          autoFocus: false,
        })
        .afterClosed()
    );
  }

  limitTwoDecimals(n: number) {
    return Math.round(n * 100) / 100;
  }

  openReleaseFormDialog(data: ReleaseFormDialogData): Promise<boolean> {
    return lastValueFrom(
      this._matDialog
        .open(ReleaseFormDialog, {
          data,
          panelClass: 'new-release-cash-flow-dialog',
          autoFocus: false,
          minWidth: this._responsiveService.veryLargeWith() ? '47vw' : '55vw',
        })
        .afterClosed()
    );
  }
}
