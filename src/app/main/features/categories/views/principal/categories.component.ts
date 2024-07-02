import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
} from '@angular/core';
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
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { CategoriesListComponent } from '../../components/categories-list/categories-list.component';
import { CategoryFormDialog } from '../form-dialog/category-form-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    CategoriesListComponent,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage implements OnInit {
  categories = signal<Category[]>([]);
  expenseCategories = signal<Category[]>([]);
  revenueCategories = signal<Category[]>([]);

  constructor(
    public readonly utils: UtilsService,
    private readonly _matDialog: MatDialog,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _categoryService: CategoryService
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
          this.utils.filterList(this.categories(), 'type', 'E')
        );
        this.revenueCategories.set(
          this.utils.filterList(this.categories(), 'type', 'R')
        );
      })
      .catch(() => {
        this.utils.showMessage('categories.error-getting-categories');
      });
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
          this.utils.filterList(this.categories(), 'type', 'E')
        );
      } else {
        this.revenueCategories.set(
          this.utils.filterList(this.categories(), 'type', 'R')
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
          this.utils.filterList(this.categories(), 'type', 'E')
        );
      } else {
        this.revenueCategories.set(
          this.utils.filterList(this.categories(), 'type', 'R')
        );
      }
    });
  }

  delete(id: number) {
    const deletingCategorie = this.categories().find((item) => item.id === id);

    if (
      deletingCategorie?.name === 'Outras despesas' ||
      deletingCategorie?.name === 'Outras receitas'
    ) {
      this.utils.showMessage("categories.can't-delete-category");
      return;
    }

    this.utils
      .showConfirmDialog('categories.confirm-delete')
      .then((response) => {
        if (!response) return;

        this._categoryService
          .delete(id)
          .then(() => {
            this.utils.showMessage('categories.deleted-successfully');

            this.getCategories();
          })
          .catch(() => {
            this.utils.showMessage('categories.error-deleting');
          });
      });
  }

  openCategoryFormDialog(data: CategoryFormDialogData): Promise<any> {
    return lastValueFrom(
      this._matDialog
        .open(CategoryFormDialog, {
          data,
          panelClass: 'category-form-dialog',
          minWidth: '40vw',
          width: '40vw',
          maxHeight: '95vh',
          autoFocus: false,
        })
        .afterClosed()
    );
  }
}
