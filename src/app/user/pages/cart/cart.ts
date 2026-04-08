import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../service/cart-service';
import { CartCountService } from '../../../service/cart-count.service';
import { OrderService } from '../../../service/order-service';
import Swal from 'sweetalert2';

declare var Razorpay: any;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, DatePipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  uid: string | null = '';
  address: string = '';
  payment_mode: string = '';
  cart: any[] = [];
  showGoTop = false;

  // Coupon
  couponCode: string = '';
  couponApplied: boolean = false;
  couponError: string = '';
  discountPercent: number = 0;
  readonly VALID_COUPON = 'URBAN20';

  @HostListener('window:scroll')
  onScroll() { this.showGoTop = window.scrollY > 300; }
  scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  goBack() { window.history.back(); }

  constructor(
    private cartservice: CartService,
    private cdr: ChangeDetectorRef,
    private orderservice: OrderService,
    private router: Router,
    private cartCountService: CartCountService
  ) {}

  ngOnInit() {

    this.uid = sessionStorage.getItem('id');

    if (!this.uid) {
      Swal.fire({
        icon: 'warning',
        title: 'Login required',
        text: 'Please login to view your cart.',
        confirmButtonColor: '#c6947a',
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    this.loadCart();
  }

  loadCart() {
    if (!this.uid) return;
    this.cartservice.getcart(this.uid).subscribe({
      next: (res: any) => {
        this.cart = Array.isArray(res?.data) ? [] : (res?.data?.items || []).filter((i: any) => i.productId).filter((i: any) => i.productId);
        this.cartCountService.set(this.cart.reduce((s, i) => s + (i.quantity || 1), 0));
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Failed to load cart' });
      }
    });
  }

  getSubtotal(): number {
    return this.cart.reduce(
      (total, item) =>
        total + (item?.productId?.price || 0) * (item?.quantity || 0),
      0
    );
  }

  getTotalAmount(): number {
    const subtotal = this.getSubtotal();
    const discount = this.couponApplied ? subtotal * 0.2 : 0;
    return subtotal - discount;
  }

  getDiscountAmount(): number {
    return this.couponApplied ? this.getSubtotal() * 0.2 : 0;
  }

  applyCoupon() {
    if (this.couponCode.trim().toUpperCase() === this.VALID_COUPON) {
      this.couponApplied = true;
      this.couponError = '';
      Swal.fire({ icon: 'success', title: 'Coupon Applied!', text: '20% discount has been applied.', timer: 1500, showConfirmButton: false, confirmButtonColor: '#2e7d32' });
    } else {
      this.couponApplied = false;
      this.couponError = 'Invalid coupon code. Try URBAN20';
    }
  }

  removeCoupon() {
    this.couponApplied = false;
    this.couponCode = '';
    this.couponError = '';
  }

  getTotalItems(): number {
    return this.cart.reduce(
      (sum, item) => sum + (item?.quantity || 0),
      0
    );
  }

  incrementQuantity(item: any) {
    this.cartservice.increaseQuantity({
      userId: this.uid,
      productId: item.productId._id
    }).subscribe({
      next: (res: any) => {
        this.cart = Array.isArray(res?.data) ? [] : (res?.data?.items || []).filter((i: any) => i.productId);
        this.cdr.detectChanges();
      }
    });
  }

  decrementQuantity(item: any) {
    if (item.quantity <= 1) {
      this.confirmRemove(item);
      return;
    }
    this.cartservice.decreaseQuantity({
      userId: this.uid,
      productId: item.productId._id
    }).subscribe({
      next: (res: any) => {
        this.cart = Array.isArray(res?.data) ? [] : (res?.data?.items || []).filter((i: any) => i.productId);
        this.cdr.detectChanges();
      }
    });
  }

  removeItem(item: any) {
    this.confirmRemove(item);
  }

  confirmRemove(item: any) {

    Swal.fire({
      icon: 'warning',
      title: 'Remove item?',
      text: 'Do you want to remove this product from your cart?',
      showCancelButton: true,
      confirmButtonColor: '#2e7d32',
      confirmButtonText: 'Yes, remove'
    }).then(result => {

      if (!result.isConfirmed) return;

      this.cartservice.removeFromCart({
        userId: this.uid,
        productId: item.productId._id
      }).subscribe({
        next: (res: any) => {
          this.cart = Array.isArray(res?.data) ? [] : (res?.data?.items || []).filter((i: any) => i.productId);
          this.cdr.detectChanges();
        },
        error: () => {
          Swal.fire({ icon: 'error', title: 'Remove failed' });
        }
      });

    });

  }

  placeorder() {

    if (!this.address) {
      Swal.fire({ icon: 'warning', title: 'Address required' });
      return;
    }

    if (!this.payment_mode) {
      Swal.fire({ icon: 'warning', title: 'Payment method required' });
      return;
    }

    const orderData = {
      userId: this.uid,
      items: this.cart.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      address: this.address,
      paymentMethod: this.payment_mode,
      total: this.getTotalAmount() + 100
    };

    if (this.payment_mode === 'online') {
      this.payNow(orderData);
    } else {
      this.orderservice.placeorder(orderData).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Order placed successfully' });
          this.router.navigate(['/payment-success']);
        },
        error: (err: any) => {
          Swal.fire({ icon: 'error', title: 'Order failed', text: err?.error?.error || 'Something went wrong' });
        }
      });
    }
  }

  payNow(orderData: any) {
    const userName = sessionStorage.getItem('name') || 'Customer';

    const options: any = {
      key: "rzp_test_SNZaIMXvc66D0t",
      amount: this.getTotalAmount() * 100,
      currency: "INR",
      name: "Urban Plants",
      description: `Order of ${this.getTotalItems()} item${this.getTotalItems() !== 1 ? 's' : ''} — ₹${this.getTotalAmount()}`,
      image: "https://img.icons8.com/color/96/potted-plant.png",

      handler: (response: any) => {
        const data = { ...orderData, paymentMethod: "online", paymentId: response.razorpay_payment_id };
        this.orderservice.placeorder(data).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Payment Successful', confirmButtonColor: '#2e7d32' });
            this.router.navigate(['/payment-success']);
          },
          error: () => {
            Swal.fire({ icon: 'error', title: 'Order save failed after payment' });
          }
        });
      },

      prefill: {
        name: userName,
        email: "",
        contact: ""
      },
      notes: {
        address: orderData.address
      },
      theme: {
        color: "#2e7d32",
        backdrop_color: "rgba(27, 94, 32, 0.6)"
      },
      modal: {
        confirm_close: true,
        animation: true
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

}