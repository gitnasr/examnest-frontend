import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard';
import { AuthRedirectGuard } from './shared/guards/auth-redirect.guard';
import { Roles } from './shared/interfaces/api.interface';

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
    data: { roles: [Roles.Student] },
    loadChildren: () =>
      import('./features/student/student.routes').then((m) => m.STUDENT_ROUTES),
  },
  {
    path: 'instructor',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Roles.Instructor, Roles.Admin, Roles.SuperAdmin] },
    loadChildren: () =>
      import('./features/instructor/instructor.routes').then((m) => m.INSTRUCTOR_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Roles.Admin, Roles.SuperAdmin] },
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
