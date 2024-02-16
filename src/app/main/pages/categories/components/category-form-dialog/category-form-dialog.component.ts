import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UtilsService } from '../../../../../utils/utils.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CategoryService } from '../../../../../services/category.service';
import { LoginService } from '../../../../../services/login.service';
import { ButtonsComponent } from '../../../../../utils/buttons/buttons.component';

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    ButtonsComponent,
  ],
  templateUrl: './category-form-dialog.component.html',
  styleUrl: './category-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormDialogComponent implements OnInit {
  public data = inject(MAT_DIALOG_DATA);
  public utilsService = inject(UtilsService);
  private _fb = inject(FormBuilder);
  private _categoryService = inject(CategoryService);
  private _dialogRef = inject(MatDialogRef);
  private _loginService = inject(LoginService);

  language = this.utilsService.getUserConfigs.language;

  categoryForm!: FormGroup;

  disabled: boolean = false;

  saving: boolean = false;

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

  buildForm() {
    this.categoryForm = this._fb.group({
      id: null,
      name: ['', Validators.required],
      color: ['', Validators.required],
      icon: ['', Validators.required],
      type: [this.data.type, Validators.required],
      userId: this._loginService.getLoggedUser!.id,
      active: true,
    });

    this.categoryForm.markAllAsTouched();
  }

  pickColor(color: string) {
    this.categoryForm.get('color')!.setValue(color);
    this.categoryForm.markAsDirty();
  }

  pickIcon(icon: string) {
    this.categoryForm.get('icon')!.setValue(icon);
    this.categoryForm.markAsDirty();
  }

  save() {
    this.saving = true;

    this._categoryService
      .save(this.categoryForm.value)
      .then((response) => {
        this._dialogRef.close(response);

        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Categoria salva com sucesso'
            : 'Category saved successfully'
        );
      })
      .catch(() => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao salvar a categoria'
            : 'Error saving category'
        );
      })
      .finally(() => {
        this.saving = false;
      });
  }

  colors: string[] = [
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

  icons: string[] = [
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
