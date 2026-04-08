import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgFor, CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductService } from '../../../service/product-service';
import { CartService } from '../../../service/cart-service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterLink, FormsModule, DatePipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {

  id: string = "";
  product: any = {};
  imageUrl: string = "http://localhost:3000/uploads/";
  selectedImage: string = "";
  productImages: string[] = [];
  showVideo: boolean = false;
  showGoTop = false;
  isWishlisted = false;

  // Zoom
  showZoom = false;
  lensX = 0;
  lensY = 0;
  zoomBgPos = '0% 0%';
  zoomBgSize = '300% 300%';
  readonly LENS_SIZE = 100;
  readonly ZOOM_FACTOR = 3;

  onImageMouseMove(event: MouseEvent) {
    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const halfLens = this.LENS_SIZE / 2;

    let x = event.clientX - rect.left - halfLens;
    let y = event.clientY - rect.top - halfLens;

    x = Math.max(0, Math.min(x, rect.width - this.LENS_SIZE));
    y = Math.max(0, Math.min(y, rect.height - this.LENS_SIZE));

    this.lensX = x;
    this.lensY = y;

    const bgX = ((x + halfLens) / rect.width) * 100;
    const bgY = ((y + halfLens) / rect.height) * 100;
    this.zoomBgPos = `${bgX}% ${bgY}%`;
    this.zoomBgSize = `${this.ZOOM_FACTOR * 100}% ${this.ZOOM_FACTOR * 100}%`;
  }

  @HostListener('window:scroll')
  onScroll() { this.showGoTop = window.scrollY > 300; }
  scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  goBack() { window.history.back(); }

  // Reviews
  reviews: any[] = [];
  averageRating: number = 0;
  showReviewForm: boolean = false;
  hoverRating: number = 0;
  newReview: any = {
    name: '',
    rating: 0,
    comment: '',
    date: new Date(),
    helpful: 0
  };

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get product ID from URL
    this.id = this.route.snapshot.paramMap.get('id') || "";
    this.getProduct();
    this.loadReviews();
  }

  selectImage(image: string) {
    this.selectedImage = image;
    this.showVideo = false;
  }

  selectVideo() {
    this.showVideo = true;
    this.showZoom = false;
  }

  // Review Functions
  loadReviews() {
    // Load reviews from localStorage for this product
    const storedReviews = localStorage.getItem(`reviews_${this.id}`);
    if (storedReviews) {
      this.reviews = JSON.parse(storedReviews);
      this.calculateAverageRating();
    } else {
      // Sample reviews for demonstration
      this.reviews = [
        {
          name: 'Rajesh Kumar',
          rating: 5,
          comment: 'Excellent product! Very fresh and healthy. Highly recommended for home gardening.',
          date: new Date('2024-01-15'),
          helpful: 12
        },
        {
          name: 'Priya Sharma',
          rating: 4,
          comment: 'Good quality product. Packaging was nice and delivery was on time.',
          date: new Date('2024-01-20'),
          helpful: 8
        },
        {
          name: 'Amit Patel',
          rating: 5,
          comment: 'Amazing! The plant is growing well. Great value for money.',
          date: new Date('2024-02-01'),
          helpful: 15
        }
      ];
      this.calculateAverageRating();
    }
  }

  calculateAverageRating() {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
  }

  getRatingCount(rating: number): number {
    return this.reviews.filter(r => r.rating === rating).length;
  }

  getRatingPercentage(rating: number): number {
    if (this.reviews.length === 0) return 0;
    return (this.getRatingCount(rating) / this.reviews.length) * 100;
  }

  toggleReviewForm() {
    this.showReviewForm = !this.showReviewForm;
    if (this.showReviewForm) {
      // Pre-fill name if user is logged in
      const userName = sessionStorage.getItem('name');
      if (userName) {
        this.newReview.name = userName;
      }
    }
  }

  setRating(rating: number) {
    this.newReview.rating = rating;
  }

  submitReview() {
    if (!this.newReview.name.trim()) {
      Swal.fire({
        title: 'Name Required',
        text: 'Please enter your name',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (this.newReview.rating === 0) {
      Swal.fire({
        title: 'Rating Required',
        text: 'Please select a rating',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!this.newReview.comment.trim()) {
      Swal.fire({
        title: 'Review Required',
        text: 'Please write your review',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Add review to list
    const review = {
      ...this.newReview,
      date: new Date(),
      helpful: 0
    };
    this.reviews.unshift(review);

    // Save to localStorage
    localStorage.setItem(`reviews_${this.id}`, JSON.stringify(this.reviews));

    // Recalculate average
    this.calculateAverageRating();

    // Show success message
    Swal.fire({
      title: 'Thank You!',
      text: 'Your review has been submitted successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    });

    // Reset form
    this.cancelReview();
  }

  cancelReview() {
    this.showReviewForm = false;
    this.newReview = {
      name: '',
      rating: 0,
      comment: '',
      date: new Date(),
      helpful: 0
    };
  }

  checkWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    this.isWishlisted = wishlist.some((p: any) => p._id === this.product._id);
  }

  toggleWishlist() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (this.isWishlisted) {
      wishlist = wishlist.filter((p: any) => p._id !== this.product._id);
      this.isWishlisted = false;
      Swal.fire({ icon: 'info', title: 'Removed from wishlist', timer: 1200, showConfirmButton: false });
    } else {
      wishlist.push(this.product);
      this.isWishlisted = true;
      Swal.fire({ icon: 'success', title: 'Added to wishlist!', timer: 1200, showConfirmButton: false });
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }

  addToCart() {
    const userId = sessionStorage.getItem('id');
    if (!userId) {
      Swal.fire({ icon: 'warning', title: 'Login required', text: 'Please login first.', confirmButtonColor: '#2e7d32' })
        .then(() => this.router.navigate(['/login']));
      return;
    }
    this.cartService.addToCart({ userId, productId: this.product._id, quantity: 1 }).subscribe({
      next: (res: any) => {
        Swal.fire({ icon: 'success', title: 'Added to cart', confirmButtonColor: '#2e7d32' })
          .then(() => this.router.navigate(['/cart']));
      },
      error: (err: any) => {
        Swal.fire({ icon: 'error', title: 'Failed', text: err?.error?.message || 'Something went wrong.' });
      }
    });
  }

  // Load product details
  getProduct() {
    this.productService.getById(this.id).subscribe({
      next: (res: any) => {
        this.product = res.data;
        
        // Collect only available images (exclude empty, null, undefined, and "no-image.jpg")
        this.productImages = [];
        if (this.product.pic1 && this.product.pic1.trim() !== '' && this.product.pic1 !== 'no-image.jpg') {
          this.productImages.push(this.product.pic1);
        }
        if (this.product.pic2 && this.product.pic2.trim() !== '' && this.product.pic2 !== 'no-image.jpg') {
          this.productImages.push(this.product.pic2);
        }
        if (this.product.pic3 && this.product.pic3.trim() !== '' && this.product.pic3 !== 'no-image.jpg') {
          this.productImages.push(this.product.pic3);
        }
        if (this.product.pic4 && this.product.pic4.trim() !== '' && this.product.pic4 !== 'no-image.jpg') {
          this.productImages.push(this.product.pic4);
        }
        if (this.product.pic5 && this.product.pic5.trim() !== '' && this.product.pic5 !== 'no-image.jpg') {
          this.productImages.push(this.product.pic5);
        }
        
        // Set first image as selected, or use placeholder if no images
        this.selectedImage = this.productImages.length > 0 ? this.productImages[0] : '';
        
        this.checkWishlist();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

}