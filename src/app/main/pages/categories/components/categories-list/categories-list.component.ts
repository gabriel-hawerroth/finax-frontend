import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Category } from '../../../../../core/entities/category/category';
import { OnCategoryEditDto } from '../../../../../core/entities/category/category-dto';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule, ButtonsComponent],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesListComponent {
  categories = input.required<Category[]>();
  categoryType = input.required<'E' | 'R'>();
  errorFetching = input.required();

  onNew = output<'E' | 'R'>();
  onEdit = output<OnCategoryEditDto>();
  onDelete = output<number>();

  onCategoryEdit(event: MouseEvent, category: Category) {
    this.onEdit.emit({ event, category });
  }
}
