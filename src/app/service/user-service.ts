import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  url = "http://localhost:3000/api"

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(this.url + '/register', data)
  }

  login(data: any) {
    return this.http.post(this.url + '/login', data)
  }

  get() {
    return this.http.get(this.url + '/alluser')
  }
}
