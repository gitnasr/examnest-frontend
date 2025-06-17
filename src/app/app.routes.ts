import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard';
import { AuthRedirectGuard } from './shared/guards/auth-redirect.guard';
import { UserRole } from './shared/interfaces/auth.interface';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then(
        (m) => m.LandingComponent
      ),
  },
  {
    path: 'auth',
    canActivate: [AuthRedirectGuard],
    loadComponent: () =>
      import('./features/auth/auth/auth.component').then(
        (m) => m.AuthComponent
      ),
  },
  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.Student] },
    loadChildren: () =>
      import('./features/student/student.routes').then((m) => m.STUDENT_ROUTES),
  },
  {
    path: 'instructor',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.Instructor, UserRole.Admin, UserRole.SuperAdmin] },
    loadChildren: () =>
      import('./features/instructor/instructor.routes').then((m) => m.INSTRUCTOR_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.Admin, UserRole.SuperAdmin] },
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
