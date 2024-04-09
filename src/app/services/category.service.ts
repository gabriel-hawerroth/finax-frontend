import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly _http = inject(HttpClient);

  private readonly apiUrl = `${environment.baseApiUrl}category`;

  getById(id: number): Promise<Category> {
    return lastValueFrom(this._http.get<Category>(`${this.apiUrl}/${id}`));
  }

  getByUser(): Promise<Category[]> {
    return lastValueFrom(
      this._http.get<Category[]>(`${this.apiUrl}/get-by-user`)
    );
  }

  save(category: Category): Promise<Category> {
    return lastValueFrom(this._http.post<Category>(`${this.apiUrl}`, category));
  }

  delete(id: number): Promise<void> {
    return lastValueFrom(this._http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
