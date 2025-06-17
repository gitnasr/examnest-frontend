import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated$.pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          // User is authenticated, redirect to appropriate dashboard
          const user = this.authService.getCurrentUserValue();
          if (user) {
            switch (user.role) {
              case UserRole.Student:
                return this.router.createUrlTree(['/student/dashboard']);
              case UserRole.Instructor:
                return this.router.createUrlTree(['/instructor']);
              case UserRole.Admin:
              case UserRole.SuperAdmin:
                return this.router.createUrlTree(['/admin']);
              default:
                return this.router.createUrlTree(['/student/dashboard']);
            }
          }
          return this.router.createUrlTree(['/student/dashboard']);
        } else {
          // User is not authenticated, allow access to auth page
          return true;
        }
      })
    );
  }
} 