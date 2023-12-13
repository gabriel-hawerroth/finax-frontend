import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Category } from '../interfaces/Category';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _http = inject(HttpClient);

  private apiUrl = `${environment.baseApiUrl}category`;

  getById(id: number): Promise<Category> {
    return lastValueFrom(this._http.get<Category>(`${this.apiUrl}/${id}`));
  }

  getByUser(userId: number): Promise<Category[]> {
    return lastValueFrom(
      this._http.get<Category[]>(`${this.apiUrl}/get-by-user/${userId}`)
    );
  }

  save(category: Category): Promise<Category> {
    return lastValueFrom(this._http.post<Category>(`${this.apiUrl}`, category));
  }

  delete(id: number): Promise<void> {
    return lastValueFrom(this._http.delete<void>(`${this.apiUrl}`));
  }
}
