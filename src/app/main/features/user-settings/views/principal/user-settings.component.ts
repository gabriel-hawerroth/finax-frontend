import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { UserConfigs } from '../../../../../core/entities/user-configs/user-configs';
import { UserConfigsService } from '../../../../../core/entities/user-configs/user-configs.service';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSelectModule,
    MatButtonToggleModule,
    TranslateModule,
    MatSlideToggleModule,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsPage implements OnInit, OnDestroy {
  private readonly _unsubscribeAll = new Subject<void>();

  configsForm!: FormGroup;
  userConfigs!: UserConfigs;

  theme = signal<string>(this.utils.getUserConfigs.theme);

  initError: boolean = false;

  constructor(
    public readonly utils: UtilsService,
    private readonly _fb: FormBuilder,
    private readonly _userConfigsService: UserConfigsService
  ) {}

  ngOnInit(): void {
    this.buidForm();
    this.getConfigs();
    this.subscribeValueChanges();
  }

  ngOnDestroy(): void {
    this.saveConfigs();

    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();
  }

  buidForm() {
    this.configsForm = this._fb.group({
      id: null,
      userId: this.utils.getLoggedUser!.id,
      theme: 'light',
      addingMaterialGoodsToPatrimony: false,
      language: 'pt-BR',
      currency: 'R$',
      releasesViewMode: 'releases',
      emailNotifications: true,
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

  subscribeValueChanges() {
    this.configsForm.valueChanges
      .pipe(takeUntil(this._unsubscribeAll), debounceTime(200))
      .subscribe((value) => {
        this.theme.set(value.theme);
        this.utils.setUserConfigs(value);
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
        this.utils.showMessage('settings.error-saving');
      });
  }

  languagesList: string[] = ['pt-BR', 'en-US', 'es-CO', 'de-DE'];

  currenciesList: string[] = ['R$', '$', '€', '£', '¥'];
}
