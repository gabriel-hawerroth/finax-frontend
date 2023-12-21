import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { UtilsService } from '../../../utils/utils.service';
import { MatButtonModule } from '@angular/material/button';
import { SplitterModule } from 'primeng/splitter';
import { Category } from '../../../interfaces/Category';
import { CategoryService } from '../../../services/category.service';
import { LoginService } from '../../../services/login.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryFormDialogComponent } from './components/category-form-dialog/category-form-dialog.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    SplitterModule,
    MatCardModule,
    MatDialogModule,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategorysComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _categoryService = inject(CategoryService);
  private _loginService = inject(LoginService);
  private _matDialog = inject(MatDialog);

  language = this.utilsService.getUserConfigs.language;

  categories: Category[] = [];

  ngOnInit(): void {
    this._categoryService
      .getByUser(this._loginService.getLoggedUserId)
      .then((response) => {
        this.categories = response;
      })
      .catch(() => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao obter as categorias'
            : 'Error getting the categories'
        );
      });
  }

  get getExpenseCategories(): Category[] {
    return this.utilsService.filterList(this.categories, 'type', 'E');
  }

  get getRevenueCategories(): Category[] {
    return this.utilsService.filterList(this.categories, 'type', 'R');
  }

  editCategory(category: Category) {
    lastValueFrom(
      this._matDialog
        .open(CategoryFormDialogComponent, {
          data: {
            category: category,
            type: category.type,
          },
          width: '40%',
          autoFocus: false,
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;

      const index: number = this.categories.findIndex(
        (item) => item.id === response.id
      );

      if (index !== -1) this.categories[index] = response;
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
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;

      this.categories.push(response);
    });
  }
}
