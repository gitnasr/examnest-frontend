import { Routes } from '@angular/router';

export const INSTRUCTOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./instructor-dashboard/instructor-dashboard.component').then(
        (m) => m.InstructorDashboardComponent
      ),
  },
  {
    path: 'exam-management',
    loadComponent: () =>
      import('./exam-management/exam-management.component').then(
        (m) => m.ExamManagementComponent
      ),
  },
]; 