import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import { SelectButtonModule } from 'primeng/selectbutton';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { UserConfigs } from '../../../interfaces/UserConfigs';
import { LoginService } from '../../../services/login.service';
import { UserConfigsService } from '../../../services/user-configs.service';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    SelectButtonModule,
    MatDividerModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonToggleModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  private _fb = inject(FormBuilder);
  private _userConfigsService = inject(UserConfigsService);
  private _loginService = inject(LoginService);

  private _unsubscribeAll: Subject<any> = new Subject();

  configsForm!: FormGroup;
  userConfigs!: UserConfigs;

  language: string = this.utilsService.getUserConfigs.language;

  themeOptions = [
    { icon: 'pi pi-sun', value: 'light' },
    { icon: 'pi pi-moon', value: 'dark' },
  ];

  ngOnInit(): void {
    this.buidForm();
    this.getConfigs();

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
    this.userConfigs = this.utilsService.getUserConfigs!;
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
