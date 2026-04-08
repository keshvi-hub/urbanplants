import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../service/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let t of toastService.toasts | async"
           class="toast-item toast-{{ t.type }}"
           (click)="toastService.remove(t.id)">
        <i class="bi" [ngClass]="{
          'bi-check-circle-fill': t.type === 'success',
          'bi-x-circle-fill':     t.type === 'error',
          'bi-exclamation-triangle-fill': t.type === 'warning',
          'bi-info-circle-fill':  t.type === 'info'
        }"></i>
        <span>{{ t.message }}</span>
        <button class="toast-close" (click)="toastService.remove(t.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 340px;
    }
    .toast-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      cursor: pointer;
      animation: slideIn 0.3s ease;
      color: #fff;
    }
    .toast-success { background: #2e7d32; }
    .toast-error   { background: #c62828; }
    .toast-warning { background: #e65100; }
    .toast-info    { background: #1565c0; }
    .toast-item i  { font-size: 1.1rem; flex-shrink: 0; }
    .toast-item span { flex: 1; }
    .toast-close {
      background: none; border: none; color: rgba(255,255,255,0.8);
      font-size: 1.2rem; cursor: pointer; padding: 0; line-height: 1;
      flex-shrink: 0;
    }
    .toast-close:hover { color: #fff; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    @media (max-width: 480px) {
      .toast-container { top: 12px; right: 12px; left: 12px; max-width: 100%; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
