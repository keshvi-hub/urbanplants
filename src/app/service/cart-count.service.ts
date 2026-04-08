import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartService } from './cart-service';

@Injectable({ providedIn: 'root' })
export class CartCountService {
  private count$ = new BehaviorSubject<number>(0);
  cartCount = this.count$.asObservable();

  constructor(private cartService: CartService) {}

  refresh() {
    const userId = sessionStorage.getItem('id');
    // Skip if not logged in or if it's the admin string id (not a valid ObjectId)
    if (!userId || userId === 'admin' || !/^[a-f\d]{24}$/i.test(userId)) {
      this.count$.next(0);
      return;
    }
    this.cartService.getcart(userId).subscribe({
      next: (res: any) => {
        const items = res.data?.items || res.items || [];
        this.count$.next(items.reduce((s: number, i: any) => s + (i.quantity || 1), 0));
      },
      error: () => this.count$.next(0)
    });
  }

  set(n: number) { this.count$.next(n); }
  increment() { this.count$.next(this.count$.value + 1); }
  reset() { this.count$.next(0); }
}
