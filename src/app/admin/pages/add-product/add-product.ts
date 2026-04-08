import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { CategoryService } from '../../../service/category-service';
import { ProductService } from '../../../service/product-service';
import { ToastService } from '../../../service/toast.service';
import { ValidationMessage } from '../../../validation-message/validation-message';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgFor, ValidationMessage, RouterLink],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  frmGrp!: FormGroup;
  categories: any[] = [];
  selectedImages: File[] = [];
  imagePreviews: string[] = [];
  selectedVideo: File | null = null;
  videoPreviewUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService,
    private toast: ToastService
  ) {
    this.frmGrp = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      oldprice: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      images: ['', Validators.required],
      stock: [100, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.get().subscribe({
      next: (res: any) => {
        this.categories = res;
      },
      error: (err) => console.error(err),
    });
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    this.selectedImages = Array.from(files);
    this.imagePreviews = [];

    // Create preview URLs for selected images
    this.selectedImages.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });

    this.frmGrp.patchValue({
      images: this.selectedImages,
    });
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.imagePreviews.splice(index, 1);
    if (this.selectedImages.length === 0) {
      this.frmGrp.patchValue({ images: '' });
    }
  }

  onVideoChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedVideo = file;
    this.videoPreviewUrl = URL.createObjectURL(file);
  }

  removeVideo() {
    this.selectedVideo = null;
    this.videoPreviewUrl = '';
  }

  onsubmit() {
    this.frmGrp.markAllAsTouched();
    if (this.frmGrp.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.frmGrp.value.name);
    formData.append('description', this.frmGrp.value.description);
    formData.append('price', this.frmGrp.value.price);
    formData.append('oldprice', this.frmGrp.value.oldprice);
    formData.append('discount', this.frmGrp.value.discount);
    formData.append('categoryId', this.frmGrp.value.categoryId);
    formData.append('stock', this.frmGrp.value.stock);
    
    // Use default userId if not logged in or if admin
    const userId = sessionStorage.getItem('id') || '000000000000000000000000';
    const validUserId = /^[a-f\d]{24}$/i.test(userId) ? userId : '000000000000000000000000';
    formData.append('userId', validUserId);

    // Append all selected images (up to 5)
    this.selectedImages.forEach((file, index) => {
      if (index === 0) formData.append('pic1', file);
      else if (index === 1) formData.append('pic2', file);
      else if (index === 2) formData.append('pic3', file);
      else if (index === 3) formData.append('pic4', file);
      else if (index === 4) formData.append('pic5', file);
    });

    if (this.selectedVideo) {
      formData.append('video', this.selectedVideo);
    }

    this.productService.add(formData).subscribe({
      next: (res: any) => {
        this.toast.success(res.message || 'Product added successfully');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to add product');
      },
    });
  }
}
