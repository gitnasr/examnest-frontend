import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'exam-entry',
    loadComponent: () =>
      import('./exam-entry/exam-entry.component').then(
        (m) => m.ExamEntryComponent
      ),
  },
  {
    path: 'exam-taking/:examId',
    loadComponent: () =>
      import('./exam-taking/exam-taking.component').then(
        (m) => m.ExamTakingComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
