import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Roles } from '../interfaces/api.interface';

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

        const requiredRoles = route.data['roles'] as Roles[];
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

  private redirectBasedOnRole(role: Roles): void {
    switch (role) {
      case Roles.Student:
        this.router.navigate(['/student']);
        break;
      case Roles.Instructor:
        this.router.navigate(['/instructor']);
        break;
      case Roles.Admin:
      case Roles.SuperAdmin:
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/auth']);
    }
  }
} 