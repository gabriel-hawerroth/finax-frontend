import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { BasicAccount } from '../../../../../core/entities/account/account-dto';
import { Category } from '../../../../../core/entities/category/category';
import { BasicCard } from '../../../../../core/entities/credit-card/credit-card-dto';
import { FilterReleasesDialogData } from '../../../../../core/entities/release/release-dto';
import { ButtonType } from '../../../../../core/enums/button-style';
import { ReleaseType } from '../../../../../core/enums/release-enums';
import { Theme } from '../../../../../core/enums/theme';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-filter-releases-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    ButtonsComponent,
    TranslateModule,
    NgOptimizedImage,
  ],
  templateUrl: './filter-releases-dialog.component.html',
  styleUrl: './filter-releases-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterReleasesDialog implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  darkThemeEnabled = signal(this._utils.getUserConfigs.theme === Theme.DARK);

  readonly data: FilterReleasesDialogData = inject(MAT_DIALOG_DATA);

  filterForm!: FormGroup;

  accounts: BasicAccount[] = this.data.accounts;
  creditCards: BasicCard[] = this.data.creditCards;
  categories: Category[] = this.data.categories;

  constructor(
    private readonly _utils: UtilsService,
    private readonly _fb: FormBuilder,
    private readonly _dialogRef: MatDialogRef<FilterReleasesDialog>
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.filterForm = this._fb.group({
      accountIds: [[]],
      creditCardIds: [[]],
      categoryIds: [[]],
      releaseTypes: ['all'],
      description: [''],
      done: ['all'],
    });
  }

  get clearBtnStyle() {
    return ButtonType.BASIC;
  }

  releaseTypeExpense = ReleaseType.EXPENSE;
  releaseTypeRevenue = ReleaseType.REVENUE;
  releaseTypeTransfer = ReleaseType.TRANSFER;

  get selectedCategories() {
    const selectedCategoriesId: number[] =
      this.filterForm.controls['categoryIds'].getRawValue();

    if (!selectedCategoriesId) return [];

    return this.categories.filter(
      (category) =>
        selectedCategoriesId.findIndex(
          (categoryId) => categoryId === category.id
        ) !== -1
    );
  }

  clearFilters() {
    this.filterForm.controls['accountIds'].setValue([]);
    this.filterForm.controls['creditCardIds'].setValue([]);
    this.filterForm.controls['categoryIds'].setValue([]);
    this.filterForm.controls['releaseTypes'].setValue('all');
  }
}
