import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <app-nav-bar></app-nav-bar>
      
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Instructor Dashboard</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Welcome to the instructor dashboard. Manage your courses and exams here.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Courses</h3>
            <p class="text-gray-600 dark:text-gray-400">Manage your courses</p>
          </div>
          
          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Exams</h3>
            <p class="text-gray-600 dark:text-gray-400">Create and manage exams</p>
          </div>
          
          <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Question Bank</h3>
            <p class="text-gray-600 dark:text-gray-400">Manage question bank</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class InstructorDashboardComponent {} 