import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../service/cart-service';
import { CartCountService } from '../../../service/cart-count.service';
import { ToastService } from '../../../service/toast.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class Wishlist implements OnInit {
  items: any[] = [];
  showGoTop = false;
  imageUrl = 'http://localhost:3000/uploads/';

  constructor(private cartService: CartService, private router: Router, private toast: ToastService, private cartCountService: CartCountService) {}

  @HostListener('window:scroll')
  onScroll() { this.showGoTop = window.scrollY > 300; }
  scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  goBack() { window.history.back(); }

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    const data = localStorage.getItem('wishlist');
    this.items = data ? JSON.parse(data) : [];
  }

  removeFromWishlist(productId: string) {
    this.items = this.items.filter(p => p._id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(this.items));
  }

  addToCart(product: any) {
    const userId = sessionStorage.getItem('id');
    if (!userId) {
      Swal.fire({ icon: 'warning', title: 'Login required', text: 'Please login first.', confirmButtonColor: '#2e7d32' })
        .then(() => this.router.navigate(['/login']));
      return;
    }
    this.cartService.addToCart({ userId, productId: product._id, quantity: 1 }).subscribe({
      next: () => {
        this.cartCountService.increment();
        this.toast.success('Added to cart!');
      },
      error: () => this.toast.error('Failed to add to cart')
    });
  }

  clearWishlist() {
    Swal.fire({
      icon: 'warning', title: 'Clear wishlist?',
      text: 'Remove all items from your wishlist?',
      showCancelButton: true, confirmButtonColor: '#e53935', confirmButtonText: 'Yes, clear'
    }).then(r => {
      if (r.isConfirmed) {
        this.items = [];
        localStorage.removeItem('wishlist');
      }
    });
  }
}
