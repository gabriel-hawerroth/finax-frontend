import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { BasicAccount } from '../../../../../core/entities/account/account-dto';
import { Category } from '../../../../../core/entities/category/category';
import { BasicCard } from '../../../../../core/entities/credit-card/credit-card-dto';
import {
  FilterReleasesDialogData,
  ReleaseFilters,
} from '../../../../../core/entities/release/release-dto';
import { ButtonType } from '../../../../../core/enums/button-style';
import { ReleaseType } from '../../../../../core/enums/release-enums';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import {
  cloudFireCdnImgsLink,
  getDefaultAccountImage,
} from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-filter-releases-dialog',
  imports: [
    CommonModule,
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
  readonly getDefaultAccountImage = getDefaultAccountImage;

  private readonly injector = inject(Injector);

  readonly data: FilterReleasesDialogData =
    this.injector.get(MAT_DIALOG_DATA, null) ||
    this.injector.get(MAT_BOTTOM_SHEET_DATA, null);

  private readonly dialogRef =
    this.injector.get<MatDialogRef<FilterReleasesDialog> | null>(
      MatDialogRef,
      null
    );

  private readonly bottomSheetRef =
    this.injector.get<MatBottomSheetRef<FilterReleasesDialog> | null>(
      MatBottomSheetRef,
      null
    );

  readonly control: FilterReleasesControl = {
    close: (result?: ReleaseFilters) => {
      if (this.dialogRef) {
        this.dialogRef.close(result);
      } else if (this.bottomSheetRef) {
        this.bottomSheetRef.dismiss(result);
      }
    },
  };

  filterForm!: FormGroup;

  accounts: BasicAccount[] = this.data.accounts;
  creditCards: BasicCard[] = this.data.creditCards;
  categories: Category[] = this.data.categories;

  clearBtnStyle = ButtonType.BASIC;

  releaseTypeExpense = ReleaseType.EXPENSE;
  releaseTypeRevenue = ReleaseType.REVENUE;
  releaseTypeTransfer = ReleaseType.TRANSFER;

  constructor(private readonly _fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.filterForm.patchValue(this.data.filters);
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

  clearFilters() {
    this.filterForm.controls['accountIds'].setValue([]);
    this.filterForm.controls['creditCardIds'].setValue([]);
    this.filterForm.controls['categoryIds'].setValue([]);
    this.filterForm.controls['releaseTypes'].setValue('all');
    this.filterForm.controls['description'].setValue('');
    this.filterForm.controls['done'].setValue('all');
  }

  filter() {
    if (this.filterForm.invalid) return;

    const filters: ReleaseFilters = this.filterForm.getRawValue();

    this.control.close(filters);
  }

  get expenseCategories(): Category[] {
    return this.categories.filter(
      (category) => category.type === ReleaseType.EXPENSE
    );
  }

  get revenueCategories(): Category[] {
    return this.categories.filter(
      (category) => category.type === ReleaseType.REVENUE
    );
  }

  selectedItemsTemplate(type: 'account' | 'creditCard' | 'category') {
    const selectedIds: number[] =
      this.filterForm.controls[`${type}Ids`].getRawValue();

    if (!selectedIds) return [];

    let items;
    switch (type) {
      case 'account':
        items = this.accounts;
        break;
      case 'creditCard':
        items = this.creditCards;
        break;
      case 'category':
        items = this.categories;
    }

    const selectedValues = items.filter((item) =>
      selectedIds.includes(item.id!)
    );

    return selectedValues.map((category) => category.name).join(', ');
  }
}

interface FilterReleasesControl {
  close(result?: ReleaseFilters): void;
}
