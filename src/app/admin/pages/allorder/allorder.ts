import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../service/order-service';

@Component({
  selector: 'app-allorder',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './allorder.html',
  styleUrl: './allorder.css',
})
export class Allorder implements OnInit {
  orders: any[] = [];
  filtered: any[] = [];
  loading = true;
  error = '';
  searchQuery = '';
  selectedStatus = '';

  statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  constructor(private orderService: OrderService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.orderService.allorder().subscribe({
      next: (res: any) => {
        console.log('Orders response:', res);
        const data = Array.isArray(res) ? res : (res.data || []);
        this.orders = data;
        this.filtered = [...this.orders];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.error = err?.error?.message || err?.message || 'Failed to load orders';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filter() {
    this.filtered = this.orders.filter(o => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q ||
        o.userId?.username?.toLowerCase().includes(q) ||
        o.userId?.email?.toLowerCase().includes(q) ||
        o._id?.toLowerCase().includes(q);
      const matchStatus = !this.selectedStatus || o.status === this.selectedStatus;
      return matchSearch && matchStatus;
    });
  }

  updateStatus(order: any, status: string) {
    this.orderService.updateStatus(order._id, status).subscribe({
      next: () => { order.status = status; },
      error: (err) => console.error('Status update failed:', err)
    });
  }

  getOrderTotal(order: any): number {
    return order.items?.reduce(
      (s: number, i: any) => s + (i.productId?.price || 0) * (i.quantity || 0), 0
    ) || order.total || 0;
  }

  getAddress(order: any): string {
    if (!order.address) return '—';
    if (typeof order.address === 'string') return order.address.trim() || '—';
    const a = order.address;
    return [a.name, a.address, a.city, a.phone].filter(Boolean).join(', ') || '—';
  }

  getStatusClass(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'delivered':  return 'badge-delivered';
      case 'shipped':    return 'badge-shipped';
      case 'processing': return 'badge-processing';
      case 'cancelled':  return 'badge-cancelled';
      default:           return 'badge-pending';
    }
  }
}
