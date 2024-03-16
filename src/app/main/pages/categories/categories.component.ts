import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { UtilsService } from '../../../utils/utils.service';
import { Category } from '../../../interfaces/category';
import { CategoryService } from '../../../services/category.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { CategoryFormDialogComponent } from './components/category-form-dialog/category-form-dialog.component';
import { lastValueFrom } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CategoriesListComponent } from './components/categories-list/categories-list.component';

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
export class CategorysComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _categoryService = inject(CategoryService);
  private _matDialog = inject(MatDialog);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  categories = signal<Category[]>([]);
  expenseCategories = signal<Category[]>([]);
  revenueCategories = signal<Category[]>([]);

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this._categoryService
      .getByUser()
      .then((response) => {
        this.categories.set(response);
        this.expenseCategories.set(
          this.utilsService.filterList(this.categories(), 'type', 'E')
        );
        this.revenueCategories.set(
          this.utilsService.filterList(this.categories(), 'type', 'R')
        );
      })
      .catch(() => {
        this.utilsService.showMessage('categories.error-getting-categories');
      });
  }

  newCategory(event: 'E' | 'R') {
    lastValueFrom(
      this._matDialog
        .open(CategoryFormDialogComponent, {
          data: {
            category: 'new',
            type: event,
          },
          width: '40%',
          autoFocus: false,
          maxHeight: '95vh',
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;

      this.categories.update((value) => {
        value.push(response);
        return value;
      });
      if (response.type === 'E') {
        this.expenseCategories.set(
          this.utilsService.filterList(this.categories(), 'type', 'E')
        );
      } else {
        this.revenueCategories.set(
          this.utilsService.filterList(this.categories(), 'type', 'R')
        );
      }

      this._changeDetectorRef.detectChanges();
    });
  }

  editCategory(event: any) {
    const clickedOnDeleteBtn = (event[0].target as HTMLElement).closest(
      '.delete-btn'
    );
    if (clickedOnDeleteBtn) return;

    lastValueFrom(
      this._matDialog
        .open(CategoryFormDialogComponent, {
          data: {
            category: event[1],
            type: event[1].type,
          },
          width: '40%',
          autoFocus: false,
          maxHeight: '95vh',
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;

      const value = this.categories();
      const index: number = value.findIndex((item) => item.id === response.id);

      value[index] = response;

      this.categories.set(value);

      if (response.type === 'E') {
        this.expenseCategories.set(
          this.utilsService.filterList(this.categories(), 'type', 'E')
        );
      } else {
        this.revenueCategories.set(
          this.utilsService.filterList(this.categories(), 'type', 'R')
        );
      }

      // this._changeDetectorRef.detectChanges();
    });
  }

  delete(id: number) {
    const deletingCategorie = this.categories().find((item) => item.id === id);

    if (
      deletingCategorie?.name === 'Outras despesas' ||
      deletingCategorie?.name === 'Outras receitas'
    ) {
      this.utilsService.showMessage("categories.can't-delete-category");
      return;
    }

    this.utilsService
      .showConfirmDialog('categories.confirm-delete')
      .then((response) => {
        if (!response) return;

        this._categoryService
          .delete(id)
          .then(() => {
            this.utilsService.showMessage('categories.deleted-successfully');

            this.getCategories();
          })
          .catch(() => {
            this.utilsService.showMessage('categories.error-deleting');
          });
      });
  }
}
