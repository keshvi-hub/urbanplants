import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../service/user-service';
import { CustomValidation } from '../custom-validation/custom-validation';
import { ToastService } from '../service/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgIf, ReactiveFormsModule, RouterLink, CustomValidation],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private u_service: UserService, private router: Router, private toast: ToastService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onsubmit() {
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.valid) return;
    const { email, password } = this.loginForm.value;
    if (email === 'admin@gmail.com' && password === 'admin_admin') {
      sessionStorage.setItem('id', 'admin');
      sessionStorage.setItem('name', 'Admin');
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('role', 'admin');
      this.router.navigate(['/admin/dashboard']);
      return;
    }
    this.loading = true;
    this.u_service.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        sessionStorage.setItem('id', res.user.id);
        sessionStorage.setItem('name', res.user.name || res.user.username);
        sessionStorage.setItem('email', res.user.email);
        sessionStorage.setItem('role', 'user');
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.toast.error(err.error?.message || 'Login failed');
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}