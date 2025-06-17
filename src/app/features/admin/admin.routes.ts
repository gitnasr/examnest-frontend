import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./user-management/user-management.component').then(
        (m) => m.UserManagementComponent
      ),
  },
  {
    path: 'branches',
    loadComponent: () =>
      import('./branch-management/branch-management.component').then(
        (m) => m.BranchManagementComponent
      ),
  },
  {
    path: 'tracks',
    loadComponent: () =>
      import('./track-management/track-management.component').then(
        (m) => m.TrackManagementComponent
      ),
  },
]; 