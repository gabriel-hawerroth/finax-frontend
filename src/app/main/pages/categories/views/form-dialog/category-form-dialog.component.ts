import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Category } from '../../../../../core/entities/category/category';
import { CategoryFormDialogData } from '../../../../../core/entities/category/category-dto';
import { CategoryService } from '../../../../../core/entities/category/category.service';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-category-form-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    ButtonsComponent,
    MatCheckboxModule,
    TranslateModule,
  ],
  templateUrl: './category-form-dialog.component.html',
  styleUrl: './category-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormDialog implements OnInit {
  data: CategoryFormDialogData = inject(MAT_DIALOG_DATA);

  readonly darkThemeEnabled = this._utils.darkThemeEnable;

  categoryForm!: FormGroup;

  disabled: boolean = false;

  saving = signal(false);

  constructor(
    private readonly _utils: UtilsService,
    private readonly _dialogRef: MatDialogRef<CategoryFormDialog>,
    private readonly _fb: FormBuilder,
    private readonly _categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.buildForm();

    if (this.data.category !== 'new')
      this.categoryForm.patchValue(this.data.category);

    if (
      this.categoryForm.value.name === 'Outras despesas' ||
      this.categoryForm.value.name === 'Outras receitas'
    ) {
      this.disabled = true;
      this.categoryForm.disable();
    }
  }

  private buildForm() {
    this.categoryForm = this._fb.group({
      id: null,
      name: ['', Validators.required],
      color: ['', Validators.required],
      icon: ['', Validators.required],
      type: [this.data.type, Validators.required],
      userId: this._utils.getLoggedUser!.id,
      active: true,
      essential: false,
    });
  }

  public pickColor(color: string) {
    this.categoryForm.get('color')!.setValue(color);
    this.categoryForm.markAsDirty();
  }

  public pickIcon(icon: string) {
    this.categoryForm.get('icon')!.setValue(icon);
    this.categoryForm.markAsDirty();
  }

  public save() {
    this.saving.set(true);
    this.categoryForm.markAllAsTouched();

    this.getSaveRequest(this.categoryForm.getRawValue())
      .then((response) => {
        this._dialogRef.close(response);
        this._utils.showMessage('categories.saved-successfully');
      })
      .catch(() => this._utils.showMessage('categories.error-saving'))
      .finally(() => this.saving.set(false));
  }

  private getSaveRequest(data: Category): Promise<Category> {
    if (data.id) return this._categoryService.edit(data);
    else return this._categoryService.createNew(data);
  }

  readonly colors: string[] = [
    '#AFAFAF',
    '#787878',
    '#FCA52D',
    '#FFA490',
    '#F98159',
    '#FB6467',
    '#FF494D',
    '#94CD7A',
    '#86BB5D',
    '#EC61A1',
    '#E454ED',
    '#82C8F1',
    '#5096DE',
    '#5161B9',
    '#8976BF',
    '#7253C8',
    '#D9AA6A',
  ];

  readonly icons: string[] = [
    'person',
    'local_bar',
    'apparel',
    'receipt_long',
    'fitness_center',
    'beach_access',
    'menu_book',
    'lunch_dining',
    'shopping_cart',
    'map',
    'flightsmode',
    'payments',
    'two_wheeler',
    'directions_car',
    'credit_card',
    'directions_bus',
    'restaurant',
    'school',
    'request_quote',
    'heart_check',
    'workspace_premium',
    'pets',
    'local_mall',
    'savings',
    'monitor_heart',
    'forest',
    'local_cafe',
    'family_restroom',
    'medication',
    'store',
    'sports_soccer',
    'sports_esports',
    'cookie',
    'spa',
    'hiking',
    'wifi_proxy',
    'currency_bitcoin',
    'attach_money',
    'finance_mode',
    'trending_down',
    'order_approve',
    'trolley',
    'local_gas_station',
    'theater_comedy',
    'local_pizza',
    'pet_supplies',
    'list',
    'cloud_upload',
    'newspaper',
    'format_quote',
    'imagesearch_roller',
    'podcasts',
    'subscriptions',
    'construction',
    'video_camera_back',
    'subway',
    'auto_towing',
    'architecture',
    'sports_martial_arts',
    'camping',
    'phishing',
    'redeem',
    'devices',
    'security_key',
    'storage',
    'charger',
    'brightness_alert',
    'wifi_home',
    'security',
    'smoking_rooms',
    'car_rental',
    'trip',
    'mop',
    'checkroom',
    'sensors',
    'chair',
    'dining',
    'deck',
    'stadia_controller',
  ];
}
