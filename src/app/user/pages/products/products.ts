import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../service/product-service';
import { CategoryService } from '../../../service/category-service';
import { CartService } from '../../../service/cart-service';
import { CartCountService } from '../../../service/cart-count.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  allCategories: any[] = [];
  selectedCategoryId: string = '';
  selectedCategoryName: string = 'All Products';
  
  // Quick View Modal
  showQuickView: boolean = false;
  loading: boolean = true;
  quickViewProduct: any = null;
  quickViewImages: string[] = [];
  selectedQuickViewImage: string = '';
  imageUrl: string = 'http://localhost:3000/uploads/';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private cartCountService: CartCountService
  ) {}

  ngOnInit() {
    // Listen for category parameter from URL and re-filter when it changes
    this.route.queryParams.subscribe(params => {
      this.selectedCategoryId = params['category'] || '';
      console.log('Category ID from URL:', this.selectedCategoryId);
      
      // If products are already loaded, filter them
      if (this.allProducts.length > 0) {
        this.filterProducts();
      }
    });
    
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.get().subscribe({
      next: (res: any) => {
        this.allCategories = res;
        console.log('Categories loaded:', this.allCategories.length);
        // Update category name if we have a selected category
        if (this.selectedCategoryId && this.allCategories.length > 0) {
          const category = this.allCategories.find(c => c._id === this.selectedCategoryId);
          this.selectedCategoryName = category ? category.cat_name : 'Products';
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (res: any) => {
        this.allProducts = res.data || res;
        console.log('All products loaded:', this.allProducts.length);
        console.log('Sample product structure:', this.allProducts[0]);
        
        // Filter products after loading
        this.filterProducts();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterProducts() {
    console.log('Filtering products...');
    console.log('Selected category ID:', this.selectedCategoryId);
    console.log('Total products:', this.allProducts.length);
    
    if (!this.selectedCategoryId || this.selectedCategoryId === '') {
      // Show ALL products when no category is selected
      this.filteredProducts = [...this.allProducts];
      this.selectedCategoryName = 'All Products';
      console.log('Showing all products:', this.filteredProducts.length);
    } else {
      // Filter by selected category
      this.filteredProducts = this.allProducts.filter(product => {
        const matches = product.categoryId?._id === this.selectedCategoryId;
        if (matches) {
          console.log('Product matches category:', product.name);
        }
        return matches;
      });
      
      // Find category name
      const category = this.allCategories.find(c => c._id === this.selectedCategoryId);
      this.selectedCategoryName = category ? category.cat_name : 'Products';
      console.log('Category name:', this.selectedCategoryName);
      console.log('Filtered products count:', this.filteredProducts.length);
    }
    this.cdr.detectChanges();
  }

  onCategoryClick(categoryId: string = '') {
    this.selectedCategoryId = categoryId;
    if (categoryId) {
      this.router.navigate(['/products'], {
        queryParams: { category: categoryId }
      });
    } else {
      // Remove category parameter to show all products
      this.router.navigate(['/products']);
    }
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
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  closeQuickView() {
    this.showQuickView = false;
    this.quickViewProduct = null;
    this.quickViewImages = [];
    this.selectedQuickViewImage = '';
    document.body.style.overflow = 'auto'; // Restore scroll
  }

  selectQuickViewImage(image: string) {
    this.selectedQuickViewImage = image;
  }

  showGoTop = false;

  @HostListener('window:scroll')
  onScroll() { this.showGoTop = window.scrollY > 300; }
  scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  goBack() { window.history.back(); }

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

  addToCart(pid: string) {
    const userId = sessionStorage.getItem('id');
    if (!userId) {
      Swal.fire({ icon: 'warning', title: 'Login required', text: 'Please login first.', confirmButtonColor: '#2e7d32' })
        .then(() => this.router.navigate(['/login']));
      return;
    }
    this.cartService.addToCart({ userId, productId: pid, quantity: 1 }).subscribe({
      next: (res: any) => {
        this.cartCountService.increment();
        Swal.fire({ icon: 'success', title: 'Added to cart', confirmButtonColor: '#2e7d32' })
          .then(() => this.router.navigate(['/cart']));
      },
      error: (err: any) => {
        Swal.fire({ icon: 'error', title: 'Failed', text: err?.error?.message || 'Something went wrong.' });
      }
    });
  }
}
