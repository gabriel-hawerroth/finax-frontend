import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { UserConfigs } from '../interfaces/UserConfigs';
import { isPlatformBrowser } from '@angular/common';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../main/dialogs/confirmation-dialog/confirmation-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private _snackBar = inject(MatSnackBar);
  private _dialog = inject(MatDialog);
  private _translateService = inject(TranslateService);

  public isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  public isPcScreen = this.isBrowser
    ? window.innerWidth > 1000 && window.innerHeight > 520
    : false;

  // user observables
  public userName: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.getLoggedUser?.firstName || ''
  );

  public userImage: BehaviorSubject<string | ArrayBuffer | null> =
    new BehaviorSubject<string | ArrayBuffer | null>('assets/user-image.webp');

  private userConfigs: BehaviorSubject<UserConfigs> =
    new BehaviorSubject<UserConfigs>(this.getUserConfigs);
  // user observables

  get getLoggedUser(): User | null {
    return this.getItemLocalStorage('userFinax')
      ? JSON.parse(atob(this.getItemLocalStorage('userFinax')!))
      : null;
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
      language: 'pt-br',
      currency: 'R$',
    };
  }

  setDefaultLanguage() {
    this._translateService.setDefaultLang(this.getUserConfigs.language);
    this._translateService.use(this.getUserConfigs.language);
  }

  setUserConfigs(configs: UserConfigs) {
    this.userConfigs.next(configs);
    this._translateService.use(configs.language);
  }

  subscribeUserConfigs(): Observable<UserConfigs> {
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

  showMessage(message: string, duration: number = 3000) {
    message = this._translateService.instant(message);

    this._snackBar.open(message, '', {
      duration: duration,
    });
  }

  showMessageWithoutDuration(message: string) {
    message = this._translateService.instant(message);
    this._snackBar.open(message, 'OK');
  }

  dismissMessage() {
    this._snackBar.dismiss();
  }

  passwordValidator() {
    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[A-Z]).{8,}$/;

    return regex;
  }

  get passwordRequirementsText(): string {
    return this._translateService.instant('generic.password-requirements');
  }

  filterList(rows: any[], atributo: string, keyWord: any): any[] {
    if (!rows) return [];

    if (typeof keyWord === 'string') {
      return rows.filter((item: any) => {
        if (item[atributo]) {
          return (
            this.removeAccents(String(item[atributo]).toLowerCase()).indexOf(
              this.removeAccents(keyWord.toLowerCase())
            ) !== -1
          );
        }
        return false;
      });
    }
    return rows.filter((item: any) => item[atributo] === keyWord);
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
      this._dialog
        .open(ConfirmationDialogComponent, {
          data: {
            message,
          },
          autoFocus: false,
        })
        .afterClosed()
    );
  }
}
