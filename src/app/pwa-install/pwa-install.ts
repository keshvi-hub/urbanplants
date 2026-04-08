import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pwa-install',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pwa-banner" *ngIf="showPrompt">
      <div class="pwa-icon"><i class="fas fa-leaf"></i></div>
      <div class="pwa-text">
        <strong>Add Urban Plants to Home Screen</strong>
        <span>Install for a faster, app-like experience</span>
      </div>
      <button class="pwa-install-btn" (click)="install()">Install</button>
      <button class="pwa-dismiss" (click)="dismiss()"><i class="fas fa-times"></i></button>
    </div>
  `,
  styles: [`
    .pwa-banner {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #1b5e20;
      color: #fff;
      border-radius: 16px;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      z-index: 99998;
      max-width: 480px;
      width: calc(100vw - 32px);
      animation: slideUp 0.4s ease;
    }
    @keyframes slideUp {
      from { transform: translateX(-50%) translateY(80px); opacity: 0; }
      to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
    }
    .pwa-icon {
      font-size: 1.6rem;
      flex-shrink: 0;
      color: #a5d6a7;
    }
    .pwa-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .pwa-text strong { font-size: 0.9rem; }
    .pwa-text span   { font-size: 0.78rem; opacity: 0.8; }
    .pwa-install-btn {
      background: #4caf50;
      color: #fff;
      border: none;
      padding: 8px 18px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;
    }
    .pwa-install-btn:hover { background: #66bb6a; }
    .pwa-dismiss {
      background: none;
      border: none;
      color: rgba(255,255,255,0.7);
      font-size: 1rem;
      cursor: pointer;
      padding: 4px;
      flex-shrink: 0;
    }
    .pwa-dismiss:hover { color: #fff; }
  `]
})
export class PwaInstallComponent implements OnInit {
  showPrompt = false;
  private deferredPrompt: any = null;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: any) {
    event.preventDefault();
    this.deferredPrompt = event;
    // Only show if user hasn't dismissed before
    if (!localStorage.getItem('pwaInstallDismissed')) {
      setTimeout(() => this.showPrompt = true, 3000);
    }
  }

  ngOnInit() {}

  install() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then(() => {
        this.deferredPrompt = null;
        this.showPrompt = false;
      });
    }
  }

  dismiss() {
    this.showPrompt = false;
    localStorage.setItem('pwaInstallDismissed', 'true');
  }
}
