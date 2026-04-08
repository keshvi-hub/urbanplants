import { NgFor, NgIf, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../service/order-service';
import { CartService } from '../../../service/cart-service';
import { ToastService } from '../../../service/toast.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-myorder',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, RouterLink],
  templateUrl: './myorder.html',
  styleUrl: './myorder.css',
})
export class Myorder {
  orders: any[] = [];
  uid: string | null = '';
  showGoTop = false;
  loading = true;

  @HostListener('window:scroll')
  onScroll() { this.showGoTop = window.scrollY > 300; }
  scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  goBack() { window.history.back(); }

  reordering: { [orderId: string]: boolean } = {};

  constructor(
    private orderservice: OrderService,
    private cartService: CartService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.uid = sessionStorage.getItem('id');
    if (!this.uid) {
      Swal.fire({
        icon: 'warning',
        title: 'Login required',
        text: 'Please login to see your orders.',
        confirmButtonColor: '#2e7d32',
      }).then(() => {
        window.location.href = '/login';
      });
    } else {
      this.orderservice.myorder(this.uid).subscribe({
        next: (res: any) => {
          this.orders = res.data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          Swal.fire({ icon: 'error', title: 'Failed to load orders', confirmButtonColor: '#2e7d32' });
        }
      });
    }
  }

  getOrderTotal(order: any): number {
    return order.items?.reduce(
      (sum: number, item: any) => sum + (item.productId?.price || 0) * (item.quantity || 0), 0
    ) || 0;
  }

  getStatusClass(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'shipped': return 'status-shipped';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  }

  getStatusIcon(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'delivered': return 'fa-check-circle';
      case 'shipped': return 'fa-truck';
      case 'cancelled': return 'fa-times-circle';
      default: return 'fa-clock';
    }
  }

  getStepIndex(status: string): number {
    switch ((status || '').toLowerCase()) {
      case 'pending':    return 0;
      case 'processing': return 1;
      case 'shipped':    return 2;
      case 'delivered':  return 3;
      default:           return 0;
    }
  }

  reorder(order: any) {
    const userId = sessionStorage.getItem('id');
    if (!userId) return;

    const items = order.items?.filter((i: any) => i.productId?._id) || [];
    if (!items.length) {
      this.toast.warning('No valid items to reorder.');
      return;
    }

    this.reordering[order._id] = true;
    let completed = 0;

    items.forEach((item: any) => {
      this.cartService.addToCart({ userId, productId: item.productId._id, quantity: item.quantity || 1 })
        .subscribe({
          next: () => {
            completed++;
            if (completed === items.length) {
              this.reordering[order._id] = false;
              this.toast.success(`${items.length} item${items.length > 1 ? 's' : ''} added to cart!`);
              this.cdr.detectChanges();
            }
          },
          error: () => {
            completed++;
            if (completed === items.length) {
              this.reordering[order._id] = false;
              this.toast.warning('Some items could not be added to cart.');
              this.cdr.detectChanges();
            }
          }
        });
    });
  }
}