import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (!user) {
          this.router.navigate(['/auth']);
          return false;
        }

        const requiredRoles = route.data['roles'] as UserRole[];
        if (!requiredRoles || requiredRoles.length === 0) {
          return true;
        }

        const hasRequiredRole = this.authService.hasAnyRole(requiredRoles);
        
        if (hasRequiredRole) {
          return true;
        } else {
          // Redirect based on user role
          this.redirectBasedOnRole(user.role);
          return false;
        }
      })
    );
  }

  private redirectBasedOnRole(role: UserRole): void {
    switch (role) {
      case UserRole.Student:
        this.router.navigate(['/student']);
        break;
      case UserRole.Instructor:
        this.router.navigate(['/instructor']);
        break;
      case UserRole.Admin:
      case UserRole.SuperAdmin:
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/auth']);
    }
  }
} 