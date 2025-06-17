import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <app-nav-bar></app-nav-bar>
      
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Welcome to the admin dashboard. Manage users, branches, and tracks here.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Users</h3>
            <p class="text-gray-600 dark:text-gray-400">Manage all users</p>
          </div>
          
          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Branches</h3>
            <p class="text-gray-600 dark:text-gray-400">Manage branches</p>
          </div>
          
          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Tracks</h3>
            <p class="text-gray-600 dark:text-gray-400">Manage tracks</p>
          </div>
          
          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Reports</h3>
            <p class="text-gray-600 dark:text-gray-400">View system reports</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent {} 