import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ValidationMessage } from '../../../validation-message/validation-message';
import { CategoryService } from '../../../service/category-service';

import { ToastService } from '../../../service/toast.service';

@Component({
  selector: 'app-addcategory',
  standalone: true,
  imports: [ReactiveFormsModule, ValidationMessage, RouterLink],
  templateUrl: './addcategory.html',
  styleUrl: './addcategory.css',
})
export class Addcategory {
  frmGrp!: FormGroup;

  constructor(private fb: FormBuilder, private catser: CategoryService, private router: Router, private toast: ToastService) {
    this.frmGrp = this.fb.group({
      cat_name: ['', Validators.required],
      cat_pic: ['', Validators.required]
    });
  }

  onsubmit(): void {
    this.frmGrp.markAllAsTouched();

    if (this.frmGrp.valid) {
      const formData = new FormData();
      formData.append('cat_name', this.frmGrp.get('cat_name')?.value);
      formData.append('cat_pic', this.frmGrp.get('cat_pic')?.value);

      this.catser.add(formData).subscribe({
        next: () => {
          this.toast.success('Category added successfully');
          this.router.navigate(['/admin/category']);
        },
        error: (err) => {
          this.toast.error('Failed to add category');
        }
      });
    }
  }

  // Capture file
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.frmGrp.patchValue({
        cat_pic: event.target.files[0]
      });
    }
  }
}