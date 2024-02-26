import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { UtilsService } from '../../../utils/utils.service';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../../interfaces/Category';
import { CategoryService } from '../../../services/category.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryFormDialogComponent } from './components/category-form-dialog/category-form-dialog.component';
import { lastValueFrom } from 'rxjs';
import { ButtonsComponent } from '../../../utils/buttons/buttons.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    ButtonsComponent,
    TranslateModule,
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

  categories: Category[] = [];

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this._categoryService
      .getByUser()
      .then((response) => {
        this.categories = response;
        this._changeDetectorRef.detectChanges();
      })
      .catch(() => {
        this.utilsService.showMessage('categories.error-getting-categories');
      });
  }

  get getExpenseCategories(): Category[] {
    return this.utilsService.filterList(this.categories, 'type', 'E');
  }

  get getRevenueCategories(): Category[] {
    return this.utilsService.filterList(this.categories, 'type', 'R');
  }

  editCategory(event: Event, category: Category) {
    const isDeleteButtonClick = (event.target as HTMLElement).closest(
      '.delete-btn'
    );

    if (isDeleteButtonClick) return;

    lastValueFrom(
      this._matDialog
        .open(CategoryFormDialogComponent, {
          data: {
            category: category,
            type: category.type,
          },
          width: '40%',
          autoFocus: false,
          maxHeight: '95vh',
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;

      const index: number = this.categories.findIndex(
        (item) => item.id === response.id
      );

      this.categories[index] = response;

      this._changeDetectorRef.detectChanges();
    });
  }

  newCategory(type: 'E' | 'R') {
    lastValueFrom(
      this._matDialog
        .open(CategoryFormDialogComponent, {
          data: {
            category: 'new',
            type: type,
          },
          width: '40%',
          autoFocus: false,
          maxHeight: '95vh',
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;

      this.categories.push(response);

      this._changeDetectorRef.detectChanges();
    });
  }

  delete(id: number) {
    const deletingCategorie = this.categories.find((item) => item.id === id);

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
