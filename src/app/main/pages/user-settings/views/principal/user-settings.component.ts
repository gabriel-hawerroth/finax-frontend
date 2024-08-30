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

  public readonly languagesList: string[] = [
    'pt-BR',
    'en-US',
    'es-CO',
    'de-DE',
  ];

  public readonly currenciesList: string[] = ['R$', '$', '€', '£', '¥'];

  public configsForm!: FormGroup;
  public userConfigs!: UserConfigs;

  public theme = signal(this._utils.getUserConfigs.theme);

  constructor(
    private readonly _utils: UtilsService,
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
      userId: this._utils.getLoggedUser!.id,
      theme: 'light',
      addingMaterialGoodsToPatrimony: false,
      language: 'pt-BR',
      currency: 'R$',
      releasesViewMode: 'RELEASES',
      emailNotifications: true,
    });
  }

  getConfigs() {
    this._userConfigsService.getLoggedUserConfigs().then((response) => {
      this.configsForm.patchValue(response);
    });
  }

  subscribeValueChanges() {
    this.configsForm.valueChanges
      .pipe(takeUntil(this._unsubscribeAll), debounceTime(200))
      .subscribe((value) => {
        this.theme.set(value.theme);
        this._utils.setUserConfigs(value);
        this.saveConfigs();
      });
  }

  saveConfigs() {
    this._userConfigsService.save(this.configsForm.getRawValue());
  }
}
