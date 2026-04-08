import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../service/product-service';

import { ToastService } from '../../../service/toast.service';

@Component({
  selector: 'app-show-product',
  standalone: true,
  imports: [CommonModule, NgFor, RouterLink, FormsModule],
  templateUrl: './show-product.html',
  styleUrl: './show-product.css',
})
export class ShowProduct {
  products: any[] = [];
  allProducts: any[] = [];
  searchQuery = '';

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    // Listen for search query from URL first
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      this.loadProducts();
    });
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (res: any) => {
        this.allProducts = res.data || res;
        console.log('All products loaded:', this.allProducts.length);
        
        if (this.searchQuery) {
          console.log('Filtering with query:', this.searchQuery);
          this.filterProducts();
        } else {
          this.products = [...this.allProducts];
        }
        
        console.log('Displayed products:', this.products.length);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading products:', err),
    });
  }

  filterProducts() {
    if (!this.searchQuery || !this.searchQuery.trim()) {
      this.products = [...this.allProducts];
      this.cdr.detectChanges();
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.products = this.allProducts.filter(product => {
      const nameMatch = product.name?.toLowerCase().includes(query);
      const descMatch = product.description?.toLowerCase().includes(query);
      const catMatch = product.categoryId?.cat_name?.toLowerCase().includes(query);
      
      console.log(`Product: ${product.name}, Name Match: ${nameMatch}, Desc Match: ${descMatch}, Cat Match: ${catMatch}`);
      
      return nameMatch || descMatch || catMatch;
    });
    
    console.log('Filtered products:', this.products.length);
    this.cdr.detectChanges();
  }

  clearSearch() {
    this.searchQuery = '';
    this.router.navigate(['/admin/products']);
    this.products = [...this.allProducts];
    this.cdr.detectChanges();
  }

  deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.productService.delete(id).subscribe({
      next: (res: any) => {
        this.toast.success(res.message || 'Product deleted');
        this.allProducts = this.allProducts.filter((p) => p._id !== id);
        this.products = this.products.filter((p) => p._id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to delete product');
      },
    });
  }
}
