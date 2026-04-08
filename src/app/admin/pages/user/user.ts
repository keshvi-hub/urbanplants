import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../service/user-service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, NgFor, RouterLink],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  users: any[] = [];
  loading = true;
  error = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.get().subscribe({
      next: (res: any) => {
        console.log('Users response:', res);
        this.users = res.data || res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Failed to load users';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
