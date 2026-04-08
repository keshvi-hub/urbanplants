import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  imports: [RouterLink],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css',
})
export class PaymentSuccess implements OnInit {
  orderId = '';
  userName = '';
  showGoTop = false;

  @HostListener('window:scroll')
  onScroll() { this.showGoTop = window.scrollY > 300; }
  scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  goBack() { window.history.back(); }

  constructor(private router: Router) {}

  ngOnInit() {
    this.userName = sessionStorage.getItem('name') || 'Customer';
    this.orderId = 'ORD' + Date.now().toString().slice(-8);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goOrders() {
    this.router.navigate(['/myorder']);
  }
}
