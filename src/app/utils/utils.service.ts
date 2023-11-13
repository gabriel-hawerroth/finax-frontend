import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment-timezone';

import { BehaviorSubject } from 'rxjs';
import { UserConfigs } from '../interfaces/UserConfigs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  // user observables
  public userImage: BehaviorSubject<string | ArrayBuffer | null> =
    new BehaviorSubject<string | ArrayBuffer | null>(null);

  public userConfigs: BehaviorSubject<UserConfigs> =
    new BehaviorSubject<UserConfigs>(this.getSavedUserConfigs);
  // user observables

  constructor(private _snackBar: MatSnackBar) {}

  showSimpleMessage(message: string) {
    this._snackBar.open(message, '', {
      duration: 3000,
    });
  }

  showSimpleMessageWithDuration(message: string, duration: number) {
    if (duration === 0) return;
    this._snackBar.open(message, '', {
      duration: duration,
    });
  }

  showSimpleMessageWithoutDuration(message: string) {
    this._snackBar.open(message, 'OK');
  }

  passwordValidator() {
    const passRequirement = {
      passwordMinNumber: 1,
      passwordMinUpperCase: 1,
      passwordMinCharacters: 8,
    };
    return [
      `(?=([^A-Z]*[A-Z])\{${passRequirement.passwordMinUpperCase},\})`,
      `(?=([^0-9]*[0-9])\{${passRequirement.passwordMinNumber},\})`,
      `[A-Za-z\\d\$\@\$\!\%\*\?\&\.]{${passRequirement.passwordMinCharacters},}`,
    ]
      .map((item) => item.toString())
      .join('');
  }

  get getSavedUserConfigs(): UserConfigs {
    return localStorage.getItem('savedUserConfigsFinax')
      ? JSON.parse(atob(localStorage.getItem('savedUserConfigsFinax')!))
      : {
          userId: 0,
          theme: 'light',
          addingMaterialGoodsToPatrimony: false,
          language: 'pt-br',
          currency: 'R$',
        };
  }

  filterList(rows: any, atributo: string, keyWord: any) {
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
        const itemDate = moment(item[atributo]).toDate();

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
}
