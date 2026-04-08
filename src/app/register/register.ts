import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/user-service';
import { CustomValidation } from '../custom-validation/custom-validation';
import { ToastService } from '../service/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CustomValidation],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  frmGrp!: FormGroup;

  constructor(private fb: FormBuilder, private uService: UserService, private router: Router, private toast: ToastService) {
    this.frmGrp = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      mobileno: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]]
    });
  }

  onsubmit() {
    this.frmGrp.markAllAsTouched();
    if (this.frmGrp.valid) {
      this.uService.register(this.frmGrp.value).subscribe({
        next: (res: any) => {
          this.toast.success(res.message || 'Registered successfully!');
          setTimeout(() => this.router.navigate(['/login']), 1200);
        },
        error: (err: any) => {
          this.toast.error(err.error?.message || 'Registration failed');
        }
      });
    }
  }
}