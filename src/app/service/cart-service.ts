import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  url = "http://localhost:3000/api/cart/";

  constructor(private http: HttpClient) {}

  addToCart(data: any) {
    return this.http.post(this.url + "add", data);
  }

  getcart(userId: string) {
    return this.http.get(this.url + userId);
  }

  increaseQuantity(data: any) {
    return this.http.put(this.url + "increase", data);
  }

  decreaseQuantity(data: any) {
    return this.http.put(this.url + "decrease", data);
  }

  removeFromCart(data: any) {
    return this.http.delete(this.url + "remove", { body: data });
  }

  clearCart(userId: string) {
    return this.http.delete(this.url + "clear", { body: { userId } });
  }
}