import { Category } from './category';

export interface CategoryFormDialogData {
  category: Category | 'new';
  type: 'E' | 'R';
}

export interface OnCategoryEditDto {
  event: MouseEvent;
  category: Category;
}
