import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../service/category-service';
import { ValidationMessage } from '../../../validation-message/validation-message';

import { ToastService } from '../../../service/toast.service';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ValidationMessage, NgIf],
  templateUrl: './editcategory.html',
  styleUrls: ['./editcategory.css'],
})
export class EditCategory implements OnInit {
  frmGrp!: FormGroup;
  selectedFile!: File;
  id!: string;
  oldImage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.frmGrp = this.fb.group({
      cat_name: ['', Validators.required],
      cat_pic: ['']
    });

    // Get ID from URL
    this.id = this.route.snapshot.paramMap.get('id')!;

    this.getSingleCategory();
  }

  // Get Single Category Data
  getSingleCategory() {
    this.categoryService.getSingleCategory(this.id).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.frmGrp.patchValue({
          cat_name: data.cat_name
        });
        this.oldImage = data.cat_pic;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // File Change
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Update Category (with FormData for multer)
  onUpdate() {
    if (this.frmGrp.invalid) return;

    const formData = new FormData();
    formData.append('cat_name', this.frmGrp.value.cat_name);

    if (this.selectedFile) {
      formData.append('cat_pic', this.selectedFile);
    }

    this.categoryService.updateCategory(this.id, formData).subscribe({
      next: (res: any) => {
        this.toast.success('Category updated successfully');
        this.router.navigate(['/admin/category']);
      },
      error: (err) => {
        console.log('Full error:', JSON.stringify(err));
        this.toast.error(err.error?.error || err.error?.message || 'Failed to update category');
      }
    });
  }

  
}