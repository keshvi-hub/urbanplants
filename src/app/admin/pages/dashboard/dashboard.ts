import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { OrderService } from '../../../service/order-service';
import { ProductService } from '../../../service/product-service';
import { UserService } from '../../../service/user-service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit {
  stats = { totalProducts: 0, totalOrders: 0, totalUsers: 0, revenue: 0 };
  recentOrders: any[] = [];
  topProducts: any[] = [];

  private allOrders: any[] = [];
  private chartsReady = false;
  private dataReady = false;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadData(); }
  ngAfterViewInit() {
    this.chartsReady = true;
    if (this.dataReady) this.buildCharts();
  }

  loadData() {
    this.orderService.allorder().subscribe({
      next: (res: any) => {
        this.allOrders = Array.isArray(res) ? res : (res.data || []);
        this.recentOrders = this.allOrders.slice(0, 6);
        this.stats.totalOrders = this.allOrders.length;
        this.stats.revenue = this.allOrders.reduce((s: number, o: any) => s + (parseFloat(o.total) || 0), 0);
        this.computeTopProducts();
        this.dataReady = true;
        this.cdr.detectChanges();
        if (this.chartsReady) this.buildCharts();
      },
      error: (err) => console.error(err)
    });

    this.productService.getAll().subscribe({
      next: (res: any) => {
        this.stats.totalProducts = (Array.isArray(res) ? res : (res.data || [])).length;
        this.cdr.detectChanges();
      }
    });

    this.userService.get().subscribe({
      next: (res: any) => {
        this.stats.totalUsers = (Array.isArray(res) ? res : (res.data || [])).length;
        this.cdr.detectChanges();
      }
    });
  }

  computeTopProducts() {
    const map = new Map<string, { name: string; pic: string; qty: number; revenue: number }>();
    for (const order of this.allOrders) {
      for (const item of order.items || []) {
        const p = item.productId;
        if (!p) continue;
        const id = p._id;
        const existing = map.get(id) || { name: p.name, pic: p.pic1, qty: 0, revenue: 0 };
        existing.qty += item.quantity || 1;
        existing.revenue += (p.price || 0) * (item.quantity || 1);
        map.set(id, existing);
      }
    }
    this.topProducts = Array.from(map.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }

  buildCharts() {
    this.buildOrdersPerDayChart();
    this.buildTopProductsChart();
    this.buildStatusChart();
  }

  buildOrdersPerDayChart() {
    const ctx = document.getElementById('ordersChart') as HTMLCanvasElement;
    if (!ctx) return;
    // Last 7 days
    const days: string[] = [];
    const counts: number[] = [];
    const sales: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      days.push(label);
      const dayOrders = this.allOrders.filter(o => {
        const od = new Date(o.createdAt);
        return od.toDateString() === d.toDateString();
      });
      counts.push(dayOrders.length);
      sales.push(dayOrders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0));
    }
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            label: 'Orders',
            data: counts,
            borderColor: '#2e7d32',
            backgroundColor: 'rgba(46,125,50,0.08)',
            tension: 0.4, fill: true,
            pointBackgroundColor: '#2e7d32',
            pointRadius: 5, borderWidth: 2,
            yAxisID: 'y'
          },
          {
            label: 'Sales (₹)',
            data: sales,
            borderColor: '#f57c00',
            backgroundColor: 'rgba(245,124,0,0.06)',
            tension: 0.4, fill: true,
            pointBackgroundColor: '#f57c00',
            pointRadius: 5, borderWidth: 2,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y:  { beginAtZero: true, position: 'left',  grid: { color: '#f0f0f0' }, ticks: { stepSize: 1 } },
          y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false } }
        }
      }
    });
  }

  buildTopProductsChart() {
    const ctx = document.getElementById('topProductsChart') as HTMLCanvasElement;
    if (!ctx || !this.topProducts.length) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.topProducts.map(p => p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name),
        datasets: [{
          label: 'Units Sold',
          data: this.topProducts.map(p => p.qty),
          backgroundColor: ['#2e7d32','#4caf50','#81c784','#a5d6a7','#c8e6c9'],
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { stepSize: 1 } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  buildStatusChart() {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (!ctx) return;
    const statusMap: Record<string, number> = {};
    for (const o of this.allOrders) {
      const s = o.status || 'Pending';
      statusMap[s] = (statusMap[s] || 0) + 1;
    }
    const labels = Object.keys(statusMap);
    const data = Object.values(statusMap);
    const colors: Record<string, string> = {
      Pending: '#f57f17', Processing: '#1565c0',
      Shipped: '#6a1b9a', Delivered: '#2e7d32', Cancelled: '#c62828'
    };
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: labels.map(l => colors[l] || '#888'),
          borderWidth: 2, borderColor: '#fff'
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } } },
        cutout: '65%'
      }
    });
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
