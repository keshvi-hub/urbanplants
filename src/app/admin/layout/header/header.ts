import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  adminName = 'Admin';

  constructor(private router: Router) {}

  ngOnInit() {
    const name = sessionStorage.getItem('name');
    if (name) this.adminName = name;
  }
}
