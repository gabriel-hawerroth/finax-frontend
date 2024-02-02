import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
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
    { icon: 'light_mode', value: 'light' },
    { icon: 'dark_mode', value: 'dark' },
  ];

  initError: boolean = false;

  ngOnInit(): void {
    this.buidForm();

    this.getConfigs();
  }

  ngOnDestroy(): void {
    this.saveConfigs();
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }

  buidForm() {
    this.configsForm = this._fb.group({
      id: null,
      userId: this._loginService.getLoggedUser!.id,
      theme: 'light',
      addingMaterialGoodsToPatrimony: false,
      language: 'pt-br',
      currency: 'R$',
    });

    this.configsForm.valueChanges
      .pipe(takeUntil(this._unsubscribeAll), debounceTime(200))
      .subscribe((value) => {
        this.language = value.language;
        this.utilsService.userConfigs.next(value);
      });
  }

  getConfigs() {
    this._userConfigsService
      .getLoggedUserConfigs()
      .then((response) => {
        this.configsForm.patchValue(response);
      })
      .catch(() => {
        this.saveConfigs();
        this.initError = true;
      });
  }

  saveConfigs() {
    this._userConfigsService
      .save(this.configsForm.value)
      .then((response) => {
        if (this.initError) {
          this.configsForm.patchValue(response);
          this.getConfigs();
        }
      })
      .catch(() => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao salvar as configuraçãoes'
            : 'Error saving settings'
        );
      });
  }
}
