import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../service/category-service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {
  categories: any[] = [];
  allCategories: any[] = [];
  searchQuery = '';

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Listen for search query from URL
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      this.loadCategories();
    });
  }

  loadCategories() {
    this.categoryService.get().subscribe({
      next: (res: any) => {
        this.allCategories = res;
        console.log('All categories loaded:', this.allCategories.length);
        
        if (this.searchQuery) {
          this.filterCategories();
        } else {
          this.categories = [...this.allCategories];
        }
        
        console.log('Displayed categories:', this.categories.length);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  filterCategories() {
    if (!this.searchQuery || !this.searchQuery.trim()) {
      this.categories = [...this.allCategories];
      this.cdr.detectChanges();
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.categories = this.allCategories.filter(category => {
      const nameMatch = category.cat_name?.toLowerCase().includes(query);
      console.log(`Category: ${category.cat_name}, Match: ${nameMatch}`);
      return nameMatch;
    });
    
    console.log('Filtered categories:', this.categories.length);
    this.cdr.detectChanges();
  }

  clearSearch() {
    this.searchQuery = '';
    this.router.navigate(['/admin/category']);
    this.categories = [...this.allCategories];
    this.cdr.detectChanges();
  }

  deleteCategory(id: string) {
    if(confirm("Are you sure?")) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          this.allCategories = this.allCategories.filter(c => c._id !== id);
          this.categories = this.categories.filter(c => c._id !== id);
          this.cdr.detectChanges();
        }
      });
    }
  }
}
