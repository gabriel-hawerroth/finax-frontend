import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { Category } from '../../../../../interfaces/category';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonsComponent } from '../../../../../utils/buttons/buttons.component';

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

  @Output() onNew = new EventEmitter<'E' | 'R'>();
  @Output() onEdit = new EventEmitter<any[]>();
  @Output() onDelete = new EventEmitter<number>();
}
