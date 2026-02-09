import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category } from './category';
import { SaveCategoryDTO } from './category-dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = `${environment.baseApiUrl}category`;

  constructor(private readonly _http: HttpClient) {}

  getById(id: number): Promise<Category> {
    return lastValueFrom(this._http.get<Category>(`${this.apiUrl}/${id}`));
  }

  getByUser(): Promise<Category[]> {
    return lastValueFrom(
      this._http.get<Category[]>(`${this.apiUrl}/get-by-user`),
    );
  }

  createNew(category: SaveCategoryDTO): Promise<Category> {
    return lastValueFrom(this._http.post<Category>(this.apiUrl, category));
  }

  edit(categoryId: number, category: SaveCategoryDTO): Promise<Category> {
    return lastValueFrom(
      this._http.put<Category>(`${this.apiUrl}/${categoryId}`, category),
    );
  }

  delete(id: number): Promise<void> {
    return lastValueFrom(this._http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
