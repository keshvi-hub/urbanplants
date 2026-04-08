import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { ToastComponent } from './toast/toast';
import { PwaInstallComponent } from './pwa-install/pwa-install';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, PwaInstallComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('major-app');
  animating = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.animating = true;
      this.cdr.detectChanges();
    });
  }
}
