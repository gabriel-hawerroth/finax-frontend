import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import { UserConfigs } from 'src/app/interfaces/UserConfigs';
import { LoginService } from 'src/app/services/login.service';
import { UserConfigsService } from 'src/app/services/userConfigs.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  configsForm!: FormGroup;
  userConfigs!: UserConfigs;

  language: string = '';
  isDarkTheme: boolean = false;

  private _unsubscribeAll: Subject<any>;

  themeOptions = [
    { icon: 'pi pi-sun', value: 'light' },
    { icon: 'pi pi-moon', value: 'dark' },
  ];

  constructor(
    public utilsService: UtilsService,
    private _fb: FormBuilder,
    private _userConfigsService: UserConfigsService,
    private _loginService: LoginService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.buidForm();
    this.getConfigs();

    this.utilsService.userConfigs
      .asObservable()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.language = value!.language;
      });

    this.configsForm.valueChanges
      .pipe(takeUntil(this._unsubscribeAll), debounceTime(200))
      .subscribe((value) => {
        this.utilsService.userConfigs.next(value);
      });
  }

  ngOnDestroy(): void {
    this.saveConfigs();
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }

  buidForm() {
    this.configsForm = this._fb.group({
      id: null,
      userId: this._loginService.getLoggedUserId,
      theme: 'light',
      addingMaterialGoodsToPatrimony: false,
      language: 'pt-br',
      currency: 'R$',
    });
  }

  getConfigs() {
    this.userConfigs = this.utilsService.getSavedUserConfigs!;
    this.configsForm.patchValue(this.userConfigs);
  }

  saveConfigs() {
    this.utilsService.userConfigs.next(this.configsForm.value);
    this._userConfigsService.save(this.configsForm.value).catch(() => {
      this.utilsService.showSimpleMessage(
        this.language === 'pt-br'
          ? 'Erro ao salvar as configuraçãoes'
          : 'Error saving settings'
      );
    });
  }
}
