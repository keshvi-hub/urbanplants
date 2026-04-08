import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../service/product-service';
import { CategoryService } from '../../../service/category-service';
import { CartCountService } from '../../../service/cart-count.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  isLoggedIn = false;
  userName = '';
  isAdmin = false;
  showDropdown = false;
  copied = false;
  cartCount = 0;

  // Search functionality
  showSearchBox = false;
  searchQuery = '';
  searchResults: any = { categories: [], products: [] };
  allProducts: any[] = [];
  allCategories: any[] = [];
  isSearching = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private elementRef: ElementRef,
    private cartCountService: CartCountService
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      if (this.showSearchBox) this.closeSearch();
      if (this.showDropdown) this.showDropdown = false;
    }
  }

  ngOnInit() {
    const userId = sessionStorage.getItem('id');
    const name = sessionStorage.getItem('name');
    if (userId) {
      this.isLoggedIn = true;
      this.userName = name || 'User';
      this.isAdmin = sessionStorage.getItem('role') === 'admin';
      this.cartCountService.refresh();
    }
    this.cartCountService.cartCount.subscribe(n => this.cartCount = n);
    this.loadProducts();
    this.loadCategories();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  copyCoupon() {
    navigator.clipboard.writeText('URBAN20').then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  logout() {
    sessionStorage.clear();
    this.isLoggedIn = false;
    this.userName = '';
    this.showDropdown = false;
    this.cartCountService.reset();
    this.router.navigate(['/login']);
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (res: any) => {
        this.allProducts = res.data || res;
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  loadCategories() {
    this.categoryService.get().subscribe({
      next: (res: any) => {
        this.allCategories = res;
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  toggleSearch() {
    this.showSearchBox = !this.showSearchBox;
    if (!this.showSearchBox) {
      this.searchQuery = '';
      this.searchResults = { categories: [], products: [] };
    }
  }

  onSearchInput() {
    if (this.searchQuery.trim().length < 2) {
      this.searchResults = { categories: [], products: [] };
      this.isSearching = false;
      return;
    }

    this.isSearching = true;
    const query = this.searchQuery.toLowerCase().trim();

    // Search categories
    this.searchResults.categories = this.allCategories.filter(cat =>
      cat.cat_name.toLowerCase().includes(query)
    ).slice(0, 5);

    // Search products
    this.searchResults.products = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    ).slice(0, 5);

    this.isSearching = false;
  }

  selectCategory(categoryId: string) {
    this.router.navigate(['/products'], {
      queryParams: { category: categoryId }
    });
    this.closeSearch();
  }

  selectProduct(productId: string) {
    this.router.navigate(['/product', productId]);
    this.closeSearch();
  }

  closeSearch() {
    this.showSearchBox = false;
    this.searchQuery = '';
    this.searchResults = { categories: [], products: [] };
  }

  get hasResults(): boolean {
    return this.searchResults.categories.length > 0 || this.searchResults.products.length > 0;
  }
}
