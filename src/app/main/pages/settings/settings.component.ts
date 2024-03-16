import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { UserConfigs } from '../../../interfaces/user-configs';
import { UserConfigsService } from '../../../services/user-configs.service';
import { UtilsService } from '../../../utils/utils.service';
import { TranslateModule } from '@ngx-translate/core';
import { GenericIdDs } from '../../../interfaces/generic';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSelectModule,
    MatButtonToggleModule,
    TranslateModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  private _fb = inject(FormBuilder);
  private _userConfigsService = inject(UserConfigsService);

  private _unsubscribeAll: Subject<any> = new Subject();

  configsForm!: FormGroup;
  userConfigs!: UserConfigs;

  theme: WritableSignal<string> = signal(
    this.utilsService.getUserConfigs.theme
  );

  initError: boolean = false;

  ngOnInit(): void {
    this.buidForm();

    this.getConfigs();
  }

  ngOnDestroy(): void {
    this.saveConfigs();
    this._unsubscribeAll.unsubscribe();
  }

  buidForm() {
    this.configsForm = this._fb.group({
      id: null,
      userId: this.utilsService.getLoggedUser!.id,
      theme: 'light',
      addingMaterialGoodsToPatrimony: false,
      language: 'pt-br',
      currency: 'R$',
      releasesViewMode: '',
    });

    this.configsForm.valueChanges
      .pipe(takeUntil(this._unsubscribeAll), debounceTime(200))
      .subscribe((value) => {
        this.theme.set(value.theme);
        this.utilsService.setUserConfigs(value);
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
        this.utilsService.showMessage('settings.error-saving-settings');
      });
  }

  get languagesList(): GenericIdDs[] {
    return [
      { id: 'pt-br', ds: 'portuguese' },
      { id: 'en-us', ds: 'english' },
      { id: 'es-es', ds: 'spanish-spain' },
      { id: 'de', ds: 'german' },
    ];
  }

  get currenciesList(): string[] {
    return ['R$', '$', '€', '£', '¥'];
  }
}
