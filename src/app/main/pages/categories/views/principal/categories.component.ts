
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Category } from '../../../../../core/entities/category/category';
import {
  CategoryFormDialogData,
  OnCategoryEditDto,
} from '../../../../../core/entities/category/category-dto';
import { CategoryService } from '../../../../../core/entities/category/category.service';
import {
  getResponsiveDialogWidth,
  ResponsiveService,
} from '../../../../../shared/services/responsive.service';
import { SpeedDialService } from '../../../../../shared/services/speed-dial.service';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { CategoriesListComponent } from '../../components/categories-list/categories-list.component';
import { CategoryFormDialog } from '../form-dialog/category-form-dialog.component';

@Component({
  selector: 'app-categories',
  imports: [
    MatCardModule,
    TranslateModule,
    CategoriesListComponent
],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage implements OnInit {
  categories = signal<Category[]>([]);
  expenseCategories = signal<Category[]>([]);
  revenueCategories = signal<Category[]>([]);

  finishedFetchingCategories = signal(false);
  errorFetchingCategories = signal(false);

  constructor(
    private readonly _utils: UtilsService,
    private readonly _matDialog: MatDialog,
    private readonly _bottomSheet: MatBottomSheet,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _categoryService: CategoryService,
    private readonly _responsiveService: ResponsiveService,
    private readonly _speedDialService: SpeedDialService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this._categoryService
      .getByUser()
      .then((response) => {
        this.categories.set(response);
        this.expenseCategories.set(
          this._utils.filterList(this.categories(), 'type', 'E')
        );
        this.revenueCategories.set(
          this._utils.filterList(this.categories(), 'type', 'R')
        );
        this._speedDialService.loadCategories(this.categories());
      })
      .catch(() => this.errorFetchingCategories.set(true))
      .finally(() => this.finishedFetchingCategories.set(true));
  }

  newCategory(event: 'E' | 'R') {
    this.openCategoryFormDialog(<CategoryFormDialogData>{
      category: 'new',
      type: event,
    }).then((response) => {
      if (!response) return;

      this.categories.update((value) => {
        value.push(response);
        return value;
      });
      if (response.type === 'E') {
        this.expenseCategories.set(
          this._utils.filterList(this.categories(), 'type', 'E')
        );
      } else {
        this.revenueCategories.set(
          this._utils.filterList(this.categories(), 'type', 'R')
        );
      }

      this._changeDetectorRef.detectChanges();
    });
  }

  editCategory(event: OnCategoryEditDto) {
    const clickedOnDeleteBtn = (event.event.target as HTMLElement).closest(
      '.delete-btn'
    );
    if (clickedOnDeleteBtn) return;

    this.openCategoryFormDialog(<CategoryFormDialogData>{
      category: event.category,
      type: event.category.type,
    }).then((response) => {
      if (!response) return;

      const value = this.categories();
      const index: number = value.findIndex((item) => item.id === response.id);

      value[index] = response;

      this.categories.set(value);

      if (response.type === 'E') {
        this.expenseCategories.set(
          this._utils.filterList(this.categories(), 'type', 'E')
        );
      } else {
        this.revenueCategories.set(
          this._utils.filterList(this.categories(), 'type', 'R')
        );
      }
    });
  }

  deleteCategory(id: number) {
    const deletingCategorie = this.categories().find((item) => item.id === id);

    if (
      deletingCategorie?.name === 'Outras despesas' ||
      deletingCategorie?.name === 'Outras receitas'
    ) {
      this._utils.showMessage("categories.can't-delete-category");
      return;
    }

    this._utils
      .showConfirmDialog('categories.confirm-delete')
      .then((response) => {
        if (!response) return;

        this._categoryService
          .delete(id)
          .then(() => {
            this._utils.showMessage('categories.deleted-successfully');

            this.getCategories();
          })
          .catch(() => {
            this._utils.showMessage('categories.error-deleting');
          });
      });
  }

  openCategoryFormDialog(data: CategoryFormDialogData): Promise<any> {
    const width = getResponsiveDialogWidth('40vw')(this._responsiveService);

    const config = {
      data,
      panelClass: 'category-form-dialog',
      minWidth: width,
      width: width,
      maxHeight: '95vh',
      autoFocus: false,
    };

    if (this._responsiveService.smallWidth()) {
      return lastValueFrom(
        this._bottomSheet.open(CategoryFormDialog, config).afterDismissed()
      );
    }

    return lastValueFrom(
      this._matDialog.open(CategoryFormDialog, config).afterClosed()
    );
  }
}
