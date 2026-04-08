import { Component, OnInit } from '@angular/core';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { ThemeService } from '../../../service/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    // Initialize theme on sidebar load
    this.themeService.isDarkMode$.subscribe();
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
