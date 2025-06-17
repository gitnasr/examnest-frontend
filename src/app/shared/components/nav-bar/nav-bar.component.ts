import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserInfo, UserRole } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-gray-800 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <a [routerLink]="['/']" class="flex-shrink-0 flex items-center">
              <img
                src="/assets/images/logos/logo.png"
                alt="Exam Nest Logo"
                class="h-8 w-auto"
              />
              <span class="ml-2 text-white font-semibold text-lg">Exam Nest</span>
            </a>
          </div>

          <!-- Navigation Links -->
          <div class="flex items-center space-x-4">
            @if (user) {
              <div class="flex items-center space-x-4">
                <span class="text-gray-300 text-sm">
                  Welcome, {{ user.name }}
                </span>
                <span class="text-gray-400 text-xs px-2 py-1 bg-gray-700 rounded">
                  {{ getRoleName(user.role) }}
                </span>
                <button
                  (click)="logout()"
                  class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            } @else {
              <a
                [routerLink]="['/auth']"
                class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </a>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavBarComponent implements OnInit {
  user: UserInfo | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  getRoleName(role: UserRole): string {
    switch (role) {
      case UserRole.Student:
        return 'Student';
      case UserRole.Instructor:
        return 'Instructor';
      case UserRole.Admin:
        return 'Admin';
      case UserRole.SuperAdmin:
        return 'Super Admin';
      default:
        return 'Unknown';
    }
  }
} 