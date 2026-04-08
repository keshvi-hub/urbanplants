import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ChatbotComponent } from '../../../chatbot/chatbot';
import { CategoryService } from '../../../service/category-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../service/product-service';
import { CartService } from '../../../service/cart-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ChatbotComponent, NgFor, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnDestroy {


  allProducts: any[] = [];
  filteredProducts: any[] = [];
  allCategories: any[] = [];
  featuredProducts: any[] = [];
  searchQuery = '';
  selectedCategory: string = '';
  
  // Quick View Modal
  showQuickView: boolean = false;
  quickViewProduct: any = null;
  quickViewImages: string[] = [];
  selectedQuickViewImage: string = '';
  imageUrl: string = 'http://localhost:3000/uploads/';

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartservice:CartService

  ) { }

  // Carousel
  slides = [0, 1, 2, 3, 4];
  currentSlide = 0;
  private carouselTimer: any;

  ngOnInit(): void {
    // Listen for search query from URL
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || '';
      if (this.selectedCategory) {
        this.filterByCategory(this.selectedCategory);
      }
    });

    this.loadCategories();
    this.loadProducts();
    this.startCarousel();
  }

  startCarousel() {
    this.carouselTimer = setInterval(() => this.nextSlide(), 4000);
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(i: number) {
    this.currentSlide = i;
    clearInterval(this.carouselTimer);
    this.startCarousel();
  }

  ngOnDestroy() {
    clearInterval(this.carouselTimer);
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (res: any) => {
        this.allProducts = res.data || res;
        this.featuredProducts = this.getOnePerCategory(this.allProducts, 4);

        if (this.selectedCategory) {
          this.filterByCategory(this.selectedCategory);
        }

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading products:', err),
    });
  }

  // Pick 1 product per category, up to `limit` total
  getOnePerCategory(products: any[], limit: number): any[] {
    const seen = new Set<string>();
    const result: any[] = [];
    for (const p of products) {
      const catId = p.categoryId?._id || p.categoryId;
      if (!seen.has(catId)) {
        seen.add(catId);
        result.push(p);
        if (result.length === limit) break;
      }
    }
    // If fewer than limit unique categories, fill remaining slots
    if (result.length < limit) {
      for (const p of products) {
        if (!result.includes(p)) {
          result.push(p);
          if (result.length === limit) break;
        }
      }
    }
    return result;
  }

  loadCategories() {
    this.categoryService.get().subscribe({
      next: (res: any) => {
        this.allCategories = res;
        console.log('Displayed categories:', this.allCategories.length);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  onCategoryClick(categoryId: string) {
    console.log('Home page - Category clicked:', categoryId);
    // Navigate to products page with category filter
    this.router.navigate(['/products'], {
      queryParams: { category: categoryId }
    }).then(success => {
      console.log('Navigation success:', success);
    });
  }

  filterByCategory(categoryId: string) {
    if (!categoryId || categoryId === 'all') {
      this.featuredProducts = [...this.allProducts];
      this.selectedCategory = '';
    } else {
      this.featuredProducts = this.allProducts.filter(product => 
        product.categoryId?._id === categoryId
      );
    }
    console.log('Filtered products:', this.featuredProducts.length);
    this.cdr.detectChanges();
  }

  clearCategoryFilter() {
    this.selectedCategory = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: null },
      queryParamsHandling: 'merge'
    });
    // Restore 1-per-category 4-product limit when filter is cleared
    this.featuredProducts = this.getOnePerCategory(this.allProducts, 4);
    this.cdr.detectChanges();
  }

  openQuickView(product: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.quickViewProduct = product;
    
    // Collect only available images (exclude "no-image.jpg")
    this.quickViewImages = [];
    if (product.pic1 && product.pic1.trim() !== '' && product.pic1 !== 'no-image.jpg') {
      this.quickViewImages.push(product.pic1);
    }
    if (product.pic2 && product.pic2.trim() !== '' && product.pic2 !== 'no-image.jpg') {
      this.quickViewImages.push(product.pic2);
    }
    if (product.pic3 && product.pic3.trim() !== '' && product.pic3 !== 'no-image.jpg') {
      this.quickViewImages.push(product.pic3);
    }
    if (product.pic4 && product.pic4.trim() !== '' && product.pic4 !== 'no-image.jpg') {
      this.quickViewImages.push(product.pic4);
    }
    if (product.pic5 && product.pic5.trim() !== '' && product.pic5 !== 'no-image.jpg') {
      this.quickViewImages.push(product.pic5);
    }
    
    // Set first image as selected
    this.selectedQuickViewImage = this.quickViewImages.length > 0 ? this.quickViewImages[0] : '';
    
    this.showQuickView = true;
    document.body.style.overflow = 'hidden';
  }

  closeQuickView() {
    this.showQuickView = false;
    this.quickViewProduct = null;
    this.quickViewImages = [];
    this.selectedQuickViewImage = '';
    document.body.style.overflow = 'auto';
  }

  selectQuickViewImage(image: string) {
    this.selectedQuickViewImage = image;
  }


  isWishlisted(productId: string): boolean {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.some((p: any) => p._id === productId);
  }

  toggleWishlist(product: any, event: Event) {
    event.stopPropagation();
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (this.isWishlisted(product._id)) {
      wishlist = wishlist.filter((p: any) => p._id !== product._id);
      Swal.fire({ icon: 'info', title: 'Removed from wishlist', timer: 1200, showConfirmButton: false });
    } else {
      wishlist.push(product);
      Swal.fire({ icon: 'success', title: 'Added to wishlist!', timer: 1200, showConfirmButton: false });
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }

user_id:string | null=""
  addToCart(pid: any) {
    this.user_id=sessionStorage.getItem('id');
    if (!this.user_id) {
      Swal.fire({
        icon: 'warning',
        title: 'Login required',
        text: 'Please login first to add items to your cart.',
        confirmButtonColor: '#c6947a',
      }).then(() => {
        window.location.href = '/login';
      });
    } else {
      const addcart = {
        userId: this.user_id,
        productId: pid,
        quantity: 1
      };
      this.cartservice.addToCart(addcart).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Added to cart',
            text: res.message || 'Product added to your cart.',
            confirmButtonColor: '#c6947a',
          }).then(() => {
            this.router.navigate(['/cart']);
          });
        },
        error: (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed to add to cart',
            text: err?.error?.message || err?.message || 'Something went wrong.',
            confirmButtonColor: '#c6947a',
          });
        },
      })

    }
  }

}
