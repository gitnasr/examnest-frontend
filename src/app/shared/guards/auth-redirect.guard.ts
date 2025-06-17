import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Roles } from '../interfaces/api.interface';

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
              case Roles.Student:
                return this.router.createUrlTree(['/student/dashboard']);
              case Roles.Instructor:
                return this.router.createUrlTree(['/instructor']);
              case Roles.Admin:
              case Roles.SuperAdmin:
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