import { Category } from './category';

export interface CategoryFormDialogData {
  category: Category | 'new';
  type: 'E' | 'R';
}

export interface OnCategoryEditDto {
  event: MouseEvent;
  category: Category;
}

export interface SaveCategoryDTO {
  name: string;
  color: string;
  icon: string;
  type: string;
  essential: boolean;
}
