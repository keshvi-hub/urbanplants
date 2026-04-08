import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private api = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(this.api + '/all');
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.api}/get/${id}`);
  }

  add(data: FormData): Observable<any> {
    return this.http.post<any>(this.api + '/add', data);
  }

  update(id: string, data: FormData): Observable<any> {
    return this.http.put<any>(`${this.api}/update/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.api}/delete/${id}`);
  }
}

