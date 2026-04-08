import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../service/toast.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  contactForm!: FormGroup;
  submitted = false;
  showGoTop = false;

  @HostListener('window:scroll')
  onScroll() { this.showGoTop = window.scrollY > 300; }
  scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  goBack() { window.history.back(); }

  contactInfo = [
    { icon: 'fa-map-marker-alt', title: 'Visit Us', details: ['123 Green Garden Street', 'Plant City, PC 12345', 'United States'] },
    { icon: 'fa-phone', title: 'Call Us', details: ['+1 (555) 123-4567', '+1 (555) 987-6543', 'Mon-Sat: 9AM - 6PM'] },
    { icon: 'fa-envelope', title: 'Email Us', details: ['info@plantsseeds.com', 'support@plantsseeds.com', 'We reply within 24 hours'] }
  ];

  constructor(private fb: FormBuilder, private toast: ToastService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.contactForm.valid) {
      this.toast.success('Thank you! We will get back to you soon.');
      this.contactForm.reset();
      this.submitted = false;
    }
  }

  get f() { return this.contactForm.controls; }
}
